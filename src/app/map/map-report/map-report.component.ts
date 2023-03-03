import {Component, OnDestroy, OnInit} from '@angular/core';
import {MapFeatureObservableProperty, MapFeaturesMetadata, ObservablePropertyValue} from '../../generated/protos/map_pb';
import {TimedMapFeatureObservableProperty} from './model/timed-map-feature-observable-property';
import * as _ from 'lodash';
import {IReport} from './model/report/report';
import {
  ILiteralFeatureChartData,
  INumericFeatureChartData, INumericFeatureMeanChartData,
  IPropertyReport
} from './model/report/property/property-report';
import {IFeaturesCountChartData} from './model/report/type/type-report';

@Component({
  selector: 'app-map-report',
  templateUrl: './map-report.component.html',
  styleUrls: ['./map-report.component.scss']
})
export class MapReportComponent implements OnDestroy {
  private buildReportTimer?: any;

  reportStartDate = new Date();

  private mapFeaturesMetadata: MapFeaturesMetadata[] = [];

  private timedMapFeaturesObservableProperties: TimedMapFeatureObservableProperty[] = [];

  report?: IReport;

  reportUpdateIntervalSeconds = 60;

  get isReportingActive(): boolean {
    return this.buildReportTimer !== undefined;
  }

  set isReportingActive(isReportActive) {
    if (this.isReportingActive !== isReportActive) {
      if (isReportActive) {
        this.buildReport();
      } else {
        clearInterval(this.buildReportTimer);
        this.buildReportTimer = undefined;
      }
    }
  }

  private static getValue(
    observablePropertyValue: ObservablePropertyValue
  ): any {
    switch (observablePropertyValue.getValueCase()) {
      case ObservablePropertyValue.ValueCase.VALUE_NOT_SET:
        return undefined;
      case ObservablePropertyValue.ValueCase.DOUBLE:
        return observablePropertyValue.getDouble();
      case ObservablePropertyValue.ValueCase.FLOAT:
        return observablePropertyValue.getFloat();
      case ObservablePropertyValue.ValueCase.INT32:
        return observablePropertyValue.getInt32();
      case ObservablePropertyValue.ValueCase.INT64:
        return observablePropertyValue.getInt64();
      case ObservablePropertyValue.ValueCase.UINT32:
        return observablePropertyValue.getUint32();
      case ObservablePropertyValue.ValueCase.UINT64:
        return observablePropertyValue.getUint64();
      case ObservablePropertyValue.ValueCase.BOOL:
        return observablePropertyValue.getBool();
      case ObservablePropertyValue.ValueCase.STRING:
        return observablePropertyValue.getString();
      case ObservablePropertyValue.ValueCase.BYTES:
        return observablePropertyValue.getBytes();
    }
  }

  private static isPropertyNumeric(
    valueType: MapFeaturesMetadata.ObservablePropertyMetadata
      .ValueTypeMap[keyof MapFeaturesMetadata.ObservablePropertyMetadata.ValueTypeMap]
  ): boolean {
    switch (valueType) {
      case 0:
        return true;
      case 1:
        return true;
      case 2:
        return true;
      case 3:
        return true;
      case 4:
        return true;
      case 5:
        return true;
      case 6:
        return false;
      case 7:
        return false;
      case 8:
        return false;
    }
  }

  private static getPropertiesGropedByTitleAndType(
    timedMapFeaturesObservableProperties: TimedMapFeatureObservableProperty[]
  ): _.Dictionary<_.Dictionary<TimedMapFeatureObservableProperty[]>> {
    return _.mapValues(
      _.groupBy(
        timedMapFeaturesObservableProperties,
        property => property.mapFeatureObservableProperty.getTypeFullName()
      ),
      (propertiesForType) =>
        _.groupBy(
          propertiesForType,
          // tslint:disable-next-line:no-non-null-assertion
          property => property.mapFeatureObservableProperty.getObservableProperty()!.getTitle()
        )
    );
  }

  //#region Chart data composers.

  private static composeFeaturesCountChartData(
    properties: TimedMapFeatureObservableProperty[],
    lastDate: Date
  ): IFeaturesCountChartData {
    const ids: string[] = [];
    const series: { name: Date, value: number }[] = [];

    _(properties)
      .sortBy(property => property.datetime)
      .forEach(property => {
        const id = property.mapFeatureObservableProperty.getId();

        if (!ids.includes(id)) {
          ids.push(id);

          series.push({name: property.datetime, value: ids.length});
        }
      });

    return {
      series: series.length === 0 ? [{name: lastDate, value: 0}] : series
    };
  }

  private static composeNumericFeaturesChartData(
    properties: TimedMapFeatureObservableProperty[],
    lastDate: Date
  ): INumericFeatureChartData[] {
    return _.map(
      _.groupBy(
        properties,
        property => property.mapFeatureObservableProperty.getId()
      ),
      (propertiesForId, id) => {
        const series = propertiesForId.map(property => ({
          name: property.datetime,
          // tslint:disable-next-line:no-non-null-assertion
          value: this.getValue(property.mapFeatureObservableProperty.getObservableProperty()!.getValue()!)
        }));

        // Add one point for last timestamp.
        series.push({
          name: lastDate,
          // tslint:disable-next-line:no-non-null-assertion
          value: _.last(series)!.value
        });

        return {
          name: id,
          series
        };
      }
    );
  }

  private static composeNumericFeaturesMeanChartData(
    properties: TimedMapFeatureObservableProperty[]
  ): INumericFeatureMeanChartData[] {
    return _.map(
      _.groupBy(
        properties,
        property => property.mapFeatureObservableProperty.getId()
      ),
      (propertiesForId, id) => {
        return {
          name: id,
          value: _(propertiesForId)
            // tslint:disable-next-line:no-non-null-assertion
            .map(property => this.getValue(property.mapFeatureObservableProperty.getObservableProperty()!.getValue()!))
            .sum() / propertiesForId.length
        };
      }
    );
  }

  private static composeLiteralFeaturesChartData(
    properties: TimedMapFeatureObservableProperty[],
    lastDate: Date
  ): ILiteralFeatureChartData[] {
    return _.map(
      _.groupBy(
        properties,
        property => property.mapFeatureObservableProperty.getId()
      ),
      (propertiesForId, id) => {
        const series = propertiesForId.map(property => ({
          // tslint:disable-next-line:no-non-null-assertion
          name: this.getValue(property.mapFeatureObservableProperty.getObservableProperty()!.getValue()!),
          value: property.datetime.getTime()
        }));

        const sortedSeries = series.sort(serie => serie.value);
        const relativeSeries =
          _.map(
            sortedSeries,
            (serie, index) => ({...serie, value: (sortedSeries[index + 1]?.value ?? lastDate.getTime()) - serie.value})
          );

        return {
          name: id,
          series: relativeSeries,
        };
      }
    );
  }

  //#endregion

  ngOnDestroy(): void {
    if (this.buildReportTimer) {
      clearInterval(this.buildReportTimer);
    }
  }

  private buildReport(): void {
    if (this.buildReportTimer) {
      clearInterval(this.buildReportTimer);
    }

    const propertiesByTitleAndType =
      MapReportComponent.getPropertiesGropedByTitleAndType(this.timedMapFeaturesObservableProperties);

    const date = new Date();

    this.report = {
      date,
      typesReports: this.mapFeaturesMetadata.map(metadata => ({
        name: metadata.getTypeFullName(),
        featuresCountChartData: MapReportComponent.composeFeaturesCountChartData(
          _.flatMap(propertiesByTitleAndType[metadata.getTypeFullName()]),
          date
        ),
        propertiesReports: metadata.getObservablePropertiesMetadataList().map(propertyMetadata => {
          const properties = propertiesByTitleAndType[metadata.getTypeFullName()]?.[propertyMetadata.getTitle()];

          const uniqueValuesCount = _(properties)
            .groupBy(property => property.mapFeatureObservableProperty.getObservableProperty()?.getValue())
            .size();

          const propertyReport: IPropertyReport = {
            title: propertyMetadata.getTitle(),
          };

          if (properties !== undefined && properties.length !== 0) {
            if (MapReportComponent.isPropertyNumeric(propertyMetadata.getValueType())) {
              propertyReport.numericData = {};
              propertyReport.numericData.featuresChartData = MapReportComponent.composeNumericFeaturesChartData(properties, date);
              propertyReport.numericData.featuresMeanChartData = MapReportComponent.composeNumericFeaturesMeanChartData(properties);
            }

            const literalPropertyMaxUniqueValuesCount = 1000;

            if (uniqueValuesCount < literalPropertyMaxUniqueValuesCount) {
              propertyReport.literalData = {};
              propertyReport.literalData.featuresChartData = MapReportComponent.composeLiteralFeaturesChartData(properties, date);
            }
          }

          return propertyReport;
        })
      }))
    };

    this.buildReportTimer = setTimeout(() => {
      this.buildReport();
    }, this.reportUpdateIntervalSeconds * 1000);
  }

  addMetadata(mapFeaturesMetadata: MapFeaturesMetadata): void {
    if (mapFeaturesMetadata.getObservablePropertiesMetadataList().length !== 0) {
      this.mapFeaturesMetadata.push(mapFeaturesMetadata);
    }
  }

  addProperty(mapFeatureObservableProperty: MapFeatureObservableProperty): void {
    this.timedMapFeaturesObservableProperties.push(new TimedMapFeatureObservableProperty(mapFeatureObservableProperty));
  }
}
