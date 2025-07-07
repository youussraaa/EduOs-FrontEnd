import { CUSTOM_ELEMENTS_SCHEMA, NgModule ,NO_ERRORS_SCHEMA} from "@angular/core";
import { CommonModule, } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { SimplePageRoutingModule } from "./simple-page-routing.module";
import { NinthPageComponent } from "./ninth-page/ninth-page.component";
import { SharedModule } from "../../shared/shared.module";
import { EtablissementComponent } from "./etablissement/etablissement.component";
import { NiveauxComponent } from "./niveaux/niveaux.component";
import { FacturablesComponent } from "./facturables/facturables.component";
import { FichesComponent } from "./fiches/fiches.component";
import { EnseignantsComponent } from "./enseignants/enseignants.component";
import { EnseignantsMatiereComponent } from "./enseignants-matiere/enseignants-matiere.component";
import { ResumeComponent } from "./resume/resume.component";
import { LienComponent } from "./lien/lien.component";
import { DomaineComponent } from "./domaine/domaine.component";
import { ListeCandidatsComponent } from "./liste-candidats/liste-candidats.component";
import { InscriptionEtudiantsComponent } from "./inscription-etudiants/inscription-etudiants.component";
import { ListeEtudiantsComponent } from "./liste-etudiants/liste-etudiants.component";
import { ProfileEtudiantComponent } from "./profile-etudiant/profile-etudiant.component";
import { Paiements_oldComponent } from "./paiements_old/paiements_old.component";
import { DashboardComponent } from ".//dashboard/dashboard.component";
import { NotesComponent } from "./notes/notes.component";
import { Classeouvert_oldComponent } from "./classeouvert_old/classeouvert_old.component";
import { Operation_oldComponent } from "./operation_old/operation_old.component";
import { Recouvrement_oldComponent } from './recouvrement_old/recouvrement_old.component'
import { ClientsComponent } from './clients/clients.component'
import { AgGridModule } from 'ag-grid-angular';
import { TableModule } from 'primeng/table';
import { SelectButtonModule } from 'primeng/selectbutton'
import { ButtonModule } from 'primeng/button';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { RecouvrementtestComponent } from './recouvrementtest/recouvrementtest.component'
import { RecouvrementComponent } from './recouvrement/recouvrement.component'
import { OperationComponent } from "./operation/operation.component";
import { ClasseouvertComponent } from "./classeouvert/classeouvert.component";

import { PaiementsComponent } from "./paiements/paiements.component";
import { IgxGridModule, IgxIconModule, IgxInputGroupModule, IgxButtonModule, IgxRippleModule, IgxActionStripModule } from 'igniteui-angular';
import { defineCustomElements } from 'igniteui-dockmanager/loader';
import { Paiements2Component } from "./paiements2/paiements2.component";
import { Classeouvert2Component } from "./classeouvert2/classeouvert2.component";
import { EncaissementComponent } from "./encaissement/encaissement.component";
import { Recouvrement2Component } from "./recouvrement2/recouvrement2.component";



defineCustomElements()

@NgModule({
  declarations: [
    DashboardComponent,
    PaiementsComponent,
    NinthPageComponent,
    EtablissementComponent,
    DomaineComponent,
    NiveauxComponent,
    FacturablesComponent,
    FichesComponent,
    EnseignantsComponent,
    EnseignantsMatiereComponent,
    ResumeComponent,
    LienComponent,
    ListeCandidatsComponent,
    ListeEtudiantsComponent,
    ProfileEtudiantComponent,
    Paiements_oldComponent,
    NotesComponent,
    Classeouvert_oldComponent,
    InscriptionEtudiantsComponent,
    Operation_oldComponent,
    Recouvrement_oldComponent,
    ClientsComponent,
    RecouvrementtestComponent,
    RecouvrementComponent,
    OperationComponent,
    ClasseouvertComponent,

    Paiements2Component,
    Classeouvert2Component,
    EncaissementComponent,
    Recouvrement2Component,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

  imports: [
    CommonModule,
    SimplePageRoutingModule,
    SharedModule,
    FormsModule,
    AgGridModule,
    TableModule,
    SelectButtonModule,
    ButtonModule,
    NgxDatatableModule,
    IgxButtonModule,
    IgxInputGroupModule,
    IgxIconModule,
    IgxRippleModule,
    IgxActionStripModule,
  ],
})
export class SimplePageModule { }
