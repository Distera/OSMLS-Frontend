import {Component, OnInit} from '@angular/core';
import {grpc} from '@improbable-eng/grpc-web';
import {MapService} from '../generated/protos/map_pb_service';
import {MapFeaturesCluster} from '../generated/protos/map_pb';
import {Empty} from 'google-protobuf/google/protobuf/empty_pb';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  mapFeaturesCluster?: MapFeaturesCluster;

  ngOnInit(): void {
    const client = grpc.client(MapService.Updates, {
      host: environment.apiUrl
    });

    client.onMessage(message => {
      this.mapFeaturesCluster = message as MapFeaturesCluster;
    });

    client.start();
    client.send(new Empty());
  }
}
