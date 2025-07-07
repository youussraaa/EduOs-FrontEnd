import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
// import { LoginComponent } from "./auth/login/login.component";
import { SimpleComponent } from "./auth/simple/simple.component";
import { CandidatureComponent } from "./pages/public/candidature/candidature.component";
import { ForgetPasswordComponent } from "./auth/forget-password/forget-password.component";

import { ContentComponent } from "./shared/components/layout/content/content.component";
import { content } from "./shared/routes/routes";

import { FullComponent } from "./shared/components/layout/full/full.component";
import { full } from "./shared/routes/full.routes";

import { NinthPageComponent } from "./components/simple-page/ninth-page/ninth-page.component";

import { EtablissementComponent } from "./components/simple-page/etablissement/etablissement.component";
import { NiveauxComponent } from "./components/simple-page/niveaux/niveaux.component";
import { FacturablesComponent } from "./components/simple-page/facturables/facturables.component";
import { FichesComponent } from "./components/simple-page/fiches/fiches.component";
import { EnseignantsComponent } from "./components/simple-page/enseignants/enseignants.component";
import { EnseignantsMatiereComponent } from "./components/simple-page/enseignants-matiere/enseignants-matiere.component";
import { ResumeComponent } from "./components/simple-page/resume/resume.component";
import { LienComponent } from "./components/simple-page/lien/lien.component";

import { ListeCandidatsComponent } from "./components/simple-page/liste-candidats/liste-candidats.component";
import { ListeEtudiantsComponent } from "./components/simple-page/liste-etudiants/liste-etudiants.component";
import { ProfileEtudiantComponent } from "./components/simple-page/profile-etudiant/profile-etudiant.component";
import { Paiements_oldComponent } from "./components/simple-page/paiements_old/paiements_old.component";
import { DashboardComponent } from "./components/simple-page/dashboard/dashboard.component";
import { NotesComponent } from "./components/simple-page/notes/notes.component";
import { AuthGuard } from "./shared/guard/auth.guard";

const routes: Routes = [
  // { path: "", redirectTo: "/dashboard", pathMatch: "full", },
  
  { path: "public/candidature", component: CandidatureComponent, },
  // { path: "auth/simple", component: SimpleComponent, },
  // { path: "auth/forget-password", component: ForgetPasswordComponent, },
  { path: "", component: ContentComponent, canActivate: [AuthGuard], children: content, },
  { path: "", component: FullComponent, canActivate: [AuthGuard], children: full, },

  // { path: "", component: DashboardComponent, },

  // { path: "etablissement", component: EtablissementComponent, },
  // { path: "niveaux", component: NiveauxComponent, },
  // { path: "facturables", component: FacturablesComponent, },
  // { path: "fiches", component: FichesComponent, },
  // { path: "enseignants", component: EnseignantsComponent, },
  // { path: "enseignants-matiere", component: EnseignantsMatiereComponent, },
  // { path: "resume", component: ResumeComponent, },
  // { path: "lien", component: LienComponent, },
  // { path: "ninth-page", component: NinthPageComponent, },
  // { path: "liste-candidats", component: ListeCandidatsComponent, },
  // { path: "liste-etudiants", component: ListeEtudiantsComponent, },
  // { path: "profile-etudiant", component: ProfileEtudiantComponent, },
  // { path: "paiements", component: PaiementsComponent, },
  // { path: "notes", component: NotesComponent, },
  { path: "**", redirectTo: "/", },
];

@NgModule({
  imports: [
    [
      RouterModule.forRoot(routes, {
        anchorScrolling: "enabled",
        scrollPositionRestoration: "enabled",
        useHash: true,
      }),
    ],
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
