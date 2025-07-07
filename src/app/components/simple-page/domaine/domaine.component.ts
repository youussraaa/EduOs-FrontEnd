import { Component, OnInit, TemplateRef } from "@angular/core";
import { NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { EduosService } from "../../../shared/services/Eduos.service";
import { v4 as uuidv4 } from "uuid";
import { Router } from "@angular/router";
import Swal from 'sweetalert2'
import { Title } from "@angular/platform-browser";

@Component({
  selector: "app-domaine",
  templateUrl: "./domaine.component.html",
  styleUrl: "./domaine.component.scss",
})
export class DomaineComponent implements OnInit {
  Domaines: any[] = [];
  // DomainesWithParent: any[] = [];

  selectedDomaine: any = {};
  selectedDomaineWithParent: any = {};

  selectedDomaineId: string = "";

  editModalContentGet: TemplateRef<any>;
  newDomaine: any = {
    Dom_Id: uuidv4(),
    Dom_Nom: null,
    Dom_Description: null,
    DomParent_Id: null, // Optionnel pour les sous-domaines
  };
  errorMessage: string = "";

  constructor(private router: Router, private EduosService: EduosService, config: NgbModalConfig, private modalService: NgbModal, private loader: NgxSpinnerService, private toastr: ToastrService,private title: Title) {
    config.backdrop = "static";
    config.keyboard = false;
    let ecole = localStorage.getItem("Ecole");
    if (ecole != null) this.title.setTitle(`Domaines - ${JSON.parse(ecole).Ecole_Nom}`);
  }

  ngOnInit(): void {
    this.loader.show();
    this.EduosService.GetDomaines()
      .subscribe((response) => {
        console.log("response GetDomaines ", response);
        this.loader.hide();

        if (response == null) {
          this.toastr.error("Erreur de récuperation des domaines")
        } else {
          this.Domaines = response;
        }
      },
        (error) => {
          console.error("Erreur GetDomaines: ", error);
          this.loader.hide();
          this.toastr.error(error?.error, "Erreur de GetDomaines");
        });
  }
  openAddModal(content: TemplateRef<any>) {
    this.modalService.open(content, { ariaLabelledBy: "dialogueAddEtudiant", size: "xl" });
  }
  openEditModalDomaine(content: TemplateRef<any>, domaine: any) {
    this.selectedDomaine = { ...domaine };
    this.selectedDomaineId = this.selectedDomaine.Dom_Id; // Assigner la valeur actuelle du sexe
    this.editModalContentGet = content;
    this.modalService.open(this.editModalContentGet, { ariaLabelledBy: "dialoguedomaineget", fullscreen: false, size: "xl" });
  }
  onSubmit() {
    this.newDomaine.DomParent_Id = this.selectedDomaineId;
    console.log(this.newDomaine);
    if (this.newDomaine.DomParent_Id == "") {
      this.newDomaine.DomParent_Id = null;
    }
    this.loader.show();
    this.EduosService.CreateDomaine(this.newDomaine)
      .subscribe((response) => {
        console.log("response CreateDomaine: ", response);
        this.loader.hide();
        if (response == null || response == false) {
          this.toastr.error("Erreur de création du domaine");
        } else {
          // Trouver le nom du domaine parent
          const parent = this.Domaines.find((d) => d.Dom_Id === this.newDomaine.DomParent_Id);
          this.newDomaine.DomParent_Nom = parent != null ? parent.Dom_Nom : null;
          this.Domaines.push({ ...this.newDomaine });
          this.toastr.success("Domaine ajouté avec succès");
          // Réinitialiser le formulaire
          this.resetAddNewDomaineForm();
        }
      },
        (error) => {
          console.error("Erreur CreateDomaine: ", error);
          this.loader.hide();
          this.toastr.error(error?.error, "Erreur de creation du domaine");
        });
  }
  addNewDomaine() {
    this.onSubmit();
    this.modalService.dismissAll();
  }
  editDomaine() {
    // Supprimer les champs non nécessaires avant la mise à jour
    delete this.selectedDomaine.ParentDomaine;
    delete this.selectedDomaine.DomParent_Nom;
    delete this.selectedDomaine.SousDomaines;

    const index = this.Domaines.findIndex((domaine) => domaine.Dom_Id === this.selectedDomaine.Dom_Id);

    this.selectedDomaine.DomParent_Id = this.selectedDomaine.DomParent_Id == '' ? null : this.selectedDomaine.DomParent_Id;

    if (index !== -1) {
      this.loader.show();
      this.EduosService.UpdateDomaine(this.Domaines[index].Dom_Id, this.selectedDomaine).subscribe(
        (response) => {
          console.log("response UpdateDomaine: ", response);
          this.loader.hide();
          if (response == null || response == false) {
            this.toastr.error("Erreur de modification du domaine");
          } else {
            // Mise à jour locale du domaine après modification
            const parent = this.Domaines.find((d) => d.Dom_Id === this.selectedDomaine.DomParent_Id);
            this.selectedDomaine.DomParent_Nom = parent ? parent.Dom_Nom : null;
            // Mettre à jour l'objet modifié dans la liste des domaines
            this.Domaines[index] = { ...this.selectedDomaine };
            this.toastr.success("Domaine modifié avec succès");
          }
        },
        (error) => {
          console.error("Erreur UpdateDomaine: ", error);
          this.loader.hide();
          this.toastr.error(error?.error, "Erreur de modification du domaine");
        }
      );
    }

    // Fermer la modal après modification
    this.modalService.dismissAll();
  }
  goToNiveau() {
    this.router.navigate(["/niveaux"])
  }

  deleteDomaine(index: number) {
    const domaineToDelete = this.Domaines[index];

    console.log("Id du domaineToDelete : ", domaineToDelete.Dom_Id);
    // this.loader.show();

    // // Appeler le service avec un tableau d'identifiants
    // this.EduosService.DeleteDomaine(domaineToDelete.Dom_Id).subscribe(
    //   (response) => {
    //     console.log("response DeleteDomaine: ", response);
    //     if ((response == null && response == false) || response == undefined) {
    //       this.loader.hide();
    //       this.toastr.error("Erreur de suppression du domaine");
    //     } else {
    //       this.toastr.success("Domaine supprimé avec succès");

    //       // Supprimer l'étudiant de la liste localement après une suppression réussie
    //       this.Domaines.splice(index, 1); // Retirer l'étudiant de la liste

    //       this.loader.hide();
    //     }
    //   },
    //   (error) => {
    //     console.error("Erreur DeleteDomaine: ", error);
    //     this.loader.hide();
    //     this.toastr.error(error?.error, "Erreur de suppression du domaine");
    //   }
    // );
    Swal.fire({
      title: "Voulez-vous supprimer le domaine ?",
      showCancelButton: true,
      confirmButtonText: "Supprimer",
      confirmButtonColor: "red",
      cancelButtonText: "Annuler"
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.loader.show()
        this.EduosService.DeleteDomaine(domaineToDelete.Dom_Id).subscribe(
          (response) => {
            console.log("response DeleteDomaine: ", response);
            if ((response == null || response == false) || response == undefined) {
              this.loader.hide();
              this.toastr.error("Erreur de suppression du domaine");
            } else {
              this.toastr.success("Domaine supprimé avec succès");

              // Supprimer l'étudiant de la liste localement après une suppression réussie
              this.Domaines.splice(index, 1); // Retirer l'étudiant de la liste

              this.loader.hide();
            }
          },
          (error) => {
            console.error("Erreur DeleteDomaine: ", error);
            this.loader.hide();
            this.toastr.error(error?.error, "Erreur de suppression du domaine");
          }
        );
      }
    });
  }
  // Réinitialiser le formulaire après création
  resetAddNewDomaineForm() {
    this.newDomaine = {
      Dom_Id: uuidv4(),
      Dom_Nom: "",
      Dom_Description: "",
      DomParent_Id: "",
    };
    this.selectedDomaineId = ""
  }
}
