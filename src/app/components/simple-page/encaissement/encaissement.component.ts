import { Component, HostListener, OnInit, } from "@angular/core";
import { NgbModal, NgbModalConfig, } from "@ng-bootstrap/ng-bootstrap";
import { EduosService } from "../../../shared/services/Eduos.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import Swal from "sweetalert2";
import { AppService } from "../../../shared/services/app.service";
import { Title } from "@angular/platform-browser";
import print from "print-js"
import { environment } from "../../../../environments/environment";

@Component({
  selector: "app-encaissement",
  templateUrl: "./encaissement.component.html",
  styleUrl: "./encaissement.component.scss",
})
export class EncaissementComponent implements OnInit {
  showSearchParams: boolean = true;
  EcoleId: string | null;
  CaisseId: string | null;
  CurrentCaisse: any;

  dockManagerConfig: { height: string | null } = { height: null };


  gridConfig: any = {
    GetVisibleColumns: () => { return this.gridConfig.columns.filter((col) => col.visible); },
    GetEnabledColumns: () => { return this.gridConfig.columns.filter((col) => !col.disableHiding); },
    title: "Encaissements",
    emptyTemplateText: "Aucun encaissement chargé",
    height: window.innerHeight - 350 + "px",
    rowHeight: "35px",
    transactions: [],
    primaryKey: "Ope_Id",
    batchEditing: true,
    rowEditable: true,
    allowFiltering: true,
    rowSelection: "multiple",
    cellSelection: "none",
    columnSelection: "none",
    data: [],
    columns: [
      { field: "Ope_Id", header: "Ope_Id", dataType: "string", visible: false, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: true, groupable: true, width: "", },
      { field: "Etd_Id", header: "Etd_Id", dataType: "string", visible: false, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: true, groupable: true, width: "", },

      { field: "Etd_Matricule", header: "Matricule", dataType: "string", visible: false, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },
      { field: "Etd_Nom", header: "Nom", dataType: "string", visible: true, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },
      { field: "Etd_Prenom", header: "Prénom", dataType: "string", visible: true, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },
      { field: "Sex_Nom", header: "Sexe", dataType: "string", visible: false, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },
      { field: "Etd_DateNaissance", header: "Date de naissance", dataType: "date", visible: true, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },
      { field: "Ope_NumRecu", header: "Numéro de recu", dataType: "string", visible: true, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },
      { field: "Ope_Montant", header: "Montant (FCFA)", dataType: "number", visible: true, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", isMontant: true, },
      { field: "Vers_NomList", header: "Versements", dataType: "string", visible: true, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },
      { field: "ModPai_Nom", header: "Mode de paiement", dataType: "string", visible: true, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },
      { field: "Ope_Date", header: "Date d'opération", dataType: "date", visible: true, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },
      { field: "Ann_Nom", header: "Année", dataType: "string", visible: false, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },
      { field: "Cls_Nom", header: "Classe", dataType: "string", visible: true, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },
      { field: "Ope_Description", header: "Description", dataType: "string", visible: true, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },
      { field: "Caisse_Nom", header: "Caisse", dataType: "string", visible: true, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },
    ],
    // ExportExcel: (args: IgxExporterEvent) => {
    //   if (this.gridConfig.data == null || this.gridConfig.data.length == 0) {
    //     this.toastr.info("Rien à exporter");
    //     return;
    //   }
    //   args.options.fileName = "Recouvrement";
    // },
  };
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

    let ecole = localStorage.getItem("Ecole");
    if (ecole != null) this.title.setTitle(`Encaissement - ${JSON.parse(ecole).Ecole_Nom}`);

    this.EcoleId = localStorage.getItem("EcoleId");
    this.CaisseId = localStorage.getItem("CaisseId");
    if (this.CaisseId == null || this.CaisseId == "") {
      Swal.fire("Vous n'avez pas de code caisse sur votre compte, veuillez contacter l'administrateur?")
    }
  }

  Operations: any[] = [];
  Annees: any[] = [];
  TotalByModePaiement: any[] = [];
  selectedOperation: any;
  totalParModePaiement: { [key: string]: number } = {};


  Enums: {
    Annees: any[];
    Caisses: any[],
  } = {
      Annees: [],
      Caisses: [],
    };

    Exporter(){
      this.EduosService.Exporter("Encaissement",this.gridConfig.GetVisibleColumns(),this.gridConfig.data)
    }
  getCurrentDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0"); // Ajoute un zéro si nécessaire
    const day = today.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`; // Format YYYY-MM-DD
  }

  ngOnInit() {
    // if (this.appService.currentAnnee != null)
    //   this.searchParams.Ann_Id = this.appService.currentAnnee.Ann_Id;
    if (this.appService.currentEcole != null)
      this.title.setTitle(`Encaissement - ${this.appService.currentEcole.Ecole_Nom}`);

    // this.appService.anneeEmitter.subscribe((item) => {
    //   this.searchParams.Ann_Id = item.Ann_Id;
    // });

    this.appService.ecoleEmitter.subscribe((item) => {
      this.title.setTitle(`Encaissement - ${item.Ecole_Nom}`);
    });

    this.searchParams.Ope_Date = new Date().toISOString().split("T")[0];

    setTimeout(() => {
      this.onWindowResize(null);
    }, 1000);

    this.GetData();

    this.loader.show();
    this.EduosService.GetAnnees()
      .subscribe(
        (response) => {
          this.loader.hide();
          console.log("response GetAnnees ", response);
          if (response == null) {
            this.toastr.error("Erreur de recupration des années");
          } else {
            this.Annees = response.sort((a, b) => b.Ann_Nom.localeCompare(a.Ann_Nom));;
            // if (!environment.production) {
            //   this.searchParams.Ope_Date = "2024-11-14";
            //   setTimeout(() => {
            //     this.GetData();
            //   }, 100);
            // }
          }
        },
        (error) => {
          this.loader.hide();
          console.error("Erreur GetAnnees: ", error);
          this.toastr.error(error?.error, "Erreur de recupration des années");
        });

    this.loader.show();
    this.EduosService.GetCommunData([
      `${environment.apiUrl}/api/Configuration/GetAnnees?Ecole_Id=${this.EcoleId}`,
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
        this.Enums.Caisses = response[1].sort((a, b) => {
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
    (window as any).encaissement = this;
  }

  searchParams: any = {
    Ope_Date: null,
    Ann_Id: "00000000-0000-0000-0000-000000000000",
    Etd_Nom: "",
    Etd_Prenom: "",
    Etd_Matricule: "",
  };

  GetData() {
    this.loader.show();
    this.searchParams.Caisse_Id = this.CaisseId;
    this.EduosService.GetOperations(this.searchParams).subscribe(
      (response) => {
        this.loader.hide();
        console.log("response GetOperations: ", response);
        if (response == null) {
          this.toastr.error("Erreur de récurération des opérations");
        } else if (response.length == 0) {
          this.toastr.info("Aucune opération trouvée");
        }
        else {
          this.Operations = response;
          this.gridConfig.data = this.Operations;
          // Regroupement et calcul des totaux
          this.totalParModePaiement = this.Operations.reduce((acc, operation) => {
            const modePaiement = operation.ModPai_Nom;
            const montant = operation.Ope_Montant;
            if (!acc[modePaiement]) acc[modePaiement] = 0;
            acc[modePaiement] += montant;
            return acc;
          }, {});
        }
        this.onWindowResize(null);
      },
      (error) => {
        this.loader.hide();
        console.error("Erreur GetOperations: ", error);
        this.toastr.error(error?.error, "Erreur de récurération des opérations");
      }
    );
  }

  openReglementModal(ReglementModal, ope_id) {
    let data = this.gridConfig.data.find((x) => x.Ope_Id == ope_id);
    this.selectedOperation = data;
    this.modalService.open(ReglementModal, { ariaLabelledBy: "modal-basic-title", size: "xl" });
  }
  genereRecu(ope_id: string) {
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
          }
        );
      }
    });
  }

  FormattedOpeDate = this.searchParams.Ope_Date ? new Date(this.searchParams.Ope_Date).toISOString().split("T")[0] : "unknown";

  fileName = `Operations_${this.FormattedOpeDate}.xlsx`;

  exportExcel() {
    this.EduosService.ExportEtatCaisse(this.Operations);
  }
  toggleSearchParams() {
    this.showSearchParams = !this.showSearchParams;
    this.onWindowResize(null);
  }

  @HostListener("window:resize", ["$event"])
  onWindowResize($event) {
    setTimeout(() => {
      let searchBarHeight = document.getElementById("searchBar")?.clientHeight;
      if (searchBarHeight == null || searchBarHeight == undefined || searchBarHeight == 0) {
        searchBarHeight = 0;
      } else {
        searchBarHeight += 30;
      }
      let dockManagerHeight = window.innerHeight - searchBarHeight - 250;
      this.dockManagerConfig.height = dockManagerHeight + "px";
      this.gridConfig.height = dockManagerHeight + "px";
    }, 100);
  }

}
