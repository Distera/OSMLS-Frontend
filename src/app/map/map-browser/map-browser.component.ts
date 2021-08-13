import {AfterViewInit, Component} from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import OSM from 'ol/source/OSM';
import {MapFeature, MapFeaturesMetadata, RemoveMapFeatureEvent} from '../../generated/protos/map_pb';
import {Tile} from 'ol/layer';
import {MousePosition} from 'ol/control';
import {format} from 'ol/coordinate';
import {Vector as SourceVector} from 'ol/source';
import {Vector as LayerVector} from 'ol/layer';
import {GeoJSON} from 'ol/format';
import * as style from 'ol/style';
import * as typescript from 'typescript';

@Component({
  selector: 'app-map-browser',
  templateUrl: './map-browser.component.html',
  styleUrls: ['./map-browser.component.scss']
})
export class MapBrowserComponent implements AfterViewInit {

  public map?: Map;

  ngAfterViewInit(): void {
    this.map = new Map({
      target: 'map',
      layers: [
        new Tile({
          source: new OSM()
        }),
      ],
      view: new View({
        center: [0, 0],
        zoom: 0
      }),
      controls: [
        new MousePosition({
          coordinateFormat: (coordinate: any): any => {
            return format(coordinate, 'X: {x}<br>Y: {y}');
          },
          projection: 'EPSG:3857',
          className: 'custom-mouse-position',
          target: document.getElementById('mouse-position') ?? undefined,
          undefinedHTML: '&nbsp;'
        })
      ]
    });

    // this.map?.on('click', (e) => {
    //   this.map?.forEachFeatureAtPixel(this.map?.getEventPixel(e.originalEvent), (ee) => console.log(ee));
    // });
  }

  addLayer(mapFeaturesMetadata: MapFeaturesMetadata): void {
    const layerType = mapFeaturesMetadata.getTypeFullName();

    const vectorSource = new SourceVector({
      features: []
    });

    const styleCompositorTsCode = `(style: any): => ${mapFeaturesMetadata.getOpenLayersStyle()};`;
    const styleCompositorJsCode = typescript.transpile(styleCompositorTsCode);
    // tslint:disable-next-line:no-eval
    const composeStyle: any = eval(styleCompositorJsCode);

    const vectorLayer = new LayerVector({
      style: composeStyle(style)
    });

    vectorLayer.set('layerType', layerType);
    vectorLayer.setSource(vectorSource);
    this.map?.addLayer(vectorLayer);
  }

  private getLayerSource(layerType: string): any | undefined {
    const layer = this.map?.getLayers().getArray().find((element) => element.get('layerType') === layerType);

    if (!layer) {
      console.log('Layer not found');

      return undefined;
    }

    // @ts-ignore
    return layer.getSource();
  }

  addOrUpdateFeature(mapFeature: MapFeature): void {
    const source = this.getLayerSource(mapFeature.getTypeFullName());

    const feature = new GeoJSON().readFeature(mapFeature.getGeoJson());

    const existentFeature = source.getFeatureById(feature.getId());

    if (existentFeature) {
      source.removeFeature(existentFeature);
    }

    source.addFeature(feature);
  }

  removeFeature(removeMapFeatureEvent: RemoveMapFeatureEvent): void {
    const source = this.getLayerSource(removeMapFeatureEvent.getTypeFullName());

    source.removeFeature(source.getFeatureById(removeMapFeatureEvent.getId()));
  }
}
