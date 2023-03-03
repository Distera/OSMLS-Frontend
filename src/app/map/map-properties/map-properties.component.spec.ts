import {IEditDate, MapPropertiesComponent} from './map-properties.component';
import {TestBed} from '@angular/core/testing';
import {
  MapFeatureObservableProperty,
  MapFeaturesMetadata,
  ObservableProperty,
  ObservablePropertyValue, RemoveMapFeatureEvent
} from '../../generated/protos/map_pb';
import {Dictionary} from 'typescript-collections';


describe('MapPropertiesComponent test', () => {
  let component: MapPropertiesComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MapPropertiesComponent
      ]
    });
    component = TestBed.inject(MapPropertiesComponent);
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
  });

  it('should add metadata properly', () => {
    const mapFeaturesMetadataMock = new MapFeaturesMetadata();
    const observablePropertyMetadata = new MapFeaturesMetadata.ObservablePropertyMetadata();
    observablePropertyMetadata.setTitle('ActorModule');
    mapFeaturesMetadataMock.addObservablePropertiesMetadata(observablePropertyMetadata);
    component.addMetadata(mapFeaturesMetadataMock);
    expect(component.idsToFeaturesByType.getValue(mapFeaturesMetadataMock.getTypeFullName())).toEqual(new Dictionary<string, any>());
  });

  it('should add property properly', () => {
    const testTypeFullName = 'test type full name';
    const testId = 'Test id';

    const observableProperty = new ObservableProperty();
    observableProperty.setValue(new ObservablePropertyValue());
    observableProperty.setTitle('test title');

    const mapFeatureObservablePropertyTest = new MapFeatureObservableProperty();
    mapFeatureObservablePropertyTest.setId(testId);
    mapFeatureObservablePropertyTest.setTypeFullName(testTypeFullName);
    mapFeatureObservablePropertyTest.setObservableProperty(observableProperty);

    const testFeature = new Dictionary<string, ObservablePropertyValue>();
    const testIdsToFeatures = new Dictionary<string, Dictionary<string, ObservablePropertyValue>>();
    testIdsToFeatures.setValue(testId, testFeature);

    spyOn(component.idsToFeaturesByType, 'getValue').withArgs(testTypeFullName).and.returnValue(testIdsToFeatures);

    component.addProperty(mapFeatureObservablePropertyTest);

    expect(testFeature.getValue(observableProperty.getTitle())).toEqual(observableProperty.getValue());
  });

  it('should remove feature properly', () => {
    const testTypeFullName = 'test type full name';
    const testId = 'Test id';
    const testIdsToFeatures = new Dictionary<string, Dictionary<string, ObservablePropertyValue>>();

    const testRemoveMapFeatureEvent = new RemoveMapFeatureEvent();
    testRemoveMapFeatureEvent.setTypeFullName(testTypeFullName);
    testRemoveMapFeatureEvent.setId(testId);

    spyOn(testIdsToFeatures, 'remove');
    spyOn(component.idsToFeaturesByType, 'getValue')
      .withArgs(testRemoveMapFeatureEvent.getTypeFullName())
      .and
      .returnValue(testIdsToFeatures);

    component.removeFeature(testRemoveMapFeatureEvent);

    expect(testIdsToFeatures.remove).toHaveBeenCalledWith(testRemoveMapFeatureEvent.getId());
  });

  it('should set and get value properly', () => {
    const options: {
      type: MapFeaturesMetadata.ObservablePropertyMetadata.ValueTypeMap[
        keyof MapFeaturesMetadata.ObservablePropertyMetadata.ValueTypeMap],
      value: any
    }[] = [
      {type: 0, value: 34.76},
      {type: 1, value: 184.5},
      {type: 2, value: 123},
      {type: 3, value: 123},
      {type: 4, value: 345},
      {type: 5, value: 678},
      {type: 6, value: true},
      {type: 7, value: 'ActorModule'},
      {type: 8, value: '0o101100'}
    ];
    for (const option of options) {
      const observablePropertyValueMock = component.setValue(option.value, option.type);
      expect(component.getValue(observablePropertyValueMock, option.type)).toEqual(option.value);
    }
  });

  it('should stop edit properly', () => {
    const newValue = 'HomeModule';
    const testObservablePropertyValue = new ObservablePropertyValue();
    const testEditData: IEditDate = {
      type: 'Test type',
      id: 'Test id',
      title: 'Test title',
      currentValue: 'Test value',
      valueType: 7
    };
    let result = new MapFeatureObservableProperty();

    component.editData = testEditData;
    spyOn(MapPropertiesComponent, 'setValue').withArgs(newValue, testEditData.valueType).and.returnValue(testObservablePropertyValue);

    component.setPropertyEvent.subscribe((x: MapFeatureObservableProperty) => result = x);
    component.stopEdit(newValue);

    expect(result.getTypeFullName()).toEqual(testEditData.type);
    expect(result.getId()).toEqual(testEditData.id);
    expect(result.getObservableProperty()?.getTitle()).toEqual(testEditData.title);
    expect(result.getObservableProperty()?.getValue()).toEqual(testObservablePropertyValue);
  });
});
