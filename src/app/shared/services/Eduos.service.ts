import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, forkJoin, Observable, of } from "rxjs";
import { environment } from "../../../environments/environment";
import { AuthService } from "./auth.service";
import { Ecole } from "../components/model/dto.model";
import { AppService } from "./app.service";
declare var $: any;

@Injectable({
  providedIn: "root",
})
export class EduosService {
  EcoleId: string | null = null;
  public static GuidEmpty: string = "00000000-0000-0000-0000-000000000000";
  public Ecole: any = null;

  constructor(private http: HttpClient, private authService: AuthService, private appService: AppService) {
    if (this.authService.isLoggedIn()) {
      // Récupérer l'école du localStorage au démarrage
      this.EcoleId = localStorage.getItem("EcoleId");
      this.Ecole = this.EcoleId ? JSON.parse(localStorage.getItem("Ecole") || "{}") : undefined;

      this.authService.GetCurrentUser().then(
        (response: any) => {
          if (!environment.production) console.log("Response GetCurrentUser from EduosService:", response);
          if (response && !this.EcoleId) {
            const ecoleIdFromUser = response.attributes?.EcoleId?.[0];
            if (ecoleIdFromUser) {
              if (!environment.production) console.log("CurrentUser EcoleId:", ecoleIdFromUser);
              this.updateEcoleId(ecoleIdFromUser);
            } else {
              console.error("No EcoleId found in user attributes!");
            }
          } else {
            console.log("EcoleId already set or no response.");
          }
        },
        (error) => {
          console.error("Error GetCurrentUser:", error);
        }
      );
      // Écouter les changements de Ecole depuis AppService
      this.appService.ecoleEmitter.subscribe((newEcole) => {
        this.EcoleId = newEcole.Ecole_Id;
        this.Ecole = newEcole;
      });
    }
  }

  private updateEcoleId(ecoleId: Ecole): void {
    const newEcole: any = { Ecole_Id: ecoleId };
    this.appService.ecoleEmitter.emit(newEcole); // Émettre l'événement pour mettre à jour globalement
  }

  // SetEcole() {
  //   console.log("SetEcole this.EcoleId: ", this.EcoleId)
  //   this.EcoleId = localStorage.getItem("EcoleId");
  //   this.Ecole = JSON.parse(localStorage.getItem("Ecole"));
  // }

  GetEcole(ecoleIds: string[]): Observable<any> {
    const params = ecoleIds.map((id) => `ListEcole_Id=${encodeURIComponent(id)}`).join("&");
    const url = `${environment.apiUrl}/api/Configuration/GetEcole?${params}`;
    return this.http.get<any>(url).pipe(catchError(this.handleError("GetEcole")));
  }

  GetEcoleByCode(Ecole_Code: string): Observable<any> {
    let url = `${environment.apiUrl}/api/Ecole/GetEcoleByCode?`;
    url += `Ecole_Code=${Ecole_Code}`;
    return this.http.get<any>(url).pipe(catchError(this.handleError("GetEcoleByCode")));
  }
  GetAnnees() {
    let url = `${environment.apiUrl}/api/Configuration/GetAnnees?`;
    url += `Ecole_Id=${this.EcoleId}`;
    return this.http.get<any>(url).pipe(catchError(this.handleError("GetAnnees")));
  }
  GetNiveau() {
    let url = `${environment.apiUrl}/api/Configuration/GetNiveau/${this.EcoleId}`;
    return this.http.get<any>(url).pipe(catchError(this.handleError("GetNiveau")));
  }
  // Create Etablissement
  CreateEtablissement(etablissementData: any): Observable<any> {
    const url = `${environment.apiUrl}/api/Configuration/CreateEcole`;
    return this.http.post<any>(url, etablissementData).pipe(catchError(this.handleError("CreateEtablissement")));
  }

  // Update Etablissement
  UpdateEtablissement(id: string, etablissementData: any): Observable<any> {
    const url = `${environment.apiUrl}/api/Configuration/UpdateEcole/${id}`;
    return this.http.put<any>(url, etablissementData).pipe(catchError(this.handleError("UpdateEtablissement")));
  }

  // Delete Etablissement
  DeleteEtablissement(id: string): Observable<any> {
    const url = `${environment.apiUrl}/api/Configuration/DeleteEcole/${id}`;
    return this.http.delete<any>(url).pipe(catchError(this.handleError("DeleteEtablissement")));
  }

  // Create Niveaux
  CreateNiveaux(niveauxData: any): Observable<any> {
    niveauxData = niveauxData.map((item) => {
      item.Ecole_Id = this.EcoleId;
      return item;
    });
    const url = `${environment.apiUrl}/api/Configuration/CreateNiveau`;
    return this.http.post<any>(url, niveauxData).pipe(catchError(this.handleError("CreateNiveau")));
  }

  // Update Niveaux
  UpdateNiveau(id: string, niveauxData: any): Observable<any> {
    niveauxData.Ecole_Id = this.EcoleId;
    const url = `${environment.apiUrl}/api/Configuration/UpdateNiveau/${id}`;
    return this.http.put<any>(url, niveauxData).pipe(catchError(this.handleError("UpdateNiveau")));
  }

  // Delete Niveaux
  DeleteNiveau(id: string): Observable<any> {
    const url = `${environment.apiUrl}/api/Configuration/DeleteNiveau/${id}`;
    return this.http.delete<any>(url).pipe(catchError(this.handleError("DeleteNiveau")));
  }

  // Create Matiere
  CreateMatiere(matiereData: any): Observable<any> {
    const url = `${environment.apiUrl}/api/Configuration/CreateMatiere`;
    return this.http.post<any>(url, matiereData);
    //.pipe(catchError(this.handleError("CreateMatiere")));
  }

  // Update Matiere
  UpdateMatiere(id: string, matiereData: any): Observable<any> {
    const url = `${environment.apiUrl}/api/Configuration/UpdateMatiere/${id}`;
    return this.http.put<any>(url, matiereData).pipe(catchError(this.handleError("UpdateMatiere")));
  }

  // Delete Matiere
  DeleteMatiere(id: string): Observable<any> {
    const url = `${environment.apiUrl}/api/Configuration/DeleteMatiere/${id}`;
    return this.http.delete<any>(url).pipe(catchError(this.handleError("DeleteMatiere")));
  }
  GetClasse(): Observable<any> {
    let url = `${environment.apiUrl}/api/Configuration/GetClasse?`;
    return this.http.get<any>(url).pipe(catchError(this.handleError("GetClasse")));
  }

  GetClasses() {
    let url = `${environment.apiUrl}/api/Configuration/GetClasses?`;
    url += `Ecole_Id=${this.EcoleId}`;
    return this.http.get<any>(url).pipe(catchError(this.handleError("GetClasses")));
  }
  // Create Classe
  CreateClasse(classeData: any): Observable<any> {
    const url = `${environment.apiUrl}/api/Configuration/CreateClasse`;
    return this.http.post<any>(url, classeData).pipe(catchError(this.handleError("CreateClasse")));
  }

  // Update Classe
  UpdateClasse(id: string, classeData: any): Observable<any> {
    const url = `${environment.apiUrl}/api/Configuration/UpdateClasse/${id}`;
    return this.http.put<any>(url, classeData).pipe(catchError(this.handleError("UpdateClasse")));
  }

  // Create ClasseAnneeMatiereEns
  CreateClasseAnneeMatiere(ClasseAnneeMatiereData: any): Observable<any> {
    const url = `${environment.apiUrl}/api/Configuration/CreateClasseAnneeMatiere`;
    return this.http.post<any>(url, ClasseAnneeMatiereData);
    //.pipe(catchError(this.handleError("CreateMatiere")));
  }

  // Update ClasseAnneeMatiere
  UpdateClasseAnneeMatiere(id: string, ClasseAnneeMatiereData: any): Observable<any> {
    const url = `${environment.apiUrl}/api/Configuration/UpdateClasseAnneeMatiere/${id}`;
    return this.http.put<any>(url, ClasseAnneeMatiereData).pipe(catchError(this.handleError("UpdateClasseAnneeMatiere")));
  }

  // Delete ClasseAnneeMatiere
  DeleteClasseAnneeMatiere(id: string): Observable<any> {
    const url = `${environment.apiUrl}/api/Configuration/DeleteClasseAnneeMatiere/${id}`;
    return this.http.delete<any>(url).pipe(catchError(this.handleError("DeleteClasseAnneeMatiere")));
  }
  //Get ClasseAnneeMatiere
  GetClasseAnneeMatiere(ClasseAnn_Id: string): Observable<any> {
    let url = `${environment.apiUrl}/api/Configuration/GetClasseAnneeMatiere?`;
    url += `ClasseAnn_Id=${ClasseAnn_Id}`;
    return this.http.get<any>(url).pipe(catchError(this.handleError("GetClasseAnneeMatiere")));
  }
  //#region ClassAnnee
  // Get ClasseAnnee
  GetClasseAnnee(params: { Ann_Id?: string; Cls_Id?: string }): Observable<any> {
    let url = `${environment.apiUrl}/api/Configuration/GetClasseAnnee?`;
    url += `Ecole_Id=${this.EcoleId}&`;
    if (params.Ann_Id != null && params.Ann_Id != "") url += `Ann_Id=${params.Ann_Id}&`;
    if (params.Cls_Id != null && params.Cls_Id != "") url += `Cls_Id=${params.Cls_Id}&`;
    return this.http.get<any>(url).pipe(catchError(this.handleError("GetClasseAnnee")));
  }

  // Create ClasseAnnee
  CreateClasseAnnee(classeanneeData: any): Observable<any> {
    const url = `${environment.apiUrl}/api/Configuration/CreateClasseAnnee`;
    return this.http.post<any>(url, classeanneeData).pipe(catchError(this.handleError("CreateClasseAnnee")));
  }
  //Delete ClasseAnnee
  DeleteClasseAnnee(ListClasseAnn_Id: string[]): Observable<any> {
    const url = `${environment.apiUrl}/api/Configuration/DeleteClasseAnnee`;
    return this.http.delete<any>(url, { body: { ListClasseAnn_Id: ListClasseAnn_Id } }).pipe(catchError(this.handleError("DeleteClasseAnnee")));
  }
  GetClassesAOuvrir(Ann_Id: string, Ecole_Id: string | null): Observable<any> {
    let url = `${environment.apiUrl}/api/Configuration/GetClassesAOuvrir?`;
    if (Ann_Id != null && Ann_Id != "") url += `Ann_Id=${Ann_Id}&`;
    if (Ecole_Id != null && Ecole_Id != "") url += `Ecole_Id=${Ecole_Id}&`;
    return this.http.get<any>(url).pipe(catchError(this.handleError("GetClassesAOuvrir")));
  }
  //#endregionClassAnnee
  // Delete Classe
  DeleteClasse(id: string): Observable<any> {
    const url = `${environment.apiUrl}/api/Configuration/DeleteClasse/${id}`;
    return this.http.delete<any>(url).pipe(catchError(this.handleError("DeleteClasse")));
  }

  //#region Enseignant
  //Get Enseignant
  GetEnseignants(Ecole_Id?: string): Observable<any> {
    let url = `${environment.apiUrl}/api/Configuration/GetEnseignants?`;
    // if (Ecole_Id != null && Ecole_Id != "")
    url += `Ecole_Id=${this.EcoleId}&`;
    return this.http.get<any>(url).pipe(catchError(this.handleError("GetEnseignants")));
  }
  // Create Enseignant
  CreateEnseignant(enseignantData: any): Observable<any> {
    enseignantData.Ecole_Id = this.EcoleId;
    const url = `${environment.apiUrl}/api/Configuration/CreateEnseignant`;
    return this.http.post<any>(url, enseignantData).pipe(catchError(this.handleError("CreateEnseignant")));
  }

  // Update Enseignant
  UpdateEnseignant(id: string, enseignantData: any): Observable<any> {
    const url = `${environment.apiUrl}/api/Configuration/UpdateEnseignant/${id}`;
    return this.http.put<any>(url, enseignantData).pipe(catchError(this.handleError("UpdateEnseignant")));
  }

  // Delete Enseignant
  DeleteEnseignant(id: string): Observable<any> {
    const url = `${environment.apiUrl}/api/Configuration/DeleteEnseignant/${id}`;
    return this.http.delete<any>(url).pipe(catchError(this.handleError("DeleteEnseignant")));
  }
  //#endregion Enseignant
  // Create Enseignant Matiere Classe
  CreateEnseignantMatiereClasse(data: any): Observable<any> {
    const url = `${environment.apiUrl}/api/Configuration/CreateEnseignantMatiereClasse`;
    return this.http.post<any>(url, data).pipe(catchError(this.handleError("CreateEnseignantMatiereClasse")));
  }

  // Update Enseignant Matiere Classe
  UpdateEnseignantMatiereClasse(id: string, data: any): Observable<any> {
    const url = `${environment.apiUrl}/api/Configuration/UpdateEnseignantMatiereClasse/${id}`;
    return this.http.put<any>(url, data).pipe(catchError(this.handleError("UpdateEnseignantMatiereClasse")));
  }

  // Delete Enseignant Matiere Classe
  DeleteEnseignantMatiereClasse(id: string): Observable<any> {
    const url = `${environment.apiUrl}/api/Configuration/DeleteEnseignantMatiereClasse/${id}`;
    return this.http.delete<any>(url).pipe(catchError(this.handleError("DeleteEnseignantMatiereClasse")));
  }

  //#region Facturable

  // Create Facturable
  CreateFacturable(data: any): Observable<any> {
    data.Ecole_Id = this.EcoleId;
    const url = `${environment.apiUrl}/api/Configuration/CreateFacturable`;
    return this.http.post<any>(url, data).pipe(catchError(this.handleError("CreateFacturable")));
  }

  // Update Facturable
  UpdateFacturable(id: string, data: any): Observable<any> {
    const url = `${environment.apiUrl}/api/Configuration/UpdateFacturable/${id}`;
    return this.http.put<any>(url, data).pipe(catchError(this.handleError("UpdateFacturable")));
  }

  // Delete Facturable
  DeleteFacturable(id: string): Observable<any> {
    const url = `${environment.apiUrl}/api/Configuration/DeleteFacturable/${id}`;
    return this.http.delete<any>(url).pipe(catchError(this.handleError("DeleteFacturable")));
  }

  // Get Facturable
  GetFacturable(): Observable<any> {
    let url = `${environment.apiUrl}/api/Configuration/GetFacturable?`;
    // if (Ecole_Id != null && Ecole_Id != "")
    url += `Ecole_Id=${this.EcoleId}&`;
    return this.http.get<any>(url).pipe(catchError(this.handleError("GetFacturable")));
  }
  // Get Facturable
  GetFacturableByEtudiantClasseAnnee(EtdClasseAnn_Id: string): Observable<any> {
    let url = `${environment.apiUrl}/api/Configuration/GetFacturableByEtudiantClasseAnnee?`;
    // if (Ecole_Id != null && Ecole_Id != "")
    url += `EtdClasseAnn_Id=${EtdClasseAnn_Id}&`;
    return this.http.get<any>(url).pipe(catchError(this.handleError("GetFacturableByEtudiantClasseAnnee")));
  }
  //#endregion Facturable
  // Create Fiche Facturation
  CreateFicheFacturation(data: any): Observable<any> {
    const url = `${environment.apiUrl}/api/Configuration/CreateFicheFacturation`;
    return this.http.post<any>(url, data).pipe(catchError(this.handleError("CreateFicheFacturation")));
  }

  // Update Fiche Facturation
  UpdateFicheFacturation(id: string, data: any): Observable<any> {
    const url = `${environment.apiUrl}/api/Configuration/UpdateFicheFacturation/${id}`;
    return this.http.put<any>(url, data).pipe(catchError(this.handleError("UpdateFicheFacturation")));
  }

  // Delete Fiche Facturation
  DeleteFicheFacturation(id: string): Observable<any> {
    const url = `${environment.apiUrl}/api/Configuration/DeleteFicheFacturation/${id}`;
    return this.http.delete<any>(url).pipe(catchError(this.handleError("DeleteFicheFacturation")));
  }

  // Get Fiche Facturation
  GetFicheFacturation(): Observable<any> {
    const url = `${environment.apiUrl}/api/Configuration/GetFicheFacturation`;
    return this.http.get<any>(url).pipe(catchError(this.handleError("GetFicheFacturation")));
  }
  CreateFacturableFicheFacturation(data: any): Observable<any> {
    const url = `${environment.apiUrl}/api/Configuration/CreateFacturableFicheFacturation`;
    return this.http.post<any>(url, data).pipe(catchError(this.handleError("CreateFacturableFicheFacturation")));
  }
  // Update Facturable Fiche Facturation
  UpdateFacturableFicheFacturation(id: string, data: any): Observable<any> {
    const url = `${environment.apiUrl}/api/Configuration/UpdateFacturableFicheFacturation/${id}`;
    return this.http.put<any>(url, data).pipe(catchError(this.handleError("UpdateFacturableFicheFacturation")));
  }
  // Delete Facturable Fiche Facturation
  DeleteFacturableFicheFacturation(id: string): Observable<any> {
    const url = `${environment.apiUrl}/api/Configuration/DeleteFacturableFicheFacturation/${id}`;
    return this.http.delete<any>(url).pipe(catchError(this.handleError("DeleteFacturableFicheFacturation")));
  }

  // Get Resume Config
  GetResumeConfig(): Observable<any> {
    const url = `${environment.apiUrl}/api/Configuration/GetResumeConfig?Ecole_Id=${this.EcoleId}`;
    return this.http.get<any>(url).pipe(catchError(this.handleError("GetResumeConfig")));
  }
  //#region Etudiant
  // Create Etudiant
  CreateEtudiant(etudiantData: any): Observable<any> {
    const url = `${environment.apiUrl}/api/Etudiant/CreateEtudiant`;
    return this.http.post<any>(url, etudiantData).pipe(catchError(this.handleError("CreateEtudiant")));
  }
  // Get Etudiant
  GetEtudiants(params: { Ecole_Id?: string; Etd_Prenom?: string; Etd_Nom?: string; Etd_Matricule?: string; TelephoneTuteur?: string }): Observable<any> {
    let url = `${environment.apiUrl}/api/Etudiant/GetEtudiants?`;
    // if (Ecole_Id != null && Ecole_Id != "")
    url += `Ecole_Id=${this.EcoleId}&`;
    if (params.Etd_Prenom != null && params.Etd_Prenom != "") url += `Etd_Prenom=${params.Etd_Prenom}&`;
    if (params.Etd_Nom != null && params.Etd_Nom != "") url += `Etd_Nom=${params.Etd_Nom}&`;
    if (params.Etd_Matricule != null && params.Etd_Matricule != "") url += `Etd_Matricule=${params.Etd_Matricule}&`;
    if (params.TelephoneTuteur != null && params.TelephoneTuteur != "") url += `TelephoneTuteur=${params.TelephoneTuteur}&`;
    return this.http.get<any>(url).pipe(catchError(this.handleError("GetEtudiants")));
  }

  // Update Etudiant
  UpdateEtudiant(id: string, etudiantData: any): Observable<any> {
    const url = `${environment.apiUrl}/api/Etudiant/UpdateEtudiant/${id}`;
    return this.http.put<any>(url, etudiantData).pipe(catchError(this.handleError("UpdateEtudiant")));
  }

  DeleteEtudiant(ids: string[]): Observable<any> {
    const url = `${environment.apiUrl}/api/Etudiant/DeleteEtudiant`;
    return this.http.delete<any>(url, { body: { ListEtd_Id: ids } }).pipe(catchError(this.handleError("DeleteEtudiant")));
  }

  //#endregion Etudiant

  //#region Candiat
  //Create Candidat
  CreateCandidat(candidatData: any): Observable<any> {
    let url = `${environment.apiUrl}/api/Candidat/CreateCandidat2?`;
    // candidatData.Ecole_Id = this.EcoleId;
    return this.http.post<any>(url, candidatData).pipe(catchError(this.handleError("CreateCandidat")));
  }

  // Get Etudiant
  GetCandidats(params: { Cnd_DateCandidature?: any; Niv_Id?: any; Cnd_Nom?: string; Cnd_Prenom?: string }): Observable<any> {
    let url = `${environment.apiUrl}/api/Candidat/GetCandidats?`;
    url += `Ecole_Id=${this.EcoleId}&`;
    if (params.Cnd_DateCandidature != null && params.Cnd_DateCandidature != "") url += `Cnd_DateCandidature=${params.Cnd_DateCandidature}&`;
    if (params.Niv_Id != null && params.Niv_Id != "") url += `Niv_Id=${params.Niv_Id}&`;
    if (params.Cnd_Nom != null && params.Cnd_Nom != "") url += `Cnd_Nom=${params.Cnd_Nom}&`;
    if (params.Cnd_Prenom != null && params.Cnd_Prenom != "") url += `Cnd_Prenom=${params.Cnd_Prenom}&`;
    return this.http.get<any>(url).pipe(catchError(this.handleError("GetCandidats")));
  }
  // Update candidat
  AccepterRefuserCandidat(candidatData: any): Observable<any> {
    const url = `${environment.apiUrl}/api/Candidat/AccepterRefuserCandidat`;
    return this.http.put<any>(url, candidatData).pipe(catchError(this.handleError("UpdateCandidat")));
  }

  //#endregion Candiat

  //#region Domaine
  GetMatieres(Niv_Id: string) {
    let url = `${environment.apiUrl}/api/Configuration/GetMatieres?`;
    url += `Niv_Id=${Niv_Id}`;
    return this.http.get<any>(url).pipe(catchError(this.handleError("GetMatieres")));
  }

  // Create Domaine
  CreateDomaine(domaineData: any): Observable<any> {
    const url = `${environment.apiUrl}/api/Configuration/CreateDomaine`;
    domaineData.Ecole_Id = this.EcoleId;
    return this.http.post<any>(url, domaineData).pipe(catchError(this.handleError("CreateDomaine")));
  }
  // Get Etudiant
  GetDomaines(): Observable<any> {
    let url = `${environment.apiUrl}/api/Configuration/GetDomaines?`;
    url += `Ecole_Id=${this.EcoleId}`;
    return this.http.get<any>(url).pipe(catchError(this.handleError("GetDomaines")));
  }

  // Update Etudiant
  UpdateDomaine(id: string, domaineData: any): Observable<any> {
    const url = `${environment.apiUrl}/api/Configuration/UpdateDomaine/${id}`;
    return this.http.put<any>(url, domaineData).pipe(catchError(this.handleError("UpdateDomaine")));
  }

  DeleteDomaine(id: string): Observable<any> {
    const url = `${environment.apiUrl}/api/Configuration/DeleteDomaine/${id}`;
    return this.http.delete<any>(url).pipe(catchError(this.handleError("DeleteDomaine")));
  }

  //#endregion Domaine
  // Handle errors
  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  GetCommunData(routes: string[]): Observable<Object[]> {
    const httpObservables = routes.map((url) => this.http.get(`${url}`));
    return forkJoin(httpObservables);
  }
  CreateEtudiantClasseAnnee(data: any) {
    const url = `${environment.apiUrl}/api/Etudiant/CreateEtudiantClasseAnnee`;
    return this.http.post(url, data);
  }
  UpdateEtudiantClasseAnnee(id: string, data: any) {
    const url = `${environment.apiUrl}/api/Etudiant/UpdateEtudiantClasseAnnee/${id}`;
    return this.http.put(url, data);
  }
  DeleteEtudiantClasseAnnee(data: any) {
    let url = `${environment.apiUrl}/api/Etudiant/DeleteEtudiantClasseAnnee`;
    return this.http.delete(url, { body: data });
  }
  DeleteOperation(id: string) {
    const url = `${environment.apiUrl}/api/Paiement/DeleteOperation/${id}`;
    return this.http.delete(url);
  }

  SearchEtudiantClasseAnnee(data: any) {
    let url = `${environment.apiUrl}/api/Etudiant/SearchEtudiantClasseAnnee?`;
    if (data.matricule != null && data.matricule != "") url += `Etd_Matricule=${data.matricule}&`;
    if (data.nom != null && data.nom != "") url += `Etd_Nom=${data.nom}&`;
    if (data.prenom != null && data.prenom != "") url += `Etd_Prenom=${data.prenom}&`;
    if (data.TelephoneTuteurs != null && data.TelephoneTuteurs != "") url += `TelephoneTuteurs=${data.TelephoneTuteurs}&`;
    if (data.niveau != null && data.niveau != "") url += `Niv_Id=${data.niveau}&`;
    if (data.classe != null && data.classe != "") url += `ClasseAnn_Id=${data.classe}&`;
    if (data.annee != null && data.annee != "") url += `Ann_Id=${data.annee}&`;
    url += `Ecole_Id=${this.EcoleId}&`;
    return this.http.get<any>(url);
  }
  //#region Paiement
  GetModePaiement(): Observable<any> {
    let url = `${environment.apiUrl}/api/Configuration/GetModePaiement`;
    return this.http.get<any>(url).pipe(catchError(this.handleError("GetModePaiement")));
  }
  GetTotalByModePaiement(): Observable<any> {
    let url = `${environment.apiUrl}/api/Configuration/GetTotalByModePaiement?`;
    url += `Ecole_Id=${this.EcoleId}&`;
    return this.http.get<any>(url).pipe(catchError(this.handleError("GetTotalByModePaiement")));
  }
  GetOperations(params: { Ope_Date?: string; Ann_Id?: string; Etd_Nom?: string; Etd_Prenom?: string; Etd_Matricule?: string; Caisse_Id?: string }): Observable<any> {
    let url = `${environment.apiUrl}/api/Paiement/GetOperations?`;
    url += `Ecole_Id=${this.EcoleId}&`;
    if (params.Ope_Date != null && params.Ope_Date != "") url += `Ope_Date=${params.Ope_Date}&`;
    if (params.Ann_Id != null && params.Ann_Id != "") url += `Ann_Id=${params.Ann_Id}&`;
    if (params.Etd_Nom != null && params.Etd_Nom != "") url += `Etd_Nom=${params.Etd_Nom}&`;
    if (params.Etd_Prenom != null && params.Etd_Prenom != "") url += `Etd_Prenom=${params.Etd_Prenom}&`;
    if (params.Etd_Matricule != null && params.Etd_Matricule != "") url += `Etd_Matricule=${params.Etd_Matricule}&`;
    if (params.Caisse_Id != null && params.Caisse_Id != "") url += `Caisse_Id=${params.Caisse_Id}&`;
    return this.http.get<any>(url).pipe(catchError(this.handleError("GetOperations")));
  }
  CreateOperation(operationData: any): Observable<any> {
    let url = `${environment.apiUrl}/api/Paiement/CreateOperation`;
    return this.http.post<any>(url, operationData).pipe(catchError(this.handleError("CreateOperation")));
  }
  DeleteVersement(id: string) {
    const url = `${environment.apiUrl}/api/Paiement/DeleteVersement/${id}`;
    return this.http.delete(url);
  }
  UpdateVersement(versementData: any): Observable<any> {
    const url = `${environment.apiUrl}/api/Paiement/UpdateVersement`;
    return this.http.put<any>(url, versementData).pipe(catchError(this.handleError("UpdateVersement")));
  }
  // Get EtudiantPaiement
  GetEtudiantPaiment(Ecole_Id?: string, Etd_Prenom?: string, Etd_Nom?: string, Etd_Matricule?: string, Etd_Id?: string): Observable<any> {
    let url = `${environment.apiUrl}/api/Paiement/GetEtudiantPaiement?`;
    // if (Ecole_Id != null && Ecole_Id != "")
    url += `Ecole_Id=${this.EcoleId}&`;
    if (Etd_Prenom != null && Etd_Prenom != "") url += `Etd_Prenom=${Etd_Prenom}&`;
    if (Etd_Nom != null && Etd_Nom != "") url += `Etd_Nom=${Etd_Nom}&`;
    if (Etd_Matricule != null && Etd_Matricule != "") url += `Etd_Matricule=${Etd_Matricule}&`;
    if (Etd_Id != null && Etd_Id != "") url += `Etd_Id=${Etd_Id}&`;
    return this.http.get<any>(url).pipe(catchError(this.handleError("GetEtudiantPaiement")));
  }
  GetEtudiantClasseAnneePaiement(params: {
    Ann_Id?: string;
    EtdClasseAnn_Id?: string;
    Niv_Id?: string;
    Cls_Id?: string;
    Etd_Matricule?: string;
    Etd_Nom?: string;
    Etd_Prenom?: string;
    TelephoneTuteur?: string;
  }): Observable<any> {
    let url = `${environment.apiUrl}/api/Paiement/GetEtudiantClasseAnneePaiement?`;
    url += `Ecole_Id=${this.EcoleId}&`;
    if (params.Ann_Id != null && params.Ann_Id != "") url += `Ann_Id=${params.Ann_Id}&`;
    if (params.EtdClasseAnn_Id != null && params.EtdClasseAnn_Id != "") url += `EtdClasseAnn_Id=${params.EtdClasseAnn_Id}&`;
    if (params.Niv_Id != null && params.Niv_Id != "") url += `Niv_Id=${params.Niv_Id}&`;
    if (params.Cls_Id != null && params.Cls_Id != "") url += `Cls_Id=${params.Cls_Id}&`;
    if (params.Etd_Matricule != null && params.Etd_Matricule != "") url += `Etd_Matricule=${params.Etd_Matricule}&`;
    if (params.Etd_Nom != null && params.Etd_Nom != "") url += `Etd_Nom=${params.Etd_Nom}&`;
    if (params.Etd_Prenom != null && params.Etd_Prenom != "") url += `Etd_Prenom=${params.Etd_Prenom}&`;
    if (params.TelephoneTuteur != null && params.TelephoneTuteur != "") url += `TelephoneTuteur=${params.TelephoneTuteur}&`;

    return this.http.get<any>(url).pipe(catchError(this.handleError("GetEtudiantClasseAnneePaiement")));
  }
  GetRecuPaiement(id: string) {
    let headers = new HttpHeaders();
    headers = headers.set("Accept", "application/pdf");
    let url = `${environment.apiUrl}/api/Report/GetRecuPaiement?Ope_Id=${id}`;
    return this.http.get(url, { headers: headers, responseType: "blob" });
  }
  // Create FacturerEtudiant
  CreateFacturerEtudiant(factureretudiantData: any): Observable<any> {
    const url = `${environment.apiUrl}/api/Paiement/FacturerEtudiant`;
    return this.http.post<any>(url, factureretudiantData).pipe(catchError(this.handleError("CreateFacturerEtudiant")));
  }
  //#endregion Paiement
  GetStatistique(params: { Ann_Id: string }) {
    let url = `${environment.apiUrl}/api/Dashboard/GetStatistique?`;
    url += `Ecole_Id=${this.EcoleId}&`;
    if (params.Ann_Id != null && params.Ann_Id != "") url += `Ann_Id=${params.Ann_Id}&`;
    return this.http.get<any>(url);
  }
  //#region Recouvrement
  GetEtudiantVersements(params: {
    Vers_Dateprevu?: any;
    Ann_Id?: any;
    Cls_Id?: any;
    Fact_Id?: any;
    Niv_Id?: any;
    Etd_Nom?: string;
    Etd_Prenom?: string;
    Etd_Matricule?: string;
    Vers_Nom?: string;
    TelephoneTuteur?: string;
  }): Observable<any> {
    let url = `${environment.apiUrl}/api/Etudiant/GetEtudiantVersements?`;
    url += `Ecole_Id=${this.EcoleId}&`;
    if (params.Vers_Dateprevu != null && params.Vers_Dateprevu != "") url += `Vers_Dateprevu=${params.Vers_Dateprevu}&`;
    if (params.Niv_Id != null && params.Niv_Id != "") url += `Niv_Id=${params.Niv_Id}&`;
    if (params.Fact_Id != null && params.Fact_Id != "") url += `Fact_Id=${params.Fact_Id}&`;
    if (params.Etd_Nom != null && params.Etd_Nom != "") url += `Etd_Nom=${params.Etd_Nom}&`;
    if (params.Etd_Prenom != null && params.Etd_Prenom != "") url += `Etd_Prenom=${params.Etd_Prenom}&`;
    if (params.Ann_Id != null && params.Ann_Id != "") url += `Ann_Id=${params.Ann_Id}&`;
    if (params.Cls_Id != null && params.Cls_Id != "") url += `Cls_Id=${params.Cls_Id}&`;
    if (params.Etd_Matricule != null && params.Etd_Matricule != "") url += `Etd_Matricule=${params.Etd_Matricule}&`;
    if (params.Vers_Nom != null && params.Vers_Nom != "") url += `Vers_Nom=${params.Vers_Nom}&`;
    if (params.TelephoneTuteur != null && params.TelephoneTuteur != "") url += `TelephoneTuteur=${params.TelephoneTuteur}&`;

    return this.http.get<any>(url).pipe(catchError(this.handleError("GetEtudiantVersements")));
  }
  GenererFacture(params: {
    Vers_Dateprevu?: any;
    Ann_Id?: any;
    Cls_Id?: any;
    Fact_Id?: any;
    Niv_Id?: any;
    Etd_Nom?: string;
    Etd_Prenom?: string;
    Etd_Matricule?: string;
    Vers_Nom?: string;
    TelephoneTuteur?: string;
  }): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set("Accept", "application/pdf");
    let url = `${environment.apiUrl}/api/Report/GetRecuPaiementV2?`;
    url += `Ecole_Id=${this.EcoleId}&`;
    if (params.Vers_Dateprevu != null && params.Vers_Dateprevu != "") url += `Vers_Dateprevu=${params.Vers_Dateprevu}&`;
    if (params.Niv_Id != null && params.Niv_Id != "") url += `Niv_Id=${params.Niv_Id}&`;
    if (params.Fact_Id != null && params.Fact_Id != "") url += `Fact_Id=${params.Fact_Id}&`;
    if (params.Etd_Nom != null && params.Etd_Nom != "") url += `Etd_Nom=${params.Etd_Nom}&`;
    if (params.Etd_Prenom != null && params.Etd_Prenom != "") url += `Etd_Prenom=${params.Etd_Prenom}&`;
    if (params.Ann_Id != null && params.Ann_Id != "") url += `Ann_Id=${params.Ann_Id}&`;
    if (params.Cls_Id != null && params.Cls_Id != "") url += `Cls_Id=${params.Cls_Id}&`;
    if (params.Etd_Matricule != null && params.Etd_Matricule != "") url += `Etd_Matricule=${params.Etd_Matricule}&`;
    if (params.Vers_Nom != null && params.Vers_Nom != "") url += `Vers_Nom=${params.Vers_Nom}&`;
    if (params.TelephoneTuteur != null && params.TelephoneTuteur != "") url += `TelephoneTuteur=${params.TelephoneTuteur}&`;

    return this.http.get(url, { headers: headers, responseType: "blob" });
  }
  GetRecouvrementPDF(params: { Vers_Dateprevu?: any; Niv_Id?: any; Ann_Id?: any; Cls_Id?: any; Fact_Id?: any; Etd_Nom?: string; Etd_Prenom?: string; Etd_Matricule?: string }): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set("Accept", "application/pdf");
    let url = `${environment.apiUrl}/api/Report/GetRecouvrementPDF?`;
    url += `Ecole_Id=${this.EcoleId}&`;
    if (params.Niv_Id != null && params.Niv_Id != "") url += `Niv_Id=${params.Niv_Id}&`;
    if (params.Ann_Id != null && params.Ann_Id != "") url += `Ann_Id=${params.Ann_Id}&`;
    if (params.Cls_Id != null && params.Cls_Id != "") url += `Cls_Id=${params.Cls_Id}&`;
    if (params.Fact_Id != null && params.Fact_Id != "") url += `Fact_Id=${params.Fact_Id}&`;
    if (params.Etd_Nom != null && params.Etd_Nom != "") url += `Etd_Nom=${params.Etd_Nom}&`;
    if (params.Etd_Prenom != null && params.Etd_Prenom != "") url += `Etd_Prenom=${params.Etd_Prenom}&`;
    if (params.Etd_Matricule != null && params.Etd_Matricule != "") url += `Etd_Matricule=${params.Etd_Matricule}&`;
    if (params.Vers_Dateprevu != null && params.Vers_Dateprevu != "") url += `Vers_Dateprevu=${params.Vers_Dateprevu}&`;

    return this.http.get(url, { headers: headers, responseType: "blob" });
  }

  //#endregion
  //#region Tuteur
  GetTuteurs() {
    let url = `${environment.apiUrl}/api/Tuteur/GetTuteur?`;
    url += `Ecole_Id=${this.EcoleId}&`;
    return this.http.get<any>(url);
  }
  GetEtudiantTuteur(Etd_Id: string) {
    let url = `${environment.apiUrl}/api/Etudiant/GetEtudiantTuteur?`;
    url += `Etd_Id=${Etd_Id}&`;
    return this.http.get<any>(url);
  }
  CreateEtudiantTuteur(data: any) {
    const url = `${environment.apiUrl}/api/Etudiant/CreateEtudiantTuteur`;
    data.Ecole_Id = this.EcoleId;
    return this.http.post(url, data);
  }
  UpdateEtudiantTuteur(etudiantData: any): Observable<any> {
    const url = `${environment.apiUrl}/api/Etudiant/UpdateEtudiantTuteur`;
    return this.http.put<any>(url, etudiantData).pipe(catchError(this.handleError("UpdateEtudiantTuteur")));
  }
  DeleteEtudiantTuteur(EtdTuteur_Id: string) {
    const url = `${environment.apiUrl}/api/Etudiant/DeleteEtudiantTuteur/${EtdTuteur_Id}`;
    return this.http.delete(url);
  }

  //#endregion

  //#region CanDelete

  CanDelete(Id: string, type: string) {
    let url = `${environment.apiUrl}/api/Configuration/CanDelete?`;
    url += `Id=${Id}&`;
    url += `type=${type}&`;
    return this.http.get<any>(url).pipe(catchError(this.handleError("CanDelete")));
  }

  //#endregion

  ExportEtatCaisse(dataSource) {
    // let dataSource = this.Operations;
    // let tabModePaiementEnum = CMP_ModePaiementEnum// =
    let tabModePaiementEnum = [
      { ModPai_Id: "38e7c309-a4d3-4c07-81eb-35f7426c9c1e", ModPai_Nom: "Wave", ModPai_Description: null },
      { ModPai_Id: "f72d7650-0228-41c8-9fc6-5b9c5d4e75bc", ModPai_Nom: "Autres", ModPai_Description: null },
      { ModPai_Id: "ac1ee351-094a-4cf2-8ad8-12b4824781e0", ModPai_Nom: "Cheque", ModPai_Description: null, total: 475025 },
      { ModPai_Id: "145fd835-99c5-4176-a9d8-3a469e2e1b73", ModPai_Nom: "Orange Money", ModPai_Description: null },
      { ModPai_Id: "73f3a369-997d-4742-a96f-af2323909c35", ModPai_Nom: "Espece", ModPai_Description: null, total: 255550 },
      { ModPai_Id: "ca49e3ed-9806-4a45-8b08-5f0b8524b1e3", ModPai_Nom: "Mandat", ModPai_Description: null, total: 23411 },
      { ModPai_Id: "fd1286cd-c21f-4622-82d4-3ec1f3b5f5e9", ModPai_Nom: "Virement", ModPai_Description: null, total: 163600 },
    ];
    let nbModesPaiements = tabModePaiementEnum.length;
    let GuidModPaiAnnulation = "fc1471cb-66db-496a-b76d-06503821ebbc";
    console.log("export EtatCaisse: ", dataSource);
    console.log("tabModePaiementEnum: ", tabModePaiementEnum);

    //#region functions
    let SetColumnsWidth = (sheet) => {
      sheet.columns(0).width(2700); //A
      sheet.columns(1).width(2200); //B

      sheet.columns(2).width(3200); //C
      sheet.columns(3).width(3200); //D
      sheet.columns(4).width(2700); //E

      sheet.columns(5).width(2500); //F
      sheet.columns(6).width(2500); //G
      sheet.columns(7).width(2800); //H
      sheet.columns(8).width(2800); //I
      sheet.columns(9).width(2500); //J
      sheet.columns(10).width(2500); //K
      sheet.columns(11).width(2500); //L

      sheet.columns(12).width(5500); //M

      sheet.columns(13).width(7400); //N
      sheet.columns(14).width(4000); //O

      // sheet.columns(15).width(4000); //P
      // sheet.columns(16).width(4000); //Q
    };

    let getExcelColLetter = (col) => {
      //retourn la Lettre  correspondante a l index de la Col 0==>A, 1==>B
      return (col + 10).toString(36).toUpperCase();
    };

    let WriteTable2 = (sheet) => {
      //Write Table Header -----------------------------------------------------------------------------------------------------------------------
      sheet.mergedCellsRegions().add(14, 0, 14, 16).value(new $.ig.excel.FormattedString("Opération de paiement et rembourcement")).getFont(0).bold(true);
      sheet.mergedCellsRegions().add(15, 0, 16, 0).value(new $.ig.excel.FormattedString("Date")).getFont(0).bold(true);
      sheet.mergedCellsRegions().add(15, 1, 16, 1).value(new $.ig.excel.FormattedString("N° Reçu")).getFont(0).bold(true);
      sheet.mergedCellsRegions().add(15, 2, 16, 2).value(new $.ig.excel.FormattedString("Nom")).getFont(0).bold(true);
      sheet.mergedCellsRegions().add(15, 3, 16, 3).value(new $.ig.excel.FormattedString("Prenom")).getFont(0).bold(true);
      sheet.mergedCellsRegions().add(15, 4, 16, 4).value(new $.ig.excel.FormattedString("Montant")).getFont(0).bold(true);
      sheet
        .mergedCellsRegions()
        .add(15, 5, 15, 5 + nbModesPaiements)
        .value(new $.ig.excel.FormattedString("Mode de paiement"))
        .getFont(0)
        .bold(true);
      sheet
        .mergedCellsRegions()
        .add(16, 5 + nbModesPaiements, 16, 5 + nbModesPaiements)
        .value(new $.ig.excel.FormattedString("Référence comptable"))
        .getFont(0)
        .bold(true);
      sheet
        .mergedCellsRegions()
        .add(15, 6 + nbModesPaiements, 16, 6 + nbModesPaiements)
        .value(new $.ig.excel.FormattedString("Observatoir"))
        .getFont(0)
        .bold(true);
      sheet
        .mergedCellsRegions()
        .add(15, 7 + nbModesPaiements, 16, 7 + nbModesPaiements)
        .value(new $.ig.excel.FormattedString("Niveau"))
        .getFont(0)
        .bold(true);

      //Draw Table on the header
      for (let i = 0; i <= 7 + nbModesPaiements; i++) {
        if (i <= 4 || i >= 15) {
          sheet.rows(15).cells(i).cellFormat().leftBorderStyle(1);
          sheet.rows(16).cells(i).cellFormat().leftBorderStyle(1);

          sheet.rows(15).cells(i).cellFormat().rightBorderStyle(1);
          sheet.rows(16).cells(i).cellFormat().rightBorderStyle(1);

          sheet.rows(15).cells(i).cellFormat().topBorderStyle(1);
          sheet.rows(16).cells(i).cellFormat().bottomBorderStyle(1);
        } else if (i <= 14) {
          sheet.rows(15).cells(i).cellFormat().topBorderStyle(1);
          sheet.rows(15).cells(i).cellFormat().bottomBorderStyle(1);
          sheet.rows(16).cells(i).cellFormat().topBorderStyle(1);
          sheet.rows(16).cells(i).cellFormat().bottomBorderStyle(1);

          sheet.rows(15).cells(i).cellFormat().rightBorderStyle(1);
          sheet.rows(16).cells(i).cellFormat().rightBorderStyle(1);
        }
      }
      //center content
      for (let i = 15; i <= 16; i++) for (let j = 0; j <= 7 + nbModesPaiements; j++) sheet.rows(i).cells(j).cellFormat().alignment($.ig.excel.HorizontalCellAlignment.center);

      //write table header modes Paiement ---------------------------------------------------------------------------------------------------------
      let listModPai_1 = tabModePaiementEnum.filter((x) => x.ModPai_Id != GuidModPaiAnnulation);
      console.log("listModPai_1: ", listModPai_1);
      listModPai_1.forEach((mod, modIndex) => {
        let col = modIndex + 5;
        let row = 16;
        sheet.mergedCellsRegions().add(row, col, row, col).value(new $.ig.excel.FormattedString(mod.ModPai_Nom)).getFont(0).bold(true);
      });
      let totalModes: any[] = listModPai_1;
      // write table content ----------------------------------------------------------------------------------------------------------------------
      let TotalMontantNormal = 0;
      let etatCaisseDSNormal = dataSource.filter((x) => x.ModPai_Id != GuidModPaiAnnulation);
      etatCaisseDSNormal.forEach((item, index) => {
        let row = index + 17;

        //date
        sheet.rows(row).cells(0).value(new Date(item.Ope_Date));
        sheet.rows(row).cells(0).cellFormat().formatString("dd-mm-yyy");

        sheet.rows(row).cells(0).cellFormat().alignment($.ig.excel.HorizontalCellAlignment.center);
        //n recu
        if (item.Ope_NumRecu != null) sheet.rows(row).cells(1).value(new $.ig.excel.FormattedString(item.Ope_NumRecu));
        sheet.rows(row).cells(1).cellFormat().alignment($.ig.excel.HorizontalCellAlignment.center);
        //nom et prenom
        if (item.Etd_Nom != null) sheet.rows(row).cells(2).value(new $.ig.excel.FormattedString(item.Etd_Nom));
        if (item.Etd_Prenom != null) sheet.rows(row).cells(3).value(new $.ig.excel.FormattedString(item.Etd_Prenom));

        //montant Total
        sheet.rows(row).cells(4).value(item.Ope_Montant);
        sheet.rows(row).cells(4).cellFormat().formatString("### ### ###");
        sheet.rows(row).cells(4).cellFormat().alignment($.ig.excel.HorizontalCellAlignment.right);

        // a corriger
        // let colModPai: any = listModPai_1.indexOf(listModPai_1.find((x) => x.ModPai_Id == item.ModPai_Id));
        let colModPai: any = listModPai_1.indexOf(listModPai_1.find((x) => x.ModPai_Id == item.ModePai_Id));

        if (colModPai != -1)
          if (totalModes[colModPai].total == null) totalModes[colModPai].total = item.Ope_Montant;
          else totalModes[colModPai].total += item.Ope_Montant;
        colModPai += 5;
        sheet.rows(row).cells(colModPai).value(item.Ope_Montant);
        sheet.rows(row).cells(colModPai).cellFormat().formatString("### ### ###");
        sheet.rows(row).cells(colModPai).cellFormat().alignment($.ig.excel.HorizontalCellAlignment.right);

        //ref comptable
        if (item.Ope_RefComptable != null)
          sheet
            .rows(row)
            .cells(5 + nbModesPaiements)
            .value(new $.ig.excel.FormattedString(item.Ope_RefComptable));
        sheet
          .rows(row)
          .cells(5 + nbModesPaiements)
          .cellFormat()
          .alignment($.ig.excel.HorizontalCellAlignment.center);

        //Observatoir
        if (item.Ope_Description != null)
          sheet
            .rows(row)
            .cells(6 + nbModesPaiements)
            .value(new $.ig.excel.FormattedString(item.Ope_Description));
        sheet
          .rows(row)
          .cells(6 + nbModesPaiements)
          .cellFormat()
          .alignment($.ig.excel.HorizontalCellAlignment.center);

        //Niveau
        if (item.Niv_Nom != null)
          sheet
            .rows(row)
            .cells(7 + nbModesPaiements)
            .value(new $.ig.excel.FormattedString(item.Niv_Nom));
        sheet
          .rows(row)
          .cells(7 + nbModesPaiements)
          .cellFormat()
          .alignment($.ig.excel.HorizontalCellAlignment.center);

        //Draw Table
        for (let i = 0; i <= 5 + nbModesPaiements + 2; i++) {
          sheet.rows(row).cells(i).cellFormat().leftBorderStyle(1);
          sheet.rows(row).cells(i).cellFormat().rightBorderStyle(1);
          sheet.rows(row).cells(i).cellFormat().topBorderStyle(1);
          sheet.rows(row).cells(i).cellFormat().bottomBorderStyle(1);
        }
      });
      // console.log("totalModes: ", totalModes)

      //Total paiement -----------------------------------------------------------------------------------------------------------------------------
      let rowTotalPaiementIndex = etatCaisseDSNormal.length + 17;
      sheet.mergedCellsRegions().add(rowTotalPaiementIndex, 0, rowTotalPaiementIndex, 3).value(new $.ig.excel.FormattedString("Total")).getFont(0).bold(true);
      sheet.rows(rowTotalPaiementIndex).cells(0).cellFormat().alignment($.ig.excel.HorizontalCellAlignment.center);

      let formulaSommeTotal = "=SUM(E18:E" + (etatCaisseDSNormal.length + 17) + ")";
      sheet.rows(rowTotalPaiementIndex).cells(4).applyFormula(formulaSommeTotal);

      sheet.rows(rowTotalPaiementIndex).cells(4).cellFormat().formatString("### ### ###");

      sheet.rows(rowTotalPaiementIndex).cells(4).cellFormat().font().bold(true);
      sheet.rows(rowTotalPaiementIndex).cells(4).cellFormat().alignment($.ig.excel.HorizontalCellAlignment.right);

      totalModes.forEach((item, index) => {
        let col = index + 5;
        if (item.total != null)
          sheet
            .rows(rowTotalPaiementIndex)
            .cells(col)
            .value(new $.ig.excel.FormattedString(item.total + ""))
            .getFont(0)
            .bold(true);
        sheet.rows(rowTotalPaiementIndex).cells(col).cellFormat().formatString("### ### ###");
        sheet.rows(rowTotalPaiementIndex).cells(col).cellFormat().alignment($.ig.excel.HorizontalCellAlignment.right);

        let formulaSommeTotalModPai = "=SUM(" + getExcelColLetter(col) + "18:" + getExcelColLetter(col) + "" + (etatCaisseDSNormal.length + 17) + ")";
        sheet.rows(rowTotalPaiementIndex).cells(col).applyFormula(formulaSommeTotalModPai);

        sheet.rows(rowTotalPaiementIndex).cells(col).cellFormat().font().bold(true);
        sheet.rows(rowTotalPaiementIndex).cells(col).cellFormat().alignment($.ig.excel.HorizontalCellAlignment.right);
      });

      //Draw Table
      for (let i = 0; i <= 5 + nbModesPaiements + 2; i++) {
        if (i == 0) sheet.rows(rowTotalPaiementIndex).cells(i).cellFormat().leftBorderStyle(1);
        if (i == 7 + nbModesPaiements) sheet.rows(rowTotalPaiementIndex).cells(i).cellFormat().rightBorderStyle(1);
        sheet.rows(rowTotalPaiementIndex).cells(i).cellFormat().topBorderStyle(1);
        sheet.rows(rowTotalPaiementIndex).cells(i).cellFormat().bottomBorderStyle(1);
      }
    };

    let DrawWhiteCells = (sheet) => {
      var light1Fill = $.ig.excel.CellFill.createSolidFill(new $.ig.excel.WorkbookColorInfo($.ig.excel.WorkbookThemeColorType.light1));
      var cells = sheet.getRegion("A1:Z200").getEnumerator();
      while (cells.moveNext()) cells.current().cellFormat().fill(light1Fill);
    };

    let DrawTable1 = (sheet) => {
      let dd: any = null;
      let df: any = null;
      dataSource.forEach((item, index) => {
        if (index == 0) {
          dd = new Date(item.Ope_Date);
          df = new Date(item.Ope_Date);
        }
        if (dd >= new Date(item.Ope_Date)) dd = new Date(item.Ope_Date);
        if (df <= new Date(item.Ope_Date)) df = new Date(item.Ope_Date);
      });

      sheet.mergedCellsRegions().add(9, 1, 9, 4).value(new $.ig.excel.FormattedString("Fiche récapitulative de caisse")).getFont(0).bold(true);
      sheet.mergedCellsRegions().add(10, 1, 10, 3).value(new $.ig.excel.FormattedString("Date de début")).getFont(0).bold(true);
      sheet.mergedCellsRegions().add(11, 1, 11, 3).value(new $.ig.excel.FormattedString("Date de fin")).getFont(0).bold(true);

      sheet.mergedCellsRegions().add(10, 4, 10, 4).value(new Date(dd));
      sheet.mergedCellsRegions().add(11, 4, 11, 4).value(new Date(df));
      sheet.rows(10).cells(4).cellFormat().formatString("dd-mm-yyy");
      sheet.rows(11).cells(4).cellFormat().formatString("dd-mm-yyy");

      sheet.rows(9).cells(1).cellFormat().alignment($.ig.excel.HorizontalCellAlignment.center);
      sheet.rows(10).cells(4).cellFormat().alignment($.ig.excel.HorizontalCellAlignment.center);
      sheet.rows(11).cells(4).cellFormat().alignment($.ig.excel.HorizontalCellAlignment.center);

      //table fiche recap de caisse
      sheet.rows(9).cells(1).cellFormat().leftBorderStyle(1);
      sheet.rows(9).cells(4).cellFormat().rightBorderStyle(1);
      for (let i = 1; i <= 4; i++) {
        sheet.rows(9).cells(i).cellFormat().topBorderStyle(1);
        sheet.rows(9).cells(i).cellFormat().bottomBorderStyle(1);
      }

      //table date text
      for (let i = 10; i <= 11; i++) {
        sheet.rows(i).cells(1).cellFormat().leftBorderStyle(1);
        sheet.rows(i).cells(3).cellFormat().rightBorderStyle(1);
        for (let j = 1; j <= 3; j++) {
          sheet.rows(i).cells(j).cellFormat().topBorderStyle(1);
          sheet.rows(i).cells(j).cellFormat().bottomBorderStyle(1);
        }
      }

      for (let i = 10; i <= 11; i++) {
        sheet.rows(i).cells(4).cellFormat().leftBorderStyle(1);
        sheet.rows(i).cells(4).cellFormat().rightBorderStyle(1);
        sheet.rows(i).cells(4).cellFormat().topBorderStyle(1);
        sheet.rows(i).cells(4).cellFormat().bottomBorderStyle(1);
      }
    };
    //#endregion functions

    let workbook = new $.ig.excel.Workbook();
    let sheet = workbook.worksheets().add("Etat Caisse");
    dataSource = dataSource.sort((a, b) => {
      if (a.Ope_NumRecu > b.Ope_NumRecu) return 1;
      if (a.Ope_NumRecu < b.Ope_NumRecu) return -1;
      return 0;
    });

    DrawWhiteCells(sheet);
    DrawTable1(sheet);
    SetColumnsWidth(sheet);
    WriteTable2(sheet);

    tabModePaiementEnum = tabModePaiementEnum.sort((a, b) => {
      if (a.ModPai_Nom > b.ModPai_Nom) return 1;
      if (a.ModPai_Nom < b.ModPai_Nom) return -1;
      return 0;
    });

    workbook.save(
      (data) => {
        let dd: any = null;
        let df: any = null;
        let hasSameEcole = true;
        let ecole: any = null;
        dataSource.forEach((item, index) => {
          if (index == 0) {
            dd = new Date(item.Ope_Date);
            df = new Date(item.Ope_Date);
            //aussi ici Fac_Nom

            ecole = item.Niv_Nom;
          }
          if (dd >= new Date(item.Ope_Date)) dd = new Date(item.Ope_Date);
          if (df <= new Date(item.Ope_Date)) df = new Date(item.Ope_Date);
          //aussi ici Fac_Nom
          if (ecole != item.Niv_Nom) hasSameEcole = false;
        });
        let fileName = "Etat de caisse ";

        if (GetFormattedDate(dd) == GetFormattedDate(df)) fileName += GetFormattedDate(dd) + "";
        else fileName += GetFormattedDate(dd) + " - " + GetFormattedDate(df);
        if (hasSameEcole) fileName += " " + ecole;
        fileName += ".xls";

        downloadExcelFile(fileName, data);
        return true;
      },
      function (error) {
        console.error("Error workbook.save", error);
        return false;
      }
    );

    //return workbook;

    function GetFormattedDate(date) {
      date = new Date(date);
      let d = date.getDate();
      let m = date.getMonth() + 1;
      let y = date.getFullYear();
      if (d < 10) d = "0" + d;
      if (m < 10) m = "0" + m;
      return d + "-" + m + "-" + y;
    }

    function downloadExcelFile(filename, data) {
      var link = document.createElement("a");
      link.href = "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64," + encodeURIComponent(data);
      // link.style = "visibility:hidden";
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  GetData(routes: string[]): Observable<Object[]> {
    const httpObservables = routes.map((url) => this.http.get(`${url}`));
    return forkJoin(httpObservables);
  }

  GetVersementsEnum() {
    let url = `${environment.apiUrl}/api/Configuration/GetVersementsEnum?`;
    url += `Ecole_Id=${this.EcoleId}&`;
    return this.http.get<any>(url);
  }
  GetCaisses() {
    let url = `${environment.apiUrl}/api/Configuration/GetCaisses?`;
    url += `Ecole_Id=${this.EcoleId}&`;
    return this.http.get<any>(url);
  }
  Exporter(sheetName: any, columns: any[], data: any[]) {
    let workbook = new $.ig.excel.Workbook();
    let sheet = workbook.worksheets().add(sheetName);

    sheet.columns(0).width(10000); //A
    sheet.columns(1).width(4000); //B
    sheet.columns(2).width(12000); //C
    sheet.columns(3).width(6000); //D
    sheet.columns(4).width(8000); //E
    sheet.columns(5).width(5000); //F

    sheet.columns(6).width(4000); //G
    sheet.columns(7).width(4000); //H
    sheet.columns(8).width(4000); //I
    sheet.columns(9).width(4000); //J
    sheet.columns(10).width(4000); //K
    sheet.columns(11).width(4000); //L

    let rowIndex = 0;
    let colIndex = 0;
    columns.forEach((column) => {
      sheet.rows(rowIndex).cells(colIndex).value(new $.ig.excel.FormattedString(column.header)).getFont(0).bold(true);
      colIndex++;
      // sheet.rows(row).cells(0).cellFormat().formatString("dd-mm-yyy");
    });

    rowIndex++;

    data.forEach((item) => {
      colIndex = 0;
      columns.forEach((column) => {
        let value = item[column.field];
        // if (column.dataType == "string")
        //   while (value.includes(";"))
        //     value = value.replace(";", ",")
        sheet.rows(rowIndex).cells(colIndex).value(value);
        colIndex++;
      });
      rowIndex++;
    });

    workbook.save(
      (data) => {
        let dd: any = null;
        let df: any = null;

        let fileName = sheetName + " " + GetFormattedDate(new Date());

        // if (GetFormattedDate(dd) == GetFormattedDate(df)) fileName += GetFormattedDate(dd) + "";
        // else fileName += GetFormattedDate(dd) + " - " + GetFormattedDate(df);
        fileName += ".xls";

        downloadExcelFile(fileName, data);
        return true;
      },
      function (error) {
        console.error("Error workbook.save", error);
        return false;
      }
    );

    //return workbook;

    function GetFormattedDate(date) {
      date = new Date(date);
      let d = date.getDate();
      let m = date.getMonth() + 1;
      let y = date.getFullYear();
      if (d < 10) d = "0" + d;
      if (m < 10) m = "0" + m;
      return d + "-" + m + "-" + y;
    }

    function downloadExcelFile(filename, data) {
      var link = document.createElement("a");
      link.href = "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64," + encodeURIComponent(data);
      // link.style = "visibility:hidden";
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}
