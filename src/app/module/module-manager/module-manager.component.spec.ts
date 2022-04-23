import {Observable} from 'rxjs';
import {TestBed} from '@angular/core/testing';
import {ModulesService} from '../../generated/api/services/modules.service';
import {ModuleManagerComponent} from './module-manager.component';

describe('ModuleManagerComponent test', () => {
  let component: ModuleManagerComponent;

  const initialModules = ['ActorModule.dll', 'HousesModule.dll'];

  function composeModuleObservable(module: string[]): Observable<string[]> {
    return new Observable(subscriber => subscriber.next(module));
  }

  let modulesServiceMock: {
    modulesGet$Json: jasmine.Spy<jasmine.Func>,
    modulesModelGet$Json: jasmine.Spy<jasmine.Func>,
    modulesModelPost: jasmine.Spy<jasmine.Func>,
    modulesModelDelete: jasmine.Spy<jasmine.Func>
  };

  beforeEach(() => {
    modulesServiceMock = {
      modulesGet$Json: jasmine.createSpy().and.returnValue(composeModuleObservable([])),
      modulesModelGet$Json: jasmine.createSpy().and.returnValue(composeModuleObservable([])),
      modulesModelPost: jasmine.createSpy().and.returnValue(new Observable(subscriber => subscriber.next(void 0))),
      modulesModelDelete: jasmine.createSpy().and.returnValue(new Observable(subscriber => subscriber.next(void 0)))
    };

    TestBed.configureTestingModule({
      providers: [
        ModuleManagerComponent,
        {provide: ModulesService, useValue: modulesServiceMock}
      ]
    });
    component = TestBed.inject(ModuleManagerComponent);
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
  });

  it('should provide initial modules properly', () => {
    expect(component.modules).toEqual([]);
  });

  it('should update modules properly', () => {
    modulesServiceMock.modulesGet$Json.and.returnValue(composeModuleObservable(initialModules));
    component.updateModules();
    expect(component.modules).toBe(initialModules);
  });

  it('should update model modules properly', () => {
    modulesServiceMock.modulesModelGet$Json.and.returnValue(composeModuleObservable(initialModules));
    component.updateModules();
    expect(component.modelModules).toBe(initialModules);
  });

  it('should add model modules properly', () => {
    spyOn(component, 'updateModules');
    component.modelModules = ['ActorModule.dll'];
    expect(component.updateModules).toHaveBeenCalledTimes(1);
    expect(modulesServiceMock.modulesModelDelete).toHaveBeenCalledTimes(0);
    expect(modulesServiceMock.modulesModelPost).toHaveBeenCalledWith(Object({ typeName: 'ActorModule.dll' }));
  });

  it('should delete model modules properly', () => {
    modulesServiceMock.modulesModelGet$Json.and.returnValue(composeModuleObservable(initialModules));
    component.updateModules();
    spyOn(component, 'updateModules');
    component.modelModules = ['ActorModule.dll'];
    expect(component.updateModules).toHaveBeenCalledTimes(1);
    expect(modulesServiceMock.modulesModelPost).toHaveBeenCalledTimes(0);
    expect(modulesServiceMock.modulesModelDelete).toHaveBeenCalledWith(Object({ typeName: 'HousesModule.dll' }));
  });
});
