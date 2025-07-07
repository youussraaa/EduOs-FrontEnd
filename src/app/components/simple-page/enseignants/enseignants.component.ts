import { Component, OnInit, TemplateRef } from "@angular/core";
import { NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { EduosService } from "../../../shared/services/Eduos.service";
import { v4 as uuidv4 } from "uuid";
import Swal from "sweetalert2";
import { Title } from "@angular/platform-browser";

interface Teacher {
  nom: string;
  prenom: string;
  dateNaissance: string;
  lieuNaissance: string;
  adresse: string;
  cin: string;
  tel: string;
  dateRecrutement: string;
  photo: string;
}

@Component({
  selector: "app-enseignants",
  templateUrl: "./enseignants.component.html",
  styleUrls: ["./enseignants.component.scss"],
})
export class EnseignantsComponent implements OnInit {
  selectedTypeSexe: any = null;
  Enseignants: any[] = [];
  selectedEnseignant: any = {};
  editModalContentGet: TemplateRef<any>;

  TypeSexeList = [
    { key: "d2821b37-77e9-4b20-b67e-5995adbd825e", libelle: "Masculin" },
    { key: "5cbda9a3-22a9-49f1-873d-5fb23e0d1156", libelle: "Feminin" },
    { key: "e603dabf-4159-4e0b-bef4-c8339da8c5cc", libelle: "Undefined" },
  ];
  newEnseignant: any = {
    Ens_Id: uuidv4(),
    // Ecole_Id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    Sex_Id: null,
    Ens_Nom: null,
    Ens_Prenom: null,
    Ens_Photo: null,
    Ens_DateNaissance: null,
    Ens_LieuNaissance: null,
    Ens_CIN: null,
    Ens_Tel: null,
    Ens_Adresse: null,
    Ens_DateRecrutement: null,
  };
  onSubmit() {
    this.newEnseignant.Sex_Id = this.selectedTypeSexe;
    console.log(this.newEnseignant);
    this.loader.show();

    this.EduosService.CreateEnseignant(this.newEnseignant).subscribe(
      (response) => {
        console.log("response CreateEnseignant: ", response);
        this.loader.hide();
        if (response == null || response == false) {
          this.toastr.error("Erreur de création de l'enseignant");
        } else {
          this.toastr.success("Enseignant ajouté avec succès");
          // console.log(this.newEnseignant);
          this.Enseignants.push({ ...this.newEnseignant });

          this.resetAddNewEnseignantForm();
        }
      },
      (error) => {
        console.error("Erreur CreateEnseignant: ", error);
        this.loader.hide();
        this.toastr.error(error?.error, "Erreur de creation du l'enseignant");
      }
    );
  }
  resetAddNewEnseignantForm() {
    this.newEnseignant = {
      Ens_Id: uuidv4(),
      // Ecole_Id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      Sex_Id: "",
      Ens_Nom: "",
      Ens_Prenom: "",
      Ens_Photo: "",
      Ens_DateNaissance: "",
      Ens_LieuNaissance: "",
      Ens_CIN: "",
      Ens_Tel: "",
      Ens_Adresse: "",
      Ens_DateRecrutement: "",
    };
  }
  addNewEnseignant() {
    this.onSubmit();
    this.modalService.dismissAll();
  }
  openAddModal(content: TemplateRef<any>) {
    this.modalService.open(content, { ariaLabelledBy: "dialogueAddEtudiant", size: "xl" });
  }
  openEditModalEnseignant(content: TemplateRef<any>, enseignant: any) {
    this.selectedEnseignant = { ...enseignant };
    this.selectedTypeSexe = this.selectedEnseignant.Sex_Id; // Assigner la valeur actuelle du sexe
    this.editModalContentGet = content;
    this.modalService.open(this.editModalContentGet, { ariaLabelledBy: "dialogueenseignantget", fullscreen: false, size: "xl" });
  }
  editEnseignant() {
    // Supprimer la propriété 'EtudiantClasseAnnees' de l'objet 'selectedEtudiant'
    this.selectedEnseignant.Sex_Id = this.selectedTypeSexe;

    // Trouver l'index de l'enseignant sélectionné dans la liste `Enseignants`
    const index = this.Enseignants.findIndex((enseignant) => enseignant.Ens_Id === this.selectedEnseignant.Ens_Id);

    console.log("Enseignant à modifier : ", index);

    if (index !== -1) {
      this.loader.show();
      this.EduosService.UpdateEnseignant(this.Enseignants[index].Ens_Id, this.selectedEnseignant).subscribe(
        (response) => {
          console.log("response UpdateEnseignant: ", response);
          if (response == null || response == false) {
            this.loader.hide();

            this.toastr.error("Erreur de modification de l'enseignant");
          } else {
            this.toastr.success("Enseignant modifié avec succès");
            this.Enseignants[index] = { ...this.selectedEnseignant };

            // Mettre à jour le nom du sexe (Sex_Nom) en fonction de Sex_Id
            const sexInfo = this.TypeSexeList.find((sexe) => sexe.key === this.selectedEnseignant.Sex_Id);
            this.Enseignants[index].Sex_Nom = sexInfo ? sexInfo.libelle : "Inconnu";

            console.log("Sexe mis à jour : ", this.Enseignants[index].Sex_Nom);
            this.Enseignants.filter((enseignant) => enseignant.Ens_Id === this.selectedEnseignant.Ens_Id);
            this.loader.hide();
          }
        },
        (error) => {
          console.error("Erreur UpdateEnseignant: ", error);
          this.loader.hide();
          this.toastr.error(error?.error, "Erreur de modification de l'enseignant");
        }
      );
    }

    // Fermer la modal après modification
    this.modalService.dismissAll();
  }

  deleteEnseignant(index: number) {
    const enseignantToDelete = this.Enseignants[index];

    console.log("Id de l'enseignantToDelete : ", enseignantToDelete.Ens_Id);
    Swal.fire({
      title: "Voulez-vous supprimer l'enseignant?",
      showCancelButton: true,
      confirmButtonText: "Supprimer",
      confirmButtonColor: "red",
      cancelButtonText: "Annuler",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.loader.show();
        this.EduosService.DeleteEnseignant(enseignantToDelete.Ens_Id).subscribe(
          (response) => {
            console.log("response DeleteEnseignant: ", response);
            if (response == null || response == false || response == undefined) {
              this.loader.hide();
              this.toastr.error("Erreur de suppression de l'enseignant");
            } else {
              this.toastr.success("Enseignant supprimé avec succès");

              // Supprimer l'étudiant de la liste localement après une suppression réussie
              this.Enseignants.splice(index, 1); // Retirer l'étudiant de la liste

              this.loader.hide();
            }
          },
          (error) => {
            console.error("Erreur DeleteEnseignant: ", error);
            this.loader.hide();
            this.toastr.error(error?.error, "Erreur de suppression de l'enseignant");
          }
        );
      }
    });

    // Appeler le service avec un tableau d'identifiants
  }

  constructor(config: NgbModalConfig, private modalService: NgbModal, private EduosService: EduosService, private loader: NgxSpinnerService, private toastr: ToastrService,private title: Title) {
    config.backdrop = "static";
    config.keyboard = false;
    let ecole = localStorage.getItem("Ecole");
    if (ecole != null) this.title.setTitle(`Enseignants - ${JSON.parse(ecole).Ecole_Nom}`);
  }
  ngOnInit(): void {
    this.loader.show();
    this.EduosService.GetEnseignants().subscribe(
      (response) => {
        console.log("response GetEnseignants ", response);
        this.loader.hide();
        if (response == null) {
          this.toastr.error("Erreur de récupération des enseignants");
        } else {
          this.Enseignants = response;
        }
      },
      (error) => {
        console.error("Erreur GetEnseignants: ", error);
        this.loader.hide();
        this.toastr.error(error?.error, "Erreur de récupération des enseignants");
      }
    );
  }
  onImageSelected(event) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64Logo = e.target.result.split(",")[1]; // Extraire la partie base64
        this.newEnseignant.Ens_Photo = base64Logo; // Sauvegarder dans l'objet newEtablissement
      };
      reader.readAsDataURL(file); // Lire le fichier comme une URL de données
    }
  }
}
