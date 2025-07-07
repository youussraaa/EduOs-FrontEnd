import { Component, HostListener, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { EduosService } from "../../../shared/services/Eduos.service";
import { v4 as uuidv4 } from "uuid";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { NgbActiveModal, NgbModal, ModalDismissReasons, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import { AppService } from "../../../shared/services/app.service";
import { formatDate } from "@angular/common";
import { IgcDockManagerLayout, IgcDockManagerPaneType, IgcSplitPaneOrientation } from "igniteui-dockmanager";
import { Fab } from "@syncfusion/ej2-buttons";
import { IgxExporterEvent, IgxGridComponent } from "igniteui-angular";
import { environment } from "../../../../environments/environment";

@Component({
  selector: "app-paiements",
  templateUrl: "./paiements.component.html",
  styleUrls: ["./paiements.component.scss"],
})
export class PaiementsComponent implements OnInit {
  showSearchParams: boolean = true;
  // selectedVersement: any;
  onFloatingButtonClick(): void {
    console.log("Bouton flottant cliqué !");
    this.showSearchParams = !this.showSearchParams;
    this.onWindowResize(event);
    // Ajoutez ici l'action que vous souhaitez exécuter
  }
  dockManagerConfig: { height: string | null } = { height: null };

  public layout: IgcDockManagerLayout = {
    rootPane: {
      type: IgcDockManagerPaneType.splitPane,
      orientation: IgcSplitPaneOrientation.horizontal,
      panes: [
        {
          type: IgcDockManagerPaneType.contentPane,
          contentId: "content1",
          header: "Etudiants",
          id: "517643f5",
          size: 100,
          allowClose: false,
          isPinned: true,
        },
        {
          type: IgcDockManagerPaneType.splitPane,
          orientation: IgcSplitPaneOrientation.vertical,
          size: 100,
          id: "3243419b",
          panes: [
            {
              type: IgcDockManagerPaneType.contentPane,
              contentId: "content2",
              header: "Versements",
              isPinned: true,
              id: "2c668497",
              allowClose: false,
            },
            {
              type: IgcDockManagerPaneType.contentPane,
              contentId: "content3",
              header: "Opérations",
              isPinned: true,
              id: "64d24770",
              allowClose: false,
            },
          ],
        },
      ],
    },
    floatingPanes: [],
  };

  @HostListener("window:resize", ["$event"])
  onWindowResize($event) {
    // console.log("onResize: ", $event);
    setTimeout(() => {
      let searchBarHeight = document.getElementById("searchBar")?.clientHeight;
      if (searchBarHeight == null || searchBarHeight == undefined || searchBarHeight == 0) {
        searchBarHeight = 0;
      } else {
        searchBarHeight += 25;
      }
      // searchBarHeight -= 20;
      // this.gridEtudiantsConfig.height = window.innerHeight - searchBarHeight - 230 + "px";
      let dockManagerHeight = window.innerHeight - searchBarHeight - 180;
      this.dockManagerConfig.height = dockManagerHeight + "px";
      // this.gridEtudiantsConfig.height = dockManagerHeight - 20 + "px";
      // console.log(searchBarHeight, window.innerHeight, this.dockManagerConfig.height);
    }, 100);
  }

  @ViewChild("GridEtudiants", { read: IgxGridComponent, static: false }) public GridEtudiants: IgxGridComponent;
  gridEtudiantsConfig: any = {
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
      {
        field: "Etd_Matricule",
        header: "Matricule",
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
        field: "Etd_NomComplet",
        header: "Elève",
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
        field: "Ann_Nom",
        header: "Année",
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
        field: "Niv_Nom",
        header: "Niveau",
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
        field: "Ann_Datedebut",
        header: "Date Début Année",
        dataType: "date",
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
        field: "Ann_Datefin",
        header: "Date Fin Année",
        dataType: "date",
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
        field: "Ann_Id",
        header: "ID Année",
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
        field: "ClasseAnn_Id",
        header: "ID Classe Année",
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
        field: "Cls_Id",
        header: "ID Classe",
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
        field: "EtdClasseAnn_Id",
        header: "ID Étudiant Classe Année",
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
        field: "Etd_Adresse",
        header: "Adresse Étudiant",
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
        field: "Etd_CIN",
        header: "CIN Étudiant",
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
        field: "Etd_DateNaissance",
        header: "Date Naissance Étudiant",
        dataType: "date",
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
        field: "Etd_LieuNaissance",
        header: "Lieu Naissance Étudiant",
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
        header: "Mail Étudiant",
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
        field: "Etd_Remarque",
        header: "Remarque Étudiant",
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
        header: "Téléphone Étudiant",
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
        field: "Niv_Id",
        header: "ID Niveau",
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
    ],

    ExportExcel: (args: IgxExporterEvent) => {
      if (this.gridEtudiantsConfig.data == null || this.gridEtudiantsConfig.data.length == 0) {
        this.toastr.info("Rien à exporter");
        return;
      }
      args.options.fileName = "Recouvrement";
    },
  };
  // selectedRowsDS: any[] = [];
  onRowSelectionChanging(event: any): void {
    let selectedRowsDS = event.newSelection;
    if (selectedRowsDS.length == 0) {
      this.gridVersementsConfig.data = [];
      this.gridOperationsConfig.data = [];
    } else {
      this.gridVersementsConfig.data = selectedRowsDS[0].Versements;
      this.gridOperationsConfig.data = selectedRowsDS[0].Operations;
    }

    this.GridVersements?.clearFilter();
    this.GridVersements?.clearSearch();
    this.GridVersements?.clearSort();
    this.GridVersements?.clearGrouping();
    this.GridVersements?.selectRows([], true);

    this.GridOperations?.clearFilter();
    this.GridOperations?.clearSearch();
    this.GridOperations?.clearSort();
    this.GridOperations?.clearGrouping();
    this.GridOperations?.selectRows([], true);
  }

  @ViewChild("GridVersements", { read: IgxGridComponent, static: false }) public GridVersements: IgxGridComponent;
  gridVersementsConfig: any = {
    data: [],
    height: "100%",
    rowHeight: "50px",
    allowFiltering: true,
    rowEditable: true,
    primaryKey: "Vers_Id",
    columns: [
      {
        field: "EtdClasseAnn_Id",
        header: "EtdClasseAnn_Id",
        dataType: "string",
        visible: false,
        sortable: true,
        resizable: true,
        filterable: true,
        editable: false,
        width: "",
      },
      {
        field: "Etd_NomComplet",
        header: "Eleve",
        dataType: "string",
        visible: true,
        sortable: true,
        resizable: true,
        filterable: true,
        editable: false,
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
        width: "",
      },
      {
        field: "Vers_Remise",
        header: "Remise",
        dataType: "number",
        visible: false,
        sortable: true,
        resizable: true,
        filterable: true,
        editable: false,
        width: "",
      },
      {
        field: "Vers_Dateprevu",
        header: "Date prévu",
        dataType: "date",
        visible: true,
        sortable: true,
        resizable: true,
        filterable: true,
        editable: false,
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
        width: "",
      },
      {
        field: "Vers_Estregle",
        header: "Réglé",
        dataType: "boolean",
        visible: true,
        sortable: true,
        resizable: true,
        filterable: true,
        editable: false,
        width: "",
      },
      {
        field: "FichFact_Nom",
        header: "Fiche Facturation",
        dataType: "string",
        visible: true,
        sortable: true,
        resizable: true,
        filterable: true,
        editable: false,
        width: "",
      },
      // Add more columns as needed
    ],
  };
  // selectedOperations: any;
  onRowSelectionOperationChanging(event: any): void {
    let selectedOperations = event.newSelection;

    this.GridVersements?.clearFilter();
    this.GridVersements?.clearSearch();
    this.GridVersements?.clearSort();
    this.GridVersements?.clearGrouping();
    this.GridVersements?.selectRows([], true);

    this.GridOperations?.clearFilter();
    this.GridOperations?.clearSearch();
    this.GridOperations?.clearSort();
    this.GridOperations?.clearGrouping();
    this.GridOperations?.selectRows([], true);
  }
  @ViewChild("GridOperations", { read: IgxGridComponent, static: false }) public GridOperations: IgxGridComponent;
  gridOperationsConfig: any = {
    data: [],
    height: "100%",
    rowHeight: "50px",
    allowFiltering: true,
    rowEditable: true,
    primaryKey: "Ope_Id",
    columns: [
      {
        field: "Ope_NumRecu",
        header: "Numéro Recu",
        dataType: "string",
        visible: true,
        sortable: true,
        resizable: true,
        filterable: true,
        editable: false,
        width: "",
      },
      {
        field: "Ope_Date",
        header: "Date d'opération",
        dataType: "date",
        visible: true,
        sortable: true,
        resizable: true,
        filterable: true,
        editable: false,
        width: "",
      },
      {
        field: "Ope_Montant",
        header: "Montant",
        dataType: "number",
        visible: true,
        sortable: true,
        resizable: true,
        filterable: true,
        editable: false,
        width: "",
      },
      {
        field: "ModPai_Nom",
        header: "Mode de paiement",
        dataType: "string",
        visible: true,
        sortable: true,
        resizable: true,
        filterable: true,
        editable: false,
        width: "",
      },
      {
        field: "Ope_Reference",
        header: "Référence",
        dataType: "string",
        visible: true,
        sortable: true,
        resizable: true,
        filterable: true,
        editable: false,
        width: "",
      },
      {
        field: "Ope_Description",
        header: "Description",
        dataType: "string",
        visible: true,
        sortable: true,
        resizable: true,
        filterable: true,
        editable: false,
        width: "",
      },
      // Add more columns as needed
    ],
  };

  EtudiantPaiement: any[] = [];
  FacturableByEtudiantClasseAnnee: any[] = [];
  filterEtudiantPaiement: any[] = [];
  filterParams = {
    global: "",
  };
  CurrentAnnee: any;

  OnFiltreChange(event, column: string) {
    setTimeout(() => {
      this.filterEtudiantPaiement = this.EtudiantByAnnee.filter(
        (x) =>
          x.Etd_Nom?.toLowerCase().includes(this.filterParams.global.toLowerCase()) ||
          x.Etd_Prenom?.toLowerCase().includes(this.filterParams.global.toLowerCase()) ||
          x.Etd_Matricule?.toLowerCase().includes(this.filterParams.global.toLowerCase()) ||
          x.Etd_Cin?.toLowerCase().includes(this.filterParams.global.toLowerCase())
      );

    }, 0);
  }

  levels = ["CP", "CM1", "CM2"]; // Sample levels
  classes = ["Class A", "Class B", "Class C"]; // Sample classes
  public history: boolean = false;

  ModePaiementList: any[] = [];
  TypeModeList = [
    { key: "ac1ee351-094a-4cf2-8ad8-12b4824781e0", libelle: "Cheque" },
    { key: "fd1286cd-c21f-4622-82d4-3ec1f3b5f5e9", libelle: "Virement" },
    { key: "f72d7650-0228-41c8-9fc6-5b9c5d4e75bc", libelle: "Autres" },
    { key: "ca49e3ed-9806-4a45-8b08-5f0b8524b1e3", libelle: "Mandat" },
    { key: "73f3a369-997d-4742-a96f-af2323909c35", libelle: "Espece" },
    { key: "38e7c309-a4d3-4c07-81eb-35f7426c9c1e", libelle: "Wave" },
    { key: "145fd835-99c5-4176-a9d8-3a469e2e1b73", libelle: "Orange Money" },
  ];

  EcoleId: string | null;
  selectedEtudiant: any = null;
  // selectedVersEtd: any[] = [];
  selectedOperation: any;
  EtudiantByAnnee: any;
  Niveaux: [] = [];
  Classes: [] = [];
  Annees: [] = [];

  selectedPayment: any = null;

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
    this.EcoleId = localStorage.getItem("EcoleId");
    //console.log('ecol', this.EcoleId);
  }
  searchParams: { Ann_Id?: any; Cls_Id?: any; Niv_Id?: any; Etd_Nom?: string; Etd_Prenom?: string; Etd_Matricule?: string } = {
    Niv_Id: "",
    Etd_Nom: "",
    Etd_Prenom: "",
    Etd_Matricule: "",
    Ann_Id: "",
    Cls_Id: "",
  };


  ngOnInit(): void {
    this.onWindowResize(null);

    (window as any).paiement = this;
    this.searchParams.Niv_Id = "00000000-0000-0000-0000-000000000000";
    // this.searchParams.Ann_Id="00000000-0000-0000-0000-000000000000";

    this.loader.show();
    this.appService.anneeEmitter.subscribe((annee) => {
      this.CurrentAnnee = this.appService.currentAnnee?.Ann_Id;
      this.appService.currentAnnee?.Ann_Id;
      this.searchParams.Ann_Id = this.appService.currentAnnee?.Ann_Id;
      console.log("Current Année : ", this.CurrentAnnee);
    });
    this.searchParams.Cls_Id = "00000000-0000-0000-0000-000000000000";
    this.GetAnnees();
    this.GetNiveau();
    this.GetClasses();
    // try {
    //   this.appService.anneeEmitter.unsubscribe();
    // } catch (e) {
    //   console.warn("Exception Unsubscribe", e);
    // }
    // this.appService.anneeEmitter.subscribe((item) => {
    //   console.log("Annee has changed: ", item);
    //   this.GetData();
    // });

    setTimeout(() => {
      this.loader.show();
      // if (this.appService.currentAnnee != null) this.GetData();
      this.EduosService.GetModePaiement().subscribe(
        (response) => {
          this.loader.hide();
          if (response == null) {
            this.toastr.error("Erreur de récupération du mode paiement");
          } else {
            console.log("récupération du mode paiement avec succès : ", response);
            this.ModePaiementList = response;
          }

          setTimeout(() => {
            if (environment.production == false) {
              this.searchParams.Niv_Id = "66339f59-ef93-411e-9dbf-d7ef8fe3e6f6";
              this.GetData();
            }

            // this.setIgxRessourceStrings()
          }, 100);
        },
        (error) => {
          console.error("Erreur lors de récupération du mode paiement : ", error);
          this.loader.hide();
          this.toastr.error("Erreur lors de récupération du mode paiement");
        }
      );
    }, 1000);

  }

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
  GetData(EtdClasseAnn_Id?: string) {
    // let params: any = { Ann_Id: this.appService.currentAnnee?.Ann_Id };

    if (
      (this.searchParams.Ann_Id === "00000000-0000-0000-0000-000000000000" || this.searchParams.Ann_Id == null || this.searchParams.Ann_Id === "") &&
      (this.searchParams.Cls_Id === "00000000-0000-0000-0000-000000000000" || this.searchParams.Cls_Id == null || this.searchParams.Cls_Id === "") &&
      (this.searchParams.Niv_Id === "00000000-0000-0000-0000-000000000000" || this.searchParams.Niv_Id == null || this.searchParams.Niv_Id === "") &&
      (this.searchParams.Etd_Matricule === "" || this.searchParams.Etd_Matricule == null) &&
      (this.searchParams.Etd_Nom === "" || this.searchParams.Etd_Nom == null) &&
      (this.searchParams.Etd_Prenom === "" || this.searchParams.Etd_Prenom == null)
    ) {
      this.toastr.warning("Select en moins un paramètre de recherche");
      console.log("les paramètres envoyé sont : ", this.searchParams);
      return;
    }
    console.log("searchParams: ", this.searchParams);

    let params: any = {
      Ann_Id: this.searchParams.Ann_Id,
      Niv_Id: this.searchParams.Niv_Id,
      Cls_Id: this.searchParams.Cls_Id,
      Etd_Matricule: this.searchParams.Etd_Matricule,
      Etd_Nom: this.searchParams.Etd_Nom,
      Etd_Prenom: this.searchParams.Etd_Prenom,
    };
    if (EtdClasseAnn_Id != null && EtdClasseAnn_Id != "") params.EtdClasseAnn_Id = EtdClasseAnn_Id;
    this.loader.show();
    // console.log("GetData for: ", this.appService.currentAnnee);
    this.EduosService.GetEtudiantClasseAnneePaiement(params).subscribe(
      (response: any) => {
        console.log("response GetEtudiantClasseAnneePaiement ", response);
        this.loader.hide();
        if (response == null) {
          this.toastr.error("Erreur de chargement des GetEtudiantClasseAnneePaiement");
        } else {
          if (EtdClasseAnn_Id == null || EtdClasseAnn_Id == "") {
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
            // console.log("grid data", this.gridEtudiantsConfig.data);
            // this.gridVersementsConfig.data = this.gridEtudiantsConfig.data
            //   .flatMap((item) => {
            //     // Vérifier si des versements existent
            //     return item.Versements.map((versement) => ({
            //       EtdClasseAnn_Id: item.EtdClasseAnn_Id,
            //       Etd_NomComplet: item.Etd_Nom + " " + item.Etd_Prenom,
            //       Ann_Nom: item.Ann_Nom,
            //       Niv_Nom: item.Niv_Nom,
            //       Cls_Nom: item.Cls_Nom,
            //       Vers_Id: versement.Vers_Id,
            //       Vers_Nom: versement.Vers_Nom,
            //       Vers_Montant: versement.Vers_Montant,
            //       Vers_Remise: versement.Vers_Remise,
            //       Vers_Dateprevu: versement.Vers_Dateprevu,
            //       Reliquat: versement.Reliquat,
            //       Vers_Estregle: versement.Vers_Estregle,
            //       FichFact_Nom: versement.FichFact_Nom,
            //     }));
            //   })
            //   .filter((versement) => versement.Vers_Montant > 0)
            //   .sort((a, b) => {
            //     if (a.Etd_NomComplet > b.Etd_NomComplet) return 1;
            //     if (a.Etd_NomComplet < b.Etd_NomComplet) return -1;
            //     if (a.Ann_Nom > b.Ann_Nom) return 1;
            //     if (a.Ann_Nom < b.Ann_Nom) return -1;
            //     if (a.Cls_Nom > b.Cls_Nom) return 1;
            //     if (a.Cls_Nom < b.Cls_Nom) return -1;
            //     return 0;
            //   });
            // this.gridOperationsConfig.data = this.gridEtudiantsConfig.data
            // .flatMap((item) => {
            //   // Vérifier si des versements existent
            //   return item.Operations.map((operation) => ({
            //     EtdClasseAnn_Id: item.EtdClasseAnn_Id,
            //     Etd_NomComplet: item.Etd_Nom + " " + item.Etd_Prenom,
            //     Ann_Nom: item.Ann_Nom,
            //     Niv_Nom: item.Niv_Nom,
            //     Cls_Nom: item.Cls_Nom,
            //     ModPai_Nom: operation.ModPai_Nom,
            //     ModePai_Id: operation.ModePai_Id,
            //     Ope_Id: operation.Ope_Id,
            //     Ope_Date: operation.Ope_Date,
            //     Ope_Description: operation.Ope_Description,
            //     Ope_Montant: operation.Ope_Montant,
            //     Ope_NumRecu: operation.Ope_NumRecu,
            //     Ope_RefComptable: operation.Ope_RefComptable,
            //   }));
            // })
            // .filter((operation) => operation.Vers_Montant > 0) // Filtrer les versements valides (montant > 0)
            // .sort((a, b) => {
            //   // Tri des versements par Nom complet, puis année et classe
            //   if (a.Etd_NomComplet > b.Etd_NomComplet) return 1;
            //   if (a.Etd_NomComplet < b.Etd_NomComplet) return -1;
            //   if (a.Ann_Nom > b.Ann_Nom) return 1;
            //   if (a.Ann_Nom < b.Ann_Nom) return -1;
            //   if (a.Cls_Nom > b.Cls_Nom) return 1;
            //   if (a.Cls_Nom < b.Cls_Nom) return -1;
            //   return 0;
            // });
            // console.log("Operations Config Data:", this.gridOperationsConfig.data);
            // this.EtudiantByAnnee = response;
            // this.filterEtudiantPaiement = this.EtudiantByAnnee;
            this.showSearchParams = false;
            this.onWindowResize(null);
          }
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

  selectedOperations;
  selectedRowsDS;
  deleteOperation(ctx: any) {
    console.log(ctx);
    Swal.fire({
      title: "Voulez-vous supprimer l'opération?",
      showCancelButton: true,
      confirmButtonText: "Supprimer",
      confirmButtonColor: "red",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        this.loader.show();
        this.EduosService.DeleteOperation(ctx.data.Ope_Id).subscribe(
          (response) => {
            console.log("Opération supprimer avec succès : ", response);
            this.loader.hide();
            this.toastr.success("Opération supprimée avec succès");

            // this.selectedEtudiant.Operations = this.selectedEtudiant?.Operations.filter((x) => x.Ope_Id !== id);
            this.gridOperationsConfig.data = this.gridOperationsConfig.data.filter((x) => x.Ope_Id !== ctx.data.Ope_Id);
            this.gridEtudiantsConfig.data = this.gridEtudiantsConfig.data.map((item) => {
              if (item.EtdClasseAnn_Id === ctx.data.EtdClasseAnn_Id) item.Operations = item.Operations.filter((x) => x.Ope_Id !== ctx.data.Ope_Id);
              return item;
            });

            // this.selectedPayment.Reliquat = this.getResteMontant();
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
  detailOperation(ctx: any, content) {
    console.log(ctx);
    this.selectedOperation = ctx.data;
    console.log(this.selectedOperation);
    this.openLg(content);
  }

  showHistory() {
    this.history = !this.history;
  }

  // selectEtudiant(student: any) {
  //   if (this.selectedEtudiant != null && this.selectedEtudiant.EtdClasseAnn_Id == student.EtdClasseAnn_Id) this.selectedEtudiant = null;
  //   else {
  //     this.selectedEtudiant = student;
  //     console.log(this.selectedEtudiant);
  //     // Réinitialiser selectedVersEtd pour chaque étudiant sélectionné
  //     this.selectedVersEtd = [];
  //   }
  // }

  // selectVersEtd(vers: any) {
  //   const isAlreadySelected = this.selectedVersEtd.some((v) => v.Vers_Id === vers.Vers_Id);

  //   if (!isAlreadySelected) {
  //     // Ajouter le versement si non sélectionné
  //     this.selectedVersEtd.push(vers);
  //   } else {
  //     // Supprimer le versement si déjà sélectionné
  //     this.selectedVersEtd = this.selectedVersEtd.filter((v) => v.Vers_Id !== vers.Vers_Id);
  //   }

  //   console.log("Selected versements:", this.selectedVersEtd);
  // }

  genereRecu(ctx: any) {
    Swal.fire({
      title: "Voulez-vous générer le reçu?",
      showCancelButton: true,
      confirmButtonText: "Générer",
      confirmButtonColor: "rgba(var(--bs-info-rgb)",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        this.loader.show();
        this.EduosService.GetRecuPaiement(ctx.data.Ope_Id).subscribe(
          (response) => {
            console.log("Reçu généré avec succès : ", response);

            if (response == null) {
              this.toastr.error("Erreur de récupération des documents.");
              this.loader.hide();
              return;
            } else {
              let blob = new Blob([response], { type: "application/pdf" });
              let fileToDownload = window.URL.createObjectURL(blob);
              var PDF_link = document.createElement("a");
              PDF_link.href = fileToDownload;
              PDF_link.download = "RecuPaiement";
              PDF_link.click();
              this.toastr.success("Reçu généré avec succès");
              this.loader.hide();
            }
          },
          (error) => {
            console.error("Erreur de génération du reçu : ", error);
            this.loader.hide();
            this.toastr.error("Erreur de génération du reçu");
          }
        );
      }
    });
  }

  openLg(content) {
    this.modalService.open(content, { size: "xl" });
  }

  // reglerPaiementAdd(content) {
  //   let selectedRows = this.GridVersements?.selectedRows;
  //   let selectedRowsDS = this.gridVersementsConfig.data.filter((item) => selectedRows?.includes(item.Vers_Id));

  //   if (!selectedRowsDS || selectedRowsDS.length === 0) {
  //     this.toastr.warning("Veuillez sélectionner au moins un versement");
  //     return;
  //   }

  //   // Check if any selected row has a Reliquat of 0
  //   let hasZeroReliquat = selectedRowsDS.find((x) => x.Reliquat === 0) != null;
  //   // const hasZeroReliquat = selectedRowsDS.some((vers) => vers.Reliquat === 0);

  //   if (hasZeroReliquat) {
  //     this.toastr.warning("Un versement contient un reliquat à zéro");
  //     return;
  //   }

  //   // If there are selected rows, prepare the new operation
  //   if (selectedRowsDS && selectedRowsDS.length > 0) {
  //     this.newOperation.EtdClasseAnn_Id = selectedRowsDS[0].EtdClasseAnn_Id; // Link the operation to the selected payment ID
  //     this.newOperation.Ope_Montant = selectedRowsDS.reduce((total, vers) => total + vers.Vers_Montant, 0);
  //     this.newOperation.Ope_Date = new Date().toISOString().split("T")[0]; // Format YYYY-MM-DD
  //   }
  //   this.newOperation.Vers_List = selectedRowsDS;
  //   this.openLg(content);
  // }

  // newOperation: any = {
  //   Ope_Id: uuidv4(),
  //   Vers_Id: null,
  //   ModePai_Id: null,
  //   Ope_Montant: null,
  //   Ope_Reference: null,
  //   Ope_Date: null,
  //   Ope_RefComptable: null,
  //   Ope_NumRecu: null,
  //   Ope_Description: null,
  //   Vers_List: ([] = []),
  // };

  dialogReglement: any = {
    newOperation: null,
    selectedVersementsDS: [],
    modal: null,
    Open: (content) => {
      this.dialogReglement.modal = content;
      let selectedRows = this.GridVersements?.selectedRows;
      this.dialogReglement.selectedVersementsDS = this.gridVersementsConfig.data.filter((item) => selectedRows?.includes(item.Vers_Id));

      if (!this.dialogReglement.selectedVersementsDS || this.dialogReglement.selectedVersementsDS.length === 0) {
        this.toastr.warning("Veuillez sélectionner au moins un versement");
        return;
      }

      // Check if any selected row has a Reliquat of 0
      let hasZeroReliquat = this.dialogReglement.selectedVersementsDS.find((x) => x.Reliquat === 0) != null;
      // const hasZeroReliquat = this.dialogReglement.selectedVersementsDS.some((vers) => vers.Reliquat === 0);

      if (hasZeroReliquat) {
        this.toastr.warning("Un versement contient un reliquat à zéro");
        return;
      }

      // If there are selected rows, prepare the new operation
      if (this.dialogReglement.selectedVersementsDS && this.dialogReglement.selectedVersementsDS.length > 0) {
        this.dialogReglement.newOperation = {
          Ope_Id: uuidv4(),
          EtdClasseAnn_Id: this.dialogReglement.selectedVersementsDS[0].EtdClasseAnn_Id,
          Ope_Montant: this.dialogReglement.selectedVersementsDS.reduce((total, vers) => total + vers.Vers_Montant, 0),
          Ope_Date: new Date().toISOString().split("T")[0],
          Vers_Id: null,
          ModePai_Id: null,
          Ope_Reference: null,
          Ope_RefComptable: null,
          Ope_NumRecu: null,
          Ope_Description: null,
          Vers_List: [],
        };

        // this.dialogReglement.newOperation.EtdClasseAnn_Id = this.dialogReglement.selectedVersementsDS[0].EtdClasseAnn_Id; // Link the operation to the selected payment ID
        // this.dialogReglement.newOperation.Ope_Montant = this.dialogReglement.selectedVersementsDS.reduce((total, vers) => total + vers.Vers_Montant, 0);
        // this.dialogReglement.newOperation.Ope_Date = new Date().toISOString().split("T")[0]; // Format YYYY-MM-DD
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
      this.selectedFacturables = [];
      this.dialogReglement.Clear();
    },
    Submit: (modal) => {
      // this.selectedVersementToDelete = this.selectedRowsDS;
      // console.log(this.selectedVersementToDelete);
      // return;
      if (this.dialogReglement.selectedVersementsDS && this.dialogReglement.selectedVersementsDS.length > 0) {
        // Créer la liste des règlements
        this.dialogReglement.newOperation.Vers_List = this.dialogReglement.selectedVersementsDS.map((vers) => ({
          Regl_Id: uuidv4(),
          Ope_Id: this.dialogReglement.newOperation.Ope_Id,
          Vers_Id: vers.Vers_Id,
          Regl_Montant: vers.Vers_Montant,
          Regl_Remarque: this.dialogReglement.newOperation.Ope_Description,
        }));

        console.log(this.dialogReglement.newOperation);
        this.loader.show();
        // Appel à ton service pour envoyer l'opération au backend
        this.EduosService.CreateOperation(this.dialogReglement.newOperation).subscribe(
          (response) => {
            this.loader.hide();
            if (response == null || response == false) {
              this.toastr.error("Erreur de création de l'operation");
            } else {
              console.log("Opération ajoutée avec succès : ", response);
              // this.loader.hide();
              this.toastr.success("Opération ajoutée avec succès");
              // Créer une copie de l'opération ajoutée et s'assurer que tous les champs sont correctement assignés

              // this.GetData(this.selectedVersementToDelete[0].EtdClasseAnn_Id);

              this.genereRecu(this.dialogReglement.newOperation.Ope_Id);

              modal.close();
              this.dialogReglement.Close();
            }
          },
          (error) => {
            console.error("Erreur lors de l'ajout de l'opération : ", error);
            this.loader.hide();
            this.toastr.error("Erreur lors de l'ajout de l'opération");
          }
        );
      } else {
        // !!!!!!!!!!!!!!!!!!!!!!!
      }
    },
  };

  facturerPaiement(content) {
    let selectedEtudiantClasseAnnee = this.GridEtudiants?.selectedRows;
    if (selectedEtudiantClasseAnnee?.length == 0) {
      this.toastr.warning("Veuillez sélectionner un étudiant");
      return;
    } else {
      let EtdClasseAnn_Id_AFacturer = selectedEtudiantClasseAnnee != null ? selectedEtudiantClasseAnnee[0] : null;
      this.loader.show();
      this.EduosService.GetFacturableByEtudiantClasseAnnee(EtdClasseAnn_Id_AFacturer).subscribe(
        (response) => {
          console.log("response GetFacturableByEtudiantClasseAnnee: ", response);
          this.loader.hide();
          if (response == null) {
            this.toastr.error("Erreur de récupération des facturable de l'élève");
          } else {
            this.FacturableByEtudiantClasseAnnee = response;
            console.log(this.FacturableByEtudiantClasseAnnee);
          }
        },
        (error) => {
          console.error("Erreur GetFacturableByEtudiantClasseAnnee: ", error);
          this.loader.hide();
          this.toastr.error("Erreur lors de récupération des facturable de l'élève");
        }
      );
      this.openLg(content);
    }
  }
  // Liste des objets sélectionnés
  selectedFacturables: any[] = [];
  getFormattedDate(): string {
    const currentDate = new Date();
    return formatDate(currentDate, "dd/MM/yyyy", "en-US"); // Format dd/MM/YYYY
  }
  // Méthode appelée lors du changement d'état de la checkbox
  onCheckboxChange(event: any, facturable: any) {
    let selectedEtudiantClasseAnnee = this.GridEtudiants?.selectedRows;
    console.log("selectedEtudiantClasseAnnee: ", selectedEtudiantClasseAnnee);

    // Passez l'objet complet au lieu de seulement l'ID
    console.log(selectedEtudiantClasseAnnee);
    if (event.target.checked) {
      // Créer un objet avec les propriétés souhaitées
      const selectedFacturable = {
        FactFicheFact_Id: facturable.FactFicheFact_Id,
        EtdClasseAnn_Id: selectedEtudiantClasseAnnee[0], // Assurez-vous que cette propriété existe dans votre objet
        Vers_Montant: facturable.FactFichFact_Montant,
        VersRec_Id: facturable.VersRec_Id,
        Vers_Remarque: `Facturation manuelle ${this.getFormattedDate()}`, // Nouvelle propriété ajoutée
      };
      this.selectedFacturables.push(selectedFacturable); // Ajouter l'objet à la liste
    } else {
      // Retirer l'objet basé sur son FactFicheFact_Id
      this.selectedFacturables = this.selectedFacturables.filter((item) => item.FactFicheFact_Id !== facturable.FactFicheFact_Id);
    }
    console.log("La liste sélectionnée :", this.selectedFacturables); // Affiche la liste actuelle des objets sélectionnés
  }
  isFacturableSelected(facturableId: string): boolean {
    return this.selectedFacturables.some((f) => f.FactFicheFact_Id === facturableId);
  }

  Facturer(modal) {
    let selectedEtudiantClasseAnnee = this.GridEtudiants?.selectedRows;

    console.log("Facturer : ", this.selectedFacturables);
    this.loader.show();
    // Appel à ton service pour envoyer l'opération au backend
    this.EduosService.CreateFacturerEtudiant(this.selectedFacturables).subscribe(
      (response) => {
        this.loader.hide();
        if (response == null || response == false) {
          this.toastr.error("Erreur de création de facturation ");
        } else {
          console.log("Facturation ajoutée avec succès : ", response);
          // this.GetData(selectedEtudiantClasseAnnee[0]);
          this.toastr.success("Facturation ajoutée avec succès");

          modal.close(); // Fermer la modal après l'ajout
        }
      },
      (error) => {
        console.error("Erreur lors de l'ajout de la facturation : ", error);
        this.loader.hide();
        this.toastr.error("Erreur lors de l'ajout de la facturation");
      }
    );
  }

  onRowSelectionVersementChanging(event: any) {
    let selectedVersements = event.newSelection;
    console.log("Row Versement selection changing: ", event.newSelection);
  }

  deleteVersement(ctx: any) {
    console.log("ctx: ", ctx);
    let Vers_IdToDelete = ctx.data.Vers_Id;

    if (this.selectedVersementToDelete?.length == 0) {
      this.toastr.warning("Veuillez sélectionner un versement");
      return;
    }

    // Afficher une boîte de dialogue de confirmation avec Swal
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
              this.loader.hide();
              if (response == null || response == false) {
                this.toastr.error("Erreur de suppression de versement");
              } else {
                console.log("Versement supprimé avec succès : ", response);

                this.gridVersementsConfig.data = this.gridVersementsConfig.data.filter((x) => x.Vers_Id !== Vers_IdToDelete);
                this.gridEtudiantsConfig.data = this.gridEtudiantsConfig.data.map((item) => {
                  if (item.EtdClasseAnn_Id === ctx.data.EtdClasseAnn_Id) item.Versements = item.Versements.filter((x) => x.Vers_Id !== Vers_IdToDelete);
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
            console.log("Opération n'a aucun réglement");
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
                    if (item.EtdClasseAnn_Id === ctx.data.EtdClasseAnn_Id) item.Versements = item.Versements.filter((x) => x.Vers_Id !== Vers_IdToDelete);
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
}
