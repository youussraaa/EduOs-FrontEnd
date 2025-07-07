import { Component, OnInit, TemplateRef } from "@angular/core";
import { NgbModal, NgbModalConfig, NgbNavChangeEvent } from "@ng-bootstrap/ng-bootstrap";
import { EduosService } from "../../../shared/services/Eduos.service";
import { v4 as uuidv4 } from "uuid";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import Swal from "sweetalert2";
import { Observable } from "rxjs";
import { TableService } from "../../../shared/services/table.service";
import { environment } from "../../../../environments/environment";
import { AppService } from "../../../shared/services/app.service";
// import * as XLSX from "xlsx";

@Component({
  selector: "app-operation_old",
  templateUrl: "./operation_old.component.html",
  styleUrl: "./operation_old.component.scss",
})
export class Operation_oldComponent implements OnInit {
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

  Operations: any[] = [];
  Annees: any[] = [];
  TotalByModePaiement: any[] = [];
  selectedOperation: any;
  totalParModePaiement: { [key: string]: number } = {};

  // Méthode pour obtenir et formater la date actuelle
  getCurrentDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0"); // Ajoute un zéro si nécessaire
    const day = today.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`; // Format YYYY-MM-DD
  }

  ngOnInit() {
    this.searchParams.Ope_Date = new Date().toISOString().split("T")[0];
    this.searchParams.Ann_Id = "00000000-0000-0000-0000-000000000000";
    // setTimeout(() => {
    //   this.searchParams.Ann_Id = this.appService.currentAnnee?.Ann_Id;
    // }, 100);

    console.log("this.searchParams.Date: ", this.searchParams.Ope_Date);
    this.charger();

    this.loader.show();
    this.EduosService.GetAnnees().subscribe(
      (response) => {
        this.loader.hide();
        console.log("response GetAnnees ", response);
        if (response == null) {
          this.toastr.error("Erreur de GetAnnees");
        } else {
          this.Annees = response;
          console.log("Les Années récupéré : ", this.Annees);

          if (!environment.production) {
            this.searchParams.Ope_Date = "2024-11-14"
            setTimeout(() => {
              this.charger()
            }, 100);
          }
        }
      },
      (error) => {
        this.loader.hide();
        console.error("Erreur GetAnnees: ", error);
        this.toastr.error(error?.error, "Erreur de GetAnnees");
      }
    );
    // this.EduosService.GetTotalByModePaiement().subscribe(
    //   (response) => {
    //     this.loader.hide();
    //     console.log("response GetTotalByModePaiement ", response);
    //     if (response == null) {
    //       this.toastr.error("Erreur de GetTotalByModePaiement");
    //     } else {
    //       this.TotalByModePaiement = response;
    //       console.log("Le total by mode paiement récupéré : ", this.TotalByModePaiement);
    //     }
    //   },
    //   (error) => {
    //     this.loader.hide();
    //     console.error("Erreur GetTotalByModePaiement: ", error);
    //     this.toastr.error(error?.error, "Erreur de GetTotalByModePaiement");
    //   }
    // );
  }

  searchParams: { Ope_Date: any; Ann_Id: string;Etd_Nom:string;Etd_Prenom:string;Etd_Matricule:string | undefined | null } = {
    Ope_Date: null,
    Ann_Id: "",
    Etd_Nom:"",
    Etd_Prenom:"",
    Etd_Matricule:""
  };

  charger() {
    console.log("searchParams: ", this.searchParams);

    this.loader.show();
    this.EduosService.GetOperations(this.searchParams).subscribe(
      (response) => {
        this.loader.hide();
        console.log("response GetOperations charger", response);
        if (response == null) {
          this.toastr.error("Erreur de GetOperations");
        } else {
          this.Operations = response;
          // Regroupement et calcul des totaux
          this.totalParModePaiement = this.Operations.reduce((acc, operation) => {
            const modePaiement = operation.ModPai_Nom;
            const montant = operation.Ope_Montant;
            if (!acc[modePaiement]) {
              acc[modePaiement] = 0;
            }
            acc[modePaiement] += montant;
            return acc;
          }, {});

          // Affichage du résultat
          console.log("Total calculer par mode de paiement :  ", this.totalParModePaiement);
          console.log("Les operations récupéré charger : ", this.Operations);
        }
      },
      (error) => {
        this.loader.hide();
        console.error("Erreur GetOperations: ", error);
        this.toastr.error(error?.error, "Erreur de GetOperations");
      }
    );
  }
  openReglementModal(ReglementModal, operation) {
    this.selectedOperation = operation;
    console.log(this.selectedOperation);
    this.modalService.open(ReglementModal, { ariaLabelledBy: "modal-basic-title", size: "xl" });
  }
  genereRecu(id: string) {
    Swal.fire({
      title: "Voulez-vous générer le reçu?",
      showCancelButton: true,
      confirmButtonText: "Générer",
      confirmButtonColor: "rgba(var(--bs-info-rgb)",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        this.loader.show();
        this.EduosService.GetRecuPaiement(id).subscribe(
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

  FormattedOpeDate = this.searchParams.Ope_Date ? new Date(this.searchParams.Ope_Date).toISOString().split('T')[0] : 'unknown';

  fileName = `Operations_${this.FormattedOpeDate}.xlsx`


  exportExcel() {
    this.EduosService.ExportEtatCaisse(this.Operations);
  }
  // exportExcel() {
  //   // Formatage de la date
  //   let formattedOpeDate = '';
  //   if (this.searchParams.Ope_Date) {
  //     try {
  //       const date = new Date(this.searchParams.Ope_Date);
  //       if (!isNaN(date.getTime())) {
  //         formattedOpeDate = date.toISOString().split('T')[0];
  //       }
  //     } catch (error) {
  //       console.error("Erreur de formatage de la date :", error);
  //     }
  //   }

  //   // Générer le nom de fichier
  //   const fileName = `Operations_${formattedOpeDate}.xlsx`;

  //   // Sélectionner les données de la table
  //   const tableElement = document.getElementById("table-data");
  //   if (!tableElement) {
  //     console.error("Table not found!");
  //     return;
  //   }

  //   // Convertir la table HTML en un tableau de données
  //   const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(tableElement);

  //   // Supprimer la dernière colonne
  //   const range = XLSX.utils.decode_range(ws['!ref']!); // Obtenir la plage de la feuille
  //   for (let R = range.s.r; R <= range.e.r; R++) { // Parcourir chaque ligne
  //     const cellAddress = XLSX.utils.encode_cell({ r: R, c: range.e.c }); // Adresse de la dernière colonne
  //     delete ws[cellAddress]; // Supprimer la cellule
  //   }
  //   range.e.c--; // Réduire la plage pour exclure la dernière colonne
  //   ws['!ref'] = XLSX.utils.encode_range(range); // Mettre à jour la plage

  //   // Créer le classeur et ajouter la feuille
  //   const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  //   // Sauvegarder le fichier
  //   XLSX.writeFile(wb, fileName);
  // }




}
