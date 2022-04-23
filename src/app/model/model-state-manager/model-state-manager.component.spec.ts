import {ModelStateManagerComponent} from './model-state-manager.component';
import {StateService} from '../../generated/api/services/state.service';
import {TestBed} from '@angular/core/testing';
import {Observable} from 'rxjs';
import {State} from '../../generated/api/models/state';

describe('ModelStateManagerComponent test', () => {
  let component: ModelStateManagerComponent;

  const initialState = State.Active;

  function composeStateObservable(state: State): Observable<State> {
    return new Observable(subscriber => subscriber.next(state));
  }

  let stateServiceMock: { stateGet$Json: jasmine.Spy<jasmine.Func>, statePut: jasmine.Spy<jasmine.Func>};

  beforeEach(() => {
    stateServiceMock = {
      stateGet$Json: jasmine.createSpy().and.returnValue(composeStateObservable(initialState)),
      statePut: jasmine.createSpy().and.returnValue(composeStateObservable(initialState))
    };

    TestBed.configureTestingModule({
      providers: [
        ModelStateManagerComponent,
        {provide: StateService, useValue: stateServiceMock}
      ]
    });
    component = TestBed.inject(ModelStateManagerComponent);
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
  });

  it('should provide initial state properly', () => {
    expect(component.state).toBe(initialState);
  });

  it('should update state properly', () => {
    stateServiceMock.stateGet$Json.and.returnValue(composeStateObservable(State.Stopped));
    component.updateState();
    expect(component.state).toBe(State.Stopped);
  });

  it('should set state properly', () => {
    stateServiceMock.statePut.and.returnValue(composeStateObservable(State.Active));
    component.state = State.Active;
    expect(component.state).toBe(State.Active);
  });
});
