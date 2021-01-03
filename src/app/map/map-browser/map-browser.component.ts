import {Component, Input, OnInit} from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import OSM from 'ol/source/OSM';
import {MapFeaturesCluster} from '../../generated/protos/map_pb';
import {Tile} from 'ol/layer';
import {defaults, MousePosition} from 'ol/control';
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
export class MapBrowserComponent implements OnInit {

  public map?: Map;

  ngOnInit(): void {
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
      controls: defaults().extend([
        new MousePosition({
          coordinateFormat: (coordinate: any): any => {
            return format(coordinate, 'X: {x}<br>Y: {y}');
          },
          projection: 'EPSG:3857',
          className: 'custom-mouse-position',
          target: document.getElementById('mouse-position') ?? undefined,
          undefinedHTML: '&nbsp;'
        })
      ])
    });
  }

  @Input()
  set mapFeaturesCluster(mapFeaturesCluster: MapFeaturesCluster) {
    mapFeaturesCluster.getFeaturesList().forEach(currentNewData => {
      const layerType = currentNewData.getTypeFullName();
      const geoJsonObject = currentNewData.getFeaturesGeoJson();

      const sameLayer = this.map?.getLayers().getArray().find((element) => element.get('layerType') === layerType);

      const vectorSource = new SourceVector({
        features: new GeoJSON().readFeatures(geoJsonObject)
      });

      if (sameLayer) {
        // @ts-ignore
        sameLayer.setSource(vectorSource);
      } else {
        const styleCompositorTsCode = `(style: any): => ${currentNewData.getOpenLayersStyle()};`;
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
    });
  }
}
