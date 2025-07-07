import { ChangeDetectionStrategy, Component, HostListener, OnInit } from "@angular/core";
import { NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import { EduosService } from "../../../shared/services/Eduos.service";
import { v4 as uuidv4 } from "uuid";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import Swal from 'sweetalert2'
import { Title } from "@angular/platform-browser";
interface Facturable {
  Fact_Id: string;
  Ecole_Id: string;
  Fact_Nom: any;
  Fact_Code: any;
  Fact_Description: any;
  Fact_EstRefacturable:boolean;
  isEditing?: boolean;
}

@Component({
  selector: "app-facturables",
  templateUrl: "./facturables.component.html",
  styleUrls: ["./facturables.component.scss"],
})
export class FacturablesComponent implements OnInit {
  @HostListener("window:resize", ["$event"])
  onWindowResize(event?: Event) {
    const card = document.getElementById("infoCard"); // Récupérer l'élément
  
    if (card) {
      const newHeight = window.innerHeight - 350 + "px"; // Calcul de la hauteur
  
      (card as HTMLElement).style.height = newHeight; // Appliquer la hauteur
      
      console.log("Nouvelle hauteur de la carte :", newHeight);
    }
  }
  ecole:any
  
  constructor(config: NgbModalConfig, private modalService: NgbModal, private EduosService: EduosService, private loader: NgxSpinnerService, private toastr: ToastrService, private router: Router,private title: Title) {
    config.backdrop = "static";
    config.keyboard = false;
    this.ecole = localStorage.getItem("Ecole");
    console.log("ecole: ", this.ecole);
    if (this.ecole != null) this.title.setTitle(`Facturables - ${JSON.parse(this.ecole).Ecole_Nom}`);
  }
  facturables: Facturable[] = [];
  newFacturable: Facturable = { Fact_Id: uuidv4(), Ecole_Id: null, Fact_Nom: null, Fact_Code: null, Fact_Description: null ,Fact_EstRefacturable:false };
  currentFacturableIndex: number | null = null;
  Facturables: any[] = [];
  
  ngOnInit(): void {
    this.onWindowResize()
    this.loader.show();

    this.EduosService.GetFacturable()
      .subscribe((response) => {
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

  // Open the modal for adding or editing a facturable
  openFacturableModal(index: number | null, content: any): void {
    if (index !== null && index !== undefined) {
      // Editing an existing facturable
      this.newFacturable = { ...this.Facturables[index] }; // Clone the facturable data
      console.log("Facturable to edit: ", this.newFacturable);
      this.currentFacturableIndex = index;
    } else {
      // Adding a new facturable
      this.newFacturable = { Fact_Id: uuidv4(), Ecole_Id: JSON.parse(this.ecole).Ecole_Id, Fact_Nom: "", Fact_Code: "", Fact_Description: "" ,Fact_EstRefacturable:false}; // Reset the form
      this.currentFacturableIndex = null;
    }
    this.modalService.open(content, { ariaLabelledBy: "modal-basic-title" });
  }

  saveFacturable(facturableIndex: number | null, modal: any): void {
    if (facturableIndex !== null && facturableIndex !== undefined) {
      // Modify the existing facturable
      this.loader.show();
      this.EduosService.UpdateFacturable(this.Facturables[facturableIndex].Fact_Id, { ...this.newFacturable }).subscribe(
        (response) => {
          console.log("response UpdateFacturable: ", response);
          this.loader.show();
          if (response == null || response === false) {
            this.loader.hide();
            this.toastr.error("Erreur de modification du facturable");
          } else {
            this.toastr.success("Facturable modifié avec succès");
            console.log("Facturable modifié : ", this.newFacturable);

            this.loader.hide();
            this.Facturables[facturableIndex] = { ...this.newFacturable };
            modal.close();
          }
        },
        (error) => {
          console.error("Erreur UpdateFacturable: ", error);
          this.loader.hide();
          this.toastr.error(error?.error, "Erreur de modification du facturable");
        }
      );
    } else {
      this.loader.show();
      this.EduosService.CreateFacturable({ ...this.newFacturable }).subscribe(
        (response) => {
          console.log("response CreateFacturable: ", response);
          this.loader.hide();
          if (response == null || response == false) {
            this.toastr.error("Erreur de création du facturable");
          } else {
            this.toastr.success("Facturable ajouté avec succès");
            this.Facturables.push(this.newFacturable);
            // Reset the modal form
            this.newFacturable = { Fact_Id: uuidv4(), Ecole_Id: JSON.parse(this.ecole).Ecole_Id, Fact_Nom: "", Fact_Code: "", Fact_Description: "",Fact_EstRefacturable:false }; // Reset the form
            this.currentFacturableIndex = null;
            modal.close();
          }
        },
        (error) => {
          console.error("Erreur CreateFacturable: ", error);
          this.loader.hide();
          this.toastr.error(error?.error, "Erreur de création du facturable");
        }
      );
    }
  }

  // Remove a facturable
  removeFacturable(index: number): void {
    Swal.fire({
      title: "Voulez-vous supprimer le facturable ?",
      showCancelButton: true,
      confirmButtonText: "Supprimer",
      confirmButtonColor: "red",
      cancelButtonText: "Annuler"
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.loader.show()
        this.EduosService.DeleteFacturable(this.Facturables[index].Fact_Id).subscribe(
          (response) => {
            console.log("response DeleteFacturable: ", response);
            this.loader.hide();
            if (response == null || response == false) {
              this.toastr.error("Erreur de suppression du facturable");
            } else {
              this.toastr.success("Facturable supprimé avec succès");
              this.Facturables.splice(index, 1);
            }
          },
          (error) => {
            console.error("Erreur DeleteFacturable: ", error);
            this.loader.hide();
            this.toastr.error(error?.error, "Erreur de suppression du facturable");
          }
        );
      }
    });
    // this.loader.show();
    // this.EduosService.DeleteFacturable(this.Facturables[index].Fact_Id).subscribe(
    //   (response) => {
    //     console.log("response DeleteFacturable: ", response);
    //     this.loader.hide();
    //     if (response == null || response == false) {
    //       this.toastr.error("Erreur de suppression du facturable");
    //     } else {
    //       this.toastr.success("Facturable supprimé avec succès");
    //       this.Facturables.splice(index, 1);
    //     }
    //   },
    //   (error) => {
    //     console.error("Erreur DeleteFacturable: ", error);
    //     this.loader.hide();
    //     this.toastr.error(error?.error, "Erreur de suppression du facturable");
    //   }
    // );
    //this.Facturables.splice(index, 1);
  }
}
