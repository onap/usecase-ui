import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationManagementComponent } from './build/application-management.component';
import { UseApplicationComponent } from './use/use-application.component';
import { KnowledgeBaseManagementComponent } from './knowledge-base-management/knowledge-base-management.component';

const routes: Routes = [
  { path: 'build', component: ApplicationManagementComponent },
  { path: 'use', component: UseApplicationComponent },
  { path: 'knowledge-base-management', component: KnowledgeBaseManagementComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaasRoutingModule { }
