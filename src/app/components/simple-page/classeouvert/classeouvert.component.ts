import { Component, HostListener, OnDestroy, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { NgbModal, NgbModalConfig, NgbNavChangeEvent } from "@ng-bootstrap/ng-bootstrap"; // Ensure NgbModal is imported
import { EduosService } from "../../../shared/services/Eduos.service";
import { v4 as uuidv4 } from "uuid";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { AppService } from "../../../shared/services/app.service";
import Swal from "sweetalert2";
import { IgxExporterEvent, IgxGridComponent } from "igniteui-angular";
import { Title } from "@angular/platform-browser";
import { Subscription } from "rxjs";

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
  selector: "app-classeouvert",
  templateUrl: "./classeouvert.component.html",
  styleUrl: "./classeouvert.component.scss",
})
export class ClasseouvertComponent implements OnInit ,OnDestroy{
  newClasseAnneeMatiere: { ClsAnnMat_Id: any; ClasseAnn_Id: any; Mat_Id: any; Ens_Id: any; Description: any };
  @HostListener("window:resize", ["$event"])
  onWindowResize($event) {
    // console.log("onResize: ", $event);
    setTimeout(() => {
      // let searchBarHeight = document.getElementById("searchBar")?.clientHeight;
      // if (searchBarHeight == null || searchBarHeight == undefined || searchBarHeight == 0) {
      //   searchBarHeight = 0;
      // } else {
      //   searchBarHeight += 25;
      // }
      // searchBarHeight -= 20;
      // this.gridEtudiantsConfig.height = window.innerHeight - searchBarHeight - 230 + "px";
      this.gridConfig.height = window.innerHeight - 230 + "px";
      // console.log(searchBarHeight, window.innerHeight, this.dockManagerConfig.height);
    }, 100);
  }
  @ViewChild("Grid", { read: IgxGridComponent, static: false }) public Grid: IgxGridComponent;
  gridConfig: any = {
    GetVisibleColumns: () => {
      return this.gridConfig.columns.filter((col) => col.visible);
    },
    GetEnabledColumns: () => {
      return this.gridConfig.columns.filter((col) => !col.disableHiding);
    },
    title: "Classe ouverte",
    emptyTemplateText: "Aucune classe année trouvée",
    height: "100%", //window.innerHeight - 350 + "px",
    rowHeight: "35px",
    transactions: [],
    primaryKey: "ClasseAnn_Id",
    batchEditing: true,
    rowEditable: true,
    allowFiltering: true,
    rowSelection: "single",
    cellSelection: "none",
    columnSelection: "none",
    data: [],
    columns: [
      {
        field: "ClasseAnn_Id",
        header: "Classe Année Id",
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
        field: "Classe_Description",
        header: "Description",
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
        header: "Classe Id",
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
        field: "Niv_Id",
        header: "Niveau Id",
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
        field: "Ann_Id",
        header: "Année Id",
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
    ],

    ExportExcel: (args: IgxExporterEvent) => {
      if (this.gridConfig.data == null || this.gridConfig.data.length == 0) {
        this.toastr.info("Rien à exporter");
        return;
      }
      args.options.fileName = "Recouvrement";
    },
  };
  // ClasseAnneeMatiere: any[] = [];
  Matieres: any[] = [];
  // selectedClasseAnneeMatiere: any;
  Enseignants: any[] = [];
  selectAll: boolean = false;
  ClasseAnnee: any;
  Classes: any;
  // selectedClasseAnnee: any;
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
    private router: Router,
    private title: Title
  ) {
    let ecole = localStorage.getItem("Ecole");
    if (ecole != null) this.title.setTitle(`Classe ouverte - ${JSON.parse(ecole).Ecole_Nom}`);
    console.log("constructor");
    config.backdrop = "static";
    config.keyboard = false;
    this.EcoleId = localStorage.getItem("EcoleId");
  }
  currentStep: number = 1;

  getData() {
    this.onWindowResize(null);
      this.loader.show();
      this.EduosService.GetAnnees().subscribe(
        (response) => {
          console.log("response GetAnnees ", response);
          // this.loader.hide();
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
            // this.loader.hide();

            this.toastr.error("Erreur de GetEnseignants");
          } else {
            this.Enseignants = response;
            console.log("this.Enseignants : ", this.Enseignants);
            // this.loader.hide();
          }
        },
        (error) => {
          console.error("Erreur GetEnseignants: ", error);
          // this.loader.hide();
          this.toastr.error(error?.error, "Erreur de GetEnseignants");
        }
      );
      setTimeout(() => {
        console.log("this.appService.currentAnnee: ", this.appService.currentAnnee);
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
              this.gridConfig.data = this.ClasseAnnee;
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
  private _subs = new Subscription();
  
  ngOnInit(): void {
    console.log("ClasseOuverteComponent initialized");
    this._subs.add(
      this.appService.anneeEmitter.subscribe((annee) => {
       this.getData();
      
      })
    );

    
    this.getData();
  }

  ngOnDestroy(): void {
    this._subs.unsubscribe();
    console.log("Unsubscribed from all subscriptions in ClasseOuverteComponent");
  }

  //#region dialogClasseAnneeMatieres
  dialogClasseAnneeMatieres: {
    ClasseAnnee: any;
    ClasseAnneeMatieres: any[];
    newClasseAnneeMatiere: any;
    ClasseAnneeMatiereToEdit: any;
    Open: Function;
    Clear: Function;
    Close: Function;
    StartAddMatiere: Function;
    ClearAddMatiere: Function;
    CloseAddMatiere: Function;
    SubmitAddMatiere: Function;
    StartEditEnseignant: Function;
    SubmitEditEnseignant: Function;
    CloseEditEnseignant: Function;
  } = {
    ClasseAnnee: null,
    ClasseAnneeMatieres: [],
    Open: (item: any, modal) => {
      console.log("item : ", item);
      this.dialogClasseAnneeMatieres.ClasseAnnee = item;
      // this.newClasseAnneeMatiere.ClasseAnn_Id = item.ClasseAnn_Id;

      this.loader.show();
      this.EduosService.GetClasseAnneeMatiere(item.ClasseAnn_Id).subscribe(
        (response) => {
          this.loader.hide();
          console.log("response GetClasseAnneeMatiere: ", response);
          if (response == null) {
            this.toastr.error("Erreur de GetClasseAnneeMatiere");
          } else {
            this.loader.hide();
            // Remove the deleted class from the ClasseAnnee array
            this.dialogClasseAnneeMatieres.ClasseAnneeMatieres = response;
          }
        },
        (error) => {
          console.error("Erreur DeleteClasseAnnee: ", error);
          this.loader.hide();
          this.toastr.error(error?.error, "Erreur de suppression de la classe ouverte");
        }
      );
      this.EduosService.GetMatieres(item.Niv_Id).subscribe(
        (response) => {
          // this.loader.hide();
          console.log("response GetMatieres: ", response);
          if (response == null) {
            this.toastr.error("Erreur de GetMatieres");
          } else {
            // this.loader.hide();
            this.Matieres = response;
          }
        },
        (error) => {
          console.error("Erreur DeleteClasseAnnee: ", error);
          this.loader.hide();
          this.toastr.error(error?.error, "Erreur de suppression de la classe ouverte");
        }
      );

      this.modalService.open(modal, {
        ariaLabelledBy: "modal-basic-title",
        size: "xl",
      });
    },
    Clear: () => {
      this.dialogClasseAnneeMatieres.ClasseAnnee = null;
      this.dialogClasseAnneeMatieres.ClasseAnneeMatieres = [];
    },
    Close: (modal: any) => {
      this.dialogClasseAnneeMatieres.Clear();
      modal.close();
    },

    // -----------------------------------------------------------
    // --- dialogAddMatiere --------------------------------------
    // -----------------------------------------------------------
    newClasseAnneeMatiere: null,
    StartAddMatiere: (content: any) => {
      this.dialogClasseAnneeMatieres.newClasseAnneeMatiere = {
        ClsAnnMat_Id: uuidv4(),
        ClasseAnn_Id: this.dialogClasseAnneeMatieres.ClasseAnnee.ClasseAnn_Id,
        Mat_Id: null,
        Ens_Id: null,
        Description: null,
      };
      this.modalService.open(content, {
        ariaLabelledBy: "dialoguecandidat",
        fullscreen: false,
        size: "xl",
      });
    },
    ClearAddMatiere: () => {
      this.dialogClasseAnneeMatieres.newClasseAnneeMatiere = null;
    },
    CloseAddMatiere: (modal: any) => {
      this.dialogClasseAnneeMatieres.ClearAddMatiere();
      modal.close();
    },
    SubmitAddMatiere: (modal: any) => {
      if (
        this.dialogClasseAnneeMatieres.newClasseAnneeMatiere.Mat_Id == null ||
        this.dialogClasseAnneeMatieres.newClasseAnneeMatiere.Mat_Id == "" ||
        this.dialogClasseAnneeMatieres.newClasseAnneeMatiere.Ens_Id == null ||
        this.dialogClasseAnneeMatieres.newClasseAnneeMatiere.Mat_Id == ""
      ) {
        this.toastr.warning("Veuillez sélectionner une matière");
        return;
      }

      this.dialogClasseAnneeMatieres.newClasseAnneeMatiere.Mat_Nom = this.Matieres.find((x) => x.Mat_Id == this.dialogClasseAnneeMatieres.newClasseAnneeMatiere.Mat_Id)?.Mat_Nom;
      this.dialogClasseAnneeMatieres.newClasseAnneeMatiere.Ens_Nom = this.Enseignants.find((x) => x.Ens_Id == this.dialogClasseAnneeMatieres.newClasseAnneeMatiere.Ens_Id)?.Ens_Nom;
      this.dialogClasseAnneeMatieres.newClasseAnneeMatiere.Ens_Prenom = this.Enseignants.find((x) => x.Ens_Id == this.dialogClasseAnneeMatieres.newClasseAnneeMatiere.Mat_Id)?.Ens_Prenom;
      this.dialogClasseAnneeMatieres.newClasseAnneeMatiere.Cls_Nom = this.dialogClasseAnneeMatieres.ClasseAnnee.Cls_Nom;

      this.loader.show();
      this.EduosService.CreateClasseAnneeMatiere(this.dialogClasseAnneeMatieres.newClasseAnneeMatiere).subscribe(
        (response) => {
          console.log("response CreateClasseAnneeMatiere: ", response);
          this.loader.hide();
          if (response == null || response == false) {
            this.toastr.error("Erreur de création de la matière de la classe ouverte");
          } else {
            this.toastr.success("Matière de la classe ouverte créé avec succès");
            this.dialogClasseAnneeMatieres.ClasseAnneeMatieres.push(this.dialogClasseAnneeMatieres.newClasseAnneeMatiere);

            this.dialogClasseAnneeMatieres.ClearAddMatiere();
            modal.close();
          }
        },
        (error) => {
          console.error("Erreur CreateClasseAnneeMatiere: ", error);
          this.loader.hide();
          this.toastr.error(error?.error, "Erreur de creation de la matière de la classe ouverte");
        }
      );
    },

    // -----------------------------------------------------------
    // --- dialogEditEnseignant ----------------------------------
    // -----------------------------------------------------------
    ClasseAnneeMatiereToEdit: null,
    StartEditEnseignant: (modal: any, ClsAnnMat_Id: string) => {
      this.dialogClasseAnneeMatieres.ClasseAnneeMatiereToEdit = this.dialogClasseAnneeMatieres.ClasseAnneeMatieres.find((x) => x.ClsAnnMat_Id == ClsAnnMat_Id);
      console.log("this.dialogClasseAnneeMatieres.ClasseAnneeMatiereToEdit: ", this.dialogClasseAnneeMatieres.ClasseAnneeMatiereToEdit);
      this.modalService.open(modal, {
        ariaLabelledBy: "modal-basic-title",
        fullscreen: false,
      });
    },
    SubmitEditEnseignant: (modal: any) => {
      if (this.dialogClasseAnneeMatieres.ClasseAnneeMatiereToEdit.Ens_Id == null || this.dialogClasseAnneeMatieres.ClasseAnneeMatiereToEdit.Ens_Id == "") {
        this.toastr.warning("Veuillez sélectionner un enseignant");
        return;
      }
      this.loader.show();
      this.EduosService.UpdateClasseAnneeMatiere(this.dialogClasseAnneeMatieres.ClasseAnneeMatiereToEdit.ClsAnnMat_Id, this.dialogClasseAnneeMatieres.ClasseAnneeMatiereToEdit).subscribe(
        (response) => {
          console.log("response UpdateClasseAnneeMatiere: ", response);
          this.loader.hide();
          if (response == null || response == false) {
            this.toastr.error("Erreur de modification de l'affectation");
          } else {
            this.toastr.success("Affectation modifié avec succès");
            this.dialogClasseAnneeMatieres.ClasseAnneeMatieres = this.dialogClasseAnneeMatieres.ClasseAnneeMatieres.map((item) => {
              if (this.dialogClasseAnneeMatieres.ClasseAnneeMatiereToEdit.ClsAnnMat_Id == item.ClsAnnMat_Id) {
                item.Ens_Nom = this.Enseignants.find((x) => x.Ens_Id == this.dialogClasseAnneeMatieres.ClasseAnneeMatiereToEdit.Ens_Id)?.Ens_Nom;
                item.Ens_Prenom = this.Enseignants.find((x) => x.Ens_Id == this.dialogClasseAnneeMatieres.ClasseAnneeMatiereToEdit.Ens_Id)?.Ens_Prenom;
              }
              return item;
            });
            modal.close();
          }
        },
        (error) => {
          console.error("Erreur UpdateClasseAnneeMatiere: ", error);
          this.loader.hide();
          this.toastr.error(error?.error, "Erreur de modification de ClasseAnneeMatiere");
        }
      );
    },
    CloseEditEnseignant: (modal: any) => {
      this.dialogClasseAnneeMatieres.ClasseAnneeMatiereToEdit = null;
      modal.close();
    },
  };

  //#endregion dialogClasseAnneeMatieres

  deleteClasseAnnee(item: any) {
    const id = item.ClasseAnn_Id;
    this.loader.show();
    // Vérification préalable via CanDelete
    this.EduosService.CanDelete(id, "ClasseAnnee").subscribe(
      (response) => {
        this.loader.hide();
        if (response == null) {
          this.toastr.error("Erreur lors de la vérification de la suppression.", "Erreur");
        } else if (response?.Can_Delete === false) {
          // La suppression est impossible
          this.toastr.warning("La suppression de cette classe est impossible car elle contient des élèves inscrit.", "Suppression impossible");
        } else if (response?.Can_Delete === true) {
          // Affichage de la confirmation de suppression
          Swal.fire({
            title: "Êtes-vous sûr ?",
            text: "Vous êtes sur le point de supprimer cette classe. Cette action est irréversible.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Oui, supprimer",
            cancelButtonText: "Annuler",
          }).then((result) => {
            if (result.isConfirmed) {
              console.log("Classe année à supprimer : ", id);

              // Ajout de l'ID à la liste des classes à supprimer
              this.ListClasseAnn_Id.push(id);
              this.loader.show();

              // Appel du service de suppression
              this.EduosService.DeleteClasseAnnee(this.ListClasseAnn_Id).subscribe(
                (response) => {
                  this.loader.hide();
                  if (response == null || response == false) {
                    this.toastr.error("Erreur de suppression de la classe ouverte");
                  } else {
                    // Suppression de la classe de la liste affichée
                    this.gridConfig.data = this.gridConfig.data.filter((item) => item.ClasseAnn_Id !== id);
                    this.toastr.success("Classe ouverte supprimée avec succès");
                  }

                  // Réinitialisation de la liste des classes supprimées
                  this.ListClasseAnn_Id = [];
                },
                (error) => {
                  this.loader.hide();
                  console.error("Erreur DeleteClasseAnnee: ", error);
                  this.toastr.error(error?.error, "Erreur de suppression de la classe ouverte");
                }
              );
            }
          });
        } else {
          console.warn("case not hededled !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        }
      },
      (error) => {
        console.error("Erreur CanDelete: ", error);
        this.toastr.error("Erreur lors de la vérification de la suppression.", "Erreur");
      }
    );
  }

  //#region dialogClasseAnnee
  dialogClasseAnnee: {
    currentStep: number;
    selectedAnnee: any;
    ClasseAOuvrir: any[];
    selectedClasseOuvrir: any[];
    Open: Function;
    Clear: Function;
    Close: Function;
    goToStep: Function;
    nextStep: Function;
    toggleAllSelections: Function;
    submitClasseAnnee: Function;
  } = {
    currentStep: 1,
    selectedAnnee: null,
    ClasseAOuvrir: [],
    selectedClasseOuvrir: [],
    goToStep: (step: number) => {
      this.dialogClasseAnnee.currentStep = step;
    },
    nextStep: (modal: any) => {
      if (this.dialogClasseAnnee.currentStep === 1) {
        if (!this.dialogClasseAnnee.selectedAnnee) {
          this.toastr.warning("Veuillez sélectionner une année");
          return;
        }
        this.loader.show();
        this.EduosService.GetClassesAOuvrir(this.dialogClasseAnnee.selectedAnnee, this.EcoleId).subscribe(
          (response) => {
            this.loader.hide();
            if (response == null) {
              this.toastr.error("Erreur de recureption des classe a ouvrir");
            } else {
              this.dialogClasseAnnee.ClasseAOuvrir = response;
              this.dialogClasseAnnee.goToStep(2);
            }
          },
          (error) => {
            this.loader.hide();
            this.toastr.error(error?.error, "Erreur de GetClassesAOuvrir");
          }
        );
      } else {
        this.loader.hide();
        this.dialogClasseAnnee.selectedClasseOuvrir = this.dialogClasseAnnee.ClasseAOuvrir.filter((classe) => classe.selected);
        this.dialogClasseAnnee.submitClasseAnnee(modal);
      }
    },
    toggleAllSelections: () => {
      this.dialogClasseAnnee.ClasseAOuvrir.forEach((classe) => (classe.selected = this.selectAll));
    },
    Open: (modal) => {
      this.dialogClasseAnnee.currentStep = 1;
      this.modalService.open(modal, {
        ariaLabelledBy: "modal-basic-title",
        size: "xl",
      });
    },
    Clear: () => {
      this.dialogClasseAnnee.selectedAnnee = null;
      this.dialogClasseAnnee.ClasseAOuvrir = [];
      this.dialogClasseAnnee.selectedClasseOuvrir = [];
    },
    Close: (modal: any) => {
      this.dialogClasseAnnee.Clear();
      modal.close();
    },
    submitClasseAnnee: (modal: any) => {
      let params = { Ann_Id: this.dialogClasseAnnee.selectedAnnee };
      if (!this.dialogClasseAnnee.selectedClasseOuvrir || this.dialogClasseAnnee.selectedClasseOuvrir.length === 0) {
        this.toastr.warning("Aucune classe sélectionnée.");
        return;
      }
      this.dialogClasseAnnee.selectedClasseOuvrir.forEach((classe) => {
        classe.ClasseAnn_Id = uuidv4();
        classe.Ann_Id = this.dialogClasseAnnee.selectedAnnee;
      });
      this.loader.show();
      this.EduosService.CreateClasseAnnee(this.dialogClasseAnnee.selectedClasseOuvrir).subscribe(
        (response) => {
          if (response == null || response == false) {
            this.loader.hide();
            this.toastr.error("Erreur d'ouverture de la classe");
          } else {
            this.EduosService.GetClasseAnnee(params).subscribe(
              (response) => {
                if (response == null || response == false) {
                  this.toastr.error("Erreur de GetClasseAnnee");
                  this.loader.hide();
                } else {
                  this.ClasseAnnee = response;
                  this.gridConfig.data = this.ClasseAnnee;
                  this.loader.hide();
                }
              },
              (error) => {
                this.toastr.error(error?.error, "Erreur de GetClasseAnnee");
                this.loader.hide();
              }
            );
            this.toastr.success("Classes ouvertes avec succès");
            this.loader.hide();
            this.modalService.dismissAll();
            this.dialogClasseAnnee.Clear();
          }
        },
        (error) => {
          this.loader.hide();
          this.toastr.error(error?.error, "Erreur d'ouverture de la classe");
        }
      );
    },
  };
  //#endregion dialogClasseAnnee

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
  Exporter() {
    this.EduosService.Exporter("Classe ouverte", this.gridConfig.GetVisibleColumns(), this.gridConfig.data);
  }
}
