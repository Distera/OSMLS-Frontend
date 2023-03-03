import {MapBrowserComponent} from './map-browser.component';
import {TestBed} from '@angular/core/testing';
import {MapFeature, MapFeaturesMetadata, RemoveMapFeatureEvent} from '../../generated/protos/map_pb';
import {Vector as LayerVector} from 'ol/layer';
import {Style} from 'ol/style';

describe('MapBrowserComponent test', () => {
  let component: MapBrowserComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MapBrowserComponent
      ]
    });
    component = TestBed.inject(MapBrowserComponent);
    // @ts-ignore
    component.ngAfterViewInit();
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
  });

  it('should compose map properly', () => {
    expect(component.map?.getTarget()).toEqual('map');
    expect(component.map?.getView().getCenter()).toEqual([0, 0]);
    expect(component.map?.getView().getZoom()).toEqual(0);
  });

  it('should add layer properly', () => {
    const typeFullName = 'type full name';
    const testFillColor = 'rgba(255, 255, 255, 0.4)';
    const testStrokeColor = 'rgba(0, 0, 0, 0.4)';
    const testStrokeWidth = 1;

    const testStyle = 'new style.Style({' +
      '                fill: new style.Fill({' +
      `                    color: \'${testFillColor}\'}),` +
      '                stroke: new style.Stroke({' +
      `                    color: \'${testStrokeColor}\',` +
      `                    width: ${testStrokeWidth}})});`;


    const testMapFeaturesMetadata = new MapFeaturesMetadata();
    testMapFeaturesMetadata.setTypeFullName(typeFullName);
    testMapFeaturesMetadata.setOpenLayersStyle(testStyle);

    component.addLayer(testMapFeaturesMetadata);
    const layer = getLayerVectorByType(typeFullName);
    expect(layer.get('layerType')).toEqual(typeFullName);

    const actualStyle = layer.getStyle() as Style;
    expect(actualStyle.getFill().getColor()).toEqual(testFillColor);
    expect(actualStyle.getStroke().getColor()).toEqual(testStrokeColor);
    expect(actualStyle.getStroke().getWidth()).toEqual(testStrokeWidth);
  });

  it('should add or update feature properly', () => {
    const typeFullName = 'type full name';
    const testMapFeaturesMetadata = new MapFeaturesMetadata();
    testMapFeaturesMetadata.setTypeFullName(typeFullName);
    component.addLayer(testMapFeaturesMetadata);

    const testFeatureGeoJson = {
      id: 'testId',
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [125.6, 10.1]
      }
    };
    const testMapFeature = new MapFeature();
    testMapFeature.setTypeFullName(typeFullName);
    testMapFeature.setGeoJson(JSON.stringify(testFeatureGeoJson));

    component.addOrUpdateFeature(testMapFeature);

    const layer = getLayerVectorByType(typeFullName);
    const actualFeature = layer.getSource().getFeatureById(testFeatureGeoJson.id);

    const actualCoordinates = actualFeature.getGeometry()?.getExtent();
    expect(actualCoordinates?.[0]).toEqual(testFeatureGeoJson.geometry.coordinates[0]);
    expect(actualCoordinates?.[1]).toEqual(testFeatureGeoJson.geometry.coordinates[1]);

    testFeatureGeoJson.geometry.coordinates[0] = 10;
    testMapFeature.setGeoJson(JSON.stringify(testFeatureGeoJson));
    component.addOrUpdateFeature(testMapFeature);

    const updatedFeature = layer.getSource().getFeatureById(testFeatureGeoJson.id);
    const updatedCoordinates = updatedFeature.getGeometry()?.getExtent();
    expect(updatedCoordinates?.[0]).toEqual(testFeatureGeoJson.geometry.coordinates[0]);
  });

  it('should remove feature properly', () => {
    const typeFullName = 'type full name';
    const testMapFeaturesMetadata = new MapFeaturesMetadata();
    testMapFeaturesMetadata.setTypeFullName(typeFullName);
    component.addLayer(testMapFeaturesMetadata);

    const testFeatureGeoJson = {
      id: 'testId',
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [0, 0]
      }
    };
    const testMapFeature = new MapFeature();
    testMapFeature.setTypeFullName(typeFullName);
    testMapFeature.setGeoJson(JSON.stringify(testFeatureGeoJson));

    component.addOrUpdateFeature(testMapFeature);

    const testRemoveMapFeatureEvent = new RemoveMapFeatureEvent();
    testRemoveMapFeatureEvent.setId(testFeatureGeoJson.id);
    testRemoveMapFeatureEvent.setTypeFullName(typeFullName);

    component.removeFeature(testRemoveMapFeatureEvent);

    const layer = getLayerVectorByType(typeFullName);
    expect(layer.getSource().getFeatures().length).toEqual(0);
  });

  function getLayerVectorByType(typeFullName: string): LayerVector {
    return component.map
      ?.getLayers()
      .getArray()
      .find((element) => element.get('layerType') === typeFullName) as LayerVector;
  }
})
;
