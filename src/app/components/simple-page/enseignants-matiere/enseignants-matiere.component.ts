import { Component, HostListener, OnInit, Renderer2, TemplateRef, ViewChild, viewChild } from "@angular/core";
import { NgbModal, NgbModalConfig, NgbNavChangeEvent } from "@ng-bootstrap/ng-bootstrap"; // Ensure NgbModal is imported
import { EduosService } from "../../../shared/services/Eduos.service";
import { v4 as uuidv4 } from "uuid";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import Swal from 'sweetalert2'
import { Title } from "@angular/platform-browser";

interface Matiere {
  Mat_Id: string;
  Niv_Id: string;
  Mat_Nom: string;
  Mat_Nbrheure: number;
  Mat_Nbrcredit: number;
  Mat_Description: string;
  Dom_Id: any;
}

interface Niveau {
  Niv_Id: string;
  // Ecole_Id: string;
  Niv_Nom: string;
  NombreClasses: number;
  Niv_Description: string;
  Matieres: Matiere[];
}
export interface Matieree {
  nom: string;
  enseignant: string;
}
export interface Classee {
  Cls_Id: string;
  Niv_Id: string;
  Cls_Nom: string;
  Classe_Description: string;
}
export interface Classe {
  id: number;
  nom: string;
  description?: string;
  matieres: Matieree[];
  showMatieres: boolean;
}

export interface Niveauu {
  nom: string;
  classes: Classe[];
  showClasses: boolean;
}
@Component({
  selector: "app-enseignants-matiere",
  templateUrl: "./enseignants-matiere.component.html",
  styleUrls: ["./enseignants-matiere.component.scss"],
})
export class EnseignantsMatiereComponent implements OnInit {
  @ViewChild("editModal") editModal;
  @ViewChild("addModal") addModal;
  @HostListener("window:resize", ["$event"])
  onWindowResize(event?: Event) {
    const card = document.getElementById("infoCard"); // Récupérer l'élément
  
    if (card) {
      const newHeight = window.innerHeight - 320 + "px"; // Calcul de la hauteur
  
      (card as HTMLElement).style.height = newHeight; // Appliquer la hauteur
      
      console.log("Nouvelle hauteur de la carte :", newHeight);
    }
  }
  resumeConfig: any[] = [];
  newClasse: Classee = {
    Cls_Id: uuidv4(),
    Niv_Id: "",
    Cls_Nom: "",
    Classe_Description: "",
  };
 
  selectedClasse: Classee;
  Enseignants: any[] = [];
  dockManagerConfig: { height: string | null } = { height: null };

  constructor(config: NgbModalConfig, private modalService: NgbModal, private EduosService: EduosService, private loader: NgxSpinnerService, private toastr: ToastrService, private router: Router,private renderer: Renderer2,private title: Title) {
    config.backdrop = "static";
    config.keyboard = false;
    let ecole = localStorage.getItem("Ecole");
    if (ecole != null) this.title.setTitle(`Gestion des classes - ${JSON.parse(ecole).Ecole_Nom}`);
  }
  gridConfig: any = {
    GetVisibleColumns: () => { return this.gridConfig.columns.filter((col) => col.visible); },
    GetEnabledColumns: () => { return this.gridConfig.columns.filter((col) => !col.disableHiding); },
    title: "Classes",
    emptyTemplateText: "Aucun niveau trouvée",
    height: window.innerHeight - 220 + "px",
    rowHeight: "35px",
    transactions: [],
    primaryKey: "Niv_Id",
    batchEditing: true,
    rowEditable: true, 
    allowFiltering: true,
    rowSelection: "multiple",
    cellSelection: "none",
    columnSelection: "none",
    data: [],
    columns: [
      { field: "Niv_Id", header: "Niv_Id", dataType: "string", visible: false, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: true, groupable: true, width: "", },
      { field: "Niv_Nom", header: "Niveau", dataType: "string", visible: true, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },
      
      { field: "Matieres", header: "Matieres", dataType: [], visible: false, sortable: false, resizable: false, filterable: false, editable: false, searchable: false, disableHiding: true, groupable: false, width: "", },
      { field: "Classes", header: "Classes", dataType: [], visible: false, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: true, groupable: true, width: "", },
      { field: "Ecole_Id", header: "Ecole_Id", dataType: "string", visible: false, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: true, groupable: true, width: "", },
      { field: "Ecole_Nom", header: "Ecole", dataType: "string", visible: false, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },
      { field: "FicheFacturations", header: "FicheFacturation", dataType: [], visible: false, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: true, groupable: true, width: "", },
      { field: "Niv_Description", header: "Description", dataType: "string", visible: false, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },
     
    ],
    subGrid: {
      GetVisibleColumns: () => { return this.gridConfig.subGrid.columns.filter((col) => col.visible); },
      GetEnabledColumns: () => { return this.gridConfig.subGrid.columns.filter((col) => !col.disableHiding); },
      primaryKey: 'Cls_Id', key: 'Classes',
      columns: [
        { field: "Cls_Id", header: "Cls_Id", dataType: "string", visible: false, sortable: false, resizable: false, filterable: false, editable: false, searchable: false, disableHiding: true, groupable: false, width: "", },
        { field: "Cls_Nom", header: "Classe", dataType: "string", visible: true, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },
        // { field: "FichFact_Actif", header: "Actif", dataType: "boolean", visible: true, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },
        { field: "Classe_Description", header: "Description", dataType: "string", visible: true, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },
        // { field: "FactFichFact_isDefault", header: "Obligatoire", dataType: "boolean", visible: true, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },
        { field: "MatiereParEnseignant", header: "MatiereParEnseignant", dataType: "string", visible: false, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },
      ]
    },
  };
  refreshSubGrid(niv_Id: string) {
  // 1) Retire l'ancienne ligne si elle existe
  document.getElementById(`subTable_${niv_Id}`)?.remove();

  // 2) Réinitialise le flag pour qu'on puisse rouvrir
  const niv = this.gridConfig.data.find(x => x.Niv_Id === niv_Id);
  if (niv) {
    niv.isSubGridVisible = false;
    // 3) Déroule la sous-grille avec les données mises à jour
    this.ShowHideSubGrid(niv_Id);
  }
}

  ShowHideSubGrid(niv_Id) {
    let niv = this.gridConfig.data.find(x => x.Niv_Id == niv_Id);
    console.log("niv: ", niv);
    if (niv.isSubGridVisible == true) {
      document.getElementById(`subTable_${niv.Niv_Id}`)?.remove();
    } else {
      var targetRow: any = document.getElementById(`row_${niv.Niv_Id}`);
      var newRow = document.createElement("tr");
      newRow.id = `subTable_${niv.Niv_Id}`;
      var mainCell = document.createElement("td");
      mainCell.colSpan = this.gridConfig.columns.length + 1;
      mainCell.style.paddingLeft = "35px";
      mainCell.style.paddingRight = "35px";

      let addButtonHtml = `
      <div class="text-end mb-3">
          <button class="btn btn-primary" id="addClasse_${niv.Niv_Id}" title="Ajouter Classe">
              <i class="fa fa-plus"></i> Ajouter Classe
          </button>
      </div>
      `;

      let ths = "";
      this.gridConfig.subGrid.GetVisibleColumns().forEach((column) => {
        if (column.visible) {
          ths += `<th style="color:white">${column.header}</th>`;
        }
      });
      ths += '<th style="color: white; text-align: left;">Actions</th>';

      let trs = "";
      if (niv.Classes.length === 0) {
        trs += `<tr>
                  <td colspan="${this.gridConfig.subGrid.GetVisibleColumns().length + 1}" 
                      class="text-center">
                    Aucune classe disponible
                  </td>
                </tr>`;
      }else{
      niv.Classes.forEach((item, index) => {
        trs += `<tr>`;
        this.gridConfig.subGrid.GetVisibleColumns().forEach((column) => {
          // Si la valeur est null ou undefined, on renvoie une chaîne vide
          const cellValue = item[column.field] != null ? item[column.field] : '';
          trs += `<td>${cellValue}</td>`;
        });
        let editButtonId = `edit_${item.Cls_Id}_${index}`;
        let deleteButtonId = `delete_${item.Cls_Id}_${index}`;
        trs += `<td>
        <a id="${editButtonId}" class="fs-5 text-warning mx-2" title="Modifier" style="cursor: pointer;">
          <i class="fa fa-edit"></i>
        </a>
        <a id="${deleteButtonId}" class="fs-5 text-danger mx-2" title="Supprimer" style="cursor: pointer;">
          <i class="fa fa-trash"></i>
        </a>
      </td>`;
        trs += `</tr>`;
      });
    }
      mainCell.innerHTML = `${addButtonHtml}<table class="table table-light fixed_header"><thead><tr style="background-color: #6f67fbc4;">${ths}</tr></thead><tbody>${trs}</tbody></table>`;
      newRow.appendChild(mainCell);
      targetRow.parentNode.insertBefore(newRow, targetRow.nextSibling);
      let addButton = document.getElementById(`addClasse_${niv.Niv_Id}`);
      if (addButton) {
        this.renderer.listen(addButton, "click", () => {
          this.openAddClasse(niv,this.addModal);
        });
      }
      niv.Classes.forEach((item, index) => {
        let editButton = document.getElementById(`edit_${item.Cls_Id}_${index}`);
        let deleteButton = document.getElementById(`delete_${item.Cls_Id}_${index}`);

        if (editButton) {
          this.renderer.listen(editButton, "click", () => {
            this.openEditModal(item,this.editModal);
          });
        }

        if (deleteButton) {
          this.renderer.listen(deleteButton, "click", () => {
            this.deleteClasse(item);
          });
        }
      });

      
    }

    this.gridConfig.data = this.gridConfig.data.map((item) => {
      if (item.Niv_Id == niv_Id)
        item.isSubGridVisible = !item.isSubGridVisible;

      return item;
    });
  }
  GetData() {
    this.loader.show();
    this.EduosService.GetEnseignants()
      .subscribe((response) => {
        console.log("response GetEnseignants ", response);
        this.loader.hide()
        if (response == null) {
          this.toastr.error("Erreur de GetEnseignants");
        } else {
          this.Enseignants = response;
          console.log("this.Enseignants : ", this.Enseignants);
        }
      },
        (error) => {
          console.error("Erreur GetEnseignants: ", error);
          this.loader.hide()
          this.toastr.error(error?.error, "Erreur de GetEnseignants");
        }
      );
    this.EduosService.GetResumeConfig().subscribe(
      (response) => {
        this.loader.hide();
        console.log("response GetResumeConfig: ", response);
        if (response == null || response.length == 0) {
          this.toastr.info("Aucune donnée trouvée.");
        } else {
          if (this.gridConfig.data.filter(x => x.isSubGridVisible).length > 0) {
            this.gridConfig.data.filter(x => x.isSubGridVisible).forEach((item) => {
              document.getElementById(`subTable_${item.Niv_Id}`)?.remove();
            })
          }

          let etudiants: any[] = []
          response.forEach((item) => {
            if (etudiants.find(x => x.Niv_Id == item.Niv_Id) == null) {
              etudiants.push({
                Niv_Id: item.Niv_Id,
                Niv_Nom: item.Niv_Nom,
                Niv_Description: item.Niv_Description,
                FicheFacturations: item.FicheFacturations,
                Ecole_Nom: item.Ecole_Nom,
                Ecole_Id: item.Ecole_Id,
                Classes: item.Classes,
                Matieres: item.Matieres,
                isSubGridVisible: false,
              })
            } 
          });

          this.gridConfig.data = etudiants
            .sort((a: any, b: any) => {
              if (a.Niv_Nom > b.Niv_Nom) return 1;
              if (a.Niv_Nom < b.Niv_Nom) return -1;
              return 0;
            })
          this.onWindowResize();        }
      },
      (error) => {
        this.loader.hide();
        console.error("Erreur GetResumeConfig: ", error);
        this.toastr.error(error?.error, "Erreur de GetResumeConfig");
      }
    );
  }
  getEnseignantName(Ens_Id: string): string {
    const enseignant = this.Enseignants.find((ens) => ens.Ens_Id === Ens_Id);
    return enseignant ? enseignant.Ens_Nom + " " + enseignant.Ens_Prenom : "Aucun enseignant";
  }
  
  ngOnInit(): void {
    this.onWindowResize();
    this.GetData();
   
  }


  goToFacturable() {
    this.router.navigate(["/facturables"]);
  }


  
  
  openAddClasse(niveau: Niveau, content: any) {
    console.log("niveau : ",niveau);
    this.newClasse.Niv_Id = niveau.Niv_Id;
    console.log("newClasse avant save", this.newClasse);
    this.modalService.open(content, { ariaLabelledBy: "modal-basic-title" });
  }
  openEditModal(classe: Classee, content: TemplateRef<any>) {
    console.log("classe : ", classe);
    this.selectedClasse = { ...classe }; // Clone the class to avoid direct mutation
    this.modalService.open(content, { ariaLabelledBy: "modal-basic-title" });
  }
  deleteClasse(classe: Classee) {
    console.log("Classe to delete : ", classe.Cls_Id);
    Swal.fire({
      title: "Voulez-vous supprimer la classe ?",
      showCancelButton: true,
      confirmButtonText: "Supprimer",
      confirmButtonColor: "red",
      cancelButtonText: "Annuler"
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.loader.show()
        this.EduosService.DeleteClasse(classe.Cls_Id).subscribe(
          (response) => {
            console.log("response DeleteClasse: ", response);
            if (response == null || response == false) {
              this.loader.hide();
    
              this.toastr.error("Erreur de suppression de la classe");
            } else {
              // Find the niveau containing the class
              // const niveau = this.resumeConfig.find((n) => n.Classes.some((c) => c.Cls_Id === classe.Cls_Id));
              const niveau = this.gridConfig.data.find((n) => n.Classes.some((c) => c.Cls_Id === classe.Cls_Id));
    
              if (niveau) {
                // Find the index of the class to delete
                const classeIndex = niveau.Classes.findIndex((c) => c.Cls_Id === classe.Cls_Id);
    
                if (classeIndex !== -1) {
                  // Remove the class from the niveau's Classes array
                  niveau.Classes.splice(classeIndex, 1);
                  console.log("Classe deleted successfully from UI");
                  this.toastr.success("Classe supprimée avec succès");
                  this.refreshSubGrid(niveau.Niv_Id);
                }
              }
              this.loader.hide();
    
              this.modalService.dismissAll();
            }
          },
          (error) => {
            console.error("Erreur DeleteClasse: ", error);
            this.loader.hide();
            this.toastr.error(error?.error, "Erreur de suppression de la classe");
          }
        );
      }
    });
    
  }
  resetNewClasse() {
    this.newClasse = {
      Cls_Id: uuidv4(),
      Niv_Id: "",
      Classe_Description: "",
      Cls_Nom: "",
    };
  }
  saveNewClass(modal: any) {
    console.log("après envoie newClasse : ", this.newClasse);
    this.loader.show();
    this.EduosService.CreateClasse(this.newClasse).subscribe(
      (response) => {
        console.log("response CreateClasse: ", response);
        if (response == null || response == false) {
          this.loader.hide();

          this.toastr.error("Erreur de création de la classe");
        } else {
          // Assuming `response` contains the new class information after creation
          const createdClasse = response;

          // Find the niveau to which the new class will be added
          const niv = this.resumeConfig.find((n) => n.Niv_Id === this.newClasse.Niv_Id);
          const niveau = this.gridConfig.data.find((n) => n.Niv_Id === this.newClasse.Niv_Id);

          if (niveau) {
            // Add the new class to the niveau's Classes array
            niveau.Classes.push(this.newClasse);
            console.log("Classe ajouté avec succès dans l'UI", this.newClasse);
            this.refreshSubGrid(niveau.Niv_Id);
          }
          this.toastr.success("Classe créé avec succès");
          this.loader.hide();

          this.modalService.dismissAll();
          this.resetNewClasse();
        }
      },
      (error) => {
        console.error("Erreur CreateClasse: ", error);
        this.loader.hide();
        this.toastr.error(error?.error, "Erreur de création de la classe");
      }
    );
  }
  saveClass(modal: any) {
    // Debugging: Check selectedClass and niveaux
    console.log("Selected Class:", this.selectedClasse);

    // Find the niveau containing the selectedClass
    // const niveau = this.resumeConfig.find((n) => n.Classes.some((c) => c.Cls_Id === this.selectedClasse.Cls_Id));
    const niveau = this.gridConfig.data.find((n) => n.Classes.some((c) => c.Cls_Id === this.selectedClasse.Cls_Id));
    console.log("niveau : ", niveau);
    if (niveau) {
      // Find index of the class in the niveau
      const classeIndex = niveau.Classes.findIndex((c) => c.Cls_Id === this.selectedClasse.Cls_Id);
      console.log("Classe Index:", classeIndex);

      if (classeIndex !== -1) {
        // Update the class

        console.log("Updated Class:", { ...this.selectedClasse });
        this.loader.show();
        this.EduosService.UpdateClasse(niveau.Classes[classeIndex].Cls_Id, { ...this.selectedClasse }).subscribe(
          (response) => {
            console.log("response UpdateClasse: ", response);
            if (response == null || response == false) {
              this.loader.hide();

              this.toastr.error("Erreur de modification de la classe");
            } else {
              niveau.Classes[classeIndex] = { ...this.selectedClasse };
              this.toastr.success("Classe modifié avec succès");
              this.refreshSubGrid(niveau.Niv_Id);
              this.loader.hide();

              this.modalService.dismissAll();
            }
          },
          (error) => {
            console.error("Erreur UpdateClasse: ", error);
            this.loader.hide();
            this.toastr.error(error?.error, "Erreur de modification de la classe");
          }
        );
      } else {
        console.error("Classe non trouvée dans le niveau.");
        this.toastr.error("Classe non trouvée dans le niveau.");
      }
    } else {
      console.error("Niveau non trouvé pour la classe sélectionnée.");
      this.toastr.error("Niveau non trouvé pour la classe sélectionnée.");
    }

    modal.close(); // Close the modal
  }
}
