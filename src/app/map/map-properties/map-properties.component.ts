import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {
  MapFeatureObservableProperty,
  MapFeaturesMetadata, ObservableProperty,
  ObservablePropertyValue, RemoveMapFeatureEvent
} from '../../generated/protos/map_pb';
import {Dictionary} from 'typescript-collections';

@Component({
  selector: 'app-map-properties',
  templateUrl: './map-properties.component.html',
  styleUrls: ['./map-properties.component.scss']
})
export class MapPropertiesComponent {
  public mapFeaturesWithObservablePropertiesMetadata: MapFeaturesMetadata[] = [];

  public idsToFeaturesByType = new Dictionary<string, Dictionary<string, Dictionary<string, ObservablePropertyValue>>>();

  public editData?: IEditDate;

  @Output()
  setPropertyEvent = new EventEmitter<MapFeatureObservableProperty>();

  static getValue(
    observablePropertyValue: ObservablePropertyValue,
    valueType: MapFeaturesMetadata.ObservablePropertyMetadata.ValueTypeMap[
      keyof MapFeaturesMetadata.ObservablePropertyMetadata.ValueTypeMap
      ]
  ): any {
    switch (valueType) {
      case 0:
        return observablePropertyValue.getDouble();
      case 1:
        return observablePropertyValue.getFloat();
      case 2:
        return observablePropertyValue.getInt32();
      case 3:
        return observablePropertyValue.getInt64();
      case 4:
        return observablePropertyValue.getUint32();
      case 5:
        return observablePropertyValue.getUint64();
      case 6:
        return observablePropertyValue.getBool();
      case 7:
        return observablePropertyValue.getString();
      case 8:
        return observablePropertyValue.getBytes();
    }
  }

  static setValue(
    value: any,
    valueType: MapFeaturesMetadata.ObservablePropertyMetadata.ValueTypeMap[
      keyof MapFeaturesMetadata.ObservablePropertyMetadata.ValueTypeMap
      ]
  ): ObservablePropertyValue {
    const observablePropertyValue = new ObservablePropertyValue();

    switch (valueType) {
      case 0:
        observablePropertyValue.setDouble(value);
        break;
      case 1:
        observablePropertyValue.setFloat(value);
        break;
      case 2:
        observablePropertyValue.setInt32(value);
        break;
      case 3:
        observablePropertyValue.setInt64(value);
        break;
      case 4:
        observablePropertyValue.setUint32(value);
        break;
      case 5:
        observablePropertyValue.setUint64(value);
        break;
      case 6:
        observablePropertyValue.setBool(value);
        break;
      case 7:
        observablePropertyValue.setString(value);
        break;
      case 8:
        observablePropertyValue.setBytes(value);
        break;
    }

    return observablePropertyValue;
  }

  getValue(
    observablePropertyValue: ObservablePropertyValue,
    valueType: MapFeaturesMetadata.ObservablePropertyMetadata.ValueTypeMap[
      keyof MapFeaturesMetadata.ObservablePropertyMetadata.ValueTypeMap
      ]
  ): any {
    return MapPropertiesComponent.getValue(observablePropertyValue, valueType);
  }

  setValue(
    value: any,
    valueType: MapFeaturesMetadata.ObservablePropertyMetadata.ValueTypeMap[
      keyof MapFeaturesMetadata.ObservablePropertyMetadata.ValueTypeMap
      ]
  ): ObservablePropertyValue {
    return MapPropertiesComponent.setValue(value, valueType);
  }

  addMetadata(mapFeaturesMetadata: MapFeaturesMetadata): void {
    if (mapFeaturesMetadata.getObservablePropertiesMetadataList().length !== 0) {
      this.mapFeaturesWithObservablePropertiesMetadata.push(mapFeaturesMetadata);

      this.idsToFeaturesByType.setValue(mapFeaturesMetadata.getTypeFullName(), new Dictionary<string, any>());
    }
  }

  addProperty(mapFeatureObservableProperty: MapFeatureObservableProperty): void {
    const idsToFeatures = this.idsToFeaturesByType.getValue(mapFeatureObservableProperty.getTypeFullName());

    if (idsToFeatures === undefined) {
      throw new Error('Ids to features dictionary is not defined.');
    }

    const id = mapFeatureObservableProperty.getId();
    let feature = idsToFeatures.getValue(id);

    if (feature === undefined) {
      feature = new Dictionary<string, ObservablePropertyValue>();
      idsToFeatures.setValue(id, feature);
    }

    // tslint:disable-next-line:no-non-null-assertion
    const observableProperty = mapFeatureObservableProperty.getObservableProperty()!;

    const observablePropertyValue = observableProperty.getValue();
    if (observablePropertyValue === undefined) {
      throw new Error('Observable property value is not defined.');
    }

    feature.setValue(observableProperty.getTitle(), observablePropertyValue);
  }

  removeFeature(removeMapFeatureEvent: RemoveMapFeatureEvent): void {
    this.idsToFeaturesByType.getValue(removeMapFeatureEvent.getTypeFullName())?.remove(removeMapFeatureEvent.getId());
  }

  public stopEdit(newValue: any): void {
    if (this.editData !== undefined && this.editData?.currentValue !== newValue) {
      const mapFeatureObservableProperty = new MapFeatureObservableProperty();
      mapFeatureObservableProperty.setTypeFullName(this.editData.type);
      mapFeatureObservableProperty.setId(this.editData.id);

      const observableProperty = new ObservableProperty();
      observableProperty.setTitle(this.editData.title);
      observableProperty.setValue(MapPropertiesComponent.setValue(newValue, this.editData.valueType));

      mapFeatureObservableProperty.setObservableProperty(observableProperty);

      this.setPropertyEvent.emit(mapFeatureObservableProperty);
    }

    this.editData = undefined;
  }
}

export interface IEditDate {
  type: string;
  id: string;
  title: string;
  valueType: MapFeaturesMetadata.ObservablePropertyMetadata.ValueTypeMap[
    keyof MapFeaturesMetadata.ObservablePropertyMetadata.ValueTypeMap
    ];
  currentValue: any;
}
