import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnInit,Renderer2 ,ViewChild} from "@angular/core";
import { NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
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
  Dom_Id: string;
  Dom_Nom: string;
}

interface Niveau {
  Niv_Id: string;
  Ecole_Id: string;
  Niv_Nom: string;
  NombreClasses: number;
  Niv_Description: string;
  Matieres: Matiere[];
}

@Component({
  selector: "app-niveaux",
  templateUrl: "./niveaux.component.html",
  styleUrls: ["./niveaux.component.scss"],
})
export class NiveauxComponent implements OnInit {
  showModalFlag = false;
  niveauToDelete2 : any = null;
@ViewChild('editsubjectModal',{static:false}) editsubjectModal: any;
@ViewChild('subjectModal',{static:false}) subjectModal: any;

  @HostListener("window:resize", ["$event"])
  onWindowResize(event?: Event) {
    const card = document.getElementById("infoCard"); // Récupérer l'élément
  
    if (card) {
      const newHeight = window.innerHeight - 340 + "px"; // Calcul de la hauteur
  
      (card as HTMLElement).style.height = newHeight; // Appliquer la hauteur
      
      console.log("Nouvelle hauteur de la carte :", newHeight);
    }
  }

  showSearchParams: boolean = true;
  dockManagerConfig: { height: string | null } = { height: null };


  formatter = new Intl.NumberFormat('en-US');

  
  niveauToDelete: number | null = null;

  gridConfig: any = {
    GetVisibleColumns: () => { return this.gridConfig.columns.filter((col) => col.visible); },
    GetEnabledColumns: () => { return this.gridConfig.columns.filter((col) => !col.disableHiding); },
    title: "Niveaux",
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
      // { field: "Cls_Id", header: "Cls_Id", dataType: "string", visible: false, sortable: false, resizable: false, filterable: false, editable: false, searchable: false, disableHiding: true, groupable: false, width: "", },
      // { field: "Fact_Id", header: "Fact_Id", dataType: "string", visible: false, sortable: false, resizable: false, filterable: false, editable: false, searchable: false, disableHiding: true, groupable: false, width: "", },
      // { field: "Niv_Id", header: "Niv_Id", dataType: "string", visible: false, sortable: false, resizable: false, filterable: false, editable: false, searchable: false, disableHiding: true, groupable: false, width: "", },
      // { field: "Tut_Id", header: "Tut_Id", dataType: "string", visible: false, sortable: false, resizable: false, filterable: false, editable: false, searchable: false, disableHiding: true, groupable: false, width: "", },

      { field: "Matieres", header: "Matieres", dataType: [], visible: false, sortable: false, resizable: false, filterable: false, editable: false, searchable: false, disableHiding: true, groupable: false, width: "", },
      { field: "Classes", header: "Classes", dataType: [], visible: false, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: true, groupable: true, width: "", },
      { field: "Ecole_Id", header: "Ecole_Id", dataType: "string", visible: false, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: true, groupable: true, width: "", },
      { field: "Ecole_Nom", header: "Ecole", dataType: "string", visible: false, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },
      { field: "FicheFacturations", header: "FicheFacturation", dataType: [], visible: false, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: true, groupable: true, width: "", },
      { field: "Niv_Description", header: "Description", dataType: "string", visible: false, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },
      // { field: "TelephoneTuteurs", header: "Tel tuteurs", dataType: "string", visible: true, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },

      // { field: "nivTuteur_ParDefault", header: "Tuteur Par Défaut", dataType: "boolean", visible: false, sortable: false, resizable: false, filterable: false, editable: false, searchable: false, disableHiding: false, groupable: false, width: "", },
      // { field: "Etd_Mail", header: "Email", dataType: "string", visible: false, sortable: false, resizable: false, filterable: false, editable: false, searchable: false, disableHiding: false, groupable: false, width: "", },
      // { field: "Etd_Tel", header: "Téléphone", dataType: "string", visible: false, sortable: false, resizable: false, filterable: false, editable: false, searchable: false, disableHiding: false, groupable: false, width: "", },
      // { field: "LienParente", header: "Lien de Parenté", dataType: "string", visible: false, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },
      // { field: "Vers_NomList", header: "Versements", dataType: "string", visible: true, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },
      // { field: "MontantTotalARegler", header: "Total a régler (FCFA)", dataType: "number", visible: true, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", isMontant: true, },

      // { field: "Tut_NomComplet", header: "Nom Complet Tuteur", dataType: "string", visible: false, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },
      // { field: "Tut_Tel", header: "Téléphone Tuteur", dataType: "string", visible: false, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },

    ],
    subGrid: {
      GetVisibleColumns: () => { return this.gridConfig.subGrid.columns.filter((col) => col.visible); },
      GetEnabledColumns: () => { return this.gridConfig.subGrid.columns.filter((col) => !col.disableHiding); },
      primaryKey: 'Mat_Id', key: 'Matieres',
      columns: [
        { field: "Mat_Id", header: "Mat_Id", dataType: "string", visible: false, sortable: false, resizable: false, filterable: false, editable: false, searchable: false, disableHiding: true, groupable: false, width: "", },
        { field: "Mat_Nom", header: "Matiere", dataType: "string", visible: true, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },
        { field: "Mat_Nbrcredit", header: "Credit", dataType: "number", visible: true, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },
        { field: "Mat_Nbrheure", header: "Heure", dataType: "number", visible: true, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },
        { field: "Dom_Nom", header: "Domaine", dataType: "string", visible: true, sortable: true, resizable: true, filterable: false, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", isMontant: true, },

        // { field: "Dom_Nom", header: "Domaine", dataType: "string", visible: true, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", isMontant: true, },
        // { field: "Actions", header: "Action", dataType: "string", visible: true, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", isMontant: true, },
        // { field: "Reliquat", header: "Reliquat", dataType: "number", visible: true, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", isMontant: true, },
        // { field: "Vers_Dateprevu", header: "Date Prévue", dataType: "date", visible: true, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },
        // { field: "Vers_Estregle", header: "Est Réglé", dataType: "boolean", visible: false, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },
        // { field: "Vers_Remise", header: "Remise", dataType: "number", visible: true, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", isMontant: true, },
        // { field: "Vers_Remarque", header: "Remarque", dataType: "string", visible: false, sortable: false, resizable: false, filterable: false, editable: false, searchable: false, disableHiding: false, groupable: false, width: "", },
      ]
    },

    // ExportExcel: (args: IgxExporterEvent) => {
    //   if (this.gridConfig.data == null || this.gridConfig.data.length == 0) {
    //     this.toastr.info("Rien à exporter");
    //     return;
    //   }
    //   args.options.fileName = "Recouvrement";
    // },
  };
  // EtudiantVersements: [] = [];
  rowsData: any;
  columnsData: any;


  searchParams: any = {
    Vers_Dateprevu: null,
    Niv_Id: "00000000-0000-0000-0000-000000000000",
    Fact_Id: "00000000-0000-0000-0000-000000000000",
    Ann_Id: "00000000-0000-0000-0000-000000000000",
    Cls_Id: "00000000-0000-0000-0000-000000000000",
    Etd_Nom: "",
    Etd_Prenom: "",
    Etd_Matricule: "",
    Vers_Nom: "",
    TelephoneTuteur: "",
  };
  Domaines: any[] = [];
  selectedDomaineId: string = "";
  DomainesWithParent: any[] = [];
  DomainesName: any[] = [];

  selectedDomaineWithParent: any = {};
  resumeConfig: any[] = [];

  levels: Niveau[] = [];
  newLevel: Niveau = {
    Niv_Id: uuidv4(),
    Ecole_Id: null,
    Niv_Nom: "",
    NombreClasses: 0,
    Niv_Description: "",
    Matieres: [],
  };
  newSubject: Matiere = {
    Mat_Id: uuidv4(),
    Niv_Id: this.newLevel.Niv_Id,
    Mat_Nom: "",
    Mat_Nbrheure: 0,
    Mat_Nbrcredit: 0,
    Mat_Description: "",
    Dom_Id: null,
    Dom_Nom: null,
  };

  editingLevelIndex: number | null = null;
  editingSubjectIndex: number | null = null;
  currentLevelIndex: number | null = null;
  isEditMode = false;

  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private EduosService: EduosService,
    private loader: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef,
    private title: Title) {
      let ecole = localStorage.getItem("Ecole");
    if (ecole != null) this.title.setTitle(`Niveaux - ${JSON.parse(ecole).Ecole_Nom}`);
    config.backdrop = "static";
    config.keyboard = false;
  }


  Niveaux: any = [];
  formatDate(val) {
    if (val == null || val == "") return null;
    let d = new Date(val);
    return ("0" + (d.getDate())).slice(-2) + "/" + ("0" + (d.getMonth() + 1)).slice(-2) + "/" + d.getFullYear();
  }
  ngOnInit(): void {
    this.onWindowResize()
    this.GetData();
    this.loader.show();
    // this.EduosService.GetDomaines().subscribe(
    //   (response) => {
    //     console.log("response GetDomaines ", response);
    //     this.loader.hide();
    //     if (response == null) {
    //       this.toastr.error("Erreur de GetDomaines");
    //     } else {
    //       this.Domaines = response;
    //     }
    //   },
    //   (error) => {
    //     console.error("Erreur GetDomaines: ", error);
    //     this.loader.hide();
    //     this.toastr.error(error?.error, "Erreur de GetDomaines");
    //   }
    // );
    this.EduosService.GetDomaines().subscribe(
      (response) => {
        this.loader.hide();
        console.log("response GetDomaines ", response);
        if (response == null) {
          this.toastr.error("Erreur de récuperation des domaines");
        } else {
          this.Domaines = response;
          this.DomainesWithParent = response;
        }
      },
      (error) => {
        console.error("Erreur GetDomaines: ", error);
        this.loader.hide();
        this.toastr.error(error?.error, "Erreur de GetDomaines");
      });

    this.loader.show();
    this.EduosService.GetResumeConfig()
      .subscribe((response) => {
        this.loader.hide();
        console.log("response GetResumeConfig: ", response);
        if (response == null) {
          this.toastr.error("Erreur de recuperation des niveaux");
        } else {
          this.resumeConfig = response;
          this.Niveaux = response
        }
      },
        (error) => {
          console.error("Erreur GetResumeConfig: ", error);
          this.loader.hide();
          this.toastr.error(error?.error, "Erreur de GetResumeConfig");
        });
  }
  GetData() {
    this.loader.show();
    this.EduosService.GetResumeConfig().subscribe(
      (response) => {
        this.loader.hide();
        console.log("response gridConfig.data: ", response);
        if (response == null) {
          this.toastr.error("Erreur de gridConfig.data");
        }
        else if (response.length == 0) {
          this.toastr.info("Aucun résultat trouvé");
        }
        else {
          if (this.gridConfig.data.filter(x => x.isSubGridVisible).length > 0) {
            this.gridConfig.data.filter(x => x.isSubGridVisible).forEach((item) => {
              document.getElementById(`subTable_${item.Niv_Id}`)?.remove();
            })
          }
          // this.EtudiantVersements = response.map((item) => {
          //   item.Etd_NomComplet = item.Etd_Nom + " " + item.Etd_Prenom;
          //   return item;
          // });

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
                Etd_Mail: item.Etd_Mail,
                Matieres: item.Matieres,
                isSubGridVisible: false,
              })
            } else {
              etudiants = etudiants.map((e) => {
                if (e.Niv_Id == item.Niv_Id) 
                  e.Versements.push(item);
                return e;
              })
            }
          });

          this.gridConfig.data = etudiants
            .sort((a: any, b: any) => {
              if (a.Niv_Nom > b.Niv_Nom) return 1;
              if (a.Niv_Nom < b.Niv_Nom) return -1;
              return 0;
            })
          // .slice(0, 100);
          this.onWindowResize();
        }
      },
      (error) => {
        this.loader.hide();
        console.error("Erreur GetEtudiantVersements: ", error);
        this.toastr.error(error?.error, "Erreur de GetEtudiantVersements");
      }
    );
  }
 // document.getElementById("subTable_${etd_id}").querySelector("td").colSpan = 7
 ShowHideSubGrid(niv_id) {
  
  let niv = this.gridConfig.data.find(x => x.Niv_Id == niv_id)
  console.log("niv: ", niv)
  if (niv.isSubGridVisible == true) {
    document.getElementById(`subTable_${niv.Niv_Id}`)?.remove();
  } else {
    // Get the target row element
    var targetRow: any = document.getElementById(`row_${niv.Niv_Id}`);

    var newRow = document.createElement("tr");
    newRow.id = `subTable_${niv.Niv_Id}`

    var mainCell = document.createElement("td");
    // mainCell.colSpan = this.gridConfig.GetVisibleColumns().length + 1;
    mainCell.colSpan = this.gridConfig.columns.length + 1;
    mainCell.style.paddingLeft = "35px";
    mainCell.style.paddingRight = "35px";


     // ✅ **Ajout du bouton "Ajouter Discipline"**
     let addButtonHtml = `
     <div class="text-end mb-3">
         <button class="btn btn-primary" id="addDiscipline_${niv.Niv_Id}" title="Ajouter Discipline">
             <i class="fa fa-plus"></i> Ajouter Discipline
         </button>
     </div>
    `;

    // table header
    let ths = ""
    this.gridConfig.subGrid.GetVisibleColumns().forEach((column) => {
      if (column.visible){
        ths += `<th style="color: white; text-align: left;">${column.header}</th>`;

      }

    })
    ths += '<th style="color: white; text-align: left;">Actions</th>';

    // table rows
    let trs = "";
    if (niv.Matieres.length === 0) {
      trs += `<tr>
                <td colspan="${this.gridConfig.subGrid.GetVisibleColumns().length + 1}" 
                    class="text-center">
                  Aucune matière disponible
                </td>
              </tr>`;
    }else{
    niv.Matieres.forEach((item,index) => {
      trs += `<tr>`
      // table values
      this.gridConfig.subGrid.GetVisibleColumns().forEach((column) => {
        let textAlign = column.dataType == 'string' ? 'left' : column.dataType == 'number' ? 'right' : column.dataType == 'date' ? 'center' : 'center';
        trs += `<td style="text-align: ${textAlign}">`
        switch (column.dataType) {
          case 'string': trs += `<span>${item[column.field]}</span>`; break;
          case 'number':
            if (column.isMontant) {
              // let montant = this.formatPrice(item[column.field], 'EUR');
              let montant = item[column.field];
              trs += `<span>${montant}</span>`;
            }
            else trs += `<span>${item[column.field]}</span>`;
            break;

          case 'date':
            let date = item[column.field];
            date = date != null ? this.formatDate(date) : "";
            trs += `<span>${date}</span>`; break;

          case 'boolean':
            let result = "";
            if (item[column.field] == true)
              result = '<i class="fa fa-check"></i></';
            trs += `<span>${result}</span>`;
            break;
          default: trs += `<span>${item[column.field]}</span>`; break;
        }
        // <span>
        //   <span>${item[column.field]}</span>
        // </span>
        trs += `</td>`
      })
      let editButtonId = `edit_${niv.Niv_Id}_${index}`;
      let deleteButtonId = `delete_${niv.Niv_Id}_${index}`;
      trs += `<td>
      <a id="${editButtonId}" class="fs-4 text-warning mx-2" title="Modifier" style="cursor: pointer;">
        <i class="fa fa-edit"></i>
      </a>
      <a id="${deleteButtonId}" class="fs-4 text-danger mx-2" title="Supprimer" style="cursor: pointer;">
        <i class="fa fa-trash"></i>
      </a>
    </td>`;
trs += `</tr>`;
    })
  }
    mainCell.innerHTML = `${addButtonHtml}<table class="table table-light fixed_header"><thead><tr style="background: linear-gradient(to right,#764ba2,#45b7d1);">${ths}</tr></thead><tbody>${trs}</tbody></table>`;
    newRow.appendChild(mainCell);
    targetRow.parentNode.insertBefore(newRow, targetRow.nextSibling);

    // **Attacher les événements après le rendu**
    niv.Matieres.forEach((item, index) => {
      let editButton = document.getElementById(`edit_${niv.Niv_Id}_${index}`);
      let deleteButton = document.getElementById(`delete_${niv.Niv_Id}_${index}`);

      if (editButton) {
        this.renderer.listen(editButton, "click", () => {
          this.openSubjectModal(index, item, this.editsubjectModal);
        });
      }

      if (deleteButton) {
        this.renderer.listen(deleteButton, "click", () => {
          this.removeSubject(niv_id, index, item);
        });
      }
    });
    // ✅ **Attacher l'événement du bouton "Ajouter Discipline"**
    let addButton = document.getElementById(`addDiscipline_${niv.Niv_Id}`);
    if (addButton) {
        this.renderer.listen(addButton, "click", () => {
            this.openSubjectModal(niv_id, null, this.subjectModal);
        });
    }
  }



  this.gridConfig.data = this.gridConfig.data.map((item) => {
    if (item.Niv_Id == niv_id)
      item.isSubGridVisible = !item.isSubGridVisible;
    return item;
  })
}
  openLevelModal(level: Niveau | null, content: any): void {
    this.isEditMode = !!level;
    if (level) {
      this.newLevel = { ...level };
      this.editingLevelIndex = this.resumeConfig.indexOf(level);
    } else {
      this.resetLevelForm();
      this.editingLevelIndex = null;
    }
    this.modalService.open(content, { ariaLabelledBy: "modal-basic-title" });
  }

  UpdateNiveau(modal: any): void {
    if (this.isEditMode && this.editingLevelIndex !== null) {
      this.loader.show()
      this.EduosService.UpdateNiveau(this.newLevel.Niv_Id, { ...this.newLevel })
        .subscribe((response) => {
          this.loader.hide();
          console.log("response UpdateNiveau: ", response);
          if ((response == null || response == false) || response == undefined) {
            this.toastr.error("Erreur de mofification du niveau");
          } else {
            this.toastr.success("Niveau modifié avec succès");
            
            this.resetLevelForm();
            modal.close();
            this.resumeConfig[this.editingLevelIndex] = { ...this.newLevel };
          }
        },
          (error) => {
            console.error("Erreur UpdateNiveau: ", error);
            this.loader.hide();
            this.toastr.error(error?.error, "Erreur de modification du niveau");
          });
      this.resumeConfig[this.editingLevelIndex] = { ...this.newLevel };
      //modifie gridConfig.data
      this.gridConfig.data = this.gridConfig.data.map((niv) => {
        if (niv.Niv_Id == this.newLevel.Niv_Id) {
          niv.Niv_Nom = this.newLevel.Niv_Nom;
          niv.Niv_Description = this.newLevel.Niv_Description;
          return niv;
        }
        return niv;
      });

    }

  }
  CreateNiveau(modal: any): void {
    if (this.isEditMode && this.editingLevelIndex !== null) {
      this.resumeConfig[this.editingLevelIndex] = { ...this.newLevel };
    } else {
      this.loader.show();
      this.EduosService.CreateNiveaux([{ ...this.newLevel }]).subscribe(
        (response) => {
          this.loader.hide();
          if (response == null || response == false) {
            this.toastr.error("Erreur d'ajout de niveau")
          } else {
            this.resumeConfig.push({ ...this.newLevel });
            this.gridConfig.data.push({ ...this.newLevel });
            this.toastr.success("Niveaux ajouté avec succès");
            this.resetLevelForm();
            modal.close();
          }
        },
        (error) => {
          this.loader.hide();
          this.toastr.error("Erreur de création des niveaux");
        });
    }

  }

  // Réinitialiser le formulaire du niveau
  resetLevelForm(): void {
    this.newLevel = {
      Niv_Id: uuidv4(),
      Ecole_Id: null,
      Niv_Nom: "",
      NombreClasses: 0,
      Niv_Description: "",
      Matieres: [],
    };
    this.isEditMode = false;
  }
  




      showModal(niv) {
        this.niveauToDelete2 = niv;
        this.showModalFlag = true;
    }

    hideModal() {
      this.niveauToDelete2 = null;
        this.showModalFlag = false;
    }

    confirmDelete() {
      this.loader.show();

      this.EduosService.DeleteNiveau(this.niveauToDelete2)
        .subscribe(
          (response) => {
            console.log("response DeleteNiveau: ", response);
            this.loader.hide();
            this.hideModal();

            if (response == null || response == false) {
              Swal.fire(
                "Erreur de suppression du niveau",
                "Vous ne pouvez pas supprimer un niveau qui contient des classes.",
                "error"
              );
            } else {
              this.toastr.success("Niveau supprimé avec succès");
              this.resumeConfig = this.resumeConfig.filter(
                x => x.Niv_Id !== this.niveauToDelete2?.Niv_Id
              );
              this.gridConfig.data = this.gridConfig.data.filter(
                x => x.Niv_Id !== this.niveauToDelete2?.Niv_Id
              );
              this.GetData()
            }

            this.niveauToDelete2 = null;
          },
          (error) => {
            console.error("Erreur DeleteNiveau: ", error);
            this.loader.hide();
            this.toastr.error(error?.error, "Erreur de suppression du niveau");
            this.hideModal();
            this.niveauToDelete2 = null;
          }
        );
      }






  DeleteNiveau(niv_id): void {
    /*Swal.fire({
      title: "Voulez-vous supprimer le niveau?",
      showCancelButton: true,
      confirmButtonText: "Supprimer",
      confirmButtonColor: "red",
      cancelButtonText: "Annuler"
    }).then((result) => {
      
      if (result.isConfirmed) {
        this.loader.show()
        this.EduosService.DeleteNiveau(niv_id)
          .subscribe(
            (response) => {
              console.log("response DeleteNiveau: ", response);
              this.loader.hide();
              if (response == null || response == false) {
                // this.toastr.error("Erreur de suppression du niveau");
                Swal.fire("Erreur de suppression du niveau", "Vous ne pouvez pas supprimer un niveau qui contient des classes.", "error");

              } else {
                this.toastr.success("Niveau supprimé avec succès");
                this.resumeConfig = this.resumeConfig.filter(x => x.Niv_Id != niv_id);
                this.gridConfig.data = this.gridConfig.data.filter(x => x.Niv_Id !== niv_id);
              }
            },
            (error) => {
              console.error("Erreur DeleteNiveau: ", error);
              this.loader.hide();
              this.toastr.error(error?.error, "Erreur de suppression du niveau");
            });
      }
    });*/


  }

  openSubjectModal(levelIndex: any, subject: any | null, content: any): void {
    console.log("Works update")
    console.log(levelIndex)
    console.log(subject)
    this.currentLevelIndex = levelIndex;
    if (subject) {
      this.newSubject = { ...subject };
      this.selectedDomaineWithParent = { Dom_Id: subject.Dom_Id }; // Initialiser Dom_Id avec la valeur actuelle

      this.editingSubjectIndex = this.resumeConfig[levelIndex].Matieres.indexOf(subject);
    } else {
      this.selectedDomaineId = this.selectedDomaineWithParent.Dom_Id;
      this.newSubject = {
        Mat_Id: uuidv4(),
        // Niv_Id: this.resumeConfig[levelIndex].Niv_Id,
        Niv_Id: levelIndex,
        Mat_Nom: "",
        Mat_Nbrheure: 0,
        Mat_Nbrcredit: 0,
        Mat_Description: "",
        Dom_Id: null,
        Dom_Nom: null,
      };
      this.editingSubjectIndex = null;
    }
    this.modalService.open(content, { ariaLabelledBy: "modal-basic-title" });
    console.log(this.newSubject)
  }
  
  

  saveSubject(modal: any): void {
    console.log(this.currentLevelIndex)
    
    if (this.currentLevelIndex !== null) {
      this.newSubject.Dom_Id = this.selectedDomaineWithParent.Dom_Id;
      if (this.newSubject.Dom_Id == undefined || this.newSubject.Dom_Id == "")
        this.newSubject.Dom_Id = null;

      if (this.editingSubjectIndex !== null) {
        this.resumeConfig[this.currentLevelIndex].Matieres[this.editingSubjectIndex] = { ...this.newSubject };
        return
      } 
      
      else {
        // assossier le nom du domaine à la matière
        // this.gridConfig.data = this.gridConfig.data.map((niv) => {
        //   this.newSubject.Dom_Nom = this.Domaines.find(x => x.Dom_Id == this.newSubject.Dom_Id)?.Dom_Nom
        //   if (niv.Niv_Id == this.newSubject.Niv_Id) {
        //     niv.Matieres.push({ ...this.newSubject });
        //     return niv;
        //   }
        //   return niv;
        // });
        // ici je doit appelé la fonction de creation de matiere
        
        // const exists = this.resumeConfig[this.currentLevelIndex].Matieres.some((subject) => subject.Mat_Nom === this.newSubject.Mat_Nom);
        
        // if (!exists) {
          this.loader.show();
          console.log("la matière a ajouté est : ", { ...this.newSubject })
          // this.newSubject.Dom_Nom = this.Domaines.find(x => x.Dom_Id == this.newSubject.Dom_Id)?.Dom_Nom
          this.EduosService.CreateMatiere({ ...this.newSubject })
            .subscribe((response) => {
              console.log("response CreateMatiere: ", response)
              this.loader.hide();
              // Swal.fire("Succès", "Matière ajouté avec succès", "success");

              if (response == null || response == false)
                this.toastr.error("Erreur de création de la matière");
              else {
                this.toastr.success("Matière ajouté avec succès");
                // this.resumeConfig[this.currentLevelIndex].Matieres.push({ ...this.newSubject });
                this.gridConfig.data = this.gridConfig.data.map((niv) => {
                  this.newSubject.Dom_Nom = this.Domaines.find(x => x.Dom_Id == this.newSubject.Dom_Id)?.Dom_Nom
                  if (niv.Niv_Id == this.newSubject.Niv_Id) {
                    niv.Matieres.push({ ...this.newSubject });
                    return niv;
                  }
                  return niv;
                });
                this.resetSubjectForm();
                modal.close();
              }
            }, (error) => {
              console.error("error CreateMatiere: ", error)
              this.loader.hide();
              this.toastr.error("Erreur de création de matière");
            });

        // } else {
          // this.toastr.warning("Cette matière existe déjà.", "Duplication détectée");
        // }
      }
    }
  }
  saveEditSubject(modal: any): void {
    if (this.currentLevelIndex !== null) {
      // Assigner la valeur sélectionnée de domaine
      this.newSubject.Dom_Id = this.selectedDomaineWithParent.Dom_Id;
      this.newSubject.Dom_Nom = this.Domaines.find(x => x.Dom_Id == this.newSubject.Dom_Id)?.Dom_Nom;
      console.log("this.newSubject.Dom_Id : ", this.newSubject.Dom_Id);

      if (this.editingSubjectIndex !== null) {
        this.loader.show();
        console.log("Objet envoyé pour la mise à jour : ", this.newSubject);

        this.EduosService.UpdateMatiere(this.newSubject.Mat_Id, this.newSubject)
          .subscribe((response) => {
            console.log("response UpdateMatiere: ", response);
            this.loader.hide();

            if ((response == null || response == false) || response == undefined) {
              Swal.fire("Erreur", "Erreur de modification de la matière.", "error");
            } else {
              this.toastr.success("Matière modifiée avec succès");
            }
          },
            (error) => {
              console.error("Erreur UpdateMatiere: ", error);
              this.loader.hide();
              this.toastr.error(error?.error, "Erreur de modification de la matière");
            });
        this.resumeConfig[this.currentLevelIndex].Matieres[this.editingSubjectIndex] = { ...this.newSubject };

       
        // this.gridConfig.data=this.gridConfig.data.map((niv)=>{
        //   if(niv.Niv_Id == this.newSubject.Niv_Id){
        //       niv.Matieres = niv.Matieres.map((mat)=>{
        //         if(mat.Mat_Id == this.newSubject.Mat_Id){  mat.Mat_Nom =null;}
        //         return mat;
        //       })
        //   return niv;
        // }});

        // Mise à jour dans gridConfig
      let niveauIndex = this.gridConfig.data.findIndex(niv => niv.Niv_Id === this.newSubject.Niv_Id);
      if (niveauIndex !== -1) {
          let matiereIndex = this.gridConfig.data[niveauIndex].Matieres.findIndex(mat => mat.Mat_Id === this.newSubject.Mat_Id);
          if (matiereIndex !== -1) {
              // 🔥 Mutation explicite pour forcer Angular à détecter le changement
              console.log("matiereIndex : ",matiereIndex)
              this.gridConfig.data[niveauIndex].Matieres[matiereIndex] = { ...this.newSubject };

              console.log("this.gridConfig.data[niveauIndex].Matieres[matiereIndex] : ",this.gridConfig.data[niveauIndex].Matieres[matiereIndex])
              console.log("this.newSubject : ",{...this.newSubject})

          }
      }

      console.log("Mise à jour réussie dans gridConfig.data", this.gridConfig.data);


      this.gridConfig.data = [...this.gridConfig.data];

    
        

      }

      this.resetSubjectForm();
      modal.close();
    }
  }
  // Réinitialiser le formulaire de matière
  resetSubjectForm(): void {
    this.newSubject = { Mat_Id: uuidv4(), Niv_Id: this.newLevel.Niv_Id, Mat_Nom: "", Mat_Nbrheure: 0, Mat_Nbrcredit: 0, Mat_Description: "", Dom_Id: null, Dom_Nom: null }; // Réinitialiser les valeurs du formulaire
    this.editingSubjectIndex = null;
    this.currentLevelIndex = null;
  }

  removeSubject(levelIndex: number, subjectIndex: number, subject: Matiere): void {
    // console.log(levelIndex)
    // console.log(subjectIndex)
    // console.log(subject)
    Swal.fire({
      title: "Voulez-vous supprimer la matière?",
      showCancelButton: true,
      confirmButtonText: "Supprimer",
      confirmButtonColor: "red",
      cancelButtonText: "Annuler"
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.loader.show()
        this.EduosService.DeleteMatiere(subject.Mat_Id).subscribe(
          (response) => {
            console.log("response DeleteMatiere: ", response);
            if ((response == null || response == false) || response == undefined) {
              this.loader.hide();
              Swal.fire("Erreur de suppression de la matière", "Vous ne pouvez pas supprimer une matière associée à des classes.", "error");

              // this.toastr.error("Erreur de suppression de la matière");
            } else {
              // this.toastr.success("Niveau modifié avec succès");
              Swal.fire("Succès", "Matière supprimé avec succès", "success");
              this.resumeConfig[levelIndex].Matieres.splice(subjectIndex, 1);
              this.loader.hide();
            }
          },
          (error) => {
            console.error("Erreur DeleteMatiere: ", error);
            this.loader.hide();
            this.toastr.error(error?.error, "Erreur de suppression de la matière");
          }
        );
      }
    });


  }

  onSubmit() {
    this.loader.show();
    this.EduosService.CreateNiveaux(this.resumeConfig).subscribe(
      (response) => {
        this.toastr.success("Niveaux ajouté avec succès");
        this.loader.hide();
        this.goToFacturable();
      },
      (error) => {
        this.loader.hide();
        this.toastr.error("Erreur de création des niveaux");
      }
    );
  }
  goToFacturable() {
    this.router.navigate(["/facturables"]);
  }
}