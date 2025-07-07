import { AfterViewInit, Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { EduosService } from "../../../shared/services/Eduos.service";
import { v4 as uuidv4 } from "uuid";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import { AppService } from "../../../shared/services/app.service";
import { formatDate } from "@angular/common";
import { environment } from "../../../../environments/environment";
import { Title } from "@angular/platform-browser";
import print from "print-js"


@Component({
  selector: "app-paiements2",
  templateUrl: "./paiements2.component.html",
  styleUrls: ["./paiements2.component.scss"],
})
export class Paiements2Component implements OnInit, AfterViewInit {
  showSearchParams: boolean = true;
  EcoleId: string | null;
  CaisseId: string | null;
  CurrentCaisse: any;

  onFloatingButtonClick(): void {
    this.showSearchParams = !this.showSearchParams;
    this.onWindowResize(event);
  }

  dockManagerConfig: { height: string | null } = { height: null };


  @HostListener("window:resize", ["$event"])
  onWindowResize($event) {
    setTimeout(() => {
      let searchBarHeight = document.getElementById("searchBar")?.clientHeight;
      if (searchBarHeight == null || searchBarHeight == undefined || searchBarHeight == 0) {
        searchBarHeight = 0;
      } else {
        searchBarHeight += 30;
      }
      let dockManagerHeight = window.innerHeight - searchBarHeight - 200;
      this.dockManagerConfig.height = dockManagerHeight + "px";

      this.gridEtudiantsConfig.height = dockManagerHeight + "px";
      this.gridVersementsConfig.height = dockManagerHeight / 2.2 + "px";
      this.gridOperationsConfig.height = dockManagerHeight / 2 + "px";

    }, 100);
  }
 
  selectedEtudiant: any = null;
  // @ViewChild("GridEtudiants", { read: IgxGridComponent, static: false }) public GridEtudiants: IgxGridComponent;
  gridEtudiantsConfig: any = {
    GetVisibleColumns: () => { return this.gridEtudiantsConfig.columns.filter((col) => col.visible); },
    GetEnabledColumns: () => { return this.gridEtudiantsConfig.columns.filter((col) => !col.disableHiding); },
    title: "Elèves",
    emptyTemplateText: "Aucun élève trouvée",
    height: "100%", //window.innerHeight - 350 + "px",
    rowHeight: "35px",
    transactions: [],
    primaryKey: "EtdClasseAnn_Id",
    batchEditing: true,
    rowEditable: true,
    allowFiltering: true,
    rowSelection: "multiple",
    cellSelection: "none",
    columnSelection: "none",
    data: [],
    columns: [
      { field: "EtdClasseAnn_Id", header: "EtdClasseAnn_Id", dataType: "string", visible: false, sortable: false, resizable: false, filterable: false, editable: false, searchable: false, disableHiding: true, groupable: false, width: "", },
      { field: "ClasseAnn_Id", header: "ClasseAnn_Id", dataType: "string", visible: false, sortable: false, resizable: false, filterable: false, editable: false, searchable: false, disableHiding: true, groupable: false, width: "", },
      { field: "Ann_Id", header: "Ann_Id", dataType: "string", visible: false, sortable: false, resizable: false, filterable: false, editable: false, searchable: false, disableHiding: true, groupable: false, width: "", },
      { field: "Cls_Id", header: "Cls_Id", dataType: "string", visible: false, sortable: false, resizable: false, filterable: false, editable: false, searchable: false, disableHiding: true, groupable: false, width: "", },
      { field: "Niv_Id", header: "Niv_Id", dataType: "string", visible: false, sortable: false, resizable: false, filterable: false, editable: false, searchable: false, disableHiding: true, groupable: false, width: "", },

      { field: "Etd_Matricule", header: "Matricule", dataType: "string", visible: true, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },
      { field: "Etd_NomComplet", header: "Elève", dataType: "string", visible: true, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: true, groupable: true, width: "", },
      { field: "Ann_Nom", header: "Année", dataType: "string", visible: false, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },
      { field: "Niv_Nom", header: "Niveau", dataType: "string", visible: false, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },
      // { field: "Ann_Datedebut", header: "Date Début Année", dataType: "date", visible: false, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },
      // { field: "Ann_Datefin", header: "Date Fin Année", dataType: "date", visible: false, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },

      { field: "Cls_Nom", header: "Classe", dataType: "string", visible: true, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },
      // { field: "Etd_Adresse", header: "Adresse Étudiant", dataType: "string", visible: false, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },
      // { field: "Etd_CIN", header: "CIN Étudiant", dataType: "string", visible: false, sortable: false, resizable: false, filterable: false, editable: false, searchable: false, disableHiding: false, groupable: false, width: "", },
      { field: "Etd_DateNaissance", header: "Date Naissance", dataType: "date", visible: true, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },
      { field: "Etd_LieuNaissance", header: "Lieu Naissance", dataType: "string", visible: false, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },
      // { field: "Etd_Mail", header: "Mail Étudiant", dataType: "string", visible: false, sortable: false, resizable: false, filterable: false, editable: false, searchable: false, disableHiding: false, groupable: false, width: "", },

      // { field: "Etd_Nom", header: "Nom", dataType: "string", visible: false, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },
      // { field: "Etd_Prenom", header: "Prénom", dataType: "string", visible: false, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },
      { field: "Etd_Remarque", header: "Remarque Étudiant", dataType: "string", visible: false, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },
      { field: "Etd_Tel", header: "Téléphone Étudiant", dataType: "string", visible: false, sortable: false, resizable: false, filterable: false, editable: false, searchable: false, disableHiding: false, groupable: false, width: "", },

      { field: "Sex_Nom", header: "Sexe", dataType: "string", visible: false, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },

      { field: "Tuteurs", header: "Tuteurs", dataType: "string", visible: true, sortable: false, resizable: false, filterable: false, editable: false, searchable: false, disableHiding: false, groupable: false, width: "", },
      { field: "TelephoneTuteurs", header: "Tel. tuteurs", dataType: "string", visible: true, sortable: false, resizable: false, filterable: false, editable: false, searchable: false, disableHiding: false, groupable: false, width: "", },
      // { field: "NumeroWhatsappTuteurs", header: "Num. whatsapp tuteurs", dataType: "string", visible: true, sortable: false, resizable: false, filterable: false, editable: false, searchable: false, disableHiding: false, groupable: false, width: "", },
      { field: "EtdClasseAnn_EstCasSocial", header: "Cas social", dataType: "boolean", visible: true, sortable: false, resizable: false, filterable: false, editable: false, searchable: false, disableHiding: false, groupable: false, width: "", },

    ],

    // ExportExcel: (args: IgxExporterEvent) => {
    //   if (this.gridEtudiantsConfig.data == null || this.gridEtudiantsConfig.data.length == 0) {
    //     this.toastr.info("Rien à exporter");
    //     return;
    //   }
    //   args.options.fileName = "Recouvrement";
    // },
    OnRowClick: (row_id) => {
      if (this.selectedEtudiant == null || this.selectedEtudiant.EtdClasseAnn_Id != row_id)
        this.selectedEtudiant = this.gridEtudiantsConfig.data.find(x => x.EtdClasseAnn_Id == row_id);
      else
        this.selectedEtudiant = null;

      this.gridVersementsConfig.data = this.selectedEtudiant != null ? this.selectedEtudiant.Versements : [];
      this.gridOperationsConfig.data = this.selectedEtudiant != null ? this.selectedEtudiant.Operations : [];

      this.gridVersementsConfig.selectedRows = [];

    },
  };


  // @ViewChild("GridVersements", { read: IgxGridComponent, static: false }) public GridVersements: IgxGridComponent;
  gridVersementsConfig: any = {
    GetVisibleColumns: () => { return this.gridVersementsConfig.columns.filter((col) => col.visible); },
    GetEnabledColumns: () => { return this.gridVersementsConfig.columns.filter((col) => !col.disableHiding); },
    data: [],
    height: "100%",
    rowHeight: "50px",
    allowFiltering: true,
    rowEditable: true,
    primaryKey: "Vers_Id",
    columns: [
      { field: "EtdClasseAnn_Id", header: "EtdClasseAnn_Id", dataType: "string", visible: false, sortable: true, resizable: true, filterable: true, editable: false, width: "", disableHiding: true, },
      // { field: "Etd_NomComplet", header: "Eleve", dataType: "string", visible: false, sortable: true, resizable: true, filterable: true, editable: false, width: "", },
      { field: "Vers_Nom", header: "Versement", dataType: "string", visible: true, sortable: true, resizable: true, filterable: true, editable: false, width: "", disableHiding: true, },
      { field: "Vers_Montant", header: "Montant (FCFA)", dataType: "number", visible: true, sortable: true, resizable: true, filterable: true, editable: false, width: "", disableHiding: false, isMontant: true, },
      { field: "Vers_Remise", header: "Remise", dataType: "number", visible: true, sortable: true, resizable: true, filterable: true, editable: false, width: "", disableHiding: false, isMontant: true, },
      { field: "Vers_Dateprevu", header: "Date prévu", dataType: "date", visible: true, sortable: true, resizable: true, filterable: true, editable: false, width: "", disableHiding: false, },
      { field: "Reliquat", header: "Reliquat (FCFA)", dataType: "number", visible: true, sortable: true, resizable: true, filterable: true, editable: false, width: "", disableHiding: false, isMontant: true, },
      { field: "Vers_Estregle", header: "Réglé", dataType: "boolean", visible: false, sortable: true, resizable: true, filterable: true, editable: false, width: "", disableHiding: false, },
      { field: "FichFact_Nom", header: "Fiche Facturation", dataType: "string", visible: true, sortable: true, resizable: true, filterable: true, editable: false, width: "", disableHiding: false, },
    ],

    selectedRows: [],
    SelectRow: (row_id) => {
      if (this.gridVersementsConfig.selectedRows.find(x => x == row_id) == null) {
        this.gridVersementsConfig.selectedRows.push(row_id);
      } else {
        this.gridVersementsConfig.selectedRows = this.gridVersementsConfig.selectedRows.filter(x => x != row_id);
      }
    }
  };

  // @ViewChild("GridOperations", { read: IgxGridComponent, static: false }) public GridOperations: IgxGridComponent;
  gridOperationsConfig: any = {
    GetVisibleColumns: () => { return this.gridOperationsConfig.columns.filter((col) => col.visible); },
    GetEnabledColumns: () => { return this.gridOperationsConfig.columns.filter((col) => !col.disableHiding); },
    data: [],
    height: "100%",
    rowHeight: "50px",
    allowFiltering: true,
    rowEditable: true,
    primaryKey: "Ope_Id",
    columns: [
      { field: "Ope_NumRecu", header: "Numéro Recu", dataType: "string", visible: true, sortable: true, resizable: true, filterable: true, editable: false, width: "", disableHiding: true, },
      { field: "Ope_Date", header: "Date d'opération", dataType: "date", visible: true, sortable: true, resizable: true, filterable: true, editable: false, width: "", disableHiding: false, },
      { field: "Ope_Montant", header: "Montant (FCFA)", dataType: "number", visible: true, sortable: true, resizable: true, filterable: true, editable: false, width: "", disableHiding: false, isMontant: true, },
      { field: "ModPai_Nom", header: "Mode de paiement", dataType: "string", visible: true, sortable: true, resizable: true, filterable: true, editable: false, width: "", disableHiding: false, },
      { field: "Ope_Reference", header: "Référence", dataType: "string", visible: true, sortable: true, resizable: true, filterable: true, editable: false, width: "", disableHiding: false, },
      { field: "Ope_Description", header: "Description", dataType: "string", visible: true, sortable: true, resizable: true, filterable: true, editable: false, width: "", disableHiding: false, },
    ],
  };

  EtudiantPaiement: any[] = [];
  filterEtudiantPaiement: any[] = [];
  filterParams = {
    global: "",
  };
  // CurrentAnnee: any;

  // EtudiantByAnnee: any;
  // OnFiltreChange(event, column: string) {
  //   setTimeout(() => {
  //     this.filterEtudiantPaiement = this.EtudiantByAnnee.filter(
  //       (x) =>
  //         x.Etd_Nom?.toLowerCase().includes(this.filterParams.global.toLowerCase()) ||
  //         x.Etd_Prenom?.toLowerCase().includes(this.filterParams.global.toLowerCase()) ||
  //         x.Etd_Matricule?.toLowerCase().includes(this.filterParams.global.toLowerCase()) ||
  //         x.Etd_Cin?.toLowerCase().includes(this.filterParams.global.toLowerCase())
  //     );
  //   }, 0);
  // }


  // selectedOperation: any;

  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private EduosService: EduosService,
    private loader: NgxSpinnerService,
    private toastr: ToastrService,
    private appService: AppService,
    private title: Title,
  ) {
    config.backdrop = "static";
    config.keyboard = false;
    this.EcoleId = localStorage.getItem("EcoleId");
    this.CaisseId = localStorage.getItem("CaisseId");
    if (this.CaisseId == null || this.CaisseId == "") {
      Swal.fire("Vous n'avez pas de code caisse sur votre compte, veuillez contacter l'administrateur?")
    }

    let ecole = localStorage.getItem("Ecole");
    if (ecole != null) this.title.setTitle(`Paiements - ${JSON.parse(ecole).Ecole_Nom}`);
  }

  searchParams: {
    Ann_Id?: any; Cls_Id?: any; Niv_Id?: any; Etd_Nom?: string; Etd_Prenom?: string; Etd_Matricule?: string
    TelephoneTuteur?: string
  } = {
      Niv_Id: "00000000-0000-0000-0000-000000000000",
      Ann_Id: "00000000-0000-0000-0000-000000000000",
      Cls_Id: "00000000-0000-0000-0000-000000000000",
      Etd_Nom: "",
      Etd_Prenom: "",
      Etd_Matricule: "",
      TelephoneTuteur: "",
    };

  Enums: {
    Annees: any[];
    Niveaux: any[];
    Classes: any[];
    ModePaiements: any[],
    Caisses: any[],
  } = {
      Annees: [],
      Niveaux: [],
      Classes: [],
      ModePaiements: [],
      Caisses: [],
    };


  ngAfterViewInit() { }

  ngOnInit(): void {
    if (this.appService.currentAnnee != null)
      this.searchParams.Ann_Id = this.appService.currentAnnee.Ann_Id;
    if (this.appService.currentEcole != null)
      this.title.setTitle(`Paiements - ${this.appService.currentEcole.Ecole_Nom}`);

    this.appService.anneeEmitter.subscribe((item) => {
      this.searchParams.Ann_Id = item.Ann_Id;
    });

    this.appService.ecoleEmitter.subscribe((item) => {
      this.title.setTitle(`Paiements - ${item.Ecole_Nom}`);
    });

    this.loader.show();
    this.EduosService.GetCommunData([
      `${environment.apiUrl}/api/Configuration/GetAnnees?Ecole_Id=${this.EcoleId}`,
      `${environment.apiUrl}/api/Configuration/GetNiveau/${this.EcoleId}`,
      `${environment.apiUrl}/api/Configuration/GetClasses?Ecole_Id=${this.EcoleId}`,
      `${environment.apiUrl}/api/Configuration/GetModePaiement`,
      `${environment.apiUrl}/api/Configuration/GetCaisses?Ecole_Id=${this.EcoleId}`,
    ]).subscribe(
      (response: any[]) => {
        console.log("Response GetCommunData: ", response);
        this.loader.hide();
        this.Enums.Annees = response[0].sort((a, b) => {
          if (a.Ann_Nom > b.Ann_Nom) return -1;
          if (a.Ann_Nom < b.Ann_Nom) return 1;
          return 0;
        });
        this.Enums.Niveaux = response[1].sort((a, b) => {
          if (a.Niv_Nom > b.Niv_Nom) return 1;
          if (a.Niv_Nom < b.Niv_Nom) return -1;
          return 0;
        });
        this.Enums.Classes = response[2].sort((a, b) => {
          if (a.Cls_Nom > b.Cls_Nom) return 1;
          if (a.Cls_Nom < b.Cls_Nom) return -1;
          return 0;
        });
        this.Enums.ModePaiements = response[3].sort((a, b) => {
          if (a.ModPai_Nom > b.ModPai_Nom) return 1;
          if (a.ModPai_Nom < b.ModPai_Nom) return -1;
          return 0;
        });
        this.Enums.Caisses = response[4].sort((a, b) => {
          if (a.Caisse_Nom > b.Caisse_Nom) return 1;
          if (a.Caisse_Nom < b.Caisse_Nom) return -1;
          return 0;
        });

        if (this.CaisseId != null && this.CaisseId != "") {
          let caisse = this.Enums.Caisses.find(x => x.Caisse_Id.toLowerCase() == this.CaisseId?.toLowerCase())
          if (caisse == null) {
            Swal.fire("Votre code de caisse est incorrect, veuillez contacter l'administrateur");
          } else {
            this.CurrentCaisse = caisse;
          }
        }
        this.onWindowResize(null);
      },
      (error) => {
        this.loader.hide();
        console.error("Error GetCommunData: ", error);
        this.onWindowResize(null);
      });

    (window as any).paiement = this;
  }


  GetData() {
    if (
      (this.searchParams.Ann_Id === "00000000-0000-0000-0000-000000000000" || this.searchParams.Ann_Id == null || this.searchParams.Ann_Id === "") &&
      (this.searchParams.Cls_Id === "00000000-0000-0000-0000-000000000000" || this.searchParams.Cls_Id == null || this.searchParams.Cls_Id === "") &&
      (this.searchParams.Niv_Id === "00000000-0000-0000-0000-000000000000" || this.searchParams.Niv_Id == null || this.searchParams.Niv_Id === "") &&
      (this.searchParams.Etd_Matricule === "" || this.searchParams.Etd_Matricule == null) &&
      (this.searchParams.Etd_Nom === "" || this.searchParams.Etd_Nom == null) &&
      (this.searchParams.Etd_Prenom === "" || this.searchParams.Etd_Prenom == null) &&
      (this.searchParams.TelephoneTuteur === "" || this.searchParams.TelephoneTuteur == null)
    ) {
      this.toastr.warning("Select en moins un paramètre de recherche");
      return;
    }

    let params: any = {
      Ann_Id: this.searchParams.Ann_Id,
      Niv_Id: this.searchParams.Niv_Id,
      Cls_Id: this.searchParams.Cls_Id,
      Etd_Matricule: this.searchParams.Etd_Matricule,
      Etd_Nom: this.searchParams.Etd_Nom,
      Etd_Prenom: this.searchParams.Etd_Prenom,
      TelephoneTuteur: this.searchParams.TelephoneTuteur,
    };
    // if (EtdClasseAnn_Id != null && EtdClasseAnn_Id != "") params.EtdClasseAnn_Id = EtdClasseAnn_Id;
    this.loader.show();
    this.EduosService.GetEtudiantClasseAnneePaiement(params).subscribe(
      (response: any) => {
        console.log("response GetEtudiantClasseAnneePaiement ", response);
        this.loader.hide();
        if (response == null) {
          this.toastr.error("Erreur de chargement des étudiants");
        }
        else if (response.length == 0) {
          this.toastr.info("Aucun élève touvré");
        } else {
          // if (EtdClasseAnn_Id == null || EtdClasseAnn_Id == "") {
          this.gridEtudiantsConfig.data = response
            .map((item) => {
              item.Etd_NomComplet = item.Etd_Nom + " " + item.Etd_Prenom;
              item.Versements = item.Versements.map((vers) => {
                vers.EtdClasseAnn_Id = item.EtdClasseAnn_Id;
                return vers;
              });
              item.Operations = item.Operations.map((op) => {
                op.EtdClasseAnn_Id = item.EtdClasseAnn_Id;
                return op;
              });
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
          this.showSearchParams = false;
          this.selectedEtudiant = null;
          this.gridVersementsConfig.selectedRows = [];
          this.gridVersementsConfig.data = [];
          this.gridOperationsConfig.data = [];
          // this.filterEtudiantPaiement = this.gridEtudiantsConfig.data;
          this.onWindowResize(null);
        }
      },
      (error) => {
        console.error("Erreur GetEtudiantClasseAnneePaiement: ", error);
        this.loader.hide();
        this.toastr.error(error?.error, "Erreur de recuperation de GetEtudiantClasseAnneePaiement.");
      }
    );
  }
  selectedVersementToDelete;

  // selectedOperations;
  // selectedRowsDS;
  deleteOperation(ope_id: string) {
    let operation = this.gridOperationsConfig.data.find(x => x.Ope_Id == ope_id);
    Swal.fire({
      title: "Voulez-vous supprimer l'opération?",
      showCancelButton: true,
      confirmButtonText: "Supprimer",
      confirmButtonColor: "red",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        this.loader.show();
        this.EduosService.DeleteOperation(ope_id).subscribe(
          (response) => {
            console.log("Opération supprimer avec succès : ", response);
            this.loader.hide();
            this.toastr.success("Opération supprimée avec succès");

            // this.selectedEtudiant.Operations = this.selectedEtudiant?.Operations.filter((x) => x.Ope_Id !== id);
            this.gridOperationsConfig.data = this.gridOperationsConfig.data.filter((x) => x.Ope_Id !== ope_id);
            this.gridEtudiantsConfig.data = this.gridEtudiantsConfig.data.map((item) => {
              if (item.EtdClasseAnn_Id === operation.EtdClasseAnn_Id) item.Operations = item.Operations.filter((x) => x.Ope_Id !== ope_id);
              return item;
            });

          },
          (error) => {
            console.error("Erreur lors de la suppression de l'opération : ", error);
            this.loader.hide();
            this.toastr.error("Erreur lors de la suppression de l'opération");
          }
        );
      }
    });
  }
  // detailOperation(ctx: any, content) {
  //   this.selectedOperation = ctx.data;
  //   this.openLg(content);
  // }




  genereRecu(ope_id: any) {
    Swal.fire({
      title: "Voulez-vous générer le reçu?",
      showCancelButton: true,
      confirmButtonText: "Générer",
      confirmButtonColor: "rgba(var(--bs-info-rgb)",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        this.loader.show();
        this.EduosService.GetRecuPaiement(ope_id).subscribe(
          (response) => {
            console.log("Reçu généré avec succès : ", response);
            this.loader.hide();

            if (response == null) {
              this.toastr.error("Erreur de récupération des documents.");
              return;
            } else {
              let blob = new Blob([response], { type: "application/pdf" });
              let fileToDownload = window.URL.createObjectURL(blob);
              print(fileToDownload);

              // var PDF_link = document.createElement("a");
              // PDF_link.href = fileToDownload;
              // PDF_link.download = "RecuPaiement";
              // PDF_link.click();
              // this.toastr.success("Reçu généré avec succès");
            }
          },
          (error) => {
            console.error("Erreur de génération du reçu : ", error);
            this.loader.hide();
            this.toastr.error("Erreur de génération du reçu");
          });
      }
    });
  }

  openLg(content) {
    this.modalService.open(content, { size: "xl" });
  }

  dialogReglement: any = {
    newOperation: null,
    selectedVersementsDS: [],
    modal: null,
    Open: (content) => {
      if (this.CaisseId == null || this.CaisseId == "") {
        this.toastr.warning("Aucune caisse associée à votre compte");
      }
      this.dialogReglement.modal = content;
      let selectedRows = this.gridVersementsConfig.selectedRows;
      this.dialogReglement.selectedVersementsDS = this.gridVersementsConfig.data.filter((item) => selectedRows?.includes(item.Vers_Id));
      if (!this.dialogReglement.selectedVersementsDS || this.dialogReglement.selectedVersementsDS.length === 0) {
        this.toastr.warning("Veuillez sélectionner au moins un versement");
        return;
      }
      // Check if any selected row has a Reliquat of 0
      let hasZeroReliquat = this.dialogReglement.selectedVersementsDS.find((x) => x.Reliquat === 0) != null;

      if (hasZeroReliquat) {
        this.toastr.warning("Un versement contient un reliquat à zéro");
        return;
      }

      // If there are selected rows, prepare the new operation
      if (this.dialogReglement.selectedVersementsDS && this.dialogReglement.selectedVersementsDS.length > 0) {
        this.dialogReglement.newOperation = {
          Ope_Id: uuidv4(),
          EtdClasseAnn_Id: this.dialogReglement.selectedVersementsDS[0].EtdClasseAnn_Id,
          Ope_Montant: this.dialogReglement.selectedVersementsDS.reduce((total, vers) => total + vers.Reliquat, 0),
          Ope_Date: new Date().toISOString().split("T")[0],
          Vers_Id: null,
          ModePai_Id: null,
          Ope_Reference: null,
          Ope_RefComptable: null,
          Ope_NumRecu: null,
          Ope_Description: null,
          Caisse_Id: this.CaisseId,
          Vers_List: [],
        };
      }
      this.dialogReglement.newOperation.Vers_List = this.dialogReglement.selectedVersementsDS;
      this.openLg(this.dialogReglement.modal);
    },
    Clear: () => {
      this.dialogReglement.newOperation = null;
      this.dialogReglement.selectedVersementsDS = [];
    },
    Close: (modal) => {
      modal.close();
      this.dialogReglement.Clear();
    },
    // Submit: (modal) => {
    //   if (this.dialogReglement.selectedVersementsDS && this.dialogReglement.selectedVersementsDS.length > 0) {
    //     const totalVersements = this.dialogReglement.selectedVersementsDS.reduce((total, vers) => total + vers.Vers_Montant, 0);
    //     let remainingAmount = this.dialogReglement.newOperation.Ope_Montant;
    
    //     // Variables pour construire le message de notification
    //     let message = "Détails des paiements :\n";
    //     let versementsPayesEntier: any[] = [];
    //     let versementsPayesPartiellement:any[] = [];
    //     let versementsNonPayes: any[] = [];
    
    //     // Créer la liste des règlements avec paiements partiels
    //     this.dialogReglement.newOperation.Vers_List = [];
    //     for (const vers of this.dialogReglement.selectedVersementsDS) {
    //       if (remainingAmount <= 0) {
    //         versementsNonPayes.push(vers); // Ajouter aux versements non payés
    //         continue;
    //       }
    
    //       const montantAPayer = Math.min(vers.Vers_Montant, remainingAmount);
    //       this.dialogReglement.newOperation.Vers_List.push({
    //         Regl_Id: uuidv4(),
    //         Ope_Id: this.dialogReglement.newOperation.Ope_Id,
    //         Vers_Id: vers.Vers_Id,
    //         Vers_Nom: vers.Vers_Nom,
    //         Regl_Montant: montantAPayer,
    //         Regl_Remarque: this.dialogReglement.newOperation.Ope_Description,
    //         Ope_Date: this.dialogReglement.newOperation.Ope_Date,
    //       });
    
    //       remainingAmount -= montantAPayer;
    
    //       // Classer les versements
    //       if (montantAPayer === vers.Vers_Montant) {
    //         versementsPayesEntier.push(vers); // Payé en entier
    //       } else {
    //         versementsPayesPartiellement.push({ vers, montantAPayer }); // Payé partiellement
    //       }
    //     }
    
        
    
    //     this.loader.show();
    //     this.EduosService.CreateOperation(this.dialogReglement.newOperation).subscribe(
    //       (response) => {
    //         console.log("response CreateOperation: ", response);
    //         this.loader.hide();
    //         if (response == null || response == false) {
    //           this.toastr.error("Erreur de création de l'operation");
    //         } else {
    //           let newOpe = this.dialogReglement.newOperation;
    //           newOpe.ModPai_Nom = this.Enums.ModePaiements.find(x => x.ModePai_Id == newOpe.ModePai_Id)?.ModePai_Nom;
    //           newOpe.Reglements = this.dialogReglement.newOperation.Vers_List;
    
    //           // Mettre à jour les reliquats des versements
    //           this.gridEtudiantsConfig.data = this.gridEtudiantsConfig.data.map((etd) => {
    //             if (etd.EtdClasseAnn_Id == this.selectedEtudiant.EtdClasseAnn_Id) {
    //               etd.Versements = etd.Versements.map((vers) => {
    //                 const reglement = newOpe.Reglements.find(reg => reg.Vers_Id === vers.Vers_Id);
    //                 if (reglement) {
    //                   vers.Reliquat -= reglement.Regl_Montant; // Mettre à jour le reliquat
    //                 }
    //                 return vers;
    //               });
    //               etd.Operations.push(newOpe);
    //             }
    //             return etd;
    //           });
    
    //           this.toastr.success("Opération ajoutée avec succès");
    //           // Construire le message de notification
    //           if (versementsPayesEntier.length > 0) {
    //             message += "<br><strong>Versements payés en entier :</strong><br>";
    //             versementsPayesEntier.forEach((vers) => {
    //               message += `- ${vers.Vers_Nom} : ${vers.Vers_Montant} FCFA<br>`;
    //             });
    //           }
              
    //           if (versementsPayesPartiellement.length > 0) {
    //             message += "<br><strong>Versements payés partiellement :</strong><br>";
    //             versementsPayesPartiellement.forEach(({ vers, montantAPayer }) => {
    //               message += `- ${vers.Vers_Nom} : ${montantAPayer} FCFA payés (reste ${vers.Vers_Montant - montantAPayer} FCFA)<br>`;
    //             });
    //           }
              
    //           if (versementsNonPayes.length > 0) {
    //             message += "<br><strong>Versements non payés :</strong><br>";
    //             versementsNonPayes.forEach((vers) => {
    //               message += `- ${vers.Vers_Nom} : 0 FCFA payés (reste ${vers.Vers_Montant} FCFA)<br>`;
    //             });
    //           }
              
    //           // Afficher la notification avec enableHtml activé
    //           this.toastr.info(message, "Détails des paiements", { timeOut: 10000, enableHtml: true });
              
    //           this.genereRecu(this.dialogReglement.newOperation.Ope_Id);
    //           this.gridVersementsConfig.selectedRows = [];
    //           modal.close();
    //           this.dialogReglement.Clear();
    //         }
    //       },
    //       (error) => {
    //         console.error("Erreur CreateOperation : ", error);
    //         this.loader.hide();
    //         this.toastr.error("Erreur de création du réglement");
    //       }
    //     );
    //   } else {
    //     console.warn("Aucun versement sélectionné !");
    //   }
    // },
    Submit: async (modal) => {
      if (this.dialogReglement.selectedVersementsDS && this.dialogReglement.selectedVersementsDS.length > 0) {
        const totalVersements = this.dialogReglement.selectedVersementsDS.reduce((total, vers) => total + vers.Reliquat, 0);
        let remainingAmount = this.dialogReglement.newOperation.Ope_Montant;
    
        // Vérifier si le montant est exact
        const isMontantExact = remainingAmount === totalVersements;
    
        // Variables pour construire le message de notification
        let message = "<div style='text-align: left;'>"; //"<div style='text-align: left;'>Détails des paiements :<br>"
        let versementsPayesEntier:any[] = [];
        let versementsPayesPartiellement:any[] = [];
        let versementsNonPayes:any[] = [];
    
        // Créer la liste des règlements avec paiements partiels
        this.dialogReglement.newOperation.Vers_List = [];
        for (const vers of this.dialogReglement.selectedVersementsDS) {
          if (remainingAmount <= 0) {
            versementsNonPayes.push(vers); // Ajouter aux versements non payés
            continue;
          }
    
          const montantAPayer = Math.min(vers.Reliquat, remainingAmount);
          this.dialogReglement.newOperation.Vers_List.push({
            Regl_Id: uuidv4(),
            Ope_Id: this.dialogReglement.newOperation.Ope_Id,
            Vers_Id: vers.Vers_Id,
            Vers_Nom: vers.Vers_Nom,
            Regl_Montant: montantAPayer,
            Regl_Remarque: this.dialogReglement.newOperation.Ope_Description,
            Ope_Date: this.dialogReglement.newOperation.Ope_Date,
          });
    
          remainingAmount -= montantAPayer;
    
          // Classer les versements
          if (montantAPayer === vers.Reliquat) {
            versementsPayesEntier.push(vers); // Payé en entier
          } else {
            versementsPayesPartiellement.push({ vers, montantAPayer }); // Payé partiellement
          }
        }
    
        // Afficher SweetAlert2 uniquement si le montant n'est pas exact
        if (!isMontantExact) {
          if (versementsPayesEntier.length > 0) {
            message += "<br><b>Versements payés en entier :</b><br>";
            versementsPayesEntier.forEach((vers) => {
              message += `- ${vers.Vers_Nom} : ${vers.Reliquat} FCFA<br>`;
            });
          }
    
          if (versementsPayesPartiellement.length > 0) {
            message += "<br><b>Versements payés partiellement :</b><br>";
            versementsPayesPartiellement.forEach(({ vers, montantAPayer }) => {
              message += `- ${vers.Vers_Nom} : ${montantAPayer} FCFA payés (reste ${vers.Reliquat - montantAPayer} FCFA)<br>`;
            });
          }
    
          if (versementsNonPayes.length > 0) {
            message += "<br><b>Versements non payés :</b><br>";
            versementsNonPayes.forEach((vers) => {
              message += `- ${vers.Vers_Nom} : 0 FCFA payés (reste ${vers.Reliquat} FCFA)<br>`;
            });
          }
          if (remainingAmount > 0) {
            message += `<br><b>Montant non utilisé :</b> ${remainingAmount} FCFA<br>`;
            message += `<br><b>Veuillez sélectionner un autre versement car il y a un excédent de montant !!!</b><br>`;

            message += "</div>";
            // Afficher SweetAlert2 avec les détails
              await Swal.fire({
                title: 'Détails des paiements',
                html: message,
                icon: 'warning',
                confirmButtonText: 'OK',
                confirmButtonColor: '#d33',
              });

            return; // Empêche la création de l'opération
          }
    
          message += "</div>";
    
          // Afficher SweetAlert2 avec les détails
          const result = await Swal.fire({
            title: 'Détails des paiements',
            html: message,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Confirmer',
            cancelButtonText: 'Annuler',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
          });
    
          // Si l'utilisateur annule, arrêter le processus
          if (result.isDismissed) {
            return;
          }
        }
    
        this.loader.show();
        this.EduosService.CreateOperation(this.dialogReglement.newOperation).subscribe(
          (response) => {
            console.log("response CreateOperation: ", response);
            this.loader.hide();
            if (response == null || response == false) {
              this.toastr.error("Erreur de création de l'operation");
            } else {
              let newOpe = this.dialogReglement.newOperation;
              newOpe.ModPai_Nom = this.Enums.ModePaiements.find(x => x.ModePai_Id == newOpe.ModePai_Id)?.ModePai_Nom;
              newOpe.Reglements = this.dialogReglement.newOperation.Vers_List;
    
              // Mettre à jour les reliquats des versements
              this.gridEtudiantsConfig.data = this.gridEtudiantsConfig.data.map((etd) => {
                if (etd.EtdClasseAnn_Id == this.selectedEtudiant.EtdClasseAnn_Id) {
                  etd.Versements = etd.Versements.map((vers) => {
                    const reglement = newOpe.Reglements.find(reg => reg.Vers_Id === vers.Vers_Id);
                    if (reglement) {
                      vers.Reliquat -= reglement.Regl_Montant; // Mettre à jour le reliquat
                    }
                    return vers;
                  });
                  etd.Operations.push(newOpe);
                }
                return etd;
              });
    
              this.toastr.success("Opération ajoutée avec succès");
              this.genereRecu(this.dialogReglement.newOperation.Ope_Id);
              this.gridVersementsConfig.selectedRows = [];
              modal.close();
              this.dialogReglement.Clear();
            }
          },
          (error) => {
            console.error("Erreur CreateOperation : ", error);
            this.loader.hide();
            this.toastr.error("Erreur de création du réglement");
          }
        );
      } else {
        console.warn("Aucun versement sélectionné !");
      }
    },
  };


  // Liste des objets sélectionnés

  getFormattedDate(): string {
    const currentDate = new Date();
    return formatDate(currentDate, "dd/MM/yyyy", "en-US"); // Format dd/MM/YYYY
  }

  selectedFacturables: any[] = [];
  FacturableByEtudiantClasseAnnee: any[] = [];
  facturerPaiement(content) {
    // let selectedEtudiantClasseAnnee = this.GridEtudiants?.selectedRows;
    // if (selectedEtudiantClasseAnnee?.length == 0) {
    //   this.toastr.warning("Veuillez sélectionner un étudiant");
    //   return;
    // } else {
    this.FacturableByEtudiantClasseAnnee = [];

    let EtdClasseAnn_Id_AFacturer = this.selectedEtudiant != null ? this.selectedEtudiant.EtdClasseAnn_Id : null;
    this.loader.show();
    this.EduosService.GetFacturableByEtudiantClasseAnnee(EtdClasseAnn_Id_AFacturer).subscribe(
      (response: any[]) => {
        console.log("response GetFacturableByEtudiantClasseAnnee: ", response);
        this.loader.hide();
        if (response == null) {
          this.toastr.error("Erreur de récupération des facturable de l'élève");
        }
        else if (response.length == 0) {
          this.toastr.info("L'élève n'a aucun autre facturable.");
        }
        else {
          this.FacturableByEtudiantClasseAnnee = response;
          this.openLg(content);
        }
      },
      (error) => {
        console.error("Erreur GetFacturableByEtudiantClasseAnnee: ", error);
        this.loader.hide();
        this.toastr.error("Erreur lors de récupération des facturable de l'élève");
      }
    );
    // }
  }
  // Méthode appelée lors du changement d'état de la checkbox
  onCheckboxChange(event: any, facturable: any) {
    // let selectedEtudiantClasseAnnee = this.GridEtudiants?.selectedRows;
    let selectedEtdClasseAnn_Id = this.selectedEtudiant.EtdClasseAnn_Id;

    if (event.target.checked) {
      const selectedFacturable = {
        FactFicheFact_Id: facturable.FactFicheFact_Id,
        EtdClasseAnn_Id: selectedEtdClasseAnn_Id,
        Vers_Montant: facturable.FactFichFact_Montant,
        VersRec_Id: facturable.VersRec_Id,
        Vers_Remarque: `Facturation manuelle ${this.getFormattedDate()}`, // Nouvelle propriété ajoutée
      };
      this.selectedFacturables.push(selectedFacturable);
    } else {
      // Retirer l'objet basé sur son FactFicheFact_Id
      this.selectedFacturables = this.selectedFacturables.filter((item) => item.FactFicheFact_Id !== facturable.FactFicheFact_Id);
    }
  }
  isFacturableSelected(facturableId: string): boolean {
    return this.selectedFacturables.some((f) => f.FactFicheFact_Id === facturableId);
  }
  Facturer(modal) {
    // let selectedEtudiantClasseAnnee = this.GridEtudiants?.selectedRows;
    this.loader.show();
    // Appel à ton service pour envoyer l'opération au backend
    this.EduosService.CreateFacturerEtudiant(this.selectedFacturables).subscribe(
      (response) => {
        console.log("response CreateFacturerEtudiant: ", response);
        this.loader.hide();
        if (response == null || response == false) {
          this.toastr.error("Erreur de facturation de l'élève.");
        } else {
          this.toastr.success("Facturation ajoutée avec succès");
          modal.close();
        }
      },
      (error) => {
        console.error("Erreur lors de l'ajout de la facturation : ", error);
        this.loader.hide();
        this.toastr.error("Erreur lors de l'ajout de la facturation");
      }
    );
  }
  CloseOperation(modal) {
    modal.close();
    this.selectedFacturables = [];
    this.FacturableByEtudiantClasseAnnee = [];
  }

  onRowSelectionVersementChanging(event: any) {
    let selectedVersements = event.newSelection;
  }

  // deleteVersement(ctx: any) {
  deleteVersement(vers_id: string) {
    // let Vers_IdToDelete = ctx.data.Vers_Id;
    let Vers_IdToDelete = vers_id;
    let versementToDelete = this.gridVersementsConfig.data.find(x => x.Vers_Id == vers_id)

    if (this.selectedVersementToDelete?.length == 0) {
      this.toastr.warning("Veuillez sélectionner un versement");
      return;
    }

    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Voulez-vous vraiment supprimer ce versement ? Cette action est irréversible.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        if (!this.gridOperationsConfig.data) {
          console.error("Operations is undefined");
          return;
        }

        if (this.gridOperationsConfig.data.length === 0) {
          this.loader.show();
          this.EduosService.DeleteVersement(Vers_IdToDelete).subscribe(
            (response) => {
              console.log("response DeleteVersement: ", response);
              this.loader.hide();
              if (response == null || response == false) {
                this.toastr.error("Erreur de suppression de versement");
              } else {

                this.gridVersementsConfig.data = this.gridVersementsConfig.data.filter((x) => x.Vers_Id !== Vers_IdToDelete);
                this.gridEtudiantsConfig.data = this.gridEtudiantsConfig.data.map((item) => {
                  if (item.EtdClasseAnn_Id === versementToDelete.EtdClasseAnn_Id) item.Versements = item.Versements.filter((x) => x.Vers_Id !== Vers_IdToDelete);
                  return item;
                });
                this.toastr.success("Versement supprimé avec succès");
              }
            },
            (error) => {
              console.error("Erreur lors de la suppression du versement : ", error);
              this.loader.hide();
              this.toastr.error("Erreur lors de la suppression du versement");
            }
          );
          return;
        }

        this.gridOperationsConfig.data.forEach((operation) => {
          if (!operation.Reglements || operation.Reglements.length === 0) {
            return;
          }

          const isVersIdInReglements = operation.Reglements.some((reglement) => reglement.Vers_Id === Vers_IdToDelete);

          if (!isVersIdInReglements) {
            this.EduosService.DeleteVersement(Vers_IdToDelete).subscribe(
              (response) => {
                console.log("response DeleteVersement: ", response);
                this.loader.hide();
                if (response == null || response == false) {
                  this.toastr.error("Erreur de suppression de versement");
                } else {
                  this.gridVersementsConfig.data = this.gridVersementsConfig.data.filter((x) => x.Vers_Id !== Vers_IdToDelete);
                  this.gridEtudiantsConfig.data = this.gridEtudiantsConfig.data.map((item) => {
                    if (item.EtdClasseAnn_Id === versementToDelete.EtdClasseAnn_Id) item.Versements = item.Versements.filter((x) => x.Vers_Id !== Vers_IdToDelete);
                    return item;
                  });
                  this.toastr.success("Versement supprimé avec succès");
                }
              },
              (error) => {
                console.error("Erreur DeleteVersement: ", error);
                this.loader.hide();
                this.toastr.error("Erreur lors de la suppression du versement");
              }
            );
          } else {
            this.toastr.error("Impossible de supprimer un versement associé à un règlement.");
          }
        });
      }
    });
  }



  //#region dialogReglements
  dialogReglements = {
    operation: null,
    reglements: [],
    Open: (ope_id: string, modal: any) => {
      this.dialogReglements.operation = this.gridOperationsConfig.data.find(x => x.Ope_Id == ope_id)
      console.log("operation: ", this.dialogReglements.operation)
      if (this.dialogReglements.operation != null) {
        this.dialogReglements.reglements = this.dialogReglements.operation.Reglements;
        console.log("this.dialogReglements.reglements: ", this.dialogReglements.reglements)
        this.openLg(modal);
      } else {
        this.toastr.error("Erreur d'affichage du détail de cette opération");
      }
    },
    Close: (modal) => {
      this.dialogReglements.operation = null;
      this.dialogReglements.reglements = [];
      modal.close();
    },
  }
  //#endregion dialogReglements



//#region dialogEditVersement
dialogEditVersement:{
  versement: any,
  Open: Function,
  Close: Function,
  EditVersement: Function,
} = {
  versement: null,
  Open: (Vers_Id: any, modal: any) => {
    const original = this.gridVersementsConfig.data.find(x => x.Vers_Id == Vers_Id);
    if (original) {
      this.dialogEditVersement.versement = { ...original }; // Copie de l'objet
      this.dialogEditVersement.versement.Vers_Dateprevu = this.formatDate(this.dialogEditVersement.versement.Vers_Dateprevu);
      this.openLg(modal);
    } else {
      this.toastr.error("Erreur d'affichage du détail de ce versement");
    }
  },
  Close: (modal) => {
    this.dialogEditVersement.versement = null;
    modal.close();
  },
  EditVersement: (modal) => {
    console.log("Edit Versement: ", this.dialogEditVersement.versement)
    if (this.dialogEditVersement.versement.Vers_Remise > this.dialogEditVersement.versement.Vers_Montant) {
      this.toastr.warning("La remise ne peut pas être supérieure au montant du versement");
      return
      
    }
    // this.dialogEditVersement.Close(modal);
    this.loader.show();
    this.EduosService.UpdateVersement(this.dialogEditVersement.versement).subscribe(
      (response) => {
        console.log("response UpdateVersement: ", response);
        this.loader.hide();
        if (response == null || response == false) {
          this.toastr.error("Erreur de modification du versement");
        } else {
          this.gridVersementsConfig.data = this.gridVersementsConfig.data.map((item) => {
            if (item.Vers_Id === this.dialogEditVersement.versement.Vers_Id) item = this.dialogEditVersement.versement;
            return item;
          });
          this.gridEtudiantsConfig.data = this.gridEtudiantsConfig.data.map((item) => {
            if (item.EtdClasseAnn_Id === this.dialogEditVersement.versement.EtdClasseAnn_Id) {
              item.Versements = item.Versements.map((vers) => {
                if (vers.Vers_Id === this.dialogEditVersement.versement.Vers_Id) vers = this.dialogEditVersement.versement;
                return vers;
              });
            }
            return item;
          });
          this.toastr.success("Versement modifié avec succès");
          modal.close();
        }
      },
      (error) => {
        console.error("Erreur UpdateVersement: ", error);
        this.loader.hide();
        this.toastr.error("Erreur lors de la modification du versement");
      }
    );
  }
}
private formatDate(date: string | null): string | null {
  return date ? formatDate(date, "yyyy-MM-dd", "en-US") : null;
}


Cen(){
  console.log("test")
}
//#endregion dialogEditVersement
 
}


