import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { ClientsRoutingModule } from './clients-routing.module';
import { ClientsComponent } from './clients.component';
import { AddCategoryComponent } from './modal/add-category/add-category.component';
import { PrintContactComponent } from './modal/print-contact/print-contact.component';
import {DetailclientComponent} from './detailclient/detailclient.component'

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ClientsRoutingModule
  ],
  declarations: [ClientsComponent, AddCategoryComponent, PrintContactComponent,DetailclientComponent]
})
export class ClientsModule { }
