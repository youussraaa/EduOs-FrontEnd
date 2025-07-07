import { Component, HostListener, ViewChild } from "@angular/core";
import { NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import { EduosService } from "../../../shared/services/Eduos.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { AppService } from "../../../shared/services/app.service";
import { BreadcrumbComponent } from "../../../shared/components/breadcrumb/breadcrumb.component";
import { IgxGridComponent, ISortingExpression, SortingDirection, IGroupingExpression, IRowSelectionEventArgs, IgxExporterEvent } from "igniteui-angular";
import { forkJoin, Observable } from "rxjs";
import { environment } from "../../../../environments/environment";

@Component({
  selector: "app-recouvrement",
  templateUrl: "./recouvrement.component.html",
  styleUrl: "./recouvrement.component.scss",
})
export class RecouvrementComponent {
  dateToString(arg0: Date) {
    throw new Error("Method not implemented.");
  }
  @ViewChild("myTable") table: any;
  // @ViewChild("gridComposantSection", { read: IgxGridComponent, static: false }) public gridComposantSection?: IgxGridComponent;
  showSearchParams: boolean = true;
  groupByExpression = [{ fieldName: "Etd_NomComplet", dir: "asc" }];
  gridConfig: any = {
    // ACD_ComposantSection
    title: "Sections",
    emptyTemplateText: "Aucune section trouvée",
    height: window.innerHeight - 350 + "px",
    rowHeight: "35px",
    transactions: [],
    primaryKey: "Vers_Id",
    batchEditing: true,
    rowEditable: true,
    allowFiltering: true,
    rowSelection: "multiple",
    cellSelection: "none",
    columnSelection: "none",
    data: [],
    columns: [
      {
        field: "Cls_Id",
        header: "Classe ID",
        dataType: "string",
        visible: false,
        sortable: false,
        resizable: false,
        filterable: false,
        editable: false,
        searchable: false,
        disableHiding: false,
        groupable: false,
        width: "",
      },
      {
        field: "Cls_Nom",
        header: "Classe",
        dataType: "string",
        visible: true,
        sortable: true,
        resizable: true,
        filterable: true,
        editable: false,
        searchable: true,
        disableHiding: false,
        groupable: true,
        width: "",
      },
      {
        field: "EtdTuteur_ParDefault",
        header: "Tuteur Par Défaut",
        dataType: "boolean",
        visible: false,
        sortable: false,
        resizable: false,
        filterable: false,
        editable: false,
        searchable: false,
        disableHiding: false,
        groupable: false,
        width: "",
      },
      {
        field: "Etd_Id",
        header: "Étudiant ID",
        dataType: "string",
        visible: false,
        sortable: true,
        resizable: true,
        filterable: true,
        editable: false,
        searchable: true,
        disableHiding: false,
        groupable: true,
        width: "",
      },
      {
        field: "Etd_Mail",
        header: "Email",
        dataType: "string",
        visible: false,
        sortable: false,
        resizable: false,
        filterable: false,
        editable: false,
        searchable: false,
        disableHiding: false,
        groupable: false,
        width: "",
      },
      {
        field: "Etd_Matricule",
        header: "Matricule",
        dataType: "string",
        visible: false,
        sortable: false,
        resizable: false,
        filterable: false,
        editable: false,
        searchable: false,
        disableHiding: false,
        groupable: false,
        width: "",
      },
      {
        field: "Etd_NomComplet",
        header: "Elève",
        dataType: "string",
        visible: false,
        sortable: true,
        resizable: true,
        filterable: true,
        editable: false,
        searchable: true,
        disableHiding: false,
        groupable: true,
        width: "",
      },
      {
        field: "Etd_Nom",
        header: "Nom",
        dataType: "string",
        visible: false,
        sortable: true,
        resizable: true,
        filterable: true,
        editable: false,
        searchable: true,
        disableHiding: false,
        groupable: true,
        width: "",
      },
      {
        field: "Etd_Prenom",
        header: "Prénom",
        dataType: "string",
        visible: false,
        sortable: true,
        resizable: true,
        filterable: true,
        editable: false,
        searchable: true,
        disableHiding: false,
        groupable: true,
        width: "",
      },
      {
        field: "Etd_Tel",
        header: "Téléphone",
        dataType: "string",
        visible: false,
        sortable: false,
        resizable: false,
        filterable: false,
        editable: false,
        searchable: false,
        disableHiding: false,
        groupable: false,
        width: "",
      },
      {
        field: "Fact_Id",
        header: "Facture ID",
        dataType: "string",
        visible: false,
        sortable: false,
        resizable: false,
        filterable: false,
        editable: false,
        searchable: false,
        disableHiding: false,
        groupable: false,
        width: "",
      },
      {
        field: "Fact_Nom",
        header: "Facturable",
        dataType: "string",
        visible: true,
        sortable: true,
        resizable: true,
        filterable: true,
        editable: false,
        searchable: true,
        disableHiding: false,
        groupable: true,
        width: "",
      },
      {
        field: "Vers_Id",
        header: "Versement ID",
        dataType: "string",
        visible: false,
        sortable: false,
        resizable: false,
        filterable: false,
        editable: false,
        searchable: false,
        disableHiding: false,
        groupable: false,
        width: "",
      },
      {
        field: "Vers_Nom",
        header: "Versement",
        dataType: "string",
        visible: true,
        sortable: true,
        resizable: true,
        filterable: true,
        editable: false,
        searchable: true,
        disableHiding: false,
        groupable: true,
        width: "",
      },
      {
        field: "Vers_Numero",
        header: "Numéro Versement",
        dataType: "number",
        visible: true,
        sortable: true,
        resizable: true,
        filterable: true,
        editable: false,
        searchable: true,
        disableHiding: false,
        groupable: true,
        width: "",
      },

      {
        field: "Vers_Montant",
        header: "Montant",
        dataType: "number",
        visible: true,
        sortable: true,
        resizable: true,
        filterable: true,
        editable: false,
        searchable: true,
        disableHiding: false,
        groupable: true,
        width: "",
      },
      {
        field: "Montant_Regle",
        header: "Montant Réglé",
        dataType: "number",
        visible: true,
        sortable: true,
        resizable: true,
        filterable: true,
        editable: false,
        searchable: true,
        disableHiding: false,
        groupable: true,
        width: "",
      },
      {
        field: "Reliquat",
        header: "Reliquat",
        dataType: "number",
        visible: true,
        sortable: true,
        resizable: true,
        filterable: true,
        editable: false,
        searchable: true,
        disableHiding: false,
        groupable: true,
        width: "",
      },
      {
        field: "Vers_Dateprevu",
        header: "Date Prévue",
        dataType: "date",
        visible: true,
        sortable: true,
        resizable: true,
        filterable: true,
        editable: false,
        searchable: true,
        disableHiding: false,
        groupable: true,
        width: "",
      },
      {
        field: "Vers_Estregle",
        header: "Est Réglé",
        dataType: "boolean",
        visible: true,
        sortable: true,
        resizable: true,
        filterable: true,
        editable: false,
        searchable: true,
        disableHiding: false,
        groupable: true,
        width: "",
      },
      {
        field: "Vers_Remise",
        header: "Remise",
        dataType: "number",
        visible: true,
        sortable: true,
        resizable: true,
        filterable: true,
        editable: false,
        searchable: true,
        disableHiding: false,
        groupable: true,
        width: "",
      },
      {
        field: "LienParente",
        header: "Lien de Parenté",
        dataType: "string",
        visible: false,
        sortable: true,
        resizable: true,
        filterable: true,
        editable: false,
        searchable: true,
        disableHiding: false,
        groupable: true,
        width: "",
      },

      {
        field: "Niv_Id",
        header: "Niveau ID",
        dataType: "string",
        visible: false,
        sortable: false,
        resizable: false,
        filterable: false,
        editable: false,
        searchable: false,
        disableHiding: false,
        groupable: false,
        width: "",
      },
      {
        field: "Niv_Nom",
        header: "Niveau",
        dataType: "string",
        visible: false,
        sortable: true,
        resizable: true,
        filterable: true,
        editable: false,
        searchable: true,
        disableHiding: false,
        groupable: true,
        width: "",
      },

      {
        field: "Sex_Nom",
        header: "Sexe",
        dataType: "string",
        visible: false,
        sortable: true,
        resizable: true,
        filterable: true,
        editable: false,
        searchable: true,
        disableHiding: false,
        groupable: true,
        width: "",
      },
      {
        field: "Tut_Id",
        header: "Tuteur ID",
        dataType: "string",
        visible: false,
        sortable: false,
        resizable: false,
        filterable: false,
        editable: false,
        searchable: false,
        disableHiding: false,
        groupable: false,
        width: "",
      },
      {
        field: "Tut_NomComplet",
        header: "Nom Complet Tuteur",
        dataType: "string",
        visible: false,
        sortable: true,
        resizable: true,
        filterable: true,
        editable: false,
        searchable: true,
        disableHiding: false,
        groupable: true,
        width: "",
      },
      {
        field: "Tut_Tel",
        header: "Téléphone Tuteur",
        dataType: "string",
        visible: false,
        sortable: true,
        resizable: true,
        filterable: true,
        editable: false,
        searchable: true,
        disableHiding: false,
        groupable: true,
        width: "",
      },

      {
        field: "Vers_Remarque",
        header: "Remarque",
        dataType: "string",
        visible: false,
        sortable: false,
        resizable: false,
        filterable: false,
        editable: false,
        searchable: false,
        disableHiding: false,
        groupable: false,
        width: "",
      },
    ],

    ExportExcel: (args: IgxExporterEvent) => {
      if (this.gridConfig.data == null || this.gridConfig.data.length == 0) {
        this.toastr.info("Rien à exporter");
        return;
      }
      args.options.fileName = "Recouvrement";
    },
  };
  EtudiantVersements: [] = [];
  // Niveaux: [] = [];
  // Facturables: [] = [];
  // Classes: [] = [];
  // Annees: [] = [];
  rowsData: any;
  columnsData: any;

  @ViewChild("grid", { static: true })
  public grid: IgxGridComponent;

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

  Enums: {
    Annees: any[];
    Niveaux: any[];
    Classes: any[];
    Facturables: any[];
  } = {
    Annees: [],
    Niveaux: [],
    Classes: [],
    Facturables: [],
  };

  ngOnInit() {
    console.log("recouvrement");
    this.searchParams.Vers_Dateprevu = new Date().toISOString().split("T")[0];
    this.searchParams.Niv_Id = "00000000-0000-0000-0000-000000000000";
    this.searchParams.Fact_Id = "00000000-0000-0000-0000-000000000000";

    // this.searchParams.Ann_Id="00000000-0000-0000-0000-000000000000";
    this.searchParams.Cls_Id = "00000000-0000-0000-0000-000000000000";
    this.onWindowResize(null);
    this.loader.show();
    this.EduosService.GetData([
      `${environment.apiUrl}/api/Configuration/GetAnnees?Ecole_Id=${localStorage.getItem("EcoleId")}`,
      `${environment.apiUrl}/api/Configuration/GetNiveau/${localStorage.getItem("EcoleId")}`,
      `${environment.apiUrl}/api/Configuration/GetClasses?Ecole_Id=${localStorage.getItem("EcoleId")}`,
      `${environment.apiUrl}/api/Configuration/GetFacturable?Ecole_Id=${localStorage.getItem("EcoleId")}`,
    ]).subscribe(
      (response: any[]) => {
        console.log("Response GetData: ", response);
        this.loader.hide();

        this.Enums.Annees = response[0];
        this.Enums.Niveaux = response[1];
        this.Enums.Classes = response[2];
        this.Enums.Facturables = response[3];

        // this.charger();
        (window as any).gloablThis = this;
      },
      (error) => {
        console.error("Error GetCommunData: ", error);
        this.loader.hide();
        this.toastr.error("Erreur de recuperation des listes");
      }
    );

    this.appService.anneeEmitter.subscribe((annee) => {
      // this.CurrentAnnee=this.appService.currentAnnee?.Ann_Id
      this.appService.currentAnnee?.Ann_Id;
      this.searchParams.Ann_Id = this.appService.currentAnnee?.Ann_Id;
    });
  }

  @HostListener("window:resize", ["$event"])
  onWindowResize($event) {
    console.log("onResize: ", $event);
    setTimeout(() => {
      let searchBarHeight = document.getElementById("searchBar")?.clientHeight;
      if (searchBarHeight == null || searchBarHeight == undefined || searchBarHeight == 0) {
        searchBarHeight = -25;
      }
      // searchBarHeight -= 20;
      this.gridConfig.height = window.innerHeight - searchBarHeight - 230 + "px";
    }, 100);
  }

  searchParams: { Vers_Dateprevu?: any; Fact_Id?: any; Ann_Id?: any; Cls_Id?: any; Niv_Id?: any; Etd_Nom?: string; Etd_Prenom?: string; Etd_Matricule?: string } = {
    Vers_Dateprevu: null,
    Niv_Id: "",
    Fact_Id: "",
    Etd_Nom: "",
    Etd_Prenom: "",
    Etd_Matricule: "",
    Ann_Id: "",
    Cls_Id: "",
  };

  charger() {
    this.loader.show();
    this.EduosService.GetEtudiantVersements(this.searchParams).subscribe(
      (response) => {
        this.loader.hide();
        console.log("response GetEtudiantVersements charger", response);
        if (response == null) {
          this.toastr.error("Erreur de GetEtudiantVersements");
        } else {
          // this.EtudiantVersements = response.map((item) => {
          //   item.Etd_NomComplet = item.Etd_Nom + " " + item.Etd_Prenom;
          //   return item;
          // });

          this.gridConfig.data = response
            .map((item) => {
              item.Etd_NomComplet = item.Etd_Nom + " " + item.Etd_Prenom;
              return item;
            })
            .sort((a: any, b: any) => {
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
          // if (this.rowsData[0]) {
          //   this.columnsData = Object.keys(this.rowsData[0]); // Dynamique en fonction du premier objet
          // }
          // console.log("EtudiantVersements : ", this.EtudiantVersements);
          if (response.length > 0) this.toggleSearchParams();
          else {
            this.toastr.info("Aucun résultat trouvé");
          }
          this.onWindowResize(null);
        }
      },
      (error) => {
        this.loader.hide();
        console.error("Erreur GetEtudiantVersements: ", error);
        this.toastr.error(error?.error, "Erreur de GetEtudiantVersements");
      }
    );
  }
  getEtdNom(etdId: any): string {
    console.log("etdId: ", etdId);
    const etudiant = this.rowsData.find((row) => row.Etd_Id === etdId);
    return etudiant ? etudiant.Etd_Nom : "Inconnu";
  }
  getEtdPrenom(etdId: string): string {
    const etudiant = this.rowsData.find((row) => row.Etd_Id === etdId);
    return etudiant ? etudiant.Etd_Prenom : "Inconnu";
  }
  getTutNomComplet(etdId: string): string {
    const etudiant = this.rowsData.find((row) => row.Etd_Id === etdId);
    return etudiant ? etudiant.Tut_NomComplet : "Inconnu";
  }
  getTutTel(etdId: string): string {
    const etudiant = this.rowsData.find((row) => row.Etd_Id === etdId);
    return etudiant ? etudiant.Tut_Tel : "Inconnu";
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
  // GetNiveau() {
  //   this.loader.show();
  //   this.EduosService.GetNiveau().subscribe(
  //     (response) => {
  //       this.loader.hide();
  //       console.log("response GetNiveau charger", response);
  //       if (response == null) {
  //         this.toastr.error("Erreur de GetNiveau");
  //       } else {
  //         this.Niveaux = response;
  //         console.log("GetNiveau : ", this.Niveaux);
  //       }
  //     },
  //     (error) => {
  //       this.loader.hide();
  //       console.error("Erreur GetNiveau: ", error);
  //       this.toastr.error(error?.error, "Erreur de GetNiveau");
  //     }
  //   );
  // }

  // GetFacturable() {
  //   this.loader.show();

  //   this.EduosService.GetFacturable().subscribe(
  //     (response) => {
  //       console.log("response GetFacturable: ", response);
  //       this.loader.hide();
  //       if (response == null) {
  //         this.toastr.error("Erreur de recuperation des facturables");
  //       } else {
  //         this.Facturables = response;
  //       }
  //     },
  //     (error) => {
  //       console.error("Erreur GetFacturable: ", error);
  //       this.loader.hide();
  //       this.toastr.error(error?.error, "Erreur de recuperation des facturables");
  //     }
  //   );
  // }
  // GetClasses() {
  //   this.loader.show();

  //   this.EduosService.GetClasses().subscribe(
  //     (response) => {
  //       console.log("response GetClasses: ", response);
  //       this.loader.hide();
  //       if (response == null) {
  //         this.toastr.error("Erreur de recuperation des classes");
  //       } else {
  //         this.Classes = response;
  //       }
  //     },
  //     (error) => {
  //       console.error("Erreur GetClasses: ", error);
  //       this.loader.hide();
  //       this.toastr.error(error?.error, "Erreur de recuperation des classes");
  //     }
  //   );
  // }
  // GetAnnees() {
  //   this.loader.show();

  //   this.EduosService.GetAnnees().subscribe(
  //     (response) => {
  //       console.log("response GetAnnees: ", response);
  //       this.loader.hide();
  //       if (response == null) {
  //         this.toastr.error("Erreur de recuperation des annees");
  //       } else {
  //         this.Annees = response;
  //       }
  //     },
  //     (error) => {
  //       console.error("Erreur GetAnnees: ", error);
  //       this.loader.hide();
  //       this.toastr.error(error?.error, "Erreur de recuperation des annees");
  //     }
  //   );
  // }
  openNewModal(newModal, EtdVers) {
    console.log("le details de EtdVers : ", EtdVers);
    this.modalService.open(newModal, { ariaLabelledBy: "modal-basic-title", size: "xl" });
  }

  toggleSearchParams() {
    this.showSearchParams = !this.showSearchParams;
    this.onWindowResize(null);
  }
}
