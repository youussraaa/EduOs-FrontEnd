import { Component, HostListener, OnInit } from "@angular/core";
import { NgbModal, NgbModalConfig, NgbNavChangeEvent } from "@ng-bootstrap/ng-bootstrap"; // Ensure NgbModal is imported
import { EduosService } from "../../../shared/services/Eduos.service";
import { v4 as uuidv4 } from "uuid";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import Swal from "sweetalert2";
import { forkJoin } from "rxjs";
import { AppService } from "../../../shared/services/app.service";
import { Title } from "@angular/platform-browser";
import { environment } from "../../../../environments/environment";

@Component({
  selector: "app-candidats",
  templateUrl: "./liste-candidats.component.html",
  styleUrls: ["./liste-candidats.component.scss"],
})
export class ListeCandidatsComponent implements OnInit {
  @HostListener("window:resize", ["$event"])
onWindowResize($event) {
  console.log("onResize: ", $event);
  setTimeout(() => {
    let searchBarHeight = document.getElementById("searchBar")?.clientHeight;
    let tableresponsive = document.getElementsByClassName("table-responsive") as HTMLCollectionOf<HTMLElement>;

    if (searchBarHeight == null || searchBarHeight == undefined || searchBarHeight == 0) {
      searchBarHeight = -25;
    }

    console.log("Search bar height: ", searchBarHeight);


    if (tableresponsive) {
      for (let i = 0; i < tableresponsive.length; i++) {
        const element = tableresponsive[i];
        let cardbodyHeight = window.innerHeight - (searchBarHeight + 330);
        element.style.height = `${cardbodyHeight}px`;
        console.log(element.style.height);
      }
    }
  }, 100);
}
  active3 = 1;
  onNavChange1(changeEvent: NgbNavChangeEvent) {
    if (changeEvent.nextId === 4) {
      changeEvent.preventDefault();
    }
    this.onWindowResize(null);
  }
  onNavChange(changeEvent: NgbNavChangeEvent) {
    if (changeEvent.nextId === 4) {
      changeEvent.preventDefault();
      
    }
    this.onWindowResize(null);
  }
  EcoleId: string;
  Candidats: any[] = [];
  CandidatsRefuser: any[] = [];
  CandidatEnAttente: any[] = [];
  CandidatAdmis: any[] = [];
  TypeSexeList = [
    { key: "d2821b37-77e9-4b20-b67e-5995adbd825e", libelle: "Masculin" },
    { key: "5cbda9a3-22a9-49f1-873d-5fb23e0d1156", libelle: "Feminin" },
    { key: "e603dabf-4159-4e0b-bef4-c8339da8c5cc", libelle: "Undefined" },
  ];

  //#region dialogCandidat
  dialogCandidat: {
    showForm: boolean;
    currentStep: number; // Initialisation du stepper
    selectedTypeSexe: any;
    selectedClasseAnnee: any;
    selectedCandidat: any;
    newTutor: any;
    newCandidat: any;
    newCandidatTutor: any;
    newEtudiant: any;
    candidatFinal: any;
    ListTutors: any[];
    ListCandidatTutors: any[];
    resetStepper: Function;
    nextStep: Function;
    previousStep: Function;
    StartAddTutor: Function;
    StartAddCandidatTutor: Function;
    StartAddCandidatFinal: Function;
    addTutor: Function;
    resetFormTutor: Function;
    resetFormCandidatTutor: Function;
    setDefaultTutor: Function;
    deleteTutor: Function;
    OnSubmit: Function;
    Clear: Function;
    Close: Function;
    StartAddCandidat: Function;
    resetAddNewCandidatForm: Function;
    resetAddCandidatFinalForm: Function;
    StartAddEtudiant: Function;
    resetAddNewEtudiantForm: Function;
    AcceptRejeterCandidat: Function;
    // rejectCandidat: Function;
    onImageSelected: Function;
    saveClassForStudent: Function;
  } = {
    showForm: false,
    currentStep: 1,
    selectedTypeSexe: null,
    selectedClasseAnnee: null,
    selectedCandidat: null,
    newTutor: null,
    newCandidat: null,
    newCandidatTutor: null,
    candidatFinal: null,
    newEtudiant: null,
    ListTutors: [],
    ListCandidatTutors: [],

    StartAddCandidat: (modal) => {
      this.dialogCandidat.newCandidat = {
        Cnd_Id: uuidv4(),
        Ecole_Id: null,
        Niv_Id: null,
        Niv_Nom: null,
        Sex_Id: null,
        Sex_Nom: null,
        Cnd_Nom: null,
        Cnd_Prenom: null,
        Cnd_Photo: null,
        Cnd_DateNaissance: null,
        Cnd_LieuNaissance: null,
        Cnd_Tel: null,
        Cnd_Mail: null,
        Cnd_Adresse: null,
        Cnd_Remarque: null,
        Cnd_EcoleOrigine: null,
      };

      this.modalService.open(modal, {
        ariaLabelledBy: "dialoguecandidat",
        fullscreen: false,
        size: "xl",
      });
    },
    StartAddTutor: () => {
      this.dialogCandidat.newTutor = {
        Tut_Id: uuidv4(),
        Ecole_Id: null,
        Tut_Sex_Id: null,
        Tut_Nom: null,
        Tut_Prenom: null,
        Tut_Tel: null,
        // Tut_Tel2: null,
        Tut_Adresse: null,
        Tut_CIN: null,
        Tut_Mail: null,
        Tut_Profession: null,
      };
      this.dialogCandidat.StartAddCandidatTutor();
      this.dialogCandidat.showForm = true;
    },
    StartAddCandidatTutor: () => {
      this.dialogCandidat.newCandidatTutor = {
        CndTuteur_Id: uuidv4(),
        // Cnd_Id:this.dialogCandidat.newCandidat.Cnd_Id,
        Cnd_Id: null,
        // Tut_Id:this.dialogCandidat.newTutor.Tut_Id,
        Tut_Id: null,
        LienParente: null,
        CndTuteur_ParDefault: null,
      };
    },
    StartAddEtudiant: () => {
      this.dialogCandidat.newEtudiant = {
        EtdClasseAnn_Id: uuidv4(),
        Etd_Id: null,
        ClasseAnn_Id: null,
      };
    },
    StartAddCandidatFinal: () => {
      this.dialogCandidat.candidatFinal = {
        Candidat: null,
        Tuteurs: null,
        CandidatTuteurs: null,
      };
    },
    Clear: () => {
      this.dialogCandidat.selectedTypeSexe = null;
      this.dialogCandidat.ListTutors = [];
      this.dialogCandidat.ListCandidatTutors = [];
      this.dialogCandidat.newCandidat = null;
      this.dialogCandidat.newTutor = null;
      (this.dialogCandidat.candidatFinal = null), this.dialogCandidat.resetFormTutor();
      this.dialogCandidat.resetAddNewCandidatForm();
      this.dialogCandidat.resetFormCandidatTutor();
      this.dialogCandidat.resetAddCandidatFinalForm();
    },
    Close: (modal: any) => {
      this.dialogCandidat.Clear();
      modal.close();
      this.dialogCandidat.resetStepper();
    },
    resetStepper: () => {
      this.dialogCandidat.currentStep = 1;
      this.dialogCandidat.ListTutors = [];
      this.dialogCandidat.ListCandidatTutors = [];
      this.dialogCandidat.resetFormTutor();
      this.dialogCandidat.resetAddNewCandidatForm();
      this.dialogCandidat.resetFormCandidatTutor();
      this.dialogCandidat.resetAddCandidatFinalForm();
    },
    nextStep: () => {
      if (!this.dialogCandidat.newCandidat.Niv_Id) {
        this.toastr.warning("Veuillez choisir un niveau");
        return;
      }
      if (!this.dialogCandidat.newCandidat.Cnd_Nom || !this.dialogCandidat.newCandidat.Cnd_Prenom) {
        this.toastr.warning("Veuillez inserer le nom et prenom du candidat");
        return;
      }
      this.dialogCandidat.currentStep = this.dialogCandidat.currentStep + 1;
    },
    previousStep: () => {
      this.dialogCandidat.currentStep = this.dialogCandidat.currentStep - 1; // Retourne à l'étape 1 (formulaire des candidats)
    },

    addTutor: () => {
      if (!this.dialogCandidat.newTutor.Tut_Nom || !this.dialogCandidat.newTutor.Tut_Prenom) {
        this.toastr.warning("Veuillez inserer le nom et prenom du tuteur");
        return;
      }
      if (!this.dialogCandidat.newTutor.Tut_Tel) {
        this.toastr.warning("Veuillez inserer le numero de téléphone du tuteur");
        return;
      }
      if (!this.dialogCandidat.newCandidatTutor.LienParente) {
        this.toastr.warning("Veuillez inserer le lien de parenté");
        return;
      }
      if (this.dialogCandidat.newTutor.Tut_Nom && this.dialogCandidat.newTutor.Tut_Prenom && this.dialogCandidat.newTutor.Tut_Tel && this.dialogCandidat.newCandidatTutor.LienParente) {
        // Copie de l'objet pour éviter les références
        this.dialogCandidat.newCandidat.Ecole_Id = this.EcoleId;
        const tutorCopy = { ...this.dialogCandidat.newTutor, Tut_Id: uuidv4(), Ecole_Id: this.EcoleId };
        const CandiatTutorCopy = { ...this.dialogCandidat.newCandidatTutor, CndTuteur_Id: uuidv4() };

        // Marquer automatiquement le premier tuteur ajouté comme par défaut
        if (this.dialogCandidat.ListTutors.length === 0) {
          tutorCopy.Tut_parDefaut = true;
          tutorCopy.LienParente = CandiatTutorCopy.LienParente;
          CandiatTutorCopy.Cnd_Id = this.dialogCandidat.newCandidat.Cnd_Id;
          CandiatTutorCopy.Tut_Id = tutorCopy.Tut_Id;
          CandiatTutorCopy.CndTuteur_ParDefault = tutorCopy.Tut_parDefaut;
        } else {
          tutorCopy.Tut_parDefaut = false;
          tutorCopy.LienParente = CandiatTutorCopy.LienParente;
          CandiatTutorCopy.Cnd_Id = this.dialogCandidat.newCandidat.Cnd_Id;
          CandiatTutorCopy.Tut_Id = tutorCopy.Tut_Id;
          CandiatTutorCopy.CndTuteur_ParDefault = tutorCopy.Tut_parDefaut;
        }
        // this.dialogCandidat.StartAddCandidatTutor()

        this.dialogCandidat.ListTutors.push(tutorCopy);
        this.dialogCandidat.ListCandidatTutors.push(CandiatTutorCopy);
        this.dialogCandidat.showForm = false; // Revenir au tableau après l'ajout
        this.dialogCandidat.resetFormTutor();
        this.dialogCandidat.resetFormCandidatTutor();
      } else {
        this.toastr.warning("Veuillez remplir les champs obligatoires (Nom, Prénom, Téléphone)");
      }
    },

    // Réinitialiser le formulaire après l'ajout
    resetFormTutor: () => {
      this.dialogCandidat.newTutor = null;
    },
    resetFormCandidatTutor: () => {
      this.dialogCandidat.newCandidatTutor = null;
    },
    // Fonction pour marquer un tuteur comme par défaut en utilisant Tut_Id
    setDefaultTutor: (tutId: string) => {
      this.dialogCandidat.ListTutors.forEach((tutor) => {
        tutor.Tut_parDefaut = tutor.Tut_Id === tutId;
      });
      // Mettre à jour la liste des relations candidat-tuteur
      this.dialogCandidat.ListCandidatTutors.forEach((candidatTutor) => {
        if (candidatTutor.Tut_Id === tutId) {
          candidatTutor.CndTuteur_ParDefault = true;
        } else {
          candidatTutor.CndTuteur_ParDefault = false;
        }
      });
    },

    // Fonction pour supprimer un tuteur de la liste en utilisant Tut_Id
    deleteTutor: (tutId: string) => {
      // Trouver le tuteur à supprimer
      const tutorToRemove = this.dialogCandidat.ListTutors.find((tutor) => tutor.Tut_Id === tutId);

      if (tutorToRemove) {
        const isDefaultTutor = tutorToRemove.Tut_parDefaut;

        // Supprimer le tuteur de la liste en filtrant
        this.dialogCandidat.ListTutors = this.dialogCandidat.ListTutors.filter((tutor) => tutor.Tut_Id !== tutId);

        // Supprimer l'entrée correspondante dans ListCandidatTutors
        this.dialogCandidat.ListCandidatTutors = this.dialogCandidat.ListCandidatTutors.filter((candidatTutor) => candidatTutor.Tut_Id !== tutId);

        // Vérifier si le tuteur supprimé était le tuteur par défaut
        if (isDefaultTutor && this.dialogCandidat.ListTutors.length > 0) {
          // Définir le premier tuteur restant comme par défaut
          this.dialogCandidat.ListTutors[0].Tut_parDefaut = true;

          // Mettre à jour ListCandidatTutors pour refléter ce changement
          this.dialogCandidat.ListCandidatTutors.forEach((candidatTutor) => {
            candidatTutor.CndTuteur_ParDefault = candidatTutor.Tut_Id === this.dialogCandidat.ListTutors[0].Tut_Id;
          });
        }
      }
    },
    OnSubmit: (modal) => {
      if (!this.dialogCandidat.newCandidat.Niv_Id) {
        this.toastr.warning("Veuillez choisir un niveau");
        return;
      }
      if (!this.dialogCandidat.newCandidat.Cnd_Nom || !this.dialogCandidat.newCandidat.Cnd_Prenom) {
        this.toastr.warning("Veuillez inserer le nom et prenom du candidat");
        return;
      }

      // Trouver l'objet sexe correspondant à l'ID sélectionné
      // const selectedSexe = this.TypeSexeList.find(
      //   (sexe) => sexe.key === this.dialogCandidat.selectedTypeSexe
      // );

      // Assigner l'ID du sexe
      // this.dialogCandidat.newCandidat.Sex_Id = this.dialogCandidat.selectedTypeSexe;
      // this.dialogCandidat.newCandidat.CndTuteur_ParDefault=true
      console.log("this.dialogCandidat.newCandidat :", this.dialogCandidat.newCandidat);
      console.log("this.dialogCandidat.ListTutors : ", this.dialogCandidat.ListTutors);
      console.log("this.dialogCandidat.ListCandidatTutors : ", this.dialogCandidat.ListCandidatTutors);

      this.dialogCandidat.StartAddCandidatFinal();

      this.dialogCandidat.candidatFinal.Candidat = this.dialogCandidat.newCandidat;
      this.dialogCandidat.candidatFinal.Tuteurs = this.dialogCandidat.ListTutors;
      this.dialogCandidat.candidatFinal.CandidatTuteurs = this.dialogCandidat.ListCandidatTutors;

      console.log("this.dialogCandidat.candidatFinal : ", this.dialogCandidat.candidatFinal);

      this.loader.show();
      this.EduosService.CreateCandidat(this.dialogCandidat.candidatFinal).subscribe(
        (response) => {
          console.log("response CreateCandidat: ", response);
          this.loader.hide();
          if (response == null || response == false) {
            this.toastr.error("Erreur de création du candidat");
          } else {
            this.toastr.success("Candidat ajouté avec succès");
            // let newCandidat: any = this.newCandidat;
            // newCandidat.Sex_Nom = selectedSexe ? selectedSexe.libelle : "";
            const selectedSexe = this.TypeSexeList.find((sexe) => sexe.key === this.dialogCandidat.newCandidat.Sex_Id);
            const selectedNiv = this.Enums.Niveaux.find((niveau) => niveau.Niv_Id === this.dialogCandidat.newCandidat.Niv_Id);
            this.dialogCandidat.candidatFinal.Candidat.Sex_Nom = selectedSexe ? selectedSexe.libelle : "Undefined";
            this.dialogCandidat.candidatFinal.Candidat.Niv_Nom = selectedNiv ? selectedNiv.Niv_Nom : "Undefined";
            this.CandidatEnAttente.push(this.dialogCandidat.candidatFinal.Candidat);
            this.dialogCandidat.resetAddNewCandidatForm();
            modal.close();
          }
        },
        (error) => {
          console.error("Erreur CreateCandidat: ", error);
          this.loader.hide();
          this.toastr.error(error?.error, "Erreur de creation du candidat");
        }
      );
    },
    resetAddNewCandidatForm: () => {
      this.dialogCandidat.newCandidat = null;
    },
    resetAddCandidatFinalForm: () => {
      this.dialogCandidat.candidatFinal = null;
    },
    resetAddNewEtudiantForm: () => {
      this.dialogCandidat.newEtudiant = {
        EtdClasseAnn_Id: uuidv4(),
        Etd_Id: null,
        ClasseAnn_Id: null,
      };
    },
    AcceptRejeterCandidat: (Cnd_Id, IsAccepte, content: any) => {
      this.dialogCandidat.selectedCandidat = Cnd_Id
      // this.dialogCandidat.selectedCandidat = candidat;
      const candidature = { Cnd_Id: Cnd_Id, IsAccepte: IsAccepte };
      let candidatEstDansEnAttente = this.CandidatEnAttente.find((c) => c.Cnd_Id == Cnd_Id);
      let candidatEstDansRefuser = this.CandidatsRefuser.find((c) => c.Cnd_Id == Cnd_Id);
      console.log("candidatEstDansEnAttente : ",candidatEstDansEnAttente)
      console.log("candidatEstDansRefuser : ",candidatEstDansRefuser)
      console.log("candidature : ",candidature)

      console.log("candidature : ", candidature);
      Swal.fire({
        title: IsAccepte ? "Voulez-vous acceper le candidat ?" : "Voulez-vous refuser le candidat ?",
        showCancelButton: true,
        confirmButtonText: "Oui",
        confirmButtonColor: "green",
        cancelButtonText: "Annuler",
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          this.loader.show();
          this.EduosService.AccepterRefuserCandidat(candidature).subscribe(
            (response) => {
              console.log("response AccepterRefuserCandidat: ", response);
              this.loader.hide();
              if (response == null || response == false) {
                this.toastr.error("Erreur d'acceptation du candidat");
              } else {
                this.toastr.success("Candidat accepté et ajouté dans la liste des élèves avec succès");

                // let candidat = this.CandidatEnAttente.find((c) => c.Cnd_Id == Cnd_Id);
                // console.log("candidat : ",candidat)
                if (IsAccepte) {
                  if (candidatEstDansEnAttente) {
                  console.log("candidat accepter depuis en attente!!!")
                  this.CandidatAdmis.push(candidatEstDansEnAttente);
                this.CandidatEnAttente = this.CandidatEnAttente.filter((c) => c.Cnd_Id != Cnd_Id);

                    
                  }
                  if (candidatEstDansRefuser) {
                  console.log("candidat accepter depuis refuser!!!")
                  this.CandidatAdmis.push(candidatEstDansRefuser);
                this.CandidatsRefuser = this.CandidatsRefuser.filter((c) => c.Cnd_Id != Cnd_Id);

                      
                  }
                  
                }else{
                  this.CandidatsRefuser.push(candidatEstDansEnAttente);
                this.CandidatEnAttente = this.CandidatEnAttente.filter((c) => c.Cnd_Id != Cnd_Id);

                  console.log("candidat Refuser !!!")
                }
                // if (!IsAccepte) {
                //   if (candidatEstDansEnAttente) {
                //     this.CandidatsRefuser = [...this.CandidatsRefuser, { ...candidatEstDansEnAttente }];
                //   } else if (candidatEstDansRefuser) {
                //     this.CandidatsRefuser = [...this.CandidatsRefuser, { ...candidatEstDansRefuser }];
                //   }
                // }
                


                if (IsAccepte){
                  Swal.fire({
                    title: "Voulez-vous inscrire le candidat dans une classe ?",
                    showCancelButton: true,
                    confirmButtonText: "Oui",
                    confirmButtonColor: "green",
                    cancelButtonText: "Non",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      // Ouvrir le modal si l'utilisateur veut inscrire le candidat
                      this.dialogCandidat.StartAddEtudiant();
                      this.modalService.open(content, {
                        ariaLabelledBy: "modal-basic-title",
                      });
                      
                    } else {
                      this.toastr.info("Candidat accepté sans l'inscrire dans une classe.");
                    }
                  });
                }
              }
            },
            (error) => {
              console.error("Erreur AccepterRefuserCandidat: ", error);
              this.loader.hide();
              this.toastr.error(error?.error, "Erreur d'acceptation du candidat");
            }
          );
        }
      });
    },
    // rejectCandidat: (candidat) => {
    //   this.dialogCandidat.selectedCandidat = candidat;
    //   const RejectCnd = {
    //     Cnd_Id: this.dialogCandidat.selectedCandidat.Cnd_Id,
    //     IsAccepte: false,
    //     CndTuteur_Id: this.dialogCandidat.selectedCandidat.CndTuteur_Id,
    //     Tut_Id: this.dialogCandidat.selectedCandidat.Tut_Id,
    //     // LienParente:this.dialogCandidat.selectedCandidat.LienParente,
    //     LienParente: "testParent",
    //     // CndTuteur_ParDefault:this.dialogCandidat.selectedCandidat.CndTuteur_ParDefault
    //     CndTuteur_ParDefault: true,
    //   };
    //   console.log("Rejected Candidat : ", RejectCnd);
    //   Swal.fire({
    //     title: "Voulez-vous refuser le candidat ?",
    //     showCancelButton: true,
    //     confirmButtonText: "Refuser",
    //     confirmButtonColor: "red",
    //     cancelButtonText: "Annuler",
    //   }).then((result) => {
    //     /* Read more about isConfirmed, isDenied below */
    //     if (result.isConfirmed) {
    //       this.loader.show();
    //       this.EduosService.AccepterRefuserCandidat(RejectCnd).subscribe(
    //         (response) => {
    //           console.log("response AccepterRefuserCandidat: ", response);
    //           if (response == null || response == false) {
    //             this.loader.hide();

    //             this.toastr.error("Erreur de refus du candidat");
    //           } else {
    //             this.loader.hide();
    //             this.toastr.success("Candidat refuser avec succès");
    //             // Supprimer le candidat de la liste CandidatEnAttente
    //             this.CandidatEnAttente = this.CandidatEnAttente.filter((c) => c.Cnd_Id !== candidat.Cnd_Id);

    //             // Ajouter le candidat à la liste CandidatsRefuser
    //             this.CandidatsRefuser.push(candidat);
    //           }
    //         },
    //         (error) => {
    //           console.error("Erreur AccepterRefuserCandidat: ", error);
    //           this.loader.hide();
    //           this.toastr.error(error?.error, "Erreur de refus du candidat");
    //         }
    //       );
    //     }
    //   });
    // },
    onImageSelected: (event) => {
      const file: File = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const base64Logo = e.target.result.split(",")[1]; // Extraire la partie base64
          this.dialogCandidat.newCandidat.Cnd_Photo = base64Logo; // Sauvegarder dans l'objet newEtablissement
        };
        reader.readAsDataURL(file); // Lire le fichier comme une URL de données
      }
    },
    saveClassForStudent: (modal: any) => {
      console.log("Candidat Id: ", this.dialogCandidat.selectedCandidat);
      console.log("selected ClasseAnnee : ", this.dialogCandidat.selectedClasseAnnee);
      if (this.dialogCandidat.selectedClasseAnnee === null || this.dialogCandidat.selectedClasseAnnee === "" || this.dialogCandidat.selectedClasseAnnee === undefined) {
        this.toastr.warning("selectionner une classe annee");
      } else {
        this.dialogCandidat.newEtudiant.Etd_Id = this.dialogCandidat.selectedCandidat;
        this.dialogCandidat.newEtudiant.ClasseAnn_Id = this.dialogCandidat.selectedClasseAnnee;
        console.log("Candidat à inscrire est :", this.dialogCandidat.newEtudiant);
        this.loader.show();
        this.EduosService.CreateEtudiantClasseAnnee([this.dialogCandidat.newEtudiant]).subscribe(
          (response) => {
            this.loader.hide();
            console.log("response CreateEtudiantClasseAnnee: ", response);
            if (response == null || response == false) {
              this.toastr.error("Erreur d'inscription du candidat à la classe");
            } else {
              this.toastr.success("Candidat inscrit avec succès");
            }
          },
          (error) => {
            console.error("Erreur CreateEtudiantClasseAnnee: ", error);
            this.loader.hide();
            this.toastr.error(error?.error, "Erreur d'inscription du candidat");
          }
        );
        modal.close();
        this.dialogCandidat.resetAddNewEtudiantForm();
        this.dialogCandidat.selectedClasseAnnee = null;
      }
    },
  };
  searchParams: { Cnd_DateCandidature: any; Niv_Id: string; Cnd_Nom: string; Cnd_Prenom: string | undefined | null } = {
    Cnd_DateCandidature: null,
    Niv_Id: "",
    Cnd_Nom: "",
    Cnd_Prenom: "",
  };

  Enums: {
    currentAnn_id: any;
    Annees: any[];
    Niveaux: any[];
    ClasseAnnee: any[];
  } = {
    currentAnn_id: null,
    Annees: [],
    Niveaux: [],
    ClasseAnnee: [],
  };

  constructor(
    public appService: AppService,
    config: NgbModalConfig,
    private modalService: NgbModal,
    private EduosService: EduosService,
    private loader: NgxSpinnerService,
    private toastr: ToastrService,
    private title: Title
  ) {
    config.backdrop = "static";
    config.keyboard = false;
    this.EcoleId = localStorage.getItem("EcoleId");
    let ecole = localStorage.getItem("Ecole");
    if (ecole != null) this.title.setTitle(`Candidats - ${JSON.parse(ecole).Ecole_Nom}`);
  } // Inject NgbModal
  ngOnInit(): void {
    this.onWindowResize(null);

    if (this.appService.currentEcole != null) this.title.setTitle(`Candidats - ${this.appService.currentEcole.Ecole_Nom}`);

    this.appService.ecoleEmitter.subscribe((item) => {
      this.title.setTitle(`Candidats - ${item.Ecole_Nom}`);
    });

    this.searchParams.Niv_Id = "00000000-0000-0000-0000-000000000000";
    this.loader.show();
    setTimeout(()=>{
    this.EduosService.GetCommunData([
      `${environment.apiUrl}/api/Configuration/GetAnnees?Ecole_Id=${this.EcoleId}`,
      `${environment.apiUrl}/api/Configuration/GetNiveau/${this.EcoleId}`,
      `${environment.apiUrl}/api/Configuration/GetClasseAnnee?Ecole_Id=${this.EcoleId}&Ann_Id=${this.appService.currentAnnee?.Ann_Id}`,
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
        this.Enums.ClasseAnnee = response[2].sort((a, b) => {
          if (a.Niv_Nom > b.Niv_Nom) return 1;
          if (a.Niv_Nom < b.Niv_Nom) return -1;
          return 0;
        });
      },
      (error) => {
        this.loader.hide();
        console.error("Error GetCommunData: ", error);
      }
    );
    },1000)
  }
  charger() {
    console.log("searchParams: ", this.searchParams);

    this.loader.show();
    this.EduosService.GetCandidats(this.searchParams).subscribe(
      (response) => {
        this.loader.hide();
        console.log("response GetCandidats charger", response);
        if (response == null) {
          this.toastr.error("Erreur de GetCandidats");
        } else {
          this.Candidats = response;

          // Associer chaque candidat avec son Niv_Nom correspondant
          this.Candidats.forEach((candidat) => {
            const niveau = this.Enums.Niveaux.find((n) => n.Niv_Id === candidat.Niv_Id);
            candidat.Niv_Nom = niveau ? niveau.Niv_Nom : "Niveau inconnu";
          });

          // Filtrer les candidats en fonction de IsAccepte
          this.CandidatsRefuser = this.Candidats.filter((candidat) => candidat.IsAccepte === false);
          this.CandidatEnAttente = this.Candidats.filter((candidat) => candidat.IsAccepte === null);
          this.CandidatAdmis = this.Candidats.filter((candidat) => candidat.IsAccepte === true);

          console.log("this.Candidats : ", this.Candidats);
          console.log("CandidatsRefuser: ", this.CandidatsRefuser);
          console.log("CandidatEnAttente: ", this.CandidatEnAttente);
          console.log("CandidatAdmis: ", this.CandidatAdmis);
        }
      },
      (error) => {
        this.loader.hide();
        console.error("Erreur GetCandidats: ", error);
        this.toastr.error(error?.error, "Erreur de GetCandidats");
      }
    );
  }
}
