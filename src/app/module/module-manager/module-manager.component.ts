import {Component} from '@angular/core';
import {ModulesService} from '../../generated/api/services/modules.service';

@Component({
  selector: 'app-module-manager',
  templateUrl: './module-manager.component.html',
  styleUrls: ['./module-manager.component.scss']
})
export class ModuleManagerComponent {
  public modules: string[] = [];
  private internalModelModules: string[] = [];

  public isModulesLoading = false;

  public get modelModules(): string[] {
    return this.internalModelModules;
  }

  public set modelModules(modelModules: string[]) {
    this.isModulesLoading = true;

    modelModules.forEach(module => {
      if (!this.internalModelModules.includes(module)) {
        this.modulesService.modulesModelPost({typeName: module}).subscribe(() => {
          this.updateModules();
        });
      }
    });

    this.internalModelModules.forEach(module => {
      if (!modelModules.includes(module)) {
        this.modulesService.modulesModelDelete({typeName: module}).subscribe(() => {
          this.updateModules();
        });
      }
    });

    this.internalModelModules = modelModules;
  }

  constructor(private modulesService: ModulesService) {
    this.updateModules();
  }

  public updateModules(): void {
    this.isModulesLoading = true;

    this.modulesService.modulesGet$Json().subscribe(modules => {
      this.modules = modules;
      this.modulesService.modulesModelGet$Json().subscribe(modelModules => {
        this.internalModelModules = modelModules;

        this.isModulesLoading = false;
      });
    });
  }
}
