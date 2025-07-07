import { Component, ViewChild } from "@angular/core";
import { NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import { EduosService } from "../../../shared/services/Eduos.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { AppService } from "../../../shared/services/app.service";
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: "app-recouvrement",
  templateUrl: "./recouvrementtest.component.html",
  styleUrl: "./recouvrementtest.component.scss",
})
export class RecouvrementtestComponent {
  @ViewChild("myTable") table: any;
  EtudiantVersements: [] = [];
  Niveaux: [] = [];
  Facturables: [] = [];
  Classes:[]=[];
  Annees:[]=[];
  rowsData: any;
  columnsData: any;
  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private EduosService: EduosService,
    private loader: NgxSpinnerService,
    private toastr: ToastrService,
    private appService: AppService
  ) {
    config.backdrop = "static";
    config.keyboard = false;
  }
  localData = [
    { Name:'John', Age: 29 },
    { Name:'Alice', Age: 27 },
    { Name:'Jessica', Age: 31 },
  ];

  title = 'My Ignite UI project';
  ngOnInit() {
    console.log("recouvrement");
    this.searchParams.Vers_Dateprevu = new Date().toISOString().split("T")[0];
    this.searchParams.Niv_Id = "00000000-0000-0000-0000-000000000000";
    this.searchParams.Fact_Id = "00000000-0000-0000-0000-000000000000";
    
    // this.searchParams.Ann_Id="00000000-0000-0000-0000-000000000000";
    this.searchParams.Cls_Id="00000000-0000-0000-0000-000000000000";
    this.GetAnnees()
    this.GetNiveau();
    this.GetClasses()
    this.GetFacturable();
    this.charger();
    this.appService.anneeEmitter.subscribe((annee) => {
      // this.CurrentAnnee=this.appService.currentAnnee?.Ann_Id    
      this.appService.currentAnnee?.Ann_Id 
      this.searchParams.Ann_Id=this.appService.currentAnnee?.Ann_Id 
      console.log("Current Année : ",this.appService.currentAnnee?.Ann_Id)
    }
    )
  }

  searchParams: { Vers_Dateprevu?: any; Fact_Id?: any;Ann_Id?:any;Cls_Id?:any; Niv_Id?: any; Etd_Nom?: string; Etd_Prenom?: string; Etd_Matricule?: string } = {
    Vers_Dateprevu: null,
    Niv_Id: "",
    Fact_Id: "",
    Etd_Nom: "",
    Etd_Prenom: "",
    Etd_Matricule: "",
    Ann_Id:"",
    Cls_Id:""
  };

  charger() {
    console.log("Paramètres de recherche:", {
      matricule: this.searchParams.Etd_Matricule,
      nom: this.searchParams.Etd_Nom,
      prenom: this.searchParams.Etd_Prenom,
      niveau: this.searchParams.Niv_Id,
      classe: this.searchParams.Cls_Id,
      annee: this.searchParams.Ann_Id,
      facturable: this.searchParams.Fact_Id,
      datePrevu: this.searchParams.Vers_Dateprevu
    });

    this.loader.show();
    this.EduosService.GetEtudiantVersements(this.searchParams).subscribe(
      (response) => {
        this.loader.hide();
        console.log("response GetEtudiantVersements charger", response);
        if (response == null) {
          this.toastr.error("Erreur de GetEtudiantVersements");
        } else {
          this.EtudiantVersements = response;
          this.rowsData = this.EtudiantVersements.sort((a: any, b: any) => {
            if (a.Etd_Nom > b.Etd_Nom) return 1;
            if (a.Etd_Nom < b.Etd_Nom) return -1;
            if (a.Niv_Nom > b.Niv_Nom) return 1;
            if (a.Niv_Nom < b.Niv_Nom) return -1;
            if (a.Fac_Nom > b.Fac_Nom) return 1;
            if (a.Fac_Nom < b.Fac_Nom) return -1;
            return 0;
          });
          // this.rowsData.forEach(row => {
          //   row.GroupKey = `${row.Etd_Matricule}-${row.Niv_Nom}`;
          // });
          if (this.rowsData[0]) {
            this.columnsData = Object.keys(this.rowsData[0]); // Dynamique en fonction du premier objet
          }
          console.log("EtudiantVersements : ", this.EtudiantVersements);
        }
      },
      (error) => {
        this.loader.hide();
        console.error("Erreur GetEtudiantVersements: ", error);
        this.toastr.error(error?.error, "Erreur de GetEtudiantVersements");
      }
    );
  }

  imprimer() {
    console.log("searchParams: ", this.searchParams);

    this.loader.show();
    this.EduosService.GetRecouvrementPDF(this.searchParams).subscribe(
      (response) => {
        console.log("Recouvrement généré avec succès : ", response);

        if (response == null) {
          this.toastr.error("Erreur de récupération des documents.");
          this.loader.hide();
          return;
        } else {
          let blob = new Blob([response], { type: "application/pdf" });
          let fileToDownload = window.URL.createObjectURL(blob);
          var PDF_link = document.createElement("a");
          PDF_link.href = fileToDownload;
          PDF_link.download = "Recouvrement";
          PDF_link.click();
          this.toastr.success("Recouvrement généré avec succès");
          this.loader.hide();
        }
      },
      (error) => {
        console.error("Erreur de génération du Recouvrement : ", error);
        this.loader.hide();
        this.toastr.error("Erreur de génération du Recouvrement");
      }
    );
  }
  // Méthode pour basculer l'expansion des groupes
  toggleExpandGroup(group) {
    this.table.groupHeader.toggleExpandGroup(group);
  }

  // onDetailToggle(event) {
  //   console.log('Detail Toggled', event);
  // }
  GetNiveau() {
    this.loader.show();
    this.EduosService.GetNiveau().subscribe(
      (response) => {
        this.loader.hide();
        console.log("response GetNiveau charger", response);
        if (response == null) {
          this.toastr.error("Erreur de GetNiveau");
        } else {
          this.Niveaux = response;
          console.log("GetNiveau : ", this.Niveaux);
        }
      },
      (error) => {
        this.loader.hide();
        console.error("Erreur GetNiveau: ", error);
        this.toastr.error(error?.error, "Erreur de GetNiveau");
      }
    );
  }

  GetFacturable() {
    this.loader.show();

    this.EduosService.GetFacturable().subscribe(
      (response) => {
        console.log("response GetFacturable: ", response);
        this.loader.hide();
        if (response == null) {
          this.toastr.error("Erreur de recuperation des facturables");
        } else {
          this.Facturables = response;
        }
      },
      (error) => {
        console.error("Erreur GetFacturable: ", error);
        this.loader.hide();
        this.toastr.error(error?.error, "Erreur de recuperation des facturables");
      }
    );
  }
  GetClasses() {
    this.loader.show();

    this.EduosService.GetClasses().subscribe(
      (response) => {
        console.log("response GetClasses: ", response);
        this.loader.hide();
        if (response == null) {
          this.toastr.error("Erreur de recuperation des classes");
        } else {
          this.Classes = response;
        }
      },
      (error) => {
        console.error("Erreur GetClasses: ", error);
        this.loader.hide();
        this.toastr.error(error?.error, "Erreur de recuperation des classes");
      }
    );
  }
  GetAnnees() {
    this.loader.show();

    this.EduosService.GetAnnees().subscribe(
      (response) => {
        console.log("response GetAnnees: ", response);
        this.loader.hide();
        if (response == null) {
          this.toastr.error("Erreur de recuperation des annees");
        } else {
          this.Annees = response;
        }
      },
      (error) => {
        console.error("Erreur GetAnnees: ", error);
        this.loader.hide();
        this.toastr.error(error?.error, "Erreur de recuperation des annees");
      }
    );
  }
  openNewModal(newModal, EtdVers) {
    console.log("le details de EtdVers : ", EtdVers);
    this.modalService.open(newModal, { ariaLabelledBy: "modal-basic-title", size: "xl" });
  }
}
