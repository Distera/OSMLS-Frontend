import {Component} from '@angular/core';
import {NzUploadFile} from 'ng-zorro-antd/upload';
import {AssembliesService} from '../../generated/api/services/assemblies.service';

@Component({
  selector: 'app-assembly-compositor',
  templateUrl: './assembly-compositor.component.html',
  styleUrls: ['./assembly-compositor.component.scss']
})
export class AssemblyCompositorComponent {
  uploadsCount = 0;

  constructor(private assembliesService: AssembliesService) {}

  beforeUpload = (file: NzUploadFile): boolean => {
    this.uploadsCount++;

    this.assembliesService.assembliesPost({body: {assembly: file as any}}).subscribe(
      () => {
        this.uploadsCount--;
        console.log(file.name + ' upload successfully.');
      },
      () => {
        this.uploadsCount--;
        console.log(file.name + ' upload failed.');
      }
    );

    return false;
  }
}
