import { Injectable, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Ecole } from '../components/model/dto.model';

@Injectable({
  providedIn: 'root'
})
export class AppService implements OnDestroy, OnInit {

  // Ecole
  // currentEcole?: { Ecole_Id: string, Ecole_Nom: string } | null = null;
  // ecoleEmitter: EventEmitter<{ Ecole_Id: string, Ecole_Nom: string }> = new EventEmitter<{ Ecole_Id: string, Ecole_Nom: string }>();
  // private ecoleEmitterSubscription?: Subscription;

  // Annee
  currentAnnee?: { Ann_Id: string, Ann_Nom: string } | null = null;
  anneeEmitter: EventEmitter<{ Ann_Id: string, Ann_Nom: string }> = new EventEmitter<{ Ann_Id: string, Ann_Nom: string }>();
  private anneeEmitterSubscription?: Subscription;

  // Ecole
  currentEcole?: { Ecole_Id: string, Ecole_Nom } | null = null;
  ecoleEmitter = new EventEmitter<Ecole>();
  private ecoleEmitterSubscription?: Subscription;

  constructor() {
    this.anneeEmitterSubscription = this.anneeEmitter.subscribe(item => { this.currentAnnee = item; });
    this.ecoleEmitterSubscription = this.ecoleEmitter.subscribe((item) => { this.currentEcole = item; this.onEcoleChange(item); });
  }
  private onEcoleChange(item: Ecole): void {
    if (item && item.Ecole_Id) {
      localStorage.setItem('EcoleId', item.Ecole_Id);
      localStorage.setItem('Ecole', JSON.stringify(item));
      // console.log('LocalStorage mis à jour :', item);
    } else {
      console.warn('Ecole invalide ou manquante :', item);
    }
  }

  ngOnInit() { }

  ngOnDestroy() {
    this.anneeEmitterSubscription?.unsubscribe();
    this.ecoleEmitterSubscription?.unsubscribe();
  }
}
