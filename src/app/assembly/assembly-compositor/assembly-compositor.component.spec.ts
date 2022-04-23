import {AssemblyCompositorComponent} from './assembly-compositor.component';
import {AssembliesService} from '../../generated/api/services/assemblies.service';
import {TestBed} from '@angular/core/testing';
import {Observable} from 'rxjs';

describe('AssemblyCompositorComponent test', () => {
  let component: AssemblyCompositorComponent;

  let assembliesServiceMock: { assembliesPost: jasmine.Spy<jasmine.Func> };

  beforeEach(() => {
    assembliesServiceMock = {
      assembliesPost: jasmine.createSpy().and.returnValue(new Observable(subscriber => subscriber.next(void 0)))
    };

    TestBed.configureTestingModule({
      providers: [
        AssemblyCompositorComponent,
        {provide: AssembliesService, useValue: assembliesServiceMock}
      ]
    });
    component = TestBed.inject(AssemblyCompositorComponent);
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
  });

  it('should provide uploads count properly', () => {
    const file = {uid: '', name: ''};
    component.beforeUpload(file);
    expect(component.uploadsCount).toBe(0);
  });

  it('should post assemblies properly', () => {
    const file = {uid: '', name: ''};
    component.beforeUpload(file);
    expect(assembliesServiceMock.assembliesPost).toHaveBeenCalledWith({body: {assembly: file as any}});
  });
});
