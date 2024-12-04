import { NgModule } from '@angular/core';
import { MaasRoutingModule } from './maas-routing.module';
import { ApplicationManagementComponent } from './build/application-management.component';
import { CreateApplicationManagementComponent } from './build/create-application-management/create-application-management.component';
import { UseApplicationComponent } from './use/use-application.component';
import { ApplicationDetailComponent } from './build/application-detail/application-detail.component';
import { DescriptionComponent } from '@src/app/shared/components/description/description.component';
import { DescriptionItemComponent } from '@src/app/shared/components/description/descriptions-item.component';
import { KnowledgeBaseManagementComponent } from './knowledge-base-management/knowledge-base-management.component';
import { CreateKnowledgeBaseComponent } from './knowledge-base-management/create-knowledge-base/create-knowledge-base.component';
import { KnowledgeBaseDetailComponent } from './knowledge-base-management/knowledge-base-detail/knowledge-base-detail.component';
import { SharedModule } from '@src/app/shared/module/sharded.module';
import { MaasService } from '@src/app/core/services/maas.service';
// import { EditKnowledgeBaseComponent } from './knowledge-base-management/edit-knowledge-base/edit-knowledge-base.component';

@NgModule({
  providers: [
    MaasService
  ],
  imports: [
    SharedModule,
    MaasRoutingModule,
  ],
  declarations: [
    ApplicationManagementComponent,
		CreateApplicationManagementComponent,
		UseApplicationComponent,
		ApplicationDetailComponent,
		DescriptionComponent,
		DescriptionItemComponent,
    KnowledgeBaseManagementComponent,
		CreateKnowledgeBaseComponent,
		KnowledgeBaseDetailComponent,
    // EditKnowledgeBaseComponent
  ]
})
export class MaasModule { }
