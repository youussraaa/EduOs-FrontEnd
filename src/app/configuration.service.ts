import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationService {
  private apiUrl = 'https://localhost:7082/api/configuration'; // URL backend

  constructor(private http: HttpClient) {}

  // Create Ecole
  createEcole(ecole: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/CreateEcole`, ecole);
  }

  // Update Ecole
  updateEcole(id: string, ecole: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/UpdateEcole/${id}`, ecole);
  }

  // Delete Ecole
  deleteEcole(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/DeleteEcole/${id}`);
  }

  // Create Niveau
  createNiveau(niveaux: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/CreateNiveau`, niveaux);
  }

  updateNiveau(id: string, payload: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/UpdateNiveau/${id}`, payload);
  }

  deleteNiveau(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/DeleteNiveau/${id}`);
  }

  // Matiere
  createMatiere(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/CreateMatiere`, payload);
  }

  updateMatiere(id: string, payload: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/UpdateMatiere/${id}`, payload);
  }

  deleteMatiere(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/DeleteMatiere/${id}`);
  }

  // Classe
  createClasse(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/CreateClasse`, payload);
  }

  updateClasse(id: string, payload: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/UpdateClasse/${id}`, payload);
  }

  deleteClasse(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/DeleteClasse/${id}`);
  }

  // Enseignant
  createEnseignant(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/CreateEnseignant`, payload);
  }

  updateEnseignant(id: string, payload: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/UpdateEnseignant/${id}`, payload);
  }

  deleteEnseignant(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/DeleteEnseignant/${id}`);
  }

  // Enseignant/Matiere/Classe
  createEnseignantMatiereClasse(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/CreateEnseignantMatiereClasse`, payload);
  }

  updateEnseignantMatiereClasse(payload: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/UpdateEnseignantMatiereClasse`, payload);
  }

  deleteEnseignantMatiereClasse(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/DeleteEnseignantMatiereClasse/${id}`);
  }

  // Facturable
  createFacturable(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/CreateFacturable`, payload);
  }

  updateFacturable(id: string, payload: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/UpdateFacturable/${id}`, payload);
  }

  deleteFacturable(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/DeleteFacturable/${id}`);
  }

  getFacturable(): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetFacturable`);
  }

  // FicheFacturation
  createFicheFacturation(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/CreateFicheFacturation`, payload);
  }

  updateFicheFacturation(id: string, payload: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/UpdateFicheFacturation/${id}`, payload);
  }

  deleteFicheFacturation(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/DeleteFicheFacturation/${id}`);
  }

  getFicheFacturation(): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetFicheFacturation`);
  }

  // ResumeConfig
  getResumeConfig(): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetResumeConfig`);
  }
  }