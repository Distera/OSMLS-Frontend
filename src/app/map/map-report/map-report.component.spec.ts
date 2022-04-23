import {MapReportComponent} from './map-report.component';
import {TestBed} from '@angular/core/testing';
import {Observable} from 'rxjs';
import {
  MapFeatureObservableProperty,
  MapFeaturesMetadata,
  ObservableProperty
} from '../../generated/protos/map_pb';
import {MapPropertiesComponent} from '../map-properties/map-properties.component';

describe('MapReportComponent test', () => {
  let component: MapReportComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MapReportComponent
      ]
    });
    component = TestBed.inject(MapReportComponent);
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
  });

  it('should create report properly for double values', () => {
    testReportCreation(0, 35.564);
  });

  it('should create report properly for float values', () => {
    testReportCreation(1, 45.34);
  });

  it('should create report properly for int32 values', () => {
    testReportCreation(2, 12345);
  });

  it('should create report properly for int64 values', () => {
    testReportCreation(3, 12345);
  });

  it('should create report properly for uint32 values', () => {
    testReportCreation(4, 45678);
  });

  it('should create report properly for uint64 values', () => {
    testReportCreation(5, 91234);
  });

  it('should create report properly for bool values', () => {
    testReportCreation(6, true);
  });

  it('should create report properly for string values', () => {
    testReportCreation(7, 'test');
  });

  it('should create report properly for bytes values', () => {
    testReportCreation(8, '0o101100');
  });

  function testReportCreation(
    type: MapFeaturesMetadata.ObservablePropertyMetadata.ValueTypeMap[keyof MapFeaturesMetadata.ObservablePropertyMetadata.ValueTypeMap],
    value: any
  ): void {
    const testMapFeaturesMetadata = new MapFeaturesMetadata();
    testMapFeaturesMetadata.setTypeFullName('type full name');

    const observablePropertyMetadata = new MapFeaturesMetadata.ObservablePropertyMetadata();
    observablePropertyMetadata.setTitle('title');
    observablePropertyMetadata.setEditable(true);
    observablePropertyMetadata.setValueType(type);
    testMapFeaturesMetadata.addObservablePropertiesMetadata(observablePropertyMetadata);

    const observablePropertyValue = MapPropertiesComponent.setValue(value, type);

    const observableProperty = new ObservableProperty();
    observableProperty.setTitle('title');
    observableProperty.setValue(observablePropertyValue);

    const testMapFeatureObservableProperty = new MapFeatureObservableProperty();
    testMapFeatureObservableProperty.setId('id');
    testMapFeatureObservableProperty.setTypeFullName('type full name');
    testMapFeatureObservableProperty.setObservableProperty(observableProperty);

    component.addMetadata(testMapFeaturesMetadata);
    component.addProperty(testMapFeatureObservableProperty);
    component.isReportingActive = true;
    component.isReportingActive = false;

    expect(component.report?.typesReports[0]?.propertiesReports[0]?.literalData?.featuresChartData?.[0].series?.[0].name).toEqual(value);
  }
});
