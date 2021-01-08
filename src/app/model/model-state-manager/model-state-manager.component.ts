import {Component} from '@angular/core';
import {StateService} from '../../generated/api/services/state.service';
import {State} from '../../generated/api/models/state';

@Component({
  selector: 'app-model-state-manager',
  templateUrl: './model-state-manager.component.html',
  styleUrls: ['./model-state-manager.component.scss']
})
export class ModelStateManagerComponent {

  public states = State;

  public isStateLoading = false;
  private internalState = State.Active;

  constructor(private stateService: StateService) {
    this.updateState();
  }

  public updateState(): void {
    this.isStateLoading = true;
    this.stateService.stateGet$Json().subscribe(next => {
      this.internalState = next;
      this.isStateLoading = false;
    });
  }

  get state(): State {
    return this.internalState;
  }

  set state(state: State) {
    this.isStateLoading = true;
    this.stateService.statePut({state}).subscribe(() => {
      this.updateState();
    });
  }
}
