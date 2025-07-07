import { Component, HostListener, OnInit, TemplateRef } from "@angular/core";
import { formatDate, DatePipe } from "@angular/common";
import { NgbModal, NgbModalConfig, NgbNavChangeEvent } from "@ng-bootstrap/ng-bootstrap";
import { EduosService } from "../../../shared/services/Eduos.service";
import { v4 as uuidv4 } from "uuid";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import Swal from "sweetalert2";
import { environment } from "../../../../environments/environment";
import { Title } from "@angular/platform-browser";
import { AppService } from "../../../shared/services/app.service";

@Component({
  selector: "app-liste-etudiants",
  templateUrl: "./liste-etudiants.component.html",
  styleUrls: ["./liste-etudiants.component.scss"],
})
export class ListeEtudiantsComponent implements OnInit {
  currentStep: number = 1; // Initialisation du stepper
  hasTuteur: boolean | null = null; // Valeur par défaut pour la question du tuteur
  currentAnnee: any = null;
  // Etudiants: any[] = [];
  Tuteurs: any[] = [];
  EtudiantTuteur: any[] = [];
  Annee:any[] = [];
  filtredEtudiants: any[] = [];
  filterParams = {
    global: "",
    Etd_Nom: null,
    Etd_Prenom: null,
    Sex_Nom: null,
    Etd_Matricule: null,
    Etd_CIN: null,
    Etd_LieuNaissance: null,
    Etd_Adresse: null,
    Etd_Tel: null,
    Etd_Mail: null,
  };
  currentSelection: any[] = [];
  selectEtudiant(Etd_Id: any) {
    // const index = this.currentSelection.indexOf(student);
    // let student = this.gridConfig.data.find((x) => x.EtdClasseAnn_Id == EtdClasseAnn_Id);

    if (this.currentSelection.includes(Etd_Id)) {
      this.currentSelection = this.currentSelection.filter((x) => x != Etd_Id);
    } else {
      this.currentSelection.push(Etd_Id);
    }

    // if (index !== -1) {
    //   // If the student is already in the array, remove them
    //   this.currentSelection.splice(index, 1);
    // } else {
    //   // Otherwise, add them to the selection
    //   this.currentSelection.push(student);
    // }
    // setTimeout(() => {
    //   if (this.currentSelection.length == 0 || this.currentSelection.length > 1) this.currentEtudiant = null;
    //   // console.log(this.currentEtudiant);
    // }, 0);
    // console.log(this.currentSelection);
  }

  OnFiltreChange(event, column: string) {
    setTimeout(() => {
      // console.log("OnFiltreChange: ", event)
      // this.filtredEtudiants = this.Etudiants.filter(x => x[column]?.toLowerCase().includes(this.filterParams[column].toLowerCase()))
      this.gridConfig.filtredData = this.gridConfig.data.filter(
        (x) =>
          x.Etd_Nom?.toLowerCase().includes(this.filterParams.global.toLowerCase()) ||
          x.Etd_Prenom?.toLowerCase().includes(this.filterParams.global.toLowerCase()) ||
          x.Etd_Matricule?.toLowerCase().includes(this.filterParams.global.toLowerCase()) ||
          x.Sex_Nom?.toLowerCase().includes(this.filterParams.global.toLowerCase()) ||
          x.Etd_LieuNaissance?.toLowerCase().includes(this.filterParams.global.toLowerCase()) ||
          x.Etd_Adresse?.toLowerCase().includes(this.filterParams.global.toLowerCase()) ||
          x.Etd_Tel?.toLowerCase().includes(this.filterParams.global.toLowerCase()) ||
          x.Etd_Mail?.toLowerCase().includes(this.filterParams.global.toLowerCase())
      );
    }, 0);
  }

  dockManagerConfig: { height: string | null } = { height: null };

  gridConfig: any = {
    GetVisibleColumns: () => {
      return this.gridConfig.columns.filter((col) => col.visible);
    },
    GetEnabledColumns: () => {
      return this.gridConfig.columns.filter((col) => !col.disableHiding);
    },
    title: "Elèves",
    emptyTemplateText: "Aucun élève chargé",
    height: window.innerHeight - 350 + "px",
    rowHeight: "35px",
    transactions: [],
    primaryKey: "Etd_Id",
    batchEditing: true,
    rowEditable: true,
    allowFiltering: true,
    rowSelection: "multiple",
    cellSelection: "none",
    columnSelection: "none",
    data: [],
    filtredData: [],
    columns: [
      {
        field: "Etd_Id",
        header: "Etd_Id",
        dataType: "string",
        visible: false,
        sortable: true,
        resizable: true,
        filterable: true,
        editable: false,
        searchable: true,
        disableHiding: true,
        groupable: true,
        width: "",
      },
      {
        field: "Etd_Id",
        header: "Etd_Id",
        dataType: "string",
        visible: false,
        sortable: true,
        resizable: true,
        filterable: true,
        editable: false,
        searchable: true,
        disableHiding: true,
        groupable: true,
        width: "",
      },

      {
        field: "Etd_Matricule",
        header: "Matricule",
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
        field: "Etd_Prenom",
        header: "Prénom",
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
        field: "Etd_Age",
        header: "Age",
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
        field: "Etd_DateNaissance",
        header: "Date de naissance",
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
        field: "Etd_LieuNaissance",
        header: "Lieu de naissance",
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
        field: "Etd_Adresse",
        header: "Adresse",
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
        field: "Tuteurs",
        header: "Tuteurs",
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
        field: "TelephoneTuteurs",
        header: "Téléphone tuteur",
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
      // {
      //   field: "NumeroWhatsappTuteurs",
      //   header: "Numéro whatsapp",
      //   dataType: "string",
      //   visible: true,
      //   sortable: true,
      //   resizable: true,
      //   filterable: true,
      //   editable: false,
      //   searchable: true,
      //   disableHiding: false,
      //   groupable: true,
      //   width: "",
      // },
      {
        field: "Etd_EstCasSocial",
        header: "Cas social",
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
    ],
  };

  Etd_IdListToMarquerCasSocial: string[] = [];
  SubmitMarquerCasSocial() {
    if (this.Etd_IdListToMarquerCasSocial.length == 0) {
      // all done, show message
      this.toastr.success("all done");
      this.loader.hide();
    } else {
      let Etd_Id = this.Etd_IdListToMarquerCasSocial[0];
      let etudiant = this.gridConfig.data.find((x) => x.Etd_Id == Etd_Id);
      etudiant.Etd_EstCasSocial = true;
      console.log("etudiant to update : ", etudiant);
      this.EduosService.UpdateEtudiant(Etd_Id, etudiant).subscribe(
        (response) => {
          console.log("response UpdateEtudiant: ", response);
          if (response == null || response == false) {
            this.toastr.error("Erreur de modification de l'élève");
          } else {
            this.toastr.success("Élève modifié avec succès");
            this.gridConfig.data = this.gridConfig.data.map((etd) => (etd.Etd_Id === etudiant.Etd_Id ? etudiant : etd));
            this.gridConfig.filtredData = this.gridConfig.filtredData.map((etd) => (etd.Etd_Id === etudiant.Etd_Id ? etudiant : etd));
          }
          this.Etd_IdListToMarquerCasSocial = this.Etd_IdListToMarquerCasSocial.filter((x) => x != Etd_Id);
          this.SubmitMarquerCasSocial();
        },
        (error) => {
          console.error("Erreur UpdateEtudiant: ", error);
          this.toastr.error(error?.error, "Erreur de modification de l'élève");
          this.Etd_IdListToMarquerCasSocial = this.Etd_IdListToMarquerCasSocial.filter((x) => x != Etd_Id);
          this.SubmitMarquerCasSocial();
        }
      );
    }
  }
  MarkAsCasSocial() {
    if (this.currentSelection.length == 0) {
      this.toastr.warning("Veuillez sélectionner au moins un élève");
      return;
    }

    Swal.fire({
      title: `Voulez-vous marquer le(s) ${this.currentSelection.length} élève(s) sélectionné(s) comme cas sociaux ?`,
      showCancelButton: true,
      confirmButtonText: "Oui",
      confirmButtonColor: "green",
      cancelButtonText: "Non",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("currentSelection to make them cas social : ", this.currentSelection);
        this.Etd_IdListToMarquerCasSocial = this.currentSelection;
        this.loader.show();
        this.SubmitMarquerCasSocial();

        this.currentSelection.forEach((Etd_Id) => {
          let etudiant = this.gridConfig.data.find((x) => x.Etd_Id == Etd_Id);
          etudiant.Etd_EstCasSocial = true;
          console.log("etudiant to update : ", etudiant);
          // this.loader.show();
          // this.EduosService.UpdateEtudiant(Etd_Id, etudiant).subscribe(
          //   (response) => {
          //     console.log("response UpdateEtudiant: ", response);
          //     this.loader.hide();
          //     if (response == null || response == false) {
          //       this.toastr.error("Erreur de modification de l'élève");
          //     } else {
          //       this.toastr.success("Élève modifié avec succès");

          //       // Update eleve in gridConfig.data
          //       this.gridConfig.data = this.gridConfig.data.map(etd =>
          //         etd.Etd_Id === etudiant.Etd_Id ? etudiant : etd
          //       );

          //       // Update eleve in gridConfig.filtredData
          //       this.gridConfig.filtredData = this.gridConfig.filtredData.map(etd =>
          //         etd.Etd_Id === etudiant.Etd_Id ? etudiant : etd
          //       );
          //     }
          //   },
          //   (error) => {
          //     console.error("Erreur UpdateEtudiant: ", error);
          //     this.loader.hide();
          //     this.toastr.error(error?.error, "Erreur de modification de l'élève");
          //   }
          // );
        });
        this.currentSelection = [];
        console.log("currentSelection after update : ", this.currentSelection);
      }
    });
  }

  searchParams: { Ecole_Id: any; Etd_Nom: string; Etd_Prenom: string; Etd_Matricule: string; TelephoneTuteur: string } = {
    Ecole_Id: null,
    Etd_Nom: "",
    Etd_Prenom: "",
    Etd_Matricule: "",
    TelephoneTuteur: "",
  };
  EtudiantChager: [] = [];
  GetData() {
    this.loader.show();
    this.EduosService.GetEtudiants(this.searchParams).subscribe(
      (response) => {
        this.loader.hide();
        console.log("response GetEtudiants", response);
        if (response == null) {
          this.toastr.error("Erreur de récuperation des élèves");
        } else if (response.length == 0) {
          this.toastr.info("Aucun élève trouvé");
        } else {
          // this.EtudiantChager = response;
          // this.Etudiants = response.map((student) => {
          //   const sexInfo = this.TypeSexeList.find((sexe) => sexe.key === student.Sex_Id);
          //   return { ...student, Sex_Nom: sexInfo ? sexInfo.libelle : "Inconnu" };
          // });
          // this.filtredEtudiants = this.Etudiants;

          this.gridConfig.data = response;
          this.gridConfig.filtredData = response;
        }
        this.onWindowResize(null);
      },
      (error) => {
        this.loader.hide();
        console.error("Erreur GetEtudiants: ", error);
        this.toastr.error(error?.error, "Erreur de récuperation des élèves");
      }
    );
  }
  EcoleId: string | null;

  Enums: {
    ClasseAnnee: any[];
    Tuteurs: any[];
  } = {
    ClasseAnnee: [],
    Tuteurs: [],
  };

  selectedTypeSexe: any = null;
  TypeSexeList = [
    { key: "d2821b37-77e9-4b20-b67e-5995adbd825e", libelle: "Masculin" },
    { key: "5cbda9a3-22a9-49f1-873d-5fb23e0d1156", libelle: "Feminin" },
    { key: "e603dabf-4159-4e0b-bef4-c8339da8c5cc", libelle: "Undefined" },
  ];
  // Méthode pour fermer le modal et réinitialiser les variables
  closeModal(modal: any) {
    modal.dismiss(); // Fermer le modal
    this.resetStepper(); // Réinitialiser l'étape
  }
  nextStep() {
    if (this.hasTuteur !== null) {
      this.currentStep = 2;
    }
  }
  // Méthode pour réinitialiser l'étape et les données si nécessaire
  resetStepper() {
    this.currentStep = 1;
    this.hasTuteur = false; // Réinitialise aussi les autres champs si nécessaire
  }
  private formatDate(date: string | null): string | null {
    return date ? formatDate(date, "yyyy-MM-dd", "en-US") : null;
  }
  openEditModalEtudiant(content: TemplateRef<any>, etd_id: string) {
    let etudiant = this.gridConfig.data.find((x) => x.Etd_Id == etd_id);
    this.selectedEtudiant = { ...etudiant };
    // Convertir la date au format YYYY-MM-DD
    if (this.selectedEtudiant.Etd_DateNaissance) {
      this.selectedEtudiant.Etd_DateNaissance = this.formatDate(this.selectedEtudiant.Etd_DateNaissance);
    }
    this.selectedTypeSexe = this.selectedEtudiant.Sex_Id; // Assigner la valeur actuelle du sexe
    this.editModalContentGet = content;
    this.modalService.open(this.editModalContentGet, { ariaLabelledBy: "dialogueetudiantget", fullscreen: false, size: "xl" });
  }
  editEtudiant() {
    this.selectedEtudiant.Sex_Id = this.selectedTypeSexe;
    const { EtudiantClasseAnnees, ...etudiantWithoutClasseAnnees } = this.selectedEtudiant;

    console.log(this.selectedEtudiant);

    this.loader.show();

    this.EduosService.UpdateEtudiant(this.selectedEtudiant.Etd_Id, this.selectedEtudiant).subscribe(
      (response) => {
        console.log("response UpdateEtudiant: ", response);
        this.loader.hide();
        if (response == null || response == false) {
          this.toastr.error("Erreur de modification de l'élève");
        } else {
          this.toastr.success("Élève modifié avec succès");

          // // Update the student in Etudiants
          // this.Etudiants = this.Etudiants.map(student =>
          //   student.Etd_Id === etudiantWithoutClasseAnnees.Etd_Id ? etudiantWithoutClasseAnnees : student
          // );

          // // Update the student in filtredEtudiants
          // this.filtredEtudiants = this.filtredEtudiants.map(student =>
          //   student.Etd_Id === etudiantWithoutClasseAnnees.Etd_Id ? etudiantWithoutClasseAnnees : student
          // );

          this.gridConfig.data = this.gridConfig.data.map((student) => (student.Etd_Id === etudiantWithoutClasseAnnees.Etd_Id ? etudiantWithoutClasseAnnees : student));

          this.gridConfig.filtredData = this.gridConfig.filtredData.map((student) => (student.Etd_Id === etudiantWithoutClasseAnnees.Etd_Id ? etudiantWithoutClasseAnnees : student));
          // Update the Sex_Nom based on Sex_Id
          const sexInfo = this.TypeSexeList.find((sexe) => sexe.key === this.selectedEtudiant.Sex_Id);
          this.gridConfig.data.forEach((student) => {
            if (student.Etd_Id === this.selectedEtudiant.Etd_Id) {
              student.Sex_Nom = sexInfo ? sexInfo.libelle : "Inconnu";
            }
          });
          this.gridConfig.filtredData.forEach((student) => {
            if (student.Etd_Id === this.selectedEtudiant.Etd_Id) {
              student.Sex_Nom = sexInfo ? sexInfo.libelle : "Inconnu";
            }
          });

          console.log("Sexe mis à jour : ", this.selectedEtudiant.Sex_Nom);
        }
      },
      (error) => {
        console.error("Erreur UpdateEtudiant: ", error);
        this.loader.hide();
        this.toastr.error(error?.error, "Erreur de modification de l'élève");
      }
    );

    // Close the modal after modification
    this.modalService.dismissAll();
  }
  deleteEtudiant(Etd_IdToDelete: string) {
    console.log("Id de l'etudiantToDelete : ", Etd_IdToDelete);
    Swal.fire({
      title: "Voulez-vous supprimer l'élève ?",
      showCancelButton: true,
      confirmButtonText: "Supprimer",
      confirmButtonColor: "red",
      cancelButtonText: "Annuler",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.loader.show();
        this.EduosService.DeleteEtudiant([Etd_IdToDelete]).subscribe(
          (response) => {
            console.log("response DeleteEtudiant: ", response);
            this.loader.hide();

            if (response == null || response == false || response == undefined) {
              this.toastr.error("Erreur de suppression de l'élève");
            } else {
              this.toastr.success("Élève supprimé avec succès");

              // Supprimer l'étudiant de la liste localement après une suppression réussie
              // this.Etudiants = this.Etudiants.filter((x) => x.Etd_Id != Etd_IdToDelete); // Retirer l'étudiant de la liste
              // this.filtredEtudiants = this.filtredEtudiants.filter((x) => x.Etd_Id != Etd_IdToDelete);

              this.gridConfig.data = this.gridConfig.data.filter((x) => x.Etd_Id != Etd_IdToDelete);
              this.gridConfig.filtredData = this.gridConfig.filtredData.filter((x) => x.Etd_Id != Etd_IdToDelete);
            }
          },
          (error) => {
            console.error("Erreur DeleteEtudiant: ", error);
            this.loader.hide();
            this.toastr.error(error?.error, "Erreur de suppression de l'élève");
          }
        );
      }
    });

    // Appeler le service avec un tableau d'identifiants
  }
  //#region detail etd

  GetEtudiantTuteur() {
    this.loader.show();
    this.EduosService.GetEtudiantTuteur(this.selectedEtudiant.Etd_Id).subscribe(
      (response) => {
        console.log("response GetEtudiantTuteur ", response);
        this.loader.hide();
        if (response == null) {
          this.toastr.error("Erreur de GetEtudiantTuteur");
        } else {
          this.EtudiantTuteur = response;
          console.log("Etudiant Tuteur : ", this.EtudiantTuteur);

          // this.EtudiantTuteur = response.map(student => {
          //   const sexInfo = this.TypeSexeList.find(sexe => sexe.key === student.Sex_Id);
          //   return { ...student, Sex_Nom: sexInfo ? sexInfo.libelle : "Inconnu" };
          // });
          // this.filtredEtudiants=this.Etudiants
        }
      },
      (error) => {
        console.error("Erreur GetEtudiantTuteur: ", error);
        this.loader.hide();
        this.toastr.error(error?.error, "Erreur de GetEtudiantTuteur");
      }
    );
  }
  opendetailEtudiantModal(content: TemplateRef<any>, etd_id: any) {
    let etudiant = this.gridConfig.data.find((x) => x.Etd_Id == etd_id);
    this.selectedEtudiant = etudiant; //{ ...etudiant };
    // this.selectedTypeSexe = this.selectedEtudiant.Sex_Id; // Assigner la valeur actuelle du sexe
    this.loader.show();
    this.EduosService.GetEtudiantTuteur(this.selectedEtudiant.Etd_Id).subscribe(
      (response) => {
        console.log("response GetEtudiantTuteur ", response);
        this.loader.hide();
        if (response == null) {
          this.toastr.error("Erreur de GetEtudiantTuteur");
        } else {
          this.EtudiantTuteur = response;
          console.log("Etudiant Tuteur : ", this.EtudiantTuteur);

          // this.EtudiantTuteur = response.map(student => {
          //   const sexInfo = this.TypeSexeList.find(sexe => sexe.key === student.Sex_Id);
          //   return { ...student, Sex_Nom: sexInfo ? sexInfo.libelle : "Inconnu" };
          // });
          // this.filtredEtudiants=this.Etudiants
        }
      },
      (error) => {
        console.error("Erreur GetEtudiantTuteur: ", error);
        this.loader.hide();
        this.toastr.error(error?.error, "Erreur de GetEtudiantTuteur");
      }
    );

    this.modalService.open(content, { ariaLabelledBy: "dialogueDetailEtudiant", fullscreen: true, size: "xl" });
  }
  //#region inscriptiob etd
  openinscriptionEtudiantModal(content: TemplateRef<any>, etd_id: any) {
    let etudiant = this.gridConfig.data.find((x) => x.Etd_Id == etd_id);
    this.selectedEtudiant = etudiant; //{ ...etudiant };
    // this.selectedTypeSexe = this.selectedEtudiant.Sex_Id; // Assigner la valeur actuelle du sexe
    this.editModalContentGet = content;
    console.log("gfgf", etudiant);

    this.modalService.open(this.editModalContentGet, { ariaLabelledBy: "dialogueInscriptionEtudiant", fullscreen: false, size: "xl" });
  }

  openinscriptionEtudiantChoseClasseModal(content: TemplateRef<any>, type: string, parcour?: any) {
    this.typeinscription = type;
    if (this.typeinscription == "inscrire") {
      this.newEtdClasseAnnee = {
        EtdClasseAnn_Id: uuidv4(),
        ClasseAnn_Id: null,
        Etd_Id: this.selectedEtudiant.Etd_Id,
        Cls_Nom: null,
        Niv_Nom: null,
        Ann_Nom: null,
      };
      // this.newEtdClasseAnnee.Etd_Id=this.selectedEtudiant.Etd_Id
      // this.newEtdClasseAnnee.ClasseAnn_Id=null
      // console.log('ee', this.newEtdClasseAnnee);
    } else if (this.typeinscription == "editerInsc") {
      this.defaultselectedEtdClassAnn = structuredClone(parcour);
      this.newEtdClasseAnnee = parcour;
      // console.log('ee2', this.newEtdClasseAnnee);
    }
    this.editModalContentGet = content;
    // console.log('gfgf', etudiant);
    this.modalService.open(this.editModalContentGet, { fullscreen: false, size: "md" });
  }
  openEtudiantTuteurModal(content: TemplateRef<any>, type: string, EtdTut?: any) {
    console.log("EtdTut à modifier cliquéé : ", EtdTut);
    this.typeinscription = type;
    if (this.typeinscription == "ajouter") {
      this.newEtdTut = {
        EtdTuteur_Id: uuidv4(),
        Etd_Id: this.selectedEtudiant.Etd_Id,
        Tut_Id: null,
        LienParente: null,
        Etd_Photo: null,
        Etd_Nom: null,
        Etd_Prenom: null,
        Etd_Sex_Id: null,
        Etd_Sex_Nom: null,
        Etd_DateNaissance: null,
        Etd_DateInscription: null,
        Etd_LieuNaissance: null,
        Etd_Mail: null,
        Etd_Matricule: null,
        Etd_Adresse: null,
        Etd_Tel: null,
        Tut_Sex_Id: null,
        Tut_Sex_Nom: null,
        Tut_Nom: null,
        Tut_Prenom: null,
        Tut_Tel: null,
        // Tut_Tel2: null,
        Tut_Adresse: null,
        Tut_CIN: null,
        Tut_Mail: null,
        Tut_Profession: null,
      };
      console.log("Ajouter");
    } else if (this.typeinscription == "modifier") {
      // this.defaultselectedEtdClassAnn = structuredClone(EtdTut)
      // this.newEtdClasseAnnee = EtdTut
      this.newEtdTut = structuredClone(EtdTut);

      // Pré-sélectionner le sexe basé sur Etd_Sex_Id
      this.selectedTypeSexe = this.TypeSexeList.find((sexe) => sexe.key === this.newEtdTut.Tut_Sex_Id)?.key;

      console.log("Modification : ", this.newEtdTut);
      console.log("Selected Sexe : ", this.selectedTypeSexe);
    }
    this.modalService.open(content, { fullscreen: false, size: "xl" });
  }
  onSexeChange(sexeKey: any): void {
    const selectedSexe = this.TypeSexeList.find((sexe) => sexe.key === sexeKey);
    this.newEtdTut.Etd_Sex_Id = selectedSexe?.key || null;
    this.newEtdTut.Etd_Sex_Nom = selectedSexe?.libelle || null;

    console.log("Sexe mis à jour : ", this.newEtdTut.Etd_Sex_Nom);
  }
  AddEtudiantTuteur(modal) {
    console.log("Objet envoyer :", this.newEtdTut);

    // Vérification si un tuteur est sélectionné (dans le Step 1)
    if (this.hasTuteur) {
      // L'utilisateur a choisi un tuteur existant
      if (!this.newEtdTut.Tut_Id) {
        this.toastr.error("Veuillez sélectionner un tuteur existant.");
        return;
      }
    } else {
      // Nouveau tuteur ajouté dans le Step 2
      if (!this.newEtdTut.Tut_Id) {
        this.newEtdTut.Tut_Id = uuidv4(); // Génération d'un UUID uniquement pour les nouveaux tuteurs
      }
    }
    this.loader.show();
    this.EduosService.CreateEtudiantTuteur(this.newEtdTut).subscribe(
      (response) => {
        this.loader.hide();

        console.log("response CreateEtudiantTuteur: ", response);
        this.GetEtudiantTuteur();

        modal.close();
        this.resetStepper();
        this.toastr.success("Tuteur ajouté avec succès");
      },
      (error) => {
        console.error("Erreur CreateEtudiantTuteur: ", error);
        this.loader.hide();
        this.toastr.error(error?.error, "Erreur d'enregister le tuteur");
      }
    );
  }
  EditEtudiantTuteur(modal) {
    this.newEtdTut.Tut_Sex_Id = this.selectedTypeSexe;
    this.loader.show();
    this.EduosService.UpdateEtudiantTuteur(this.newEtdTut).subscribe(
      (response) => {
        this.loader.hide();

        console.log("response UpdateEtudiantTuteur: ", response);
        this.GetEtudiantTuteur();
        modal.close();
        this.toastr.success("Tuteur modifié avec succès");
      },
      (error) => {
        console.error("Erreur UpdateEtudiantTuteur: ", error);
        this.loader.hide();
        this.toastr.error(error?.error, "Erreur de modifié le tuteur");
      }
    );
  }
  deleteEtudiantTuteur(EtdTuteur_Id) {
    Swal.fire({
      title: "Voulez-vous supprimer le tuteur ?",
      showCancelButton: true,
      confirmButtonText: "Oui",
      confirmButtonColor: "green",
      cancelButtonText: "Non",
    }).then((result) => {
      if (result.isConfirmed) {
        this.loader.show();
        this.EduosService.DeleteEtudiantTuteur(EtdTuteur_Id).subscribe(
          (response) => {
            this.loader.hide();

            console.log("response DeleteEtudiantTuteur: ", response);
            this.GetEtudiantTuteur();
            this.toastr.success("Tuteur supprimé avec succès");
          },
          (error) => {
            console.error("Erreur DeleteEtudiantTuteur: ", error);
            this.loader.hide();
            this.toastr.error(error?.error, "Erreur suppression du tuteur");
          }
        );
      }
      // else {
      //   this.toastr.info(
      //     "Tuteur n'est pas supprimé"
      //   );
      // }
    });
    console.log("EtdTut_Id a supprimé : ", EtdTuteur_Id);
  }

  newEtdClasseAnnee = {
    EtdClasseAnn_Id: null,
    ClasseAnn_Id: null,
    Etd_Id: null,
    Cls_Nom: null,
    Niv_Nom: null,
    Ann_Nom: null,
  };
  newEtdTut: any = {};
  typeinscription: string | null = null;
  defaultselectedEtdClassAnn: any = {};

  IncrireEtudiant(modal: any): void {
    if (this.selectedAnnId == null) {
      Swal.fire({
        title: "Veuillez selectionner une année scolaire",
        icon: "warning",
      });
      return;
    }
    if (this.newEtdClasseAnnee.ClasseAnn_Id == null) {
      Swal.fire({
        title: "Veuillez selectionner la classe",
        icon: "warning",
      });
      return;
    }
    if (this.typeinscription == "inscrire") {
      this.loader.show();
      this.EduosService.CreateEtudiantClasseAnnee([this.newEtdClasseAnnee]).subscribe(
        (response) => {
          console.log("response CreateEtudiantClasseAnnee: ", response);
          (this.newEtdClasseAnnee.Cls_Nom = this.Enums.ClasseAnnee.find((x) => x.ClasseAnn_Id == this.newEtdClasseAnnee.ClasseAnn_Id).Cls_Nom),
            (this.newEtdClasseAnnee.Niv_Nom = this.Enums.ClasseAnnee.find((x) => x.ClasseAnn_Id == this.newEtdClasseAnnee.ClasseAnn_Id).Niv_Nom),
            (this.newEtdClasseAnnee.Ann_Nom = this.Enums.ClasseAnnee.find((x) => x.ClasseAnn_Id == this.newEtdClasseAnnee.ClasseAnn_Id).Ann_Nom);
          this.selectedEtudiant.EtudiantClasseAnnees.push(this.newEtdClasseAnnee);
          this.toastr.success("Inscription effectuée avec succès");
          this.loader.hide();
        },
        (error) => {
          console.error("Erreur EtudiantClasseAnnees: ", error);
          this.loader.hide();
          this.toastr.error(error?.error, "Erreur de l'inscription de l'élève");
        }
      );
      modal.close(); // Close the modal
    } else if (this.typeinscription == "editerInsc") {
      this.loader.show();
      this.EduosService.UpdateEtudiantClasseAnnee(this.newEtdClasseAnnee.EtdClasseAnn_Id, this.newEtdClasseAnnee).subscribe(
        (response) => {
          console.log("response UpdateEtudiantClasseAnnee: ", response);
          (this.newEtdClasseAnnee.Cls_Nom = this.Enums.ClasseAnnee.find((x) => x.ClasseAnn_Id == this.newEtdClasseAnnee.ClasseAnn_Id).Cls_Nom),
            (this.newEtdClasseAnnee.Niv_Nom = this.Enums.ClasseAnnee.find((x) => x.ClasseAnn_Id == this.newEtdClasseAnnee.ClasseAnn_Id).Niv_Nom),
            (this.newEtdClasseAnnee.Ann_Nom = this.Enums.ClasseAnnee.find((x) => x.ClasseAnn_Id == this.newEtdClasseAnnee.ClasseAnn_Id).Ann_Nom);
          // this.selectedEtudiant.EtudiantClasskeAnnees.push(this.newEtdClasseAnnee)
          this.toastr.success("Modification effectuée avec succès");
          this.loader.hide();
        },
        (error) => {
          console.error("Erreur EtudiantClasseAnnees: ", error);
          this.loader.hide();
          this.toastr.error(error?.error, "Erreur de modification de l'inscription de l'élève");
        }
      );
      modal.close(); // Close the modal
    }
  }
  CloseDialoginscriptionEtudiantChoseClasseModal(modal: any) {
    this.newEtdClasseAnnee = this.defaultselectedEtdClassAnn;
    modal.close();
  }
  deleteEtudiantClasseAnnee(parcour: any) {
    console.log("bv", parcour);
    Swal.fire({
      title: "La suppression de cette inscription supprimera également tous les versements affectés à cet élève. Voulez-vous continuer ?",
      showCancelButton: true,
      confirmButtonText: "Supprimer",
      confirmButtonColor: "red",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        let param = {
          ListEtdClsAnn_Id: [parcour.EtdClasseAnn_Id],
        };
        this.loader.show();
        this.EduosService.DeleteEtudiantClasseAnnee(param).subscribe(
          (response) => {
            console.log("response DeleteEtudiantClasseAnnee: ", response);

            this.toastr.success("Suppression effectuée avec succès");
            this.selectedEtudiant.EtudiantClasseAnnees = this.selectedEtudiant.EtudiantClasseAnnees.filter((x) => x.EtdClasseAnn_Id != parcour.EtdClasseAnn_Id);
            this.loader.hide();
          },
          (error) => {
            console.error("Erreur EtudiantClasseAnnees: ", error);
            this.loader.hide();
            this.toastr.error(error?.error, "Erreur de suppression de l'inscription de l'élève");
          }
        );
      }
    });
  }
  //#endregion

  selectedStudent: any = {};
  selectedEtudiant: any = {};
  editModalContent: TemplateRef<any>;
  editModalContentGet: TemplateRef<any>;
  // toutes les paires classe↔année de l’API
  allClasseAnnee: any[] = [];
  // classes filtrées par l’année sélectionnée
  filteredClasseAnnee: any[] = [];
  // année courante choisie dans le <select>
  selectedAnnId: string;
  constructor(config: NgbModalConfig, private modalService: NgbModal, private EduosService: EduosService, private loader: NgxSpinnerService, private toastr: ToastrService, private title: Title,private appService: AppService) { 
    config.backdrop = "static";
    config.keyboard = false;
    this.currentAnnee = localStorage.getItem("selectedAnnee");
    
    this.EcoleId = localStorage.getItem("EcoleId");

    let ecole = localStorage.getItem("Ecole");
    if (ecole != null) this.title.setTitle(`Élèves - ${JSON.parse(ecole).Ecole_Nom}`);
  }

  //Current Ann_Id
  ngOnInit(): void {
    this.loader.show();
    console.log("currentAnnee : ", this.currentAnnee);
    this.EduosService.GetCommunData([
      `${environment.apiUrl}/api/Configuration/GetClasseAnnee?Ecole_Id=${this.EcoleId}`,
      `${environment.apiUrl}/api/Tuteur/GetTuteur?Ecole_Id=${this.EcoleId}`,
      // `${environment.urlProgramme}/api/Diplome/GetDiplomes`,
    ]).subscribe(
      (response: any[]) => {
        console.log("Response GetCommunData: ", response);
        this.loader.hide();
        this.Enums.ClasseAnnee = response[0];
        this.Enums.Tuteurs = response[1];
        this.allClasseAnnee = response[0];

        if (environment.production == false) {
          this.searchParams.Etd_Nom = "DIAW";
          this.GetData();
        }
      },
      (error) => {
        this.loader.hide();
        console.error("Error GetCommunData: ", error);
      }
    );
    (window as any).etudiants = this;
    this.EduosService.GetAnnees().subscribe(
      (response) => {
        console.log("response GetAnnees: ", response);
        this.Annee = response;
        // order by ann_nom desc
        this.Annee = this.Annee.sort((a, b) => (a.Ann_Nom < b.Ann_Nom ? 1 : -1));
      },
      (error) => {
        console.error("Erreur GetAnnees: ", error);
      }
    );
  }
 /** appelé à chaque changement d’année */
  onYearChange(annId: string) {
    this.selectedAnnId = annId;
    // on filtre les classes correspondant à l’année
    this.filteredClasseAnnee = this.allClasseAnnee.filter(c => c.Ann_Id === annId);
    console.log("filteredClasseAnnee : ", this.filteredClasseAnnee);

    // si la classe précédemment choisie n’appartient plus à la nouvelle liste, on reset
    if (!this.filteredClasseAnnee.some(c => c.ClasseAnn_Id === this.newEtdClasseAnnee.ClasseAnn_Id)) {
      this.newEtdClasseAnnee.ClasseAnn_Id = null;
    }
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
      let dockManagerHeight = window.innerHeight - searchBarHeight - 260;
      this.dockManagerConfig.height = dockManagerHeight + "px";
      this.gridConfig.height = dockManagerHeight + "px";
    }, 100);
  }
  Exporter() {
    this.EduosService.Exporter("Elèves", this.gridConfig.GetVisibleColumns(), this.gridConfig.data);
  }
}
