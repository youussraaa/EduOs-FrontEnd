import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { NinthPageComponent } from "./ninth-page/ninth-page.component";

import { EtablissementComponent } from "./etablissement/etablissement.component";
import { NiveauxComponent } from "./niveaux/niveaux.component";
import { FacturablesComponent } from "./facturables/facturables.component";
import { FichesComponent } from "./fiches/fiches.component";
import { EnseignantsComponent } from "./enseignants/enseignants.component";
import { EnseignantsMatiereComponent } from "./enseignants-matiere/enseignants-matiere.component";
import { ResumeComponent } from "./resume/resume.component";
import { LienComponent } from "./lien/lien.component";
import { DomaineComponent } from "./domaine/domaine.component";

import { NotesComponent } from "./notes/notes.component";
import { Classeouvert_oldComponent } from "./classeouvert_old/classeouvert_old.component";
import { ListeCandidatsComponent } from "./liste-candidats/liste-candidats.component";
import { ListeEtudiantsComponent } from "./liste-etudiants/liste-etudiants.component";
import { ProfileEtudiantComponent } from "./profile-etudiant/profile-etudiant.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { InscriptionEtudiantsComponent } from "./inscription-etudiants/inscription-etudiants.component";
import { Operation_oldComponent } from "./operation_old/operation_old.component";
import { Recouvrement_oldComponent } from './recouvrement_old/recouvrement_old.component'
import { ClientsComponent } from './clients/clients.component'
// import { AuthGuard } from "src/app/shared/guard/auth.guard";
import { RecouvrementtestComponent } from './recouvrementtest/recouvrementtest.component'
import { RecouvrementComponent } from './recouvrement/recouvrement.component'
import { OperationComponent } from "./operation/operation.component";
import { ClasseouvertComponent } from "./classeouvert/classeouvert.component";
import { AuthGuard } from "../../shared/guard/auth.guard";
import { Classeouvert2Component } from "./classeouvert2/classeouvert2.component";

import { Paiements_oldComponent } from "./paiements_old/paiements_old.component";
import { PaiementsComponent } from "./paiements/paiements.component";
import { Paiements2Component } from "./paiements2/paiements2.component";
import { EncaissementComponent } from "./encaissement/encaissement.component";
import { Recouvrement2Component } from "./recouvrement2/recouvrement2.component";


const routes: Routes = [
  {
    path: "",
    children: [
      { path: "", component: DashboardComponent, canActivate: [AuthGuard], },

      // configuration
      { path: "etablissement", component: EtablissementComponent, data: { roles: ['configuration'], }, canActivate: [AuthGuard], },
      { path: "domaine", component: DomaineComponent, data: { roles: ['configuration'], }, canActivate: [AuthGuard], },
      { path: "niveaux", component: NiveauxComponent, data: { roles: ['configuration'], }, canActivate: [AuthGuard], },
      { path: "facturables", component: FacturablesComponent, data: { roles: ['configuration'], }, canActivate: [AuthGuard], },
      { path: "fiches", component: FichesComponent, data: { roles: ['configuration'], }, canActivate: [AuthGuard], },
      { path: "enseignants", component: EnseignantsComponent, data: { roles: ['configuration'], }, canActivate: [AuthGuard], },
      { path: "enseignants-matiere", component: EnseignantsMatiereComponent, data: { roles: ['configuration'], }, canActivate: [AuthGuard], },
      { path: "resume", component: ResumeComponent, data: { roles: ['configuration'], }, canActivate: [AuthGuard], },

      { path: "lien", component: LienComponent, },
      { path: "ninth-page", component: NinthPageComponent, },
      { path: "liste-candidats", component: ListeCandidatsComponent, },

      // inscription
      { path: "liste-etudiants", component: ListeEtudiantsComponent, data: { roles: ['inscription'], }, canActivate: [AuthGuard], },
      { path: "profile-etudiant", component: ProfileEtudiantComponent, data: { roles: ['inscription'], }, canActivate: [AuthGuard], },
      { path: "inscription-etudiants", component: InscriptionEtudiantsComponent, data: { roles: ['inscription'], }, canActivate: [AuthGuard], },

      { path: "classe-ouvert_old", component: Classeouvert_oldComponent, data: { roles: ['configuration'], }, canActivate: [AuthGuard], },

      { path: "notes", component: NotesComponent, data: { roles: ['configuration'], }, canActivate: [AuthGuard], },

      // paiement
      { path: "operation_old", component: Operation_oldComponent, data: { roles: ['paiement'], }, canActivate: [AuthGuard], },
      { path: "recouvrement_old", component: Recouvrement_oldComponent, data: { roles: ['paiement'], }, canActivate: [AuthGuard], },

      { path: "clients", component: ClientsComponent, data: { roles: [], }, canActivate: [AuthGuard], },
      { path: "recouvrementtest", component: RecouvrementtestComponent, data: { roles: ['paiement'], }, canActivate: [AuthGuard], },
      { path: "operation", component: OperationComponent, data: { roles: ['paiement'], }, canActivate: [AuthGuard], },

      { path: "classe-ouvert", component: ClasseouvertComponent, data: { roles: ['configuration'], }, canActivate: [AuthGuard], },
      { path: "classe-ouvert2", component: Classeouvert2Component, data: { roles: ['configuration'], }, canActivate: [AuthGuard], },


      // { path: "paiements", component: PaiementsComponent, data: { roles: ['paiement'], }, canActivate: [AuthGuard], },
      { path: "paiements_old", component: Paiements_oldComponent, data: { roles: ['paiement'], }, canActivate: [AuthGuard], },

      { path: "paiements", component: Paiements2Component, data: { roles: ['paiement'], }, canActivate: [AuthGuard], },
      { path: "encaissement", component: EncaissementComponent, data: { roles: ['paiement'], }, canActivate: [AuthGuard], },
      { path: "recouvrement", component: Recouvrement2Component, data: { roles: ['paiement'], }, canActivate: [AuthGuard], },


    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SimplePageRoutingModule { }
