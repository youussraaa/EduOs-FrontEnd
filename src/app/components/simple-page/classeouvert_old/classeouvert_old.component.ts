import { Component, OnInit, TemplateRef } from "@angular/core";
import {
  NgbModal,
  NgbModalConfig,
  NgbNavChangeEvent,
} from "@ng-bootstrap/ng-bootstrap"; // Ensure NgbModal is imported
import { EduosService } from "../../../shared/services/Eduos.service";
import { v4 as uuidv4 } from "uuid";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { AppService } from "../../../shared/services/app.service";
import Swal from 'sweetalert2'

interface ClasseOuvert {
  ClasseAnn_Id: any;
  Ann_Id: any;
  Cls_Id: any;
  Niv_Nom: any;
  Ann_Nom: any;
  Cls_Nom: any;
  Classe_Description: any;
}
@Component({
  selector: "app-classeouvert_old",
  templateUrl: "./classeouvert_old.component.html",
  styleUrl: "./classeouvert_old.component.scss",
})
export class Classeouvert_oldComponent implements OnInit {
  ClasseAnneeMatiere: any[] = [];
  selectedClasseAnneeMatiere: any;
  Enseignants: any[] = [];
  selectAll: boolean = false;
  ClasseAnnee: any;
  Classes: any;
  selectedClasseAnnee: any;
  selectedAnnee: any;
  selectedClasse: any;
  ListClasseAnn_Id: any[] = [];
  GetAnnee: any[] = [];
  ClasseAOuvrir: any;
  selectedClasseOuvrir: any;
  EcoleId: string | null = null;
  newClasseAnnee: ClasseOuvert = {
    ClasseAnn_Id: uuidv4(),
    Ann_Id: null,
    Cls_Nom: null,
    Ann_Nom: null,
    Niv_Nom: null,
    Cls_Id: null,
    Classe_Description: null,
  };
  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private EduosService: EduosService,
    private loader: NgxSpinnerService,
    private toastr: ToastrService,
    public appService: AppService,
    private router: Router
  ) {
    console.log("constructor");
    config.backdrop = "static";
    config.keyboard = false;
    this.EcoleId = localStorage.getItem("EcoleId");
  }
  currentStep: number = 1;
  toggleAllSelections(): void {
    this.ClasseAOuvrir.forEach((classe) => (classe.selected = this.selectAll));
  }
  goToStep(step: number): void {
    this.currentStep = step;
  }
  nextStep(modal: any): void {
    if (this.currentStep === 1) {
      // Vérifiez que `selectedAnnee` est défini
      if (!this.selectedAnnee) {
        this.toastr.warning("Veuillez sélectionner une année");
        return;
      }
      this.loader.show();
      this.EduosService.GetClassesAOuvrir(this.selectedAnnee, this.EcoleId).subscribe(
        (response) => {
          console.log("response GetClassesAOuvrir ", response);
          this.loader.hide();
          if (response == null) {
            this.toastr.error("Erreur de recureption des classe a ouvrir");
          } else {
            this.ClasseAOuvrir = response;
            this.goToStep(2); // Aller au formulaire
          }
        },
        (error) => {
          console.error("Erreur GetClassesAOuvrir: ", error);
          this.loader.hide();
          this.toastr.error(error?.error, "Erreur de GetClassesAOuvrir");
        }
      );
    } else {
      this.loader.hide();
      this.selectedClasseOuvrir = this.ClasseAOuvrir.filter(
        (classe) => classe.selected
      );
      console.log(this.selectedClasseOuvrir);
      this.saveClassAdd(); // Enregistrer les données
    }
  }
  ngOnInit(): void {
    console.log("ngOnInit");
    this.loader.show()
    this.EduosService.GetAnnees().subscribe(
      (response) => {
        console.log("response GetAnnees ", response);
        this.loader.hide();
        if (response == null) {
          this.toastr.error("Erreur de recureption des annees");
        } else {
          this.GetAnnee = response;
        }
      },
      (error) => {
        console.error("Erreur GetAnnees: ", error);
        this.loader.hide();
        this.toastr.error(error?.error, "Erreur de GetAnnees");
      }
    );
    this.EduosService.GetEnseignants().subscribe(
      (response) => {
        console.log("response GetEnseignants ", response);
        if (response == null) {
          this.loader.hide();

          this.toastr.error("Erreur de GetEnseignants");
        } else {
          this.Enseignants = response;
          console.log("this.Enseignants : ", this.Enseignants);
          this.loader.hide();
        }
      },
      (error) => {
        console.error("Erreur GetEnseignants: ", error);
        this.loader.hide();
        this.toastr.error(error?.error, "Erreur de GetEnseignants");
      }
    );
    setTimeout(() => {
      console.log(
        "this.appService.currentAnnee: ",
        this.appService.currentAnnee
      );
      let params = { Ann_Id: this.appService.currentAnnee?.Ann_Id };
      this.loader.show();
      this.EduosService.GetClasseAnnee(params).subscribe(
        (response) => {
          console.log("response GetClasseAnnee ", response);
          this.loader.hide();

          if (response == null) {
            this.toastr.error("Erreur de GetClasseAnnee");
          } else {
            this.ClasseAnnee = response;
            console.log("this.ClasseAnnee : ", this.ClasseAnnee);
            this.loader.hide();
          }
        },
        (error) => {
          console.error("Erreur GetClasseAnnee: ", error);
          this.loader.hide();
          this.toastr.error(error?.error, "Erreur de GetClasseAnnee");
        }
      );
    }, 10);
  }
  openEditClasseAnnee(classeannee, modal) {
    this.selectedClasseAnnee = classeannee;
    console.log("this.selectedClasseAnnee : ", this.selectedClasseAnnee);
    this.loader.show();
    this.EduosService.GetClasseAnneeMatiere(
      this.selectedClasseAnnee.ClasseAnn_Id
    ).subscribe(
      (response) => {
        console.log("response GetClasseAnneeMatiere: ", response);
        if (response == null) {
          this.loader.hide();
          this.toastr.error("Erreur de GetClasseAnneeMatiere");
        } else {
          this.loader.hide();
          // Remove the deleted class from the ClasseAnnee array
          this.ClasseAnneeMatiere = response;
          console.log(this.ClasseAnneeMatiere);
        }

        this.loader.hide();
      },
      (error) => {
        console.error("Erreur DeleteClasseAnnee: ", error);
        this.loader.hide();
        this.toastr.error(
          error?.error,
          "Erreur de suppression de la classe ouverte"
        );
      }
    );

    this.modalService.open(modal, {
      ariaLabelledBy: "modal-basic-title",
      size: "xl",
    });
  }
  openaffectationEnsClsModal(modal, ClsAnnMat, i) {
    this.selectedClasseAnneeMatiere = { ...ClsAnnMat };
    console.log(this.selectedClasseAnneeMatiere);
    console.log(i);
    this.modalService.open(modal, {
      ariaLabelledBy: "modal-basic-title",
      fullscreen: false,
    });
  }
  ModifierAffectation(modal, selectedClasseAnneeMatiere) {
    console.log(selectedClasseAnneeMatiere);
    console.log(selectedClasseAnneeMatiere.ClsAnnMat_Id);
    if(selectedClasseAnneeMatiere.Ens_Id===""){
      selectedClasseAnneeMatiere.Ens_Id=null
    }
    console.log(selectedClasseAnneeMatiere.Ens_Id)
    this.loader.show();
    this.EduosService.UpdateClasseAnneeMatiere(
      selectedClasseAnneeMatiere.ClsAnnMat_Id,
      selectedClasseAnneeMatiere
    ).subscribe(
      (response) => {
        console.log("response UpdateClasseAnneeMatiere: ", response);
        this.loader.hide();
        if (response == null || response == false) {
          this.toastr.error("Erreur de modification de l'affectation");
        } else {
          this.toastr.success("Affectation modifié avec succès");
          this.ClasseAnneeMatiere = this.ClasseAnneeMatiere.map((item) => {
            if (item.ClsAnnMat_Id == selectedClasseAnneeMatiere.ClsAnnMat_Id) {
              item.Ens_Id = selectedClasseAnneeMatiere.Ens_Id;
              item.Ens_Nom = selectedClasseAnneeMatiere.Ens_Id == null || selectedClasseAnneeMatiere.Ens_Id == "" ? null : this.Enseignants.find(x=> x.Ens_Id == selectedClasseAnneeMatiere.Ens_Id)?.Ens_Nom;
              item.Ens_Prenom = selectedClasseAnneeMatiere.Ens_Id == null || selectedClasseAnneeMatiere.Ens_Id == "" ? null : this.Enseignants.find(x=> x.Ens_Id == selectedClasseAnneeMatiere.Ens_Id)?.Ens_Prenom;
            }
            return item;
          });
          modal.close();
        }
      },
      (error) => {
        console.error("Erreur UpdateClasseAnneeMatiere: ", error);
        this.loader.hide();
        this.toastr.error(
          error?.error,
          "Erreur de modification de ClasseAnneeMatiere"
        );
      }
    );
  }
  CloseDialogopenaffectationEnsClsModal(modal: any) {
    modal.close();
  }
  deleteClasseAnnee(classeannee) {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Vous êtes sur le point de supprimer cette classe. Cette action est irréversible.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("classe année à supprimer : ", classeannee.ClasseAnn_Id);
  
        // Ajout de l'ID de la classe à la liste des classes supprimées
        this.ListClasseAnn_Id.push(classeannee.ClasseAnn_Id);
        console.log(JSON.parse(JSON.stringify(this.ListClasseAnn_Id)));
        this.loader.show();
  
        this.EduosService.DeleteClasseAnnee(this.ListClasseAnn_Id).subscribe(
          (response) => {
            console.log("Réponse DeleteClasseAnnee: ", response);
            this.loader.hide();
  
            if (response == null || response == false) {
              this.toastr.error("Erreur de suppression de la classe ouverte");
            } else {
              // Suppression de la classe de l'interface
              this.ClasseAnnee = this.ClasseAnnee.filter(
                (item) => item.ClasseAnn_Id !== classeannee.ClasseAnn_Id
              );
              console.log("Classe ouverte supprimée avec succès de l'interface");
              this.toastr.success("Classe ouverte supprimée avec succès");
            }
  
            // Optionnel: Vider la liste des classes supprimées
            this.ListClasseAnn_Id = [];
          },
          (error) => {
            console.error("Erreur DeleteClasseAnnee: ", error);
            this.loader.hide();
            this.toastr.error(
              error?.error,
              "Erreur de suppression de la classe ouverte"
            );
          }
        );
      }
    });
  }
  
  openAddClasseAnnee(modal) {
    this.currentStep = 1;

    this.modalService.open(modal, {
      ariaLabelledBy: "modal-basic-title",
      size: "xl",
    });
  }

  saveClassAdd() {
    // Vérifiez que `selectedClasseOuvrir` contient des données
    if (!this.selectedClasseOuvrir || this.selectedClasseOuvrir.length === 0) {
      this.toastr.warning("Aucune classe sélectionnée.");
      return;
    }

    // Ajoutez un champ `ClsAnn_Id` avec un UUID et `Ann_Id` à chaque objet sélectionné
    this.selectedClasseOuvrir.forEach((classe) => {
      classe.ClasseAnn_Id = uuidv4(); // Génère un identifiant unique pour chaque classe
      classe.Ann_Id = this.selectedAnnee; // Ajoute l'année sélectionnée
    });

    console.log(
      "this.selectedClasseOuvrir avec ClsAnn_Id:",
      this.selectedClasseOuvrir
    );

    this.loader.show();
    this.EduosService.CreateClasseAnnee(this.selectedClasseOuvrir).subscribe(
      (response) => {
        console.log("response CreateClasseAnnee: ", response);
        if (response == null || response == false) {
          this.loader.hide();
          this.toastr.error("Erreur d'ouverture de la classe");
        } else {
          // Appeler GetClasseAnnee seulement si `selectedAnnee` est valide
          this.EduosService.GetClasseAnnee(this.selectedAnnee).subscribe(
            (response) => {
              console.log("response GetClasseAnnee ", response);
              if (response == null || response == false) {
                this.toastr.error("Erreur de GetClasseAnnee");
                this.loader.hide();
              } else {
                this.ClasseAnnee = response;
                console.log("this.ClasseAnnee : ", this.ClasseAnnee);
                this.loader.hide();
              }
            },
            (error) => {
              console.error("Erreur GetClasseAnnee: ", error);
              this.toastr.error(error?.error, "Erreur de GetClasseAnnee");
              this.loader.hide();
            }
          );
          this.toastr.success("Classes ouvertes avec succès");
          this.loader.hide();
          this.modalService.dismissAll();
          this.resetClasseAnnee();
        }
      },
      (error) => {
        console.error("Erreur CreateClasseAnnee: ", error);
        this.loader.hide();
        this.toastr.error(error?.error, "Erreur d'ouverture de la classe");
      }
    );

    // this.modalService.dismissAll();
    // this.resetClasseAnnee();
  }

  resetClasseAnnee() {
    this.newClasseAnnee = {
      ClasseAnn_Id: uuidv4(),
      Ann_Id: null,
      Cls_Id: null,
      Ann_Nom: null,
      Classe_Description: null,
      Cls_Nom: null,
      Niv_Nom: null,
    };
    this.selectedAnnee = null;
    this.selectedClasse = null;
    this.selectedClasseOuvrir = null;
  }
}
