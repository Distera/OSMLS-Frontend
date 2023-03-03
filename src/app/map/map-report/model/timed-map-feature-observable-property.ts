import {MapFeatureObservableProperty} from '../../../generated/protos/map_pb';

export class TimedMapFeatureObservableProperty {
  public readonly datetime = new Date(Date.now());

  constructor(public mapFeatureObservableProperty: MapFeatureObservableProperty) {
  }
}
