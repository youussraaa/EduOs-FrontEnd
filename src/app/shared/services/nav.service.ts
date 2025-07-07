import { Injectable, OnDestroy } from "@angular/core";
import { Subject, BehaviorSubject, fromEvent } from "rxjs";
import { takeUntil, debounceTime } from "rxjs/operators";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

// Menu
export interface Menu {
  headTitle1?: string;
  headTitle2?: string;
  path?: string;
  title?: string;
  icon?: string;
  type?: string;
  badgeType?: string;
  badgeValue?: string;
  active?: boolean;
  bookmark?: boolean;
  children?: Menu[];
}

@Injectable({
  providedIn: "root",
})
export class NavService implements OnDestroy {
  private unsubscriber: Subject<any> = new Subject();
  public screenWidth: BehaviorSubject<number> = new BehaviorSubject(window.innerWidth);

  // Search Box
  public search: boolean = false;

  // Language
  public language: boolean = false;

  // Mega Menu
  public megaMenu: boolean = false;
  public levelMenu: boolean = false;
  public megaMenuColapse: boolean = window.innerWidth < 1199 ? true : false;

  // Collapse Sidebar
  public collapseSidebar: boolean = window.innerWidth < 991 ? true : false;

  // For Horizontal Layout Mobile
  public horizontal: boolean = window.innerWidth < 991 ? false : true;

  // Full screen
  public fullScreen: boolean = false;

  constructor(private router: Router, private httpClient: HttpClient) {
    this.setScreenWidth(window.innerWidth);
    fromEvent(window, "resize")
      .pipe(debounceTime(1000), takeUntil(this.unsubscriber))
      .subscribe((evt: any) => {
        this.setScreenWidth(evt.target.innerWidth);
        if (evt.target.innerWidth < 991) {
          this.collapseSidebar = true;
          this.megaMenu = false;
          this.levelMenu = false;
        }
        if (evt.target.innerWidth < 1199) {
          this.megaMenuColapse = true;
        }
      });
    if (window.innerWidth < 991) {
      // Detect Route change sidebar close
      this.router.events.subscribe((event) => {
        this.collapseSidebar = true;
        this.megaMenu = false;
        this.levelMenu = false;
      });
    }
  }

  ngOnDestroy() {
    // this.unsubscriber.next();
    this.unsubscriber.complete();
  }

  private setScreenWidth(width: number): void {
    this.screenWidth.next(width);
  }

  MENUITEMS: Menu[] = [
    {
      title: "configuration Page",
      icon: "widget",
      type: "sub",
      badgeType: "light-primary",
      active: false,
      children: [
        { path: "/etablissement", title: "etablissement", type: "link" },
        { path: "/domaine", title: "Domaines", type: "link" },
        { path: "/niveaux", title: "Niveaux", type: "link" },
        { path: "/facturables", title: "facturables", type: "link" },
        { path: "/fiches", title: "Fiches de facturation", type: "link" },
        { path: "/enseignants", title: "Enseignants", type: "link" },
        { path: "/enseignants-matiere", title: "Gestion des classes", type: "link" },
        //{ path: "/classe-ouvert", title: "Classe ouverte", type: "link" },
        { path: "/resume", title: "RÉSUMÉ", type: "link" },
        // { path: "/lien", title: " lien des candidats", type: "link" },
      ],
    },
    { title: "Dashboard", type: "link", icon: "home", path: "/dashboard/",/* active: false, */ },
    { title: "Candidats", type: "link", icon: "social", path: "/liste-candidats/", },
    { title: "Élèves", type: "link", icon: "user", path: "/liste-etudiants", },
    { title: "Inscrits", type: "link", icon: "table", path: "/inscription-etudiants", },
    { title: "Classe ouverte", type: "link", icon: "learning", path: "/classe-ouvert", },
    { title: "Paiement", type: "link", icon: "task", path: "/paiements", },
    { title: "Encaissement", type: "link", icon: "task", path: "/encaissement", },
    { title: "Recouvrement", type: "link", icon: "internationalization", path: "/recouvrement", },
    // {
    //   title: "Dossier Etudiants",
    //   type: "link",
    //   icon: "internationalization",
    //   path: "/clients",
    // },
    // { headTitle1: "Edu-OS 1", },
  ];

  // Array
  items = new BehaviorSubject<Menu[]>(this.MENUITEMS);
}
