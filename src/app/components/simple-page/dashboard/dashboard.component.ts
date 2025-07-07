import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";

import { NgbCalendar, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { Chart } from "chart.js";
import { NgbModal, NgbModalConfig, NgbNavChangeEvent } from "@ng-bootstrap/ng-bootstrap";
import { EduosService } from "../../../shared/services/Eduos.service";
import { v4 as uuidv4 } from "uuid";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { AppService } from "../../../shared/services/app.service";
import { AuthService } from "../../../shared/services/auth.service";
import { Title } from "@angular/platform-browser";
@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit,OnDestroy {
  private _subs = new Subscription();

  Statistique: any = null;

  model: NgbDateStruct;
  date: { year: number; month: number };
  show: boolean = false;
  Etudiants: any[] = [];
  Enseignants: any[] = [];
  EtudiantPaiement: any;
  MontantTotal: number = 0;
  canViewDashboard: boolean = false;

  // Sample data for students chart
  public students = [
    { name: "John Doe", level: "CP", score: 85 },
    { name: "Jane Doe", level: "CE1", score: 75 },
    { name: "Mike Doe", level: "CM2", score: 90 },
  ];

  public course = [
    {
      courseImage: "assets/images/dashboard-3/course/1.svg",
      arrow: "assets/images/dashboard-3/course/back-arrow/1.png",
      courseName: "Management",
    },
    {
      courseImage: "assets/images/dashboard-3/course/2.svg",
      arrow: "assets/images/dashboard-3/course/back-arrow/2.png",
      courseName: "Web Development",
    },
    {
      courseImage: "assets/images/dashboard-3/course/3.svg",
      arrow: "assets/images/dashboard-3/course/back-arrow/1.png",
      courseName: "Business Analytics",
    },
    {
      courseImage: "assets/images/dashboard-3/course/4.svg",
      arrow: "assets/images/dashboard-3/course/back-arrow/3.png",
      courseName: "Marketing",
    },
  ];

  constructor(
    private calendar: NgbCalendar,
    config: NgbModalConfig,
    private modalService: NgbModal,
    private EduosService: EduosService,
    private loader: NgxSpinnerService,
    private appService: AppService,
    private toastr: ToastrService,
    private authService: AuthService,
  private title: Title) {
    config.backdrop = "static";
    config.keyboard = false;
    let ecole = localStorage.getItem("Ecole");
    if (ecole != null) this.title.setTitle(`Dashboard - ${JSON.parse(ecole).Ecole_Nom}`);
      if (this.authService.CurrentUserHasRole("CanViewDashboard", false)) {
        this.canViewDashboard = true;
        console.log("CanViewDashboard !!!")
      }
    this.model = calendar.getToday();
  }

  ngOnInit(): void {
    // Au lieu de .subscribe() "à nu", on garde la souscription
    this._subs.add(
      this.appService.anneeEmitter.subscribe((annee) => {
        this.getData();
      })
    );
    console.log("DashboardComponent initialized");
    this.getData();
  }
  ngOnDestroy(): void {
    this._subs.unsubscribe();
    console.log("Unsubscribed from all subscriptions in DashboardComponent");
  }


  getData() {
    this.loader.show();
    let params = {
      Ann_Id: this.appService.currentAnnee?.Ann_Id,
    }
    this.EduosService.GetStatistique(params)
      .subscribe((response: any) => {
        console.log("response GetStatistique ", response);
        this.loader.hide();
        if (response == null) {
          this.toastr.error("Erreur de chargement des statistics");
        } else {
          this.Statistique = response;
        }
      },
        (error) => {
          console.error("Erreur GetStatistique: ", error);
          this.loader.hide();
          this.toastr.error(error?.error, "Erreur de recuperation de statistiques.");
        });
  }
  

  // Method to toggle content visibility
  toggle() {
    this.show = !this.show;
  }

  // Method to select today's date
  selectToday() {
    this.model = this.calendar.getToday();
  }
}
