import {Component, OnInit, ViewChild} from '@angular/core';
import {grpc} from '@improbable-eng/grpc-web';
import {MapService} from '../generated/protos/map_pb_service';
import {
  MapFeature,
  MapFeatureObservableProperty,
  MapFeaturesMetadata,
  RemoveMapFeatureEvent
} from '../generated/protos/map_pb';
import {Empty} from 'google-protobuf/google/protobuf/empty_pb';
import {environment} from '../../environments/environment';
import {MapBrowserComponent} from './map-browser/map-browser.component';
import MethodDefinition = grpc.MethodDefinition;
import ProtobufMessage = grpc.ProtobufMessage;
import {Observable} from 'rxjs';
import {MapPropertiesComponent} from './map-properties/map-properties.component';
import {MapReportComponent} from './map-report/map-report.component';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  ngOnInit(): void {
    this.observeMapFeaturesMetadata();
  }

  @ViewChild(MapBrowserComponent, {static: false})
  private mapBrowserComponent?: MapBrowserComponent;

  @ViewChild(MapPropertiesComponent, {static: false})
  private mapPropertiesComponent?: MapPropertiesComponent;

  @ViewChild(MapReportComponent, {static: false})
  private mapReportComponent?: MapReportComponent;

  private observeMessages(methodDescriptor: MethodDefinition<ProtobufMessage, ProtobufMessage>): Observable<ProtobufMessage> {
    const client = grpc.client(methodDescriptor, {
      host: environment.apiUrl
    });

    return new Observable(subscriber => {
      client.onMessage(message => subscriber.next(message));

      client.start();
      client.send(new Empty());

      client.onEnd(code => {
        if (code === grpc.Code.OK) {
          subscriber.complete();
        } else {
          subscriber.error(`Error when fetching data from grpc, error code: ${code}.`);
        }
      });
    });
  }

  private observeMapFeaturesMetadata(): void {
    this.observeMessages(MapService.GetMapFeaturesMetadata).subscribe(
      next => this.handleMapFeaturesMetadata(next as MapFeaturesMetadata),
      error => {
        throw new Error(error);
      },
      () => {
        this.observeMapFeaturesMetadataUpdates();

        this.observeMapFeatures();
        this.observeMapFeaturesObservableProperties();
      });
  }

  private observeMapFeaturesMetadataUpdates(): void {
    this.observeMessages(MapService.GetMapFeaturesMetadataUpdates).subscribe(
      next => this.handleMapFeaturesMetadata(next as MapFeaturesMetadata),
      error => {
        throw new Error(error);
      });
  }

  private observeMapFeatures(): void {
    this.observeMessages(MapService.GetMapFeatures).subscribe(
      next => this.handleMapFeature(next as MapFeature),
      error => {
        throw new Error(error);
      },
      () => {
        this.observeMapFeaturesUpdates();
        this.observeRemoveMapFeatureEventsUpdates();
      });
  }

  private observeMapFeaturesUpdates(): void {
    this.observeMessages(MapService.GetMapFeaturesUpdates).subscribe(
      next => this.handleMapFeature(next as MapFeature),
      error => {
        throw new Error(error);
      });
  }

  private observeRemoveMapFeatureEventsUpdates(): void {
    this.observeMessages(MapService.GetRemoveMapFeatureEventsUpdates).subscribe(
      next => this.handleRemoveMapFeatureEvent(next as RemoveMapFeatureEvent),
      error => {
        throw new Error(error);
      });
  }

  private observeMapFeaturesObservableProperties(): void {
    this.observeMessages(MapService.GetMapFeaturesObservableProperties).subscribe(
      next => this.handleMapFeatureObservableProperty(next as MapFeatureObservableProperty),
      error => {
        throw new Error(error);
      },
      () => {
        this.observeMapFeaturesObservablePropertiesUpdates();
      });
  }

  private observeMapFeaturesObservablePropertiesUpdates(): void {
    this.observeMessages(MapService.GetMapFeaturesObservablePropertiesUpdates).subscribe(
      next => this.handleMapFeatureObservableProperty(next as MapFeatureObservableProperty),
      error => {
        throw new Error(error);
      });
  }

  public setMapFeatureObservableProperty(mapFeatureObservableProperty: MapFeatureObservableProperty): Promise<void> {
    const client = grpc.client(MapService.SetMapFeatureObservableProperty, {
      host: environment.apiUrl
    });

    client.start();
    client.send(mapFeatureObservableProperty);

    return new Promise<void>((resolve, reject) => {
      client.onEnd(code => {
        if (code === grpc.Code.OK) {
          resolve();
        } else {
          reject(new Error(`Error when setting observable property, error code: ${code}.`));
        }
      });
    });
  }

  private handleMapFeaturesMetadata(mapFeaturesMetadata: MapFeaturesMetadata): void {
    this.mapBrowserComponent?.addLayer(mapFeaturesMetadata);
    this.mapPropertiesComponent?.addMetadata(mapFeaturesMetadata);
    this.mapReportComponent?.addMetadata(mapFeaturesMetadata);
  }

  private handleMapFeature(mapFeature: MapFeature): void {
    this.mapBrowserComponent?.addOrUpdateFeature(mapFeature as MapFeature);
  }

  private handleRemoveMapFeatureEvent(removeMapFeatureEvent: RemoveMapFeatureEvent): void {
    this.mapBrowserComponent?.removeFeature(removeMapFeatureEvent as RemoveMapFeatureEvent);
    this.mapPropertiesComponent?.removeFeature(removeMapFeatureEvent as RemoveMapFeatureEvent);
  }

  private handleMapFeatureObservableProperty(mapFeatureObservableProperty: MapFeatureObservableProperty): void {
    this.mapPropertiesComponent?.addProperty(mapFeatureObservableProperty);
    this.mapReportComponent?.addProperty(mapFeatureObservableProperty);
  }
}
