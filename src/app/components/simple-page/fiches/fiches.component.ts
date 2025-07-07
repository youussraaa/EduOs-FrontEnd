import { ChangeDetectionStrategy, Component, HostListener, OnInit,Renderer2, ViewChild } from "@angular/core";
import { NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import { EduosService } from "../../../shared/services/Eduos.service";
import { v4 as uuidv4 } from "uuid";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { environment } from "src/environments/environment";
import { Title } from "@angular/platform-browser";

interface FacturableFicheFacturation {
  FactFicheFact_Id: string;
  Fact_Id: string;
  FichFact_Id: string;
  FactFichFact_Montant: number;
  FactFichFact_Description: string;
  Fact_Nom: string;
}

interface FicheFacturation {
  FichFact_Id: string;
  Ecole_Id: string;
  // Ann_Id: string;
  FichFact_Nom: string;
  FichFact_Description: string;
  Niv_Id: string;
  // Ann_Nom: string;
  isSubGridVisible: boolean;
  FacturableFicheFacturation: FacturableFicheFacturation[];
  FichFact_Actif: boolean;
}

@Component({
  selector: "app-fiches",
  templateUrl: "./fiches.component.html",
  styleUrls: ["./fiches.component.scss"],
})
export class FichesComponent implements OnInit {
  @ViewChild('ficheFacturationModal',{static:false}) ficheFacturationModal: any;
@ViewChild('facturableModal',{static:false}) facturableModal: any;
@HostListener("window:resize", ["$event"])
      onWindowResize(event?: Event) {
        const card = document.getElementById("infoCard"); // Récupérer l'élément
      
        if (card) {
          const newHeight = window.innerHeight - 300 + "px"; // Calcul de la hauteur
      
          (card as HTMLElement).style.height = newHeight; // Appliquer la hauteur
          
          console.log("Nouvelle hauteur de la carte :", newHeight);
        }
      }
      dockManagerConfig: { height: string | null } = { height: null };

  resumeConfig: any;
  selectedDomaineWithParent: any = {};
  DomainesWithParent: any[] = [];
  selectedFacturable: any = {};
  Facturables: any = {};

  Enums: {
    VersementReccurence: any[],
  } = {
    VersementReccurence: [],
    }

  newFicheFacturation: FicheFacturation = {
    FichFact_Id: uuidv4(),
    Ecole_Id: null,
    // Ann_Id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    Niv_Id: "",
    FichFact_Nom: "",
    FichFact_Description: "",
    // Ann_Nom: "",
    isSubGridVisible: false,
    FacturableFicheFacturation: [],
    FichFact_Actif: null,
  };

  newFacturableFicheFacturation: FacturableFicheFacturation = {
    FactFicheFact_Id: uuidv4(),
    FichFact_Id: null,
    Fact_Id: null,
    FactFichFact_Description: null,
    FactFichFact_Montant: 0,
    Fact_Nom: null,
  };
  selectedFicheFacturation: any;
  selectedFacturableName: string = "";
  facturableAmount: number = 0;
  editingFicheFacturationId: string;
  editingFacturableIndex: number;
  currentFicheId: string;
  isEditMode = false;
  selectedRow: number | null = null; // Track the selected row
  EcoleId: string;
  // Enums: {
  //   Facturable: any[],
  // } = {
  //   Facturable : [],
  //   }

  constructor(config: NgbModalConfig, private modalService: NgbModal, private EduosService: EduosService, private renderer: Renderer2,private loader: NgxSpinnerService, private toastr: ToastrService, private router: Router,private title: Title) {
    config.backdrop = "static";
    config.keyboard = false;
    this.EcoleId = localStorage.getItem("EcoleId");
    let ecole = localStorage.getItem("Ecole");
    if (ecole != null) this.title.setTitle(`Fiches de facturation - ${JSON.parse(ecole).Ecole_Nom}`);
  }
  gridConfig: any = {
    GetVisibleColumns: () => { return this.gridConfig.columns.filter((col) => col.visible); },
    GetEnabledColumns: () => { return this.gridConfig.columns.filter((col) => !col.disableHiding); },
    title: "Fiches",
    emptyTemplateText: "Aucune fiche trouvée",
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
      primaryKey: 'FichFact_Id', key: 'FicheFacturations',
      columns: [
        { field: "FichFact_Id", header: "FichFact_Id", dataType: "string", visible: false, sortable: false, resizable: false, filterable: false, editable: false, searchable: false, disableHiding: true, groupable: false, width: "", },
        { field: "FichFact_Nom", header: "Facturable", dataType: "string", visible: true, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },
        { field: "FichFact_Actif", header: "Actif", dataType: "boolean", visible: true, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },
        { field: "FichFact_Description", header: "Description", dataType: "string", visible: true, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },
        // { field: "FactFichFact_isDefault", header: "Obligatoire", dataType: "boolean", visible: true, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },
        { field: "FacturableFicheFacturation", header: "FacturableFicheFacturation", dataType: "string", visible: false, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },
      ]
    },
  };
  // ngOnInit(): void {
  //   this.onWindowResize()
  //   this.loader.show();
  //   this.EduosService.GetFacturable().subscribe(
  //     (response) => {
  //       console.log("response GetFacturable ", response);
  //       if (response == null || response.length == 0) {
  //         this.loader.hide();

  //         this.toastr.info("Aucun Facturable trouvé");
  //       } else {
  //         this.Facturables = response;
  //         console.log("this.Facturables With Parent : ", this.Facturables);
  //         this.loader.hide();
  //       }
  //     },
  //     (error) => {
  //       console.error("Erreur GetFacturable: ", error);
  //       this.loader.hide();
  //       this.toastr.error(error?.error, "Erreur de GetFacturable");
  //     }
  //   );
  //   this.EduosService.GetResumeConfig().subscribe(
  //     (response) => {
  //       this.loader.show();

  //       console.log("response GetResumeConfig: ", response);
  //       if (response == null || response.length == 0) {
  //         this.loader.hide();

  //         this.toastr.info("Aucune donnée trouvée.");
  //       } else {
  //         this.resumeConfig = response;
  //         this.loader.hide();
  //       }
  //     },
  //     (error) => {
  //       console.error("Erreur GetResumeConfig: ", error);
  //       this.loader.hide();
  //       this.toastr.error(error?.error, "Erreur de GetResumeConfig");
  //     }
  //   );
  //   this.EduosService.GetCommunData([
  //     `${environment.apiUrl}/api/Configuration/GetVersementReccurence`,
  //   ])
  //     .subscribe((response: any[]) => {
  //       console.log("Response GetCommunData: ", response)
  //       this.Enums.VersementReccurence = response[0];
  //     }, (error) => {
  //       console.error("Error GetCommunData: ", error)
  //     })
      
  //   this.newFicheFacturation = {
  //     FichFact_Id: uuidv4(),
  //     Ecole_Id: this.EcoleId,
  //     // Ann_Id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  //     Niv_Id: "",
  //     FichFact_Nom: "",
  //     FichFact_Description: "",
  //     // Ann_Nom: "",
  //     showFacturables: false,
  //     FacturableFicheFacturation: [],
  //     FichFact_Actif: null,
  //   };
  // }
  ngOnInit(): void {
    this.onWindowResize();
    this.GetData();
    this.loader.show();
    this.EduosService.GetFacturable().subscribe(
      (response) => {
        console.log("response GetFacturable ", response);
        if (response == null || response.length == 0) {
          this.loader.hide();
          this.toastr.info("Aucun Facturable trouvé");
        } else {
          this.Facturables = response;
          console.log("this.Facturables With Parent : ", this.Facturables);
          this.loader.hide();
        }
      },
      (error) => {
        console.error("Erreur GetFacturable: ", error);
        this.loader.hide();
        this.toastr.error(error?.error, "Erreur de GetFacturable");
      }
    );
    // this.EduosService.GetResumeConfig().subscribe(
    //   (response) => {
    //     this.loader.show();
    //     console.log("response GetResumeConfig: ", response);
    //     if (response == null || response.length == 0) {
    //       this.loader.hide();
    //       this.toastr.info("Aucune donnée trouvée.");
    //     } else {
    //       this.gridConfig.data = response;
    //       this.loader.hide();
    //     }
    //   },
    //   (error) => {
    //     console.error("Erreur GetResumeConfig: ", error);
    //     this.loader.hide();
    //     this.toastr.error(error?.error, "Erreur de GetResumeConfig");
    //   }
    // );
    this.EduosService.GetCommunData([
      `${environment.apiUrl}/api/Configuration/GetVersementReccurence`,
    ])
      .subscribe((response: any[]) => {
        console.log("Response GetCommunData: ", response);
        this.Enums.VersementReccurence = response[0];
      }, (error) => {
        console.error("Error GetCommunData: ", error);
      });
  }

  GetData() {
    this.loader.show();
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
          // .slice(0, 100);
          this.onWindowResize();        }
      },
      (error) => {
        this.loader.hide();
        console.error("Erreur GetResumeConfig: ", error);
        this.toastr.error(error?.error, "Erreur de GetResumeConfig");
      }
    );
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
          <button class="btn btn-primary" id="addFacturable_${niv.Niv_Id}" title="Ajouter Facturable">
              <i class="fa fa-plus"></i> Ajouter Facturable
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
      if (niv.FicheFacturations.length === 0) {
        trs += `<tr>
                  <td colspan="${this.gridConfig.subGrid.GetVisibleColumns().length + 1}" 
                      class="text-center">
                    Aucune fiche de facturation disponible
                  </td>
                </tr>`;
      }else{
      niv.FicheFacturations.forEach((item, index) => {
        trs += `<tr>`;
        this.gridConfig.subGrid.GetVisibleColumns().forEach((column) => {
          trs += `<td>${item[column.field]}</td>`;
        });
        let editButtonId = `edit_${item.FichFact_Id}_${index}`;
        let deleteButtonId = `delete_${item.FichFact_Id}_${index}`;
        let showFacturablesButtonId = `showFacturables_${item.FichFact_Id}_${index}`;
        trs += `<td>
        <a id="${editButtonId}" class="fs-5 text-warning mx-2" title="Modifier" style="cursor: pointer;">
          <i class="fa fa-edit"></i>
        </a>
        <a id="${deleteButtonId}" class="fs-5 text-danger mx-2" title="Supprimer" style="cursor: pointer;">
          <i class="fa fa-trash"></i>
        </a>
        <a id="${showFacturablesButtonId}" class="fs-5 text-info mx-2" title="Afficher Facturables" style="cursor: pointer;">
          <i class="fa fa-bars"></i>
      </td>`;
        trs += `</tr>`;
      });
    }
      mainCell.innerHTML = `${addButtonHtml}<table class="table table-light fixed_header"><thead><tr style="background-color: #6f67fbc4;">${ths}</tr></thead><tbody>${trs}</tbody></table>`;
      newRow.appendChild(mainCell);
      targetRow.parentNode.insertBefore(newRow, targetRow.nextSibling);

      niv.FicheFacturations.forEach((item, index) => {
        let editButton = document.getElementById(`edit_${item.FichFact_Id}_${index}`);
        let deleteButton = document.getElementById(`delete_${item.FichFact_Id}_${index}`);
        let showFacturablesButtonId = document.getElementById(`showFacturables_${item.FichFact_Id}_${index}`);
        let addButton = document.getElementById(`addFacturable_${niv.Niv_Id}`);

        if (editButton) {
          this.renderer.listen(editButton, "click", () => {
            this.openFicheFacturationModal(item,this.ficheFacturationModal,index);
          });
        }

        if (deleteButton) {
          this.renderer.listen(deleteButton, "click", () => {
            this.removeFicheFacturation(item);
          });
        }
        if (showFacturablesButtonId) {
          this.renderer.listen(showFacturablesButtonId, "click", () => {
            console.log("clicked")
            this.openDetailFicheFacturation(item,this.facturableModal);
          });
          if (addButton) {
            this.renderer.listen(addButton, "click", () => {
              this.openFicheFacturationModal(null,this.ficheFacturationModal,niv.Niv_Id);
            });
          }
        }
      });

      
    }

    this.gridConfig.data = this.gridConfig.data.map((item) => {
      if (item.Niv_Id == niv_Id)
        item.isSubGridVisible = !item.isSubGridVisible;
      // item.isSubGridVisible = item.showFacturables; // Mise à jour de isSubGridVisible

      return item;
    });
  }
  openFicheFacturationModal(ficheFacturation: FicheFacturation | null, content: any, niv_id: any): void {
    this.isEditMode = !!ficheFacturation;
    const niv_Id=niv_id

    if (ficheFacturation) {
      // Edit mode: Load existing fiche details into the form
      this.newFicheFacturation = { ...ficheFacturation };
    } else {
      console.log("Add mode")
      console.log("niv_Id : ",niv_Id)
      // Add mode: Initialize new fiche facturation
      this.newFicheFacturation = {
        FichFact_Id: uuidv4(),
        Ecole_Id: this.EcoleId,
        // Ann_Id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        Niv_Id: niv_Id,
        FichFact_Nom: null,
        FichFact_Description: null,
        // Ann_Nom: "",
        isSubGridVisible: false,
        FacturableFicheFacturation: [],
        FichFact_Actif: null,
      };
    }

    this.modalService.open(content, { ariaLabelledBy: "modal-basic-title" });
  }

  openDetailFicheFacturation(ficheFacturation: any, content: any) {
    this.editingFicheFacturationId = ficheFacturation.FichFact_Id;
    
    if (ficheFacturation) {
      this.newFacturableFicheFacturation = {
        FactFicheFact_Id: uuidv4(),
        Fact_Id: this.selectedFacturable.Fact_Id,
        FichFact_Id: ficheFacturation.FichFact_Id,
        FactFichFact_Description: null,
        FactFichFact_Montant: 0,
        Fact_Nom: null,
      };

      this.selectedFicheFacturation = ficheFacturation.FacturableFicheFacturation || [];
      console.log("this.selectedFicheFacturation : ", this.selectedFicheFacturation);
    } else {
      this.selectedFicheFacturation = [];
    }

    this.modalService.open(content, {
      ariaLabelledBy: "modal-basic-title",
      size: "xl",
    });
  }
  saveFicheFacturation(modal: any): void {
    if (this.isEditMode && this.editingFicheFacturationId !== null) {
      // Edit mode: Update the existing FicheFacturation
      // const level = this.resumeConfig[this.editingFicheFacturationIndex];
      const level = this.gridConfig.data.find(x => x.FicheFacturations.some(f => f.FichFact_Id === this.editingFicheFacturationId));
      const ficheIndex = level.FicheFacturations.findIndex((fiche) => fiche.FichFact_Id === this.newFicheFacturation.FichFact_Id);
      console.log(level)
      console.log(ficheIndex)
      

      if (ficheIndex !== -1) {
        // Modify the existing facturable
        this.loader.show();
        this.EduosService.UpdateFicheFacturation(this.newFicheFacturation.FichFact_Id, { ...this.newFicheFacturation }).subscribe(
          (response) => {
            console.log("response UpdateFicheFacturation: ", response);
            this.loader.show();
            if (response == null || response === false) {
              this.loader.hide();
              this.toastr.error("Erreur de modification du Fiche Facturation");
            } else {
              this.toastr.success("Fiche Facturation modifié avec succès");
              console.log("Fiche Facturation modifié : ", this.newFicheFacturation);

              this.loader.hide();
              level.FicheFacturations[ficheIndex] = {
                ...this.newFicheFacturation,
              };
              modal.close();
            }
          },
          (error) => {
            console.error("Erreur UpdateFacturable: ", error);
            this.loader.hide();
            this.toastr.error(error?.error, "Erreur de modification du facturable");
          }
        );
      }
    } else {
      console.log("this.newFicheFacturation : ",this.newFicheFacturation)
      // Add mode: Find the current level
      const level = this.gridConfig.data.find((niv) => niv.Niv_Id === this.newFicheFacturation.Niv_Id);
      console.log("level : ",level)
      // level.FicheFacturations.push({ ...this.newFicheFacturation });
      
      // this.newFicheFacturation.Ann_Nom = "24-25";

      // Ensure that FicheFacturations array exists
      if (!level.FicheFacturations) {
        level.FicheFacturations = [];
      }

      // Add the new FicheFacturation
      this.loader.show();
      this.EduosService.CreateFicheFacturation({
        ...this.newFicheFacturation,
      }).subscribe(
        (response) => {
          console.log("response CreateFicheFacturation: ", response);
          this.loader.hide();
          if (response == null || response === false) {
            this.toastr.error("Erreur de création du fiche facturation");
          } else {
            this.toastr.success("Fiche facturation ajouté avec succès");
            level.FicheFacturations.push({ ...this.newFicheFacturation });
            this.resetFicheFacturationForm();
            modal.close();
          }
        },
        (error) => {
          console.error("Erreur CreateFicheFacturation: ", error);
          this.loader.hide();
          this.toastr.error(error?.error, "Erreur de création du fiche facturation");
        }
      );
    }
  }
  removeFicheFacturation(ficheFacturation: FicheFacturation): void {
    Swal.fire({
      title: "Voulez-vous supprimer la fiche de facturation?",
      showCancelButton: true,
      confirmButtonText: "Supprimer",
      confirmButtonColor: "red",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        this.loader.show();
        this.EduosService.DeleteFicheFacturation(ficheFacturation.FichFact_Id).subscribe(
          (response) => {
            console.log("response DeleteFicheFacturation: ", response);
            this.loader.hide();

            if (response == null || response === false) {
              this.toastr.error("Erreur de suppression du fiche facturation");
            } else {
              this.toastr.success("Fiche facturation supprimée avec succès");

              // Trouver le niveau correspondant
              const level = this.gridConfig.data.find(x => x.FicheFacturations.some(f => f.FichFact_Id === ficheFacturation.FichFact_Id));
              if (level && level.FicheFacturations) {
                const index = level.FicheFacturations.findIndex(f => f.FichFact_Id === ficheFacturation.FichFact_Id);
                if (index !== -1) {
                  level.FicheFacturations.splice(index, 1);
                  console.log("Fiche Facturation supprimée de l'array: ", ficheFacturation.FichFact_Id);
                }
              }
            }
          },
          (error) => {
            console.error("Erreur DeleteFicheFacturation: ", error);
            this.loader.hide();
            this.toastr.error(error?.error, "Erreur de suppression du fiche facturation");
          }
        );
      }
    });
  }

  // @ViewChild("DialogFacturation", { read: NgbModal, static: false }) public DialogFacturation?: any;
  dialogFacturable: {
    isEditing: boolean | null;
    title: string;
    data: any;
    Open: Function;
    Close: Function;
    Clear: Function;
    Submit: Function;
  } = {
    isEditing: null,
    title: "",
    data: null,
    Open: (modal, FactFicheFact_Id?: string) => {
      if (FactFicheFact_Id == null) {
        this.dialogFacturable.isEditing = false;
        this.dialogFacturable.data = {
          FactFicheFact_Id: uuidv4(),
        };
        this.dialogFacturable.title = "Ajouter facturable";

        this.modalService.open(modal, { ariaLabelledBy: "modal-basic-title" });
      } else {
        this.dialogFacturable.isEditing = true;
        this.dialogFacturable.data = structuredClone(this.selectedFicheFacturation.find((x) => x.FactFicheFact_Id == FactFicheFact_Id));
        this.dialogFacturable.title = "Modifier facturable";
        this.modalService.open(modal, { ariaLabelledBy: "modal-basic-title" });
      }
    },
    Close: () => {
      this.dialogFacturable.Clear();
      // close
    },
    Clear: () => {
      this.dialogFacturable.isEditing = null;
      this.dialogFacturable.data = null;
    },
    Submit: (modal: any) => {
      if (this.dialogFacturable.isEditing == false) {
        // Trouver le niveau et la fiche par ID au lieu de l'index
        const level = this.gridConfig.data.find(x => x.FicheFacturations.some(f => f.FichFact_Id === this.editingFicheFacturationId));
        const fiche = level.FicheFacturations.find(f => f.FichFact_Id === this.editingFicheFacturationId);
        
        console.log("level : ", level);
        console.log("fiche : ", fiche);
        
        if (!fiche.FacturableFicheFacturation) {
          fiche.FacturableFicheFacturation = [];
        }

        this.dialogFacturable.data.FichFact_Id = fiche.FichFact_Id;
        this.dialogFacturable.data.Fact_Id = this.dialogFacturable.data.Fact_Id;

        const alreadyExists = fiche.FacturableFicheFacturation.some(
          (fact) => fact.FactFicheFact_Id === this.dialogFacturable.data.FactFicheFact_Id
        );

        this.loader.show();

        if (!alreadyExists) {
          this.EduosService.CreateFacturableFicheFacturation({
            ...this.dialogFacturable.data,
          }).subscribe(
            (response) => {
              if (response == null || response === false) {
                this.loader.hide();
                this.toastr.error("Erreur de création du facturable fiche facturation");
              } else {
                this.toastr.success("Facturable fiche facturation ajouté avec succès");

                this.dialogFacturable.data.Fact_Nom = this.Facturables.find(
                  (x) => x.Fact_Id == this.dialogFacturable.data.Fact_Id
                ).Fact_Nom;
                this.dialogFacturable.data.VersRec_Nom = this.Enums.VersementReccurence.find(
                  (x) => x.VersRec_Id == this.dialogFacturable.data.VersRec_Id
                )?.VersRec_Nom || "";

                fiche.FacturableFicheFacturation.push({
                  ...this.dialogFacturable.data,
                });

                this.selectedFicheFacturation = [...fiche.FacturableFicheFacturation];
                
                this.resetFacturableFicheFacturationForm();
                this.loader.hide();
              }
            },
            (error) => {
              console.error("Erreur CreateFacturableFicheFacturation: ", error);
              this.loader.hide();
              this.toastr.error(error?.error, "Erreur de création du facturable fiche facturation");
            }
          );
        } else {
          console.warn("Duplicate facturable fiche facturation, not adding.");
          this.loader.hide();
        }
      } else {
        // Mode édition...
        // Même logique pour trouver le niveau et la fiche par ID
        const level = this.gridConfig.data.find(x => x.FicheFacturations.some(f => f.FichFact_Id === this.editingFicheFacturationId));
        const fiche = level.FicheFacturations.find(f => f.FichFact_Id === this.editingFicheFacturationId);

        this.EduosService.UpdateFacturableFicheFacturation(
          this.dialogFacturable.data.FactFicheFact_Id,
          this.dialogFacturable.data
        ).subscribe(
          (response) => {
            if (response) {
              this.dialogFacturable.data.Fact_Id = this.dialogFacturable.data.Fact_Id;
              this.dialogFacturable.data.Fact_Nom = this.Facturables.find(
                (x) => x.Fact_Id == this.dialogFacturable.data.Fact_Id
              ).Fact_Nom;
              this.dialogFacturable.data.VersRec_Nom = this.Enums.VersementReccurence.find(
                (x) => x.VersRec_Id == this.dialogFacturable.data.VersRec_Id
              )?.VersRec_Nom || "";

              this.selectedFicheFacturation = this.selectedFicheFacturation.map((fact) =>
                fact.FactFicheFact_Id === this.dialogFacturable.data.FactFicheFact_Id
                  ? { ...this.dialogFacturable.data }
                  : fact
              );

              fiche.FacturableFicheFacturation = fiche.FacturableFicheFacturation.map((fact) =>
                fact.FactFicheFact_Id === this.dialogFacturable.data.FactFicheFact_Id
                  ? { ...this.dialogFacturable.data }
                  : fact
              );

              this.toastr.success("Facturable Fiche Facturation mis à jour avec succès");
              modal.close();
              this.resetFacturableFicheFacturationForm();
              this.isEditMode = false;
              this.loader.hide();
            } else {
              this.loader.hide();
              this.toastr.error("Erreur de mise à jour du Facturable Fiche Facturation");
            }
          },
          (error) => {
            this.loader.hide();
            console.error("Erreur UpdateFacturableFicheFacturation: ", error);
            this.toastr.error(error?.error, "Erreur de mise à jour du Facturable Fiche Facturation");
          }
        );
      }
      modal.close();
    },
  };

  // Function to open the modal for editing
  openEditFacturableModal(facturable, index: number, modal: any): void {
    this.isEditMode = true;
    this.editingFacturableIndex = index;

    // Load the selected facturable into the form for editing
    this.newFacturableFicheFacturation = { ...facturable };

    // Open the modal
    this.modalService.open(modal, {
      ariaLabelledBy: "modal-basic-title",
      size: "xl",
    });
  }
  // Function to close the modal and reset the form
  closeModalAndResetForm(modal): void {
    // Reset the form after closing the modal
    this.resetFacturableFicheFacturationForm();
    // Close all opened modals
    modal.close();
  }
  // Function to update the facturable fiche facturation
  openAddUpdateFacturableFicheFacturation(modal, FactFicheFact, jindex): void {
    this.isEditMode = true;
    console.log("modal : ", modal);
    console.log("FactFicheFact : ", FactFicheFact);
    console.log("jindex : ", jindex);
    
    // Trouver le niveau et la fiche par ID
    const level = this.gridConfig.data.find(x => x.FicheFacturations.some(f => f.FichFact_Id === this.editingFicheFacturationId));
    const fiche = level.FicheFacturations.find(f => f.FichFact_Id === this.editingFicheFacturationId);

    // Pre-fill the form with the selected facturable's data
    this.newFacturableFicheFacturation = { ...FactFicheFact };
    this.selectedFacturable.Fact_Id = FactFicheFact.Fact_Id;

    this.modalService.open(modal, { ariaLabelledBy: "modal-basic-title" });
  }
  ModifierFactFichFact(newFacturableFicheFacturation, modal) {
    console.log("Updating Facturable: ", newFacturableFicheFacturation);
    this.loader.show();

    // Trouver le niveau et la fiche par ID
    const level = this.gridConfig.data.find(x => x.FicheFacturations.some(f => f.FichFact_Id === this.editingFicheFacturationId));
    const fiche = level.FicheFacturations.find(f => f.FichFact_Id === this.editingFicheFacturationId);

    // Reste du code...
  }

  removeFacturableFicheFacturation(selectedFacturableFicheFacturation, index: number) {
    console.log("Index selectionné : ", index);
    console.log("Fiche de facturation : ", selectedFacturableFicheFacturation);

    Swal.fire({
      title: "Voulez-vous supprimer le facturable fiche de facturation?",
      showCancelButton: true,
      confirmButtonText: "Supprimer",
      confirmButtonColor: "red",
      cancelButtonText: "Annuler",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.loader.show();
        this.EduosService.DeleteFacturableFicheFacturation(selectedFacturableFicheFacturation.FactFicheFact_Id).subscribe(
          (response) => {
            console.log("response DeleteFacturableFicheFacturation: ", response);

            if (response == null || response === false) {
              this.loader.hide();
              this.toastr.error("Erreur de suppression du Facturable fiche facturation");
            } else {
              this.toastr.success("Facturable fiche facturation supprimée avec succès");

              // Remove the item from the selectedFicheFacturation array
              this.selectedFicheFacturation.splice(index, 1);

              console.log("Facturable fiche facturation supprimée du tableau local");

              this.loader.hide();
            }
          },
          (error) => {
            console.error("Erreur DeleteFicheFacturation: ", error);
            this.loader.hide();
            this.toastr.error(error?.error, "Erreur de suppression du fiche facturation");
          }
        );
      }
    });
  }
  // Réinitialiser le formulaire du niveau
  resetFicheFacturationForm(): void {
    this.newFicheFacturation = {
      FichFact_Id: uuidv4(),
      Ecole_Id: this.EcoleId,
      // Ann_Id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      Niv_Id: "",
      FichFact_Nom: "",
      FichFact_Description: "",
      // Ann_Nom: "",
      isSubGridVisible: false,
      FacturableFicheFacturation: [],
      FichFact_Actif: null,
    };
    this.isEditMode = false;
  }
  // Ouvrir le modal pour ajouter un facturable
  openFacturableModal(levelIndex: number, ficheFacturation: FicheFacturation | null, content: any, ficheIndex: number): void {
    this.currentFicheId = ficheFacturation.FichFact_Id;
    this.editingFicheFacturationId = ficheFacturation.FichFact_Id;
    const level = this.gridConfig.data[levelIndex]; // Reference the current level
    const fiche = level.FicheFacturations[ficheIndex]; // Reference the current fiche facturation
    const ficheFact=fiche.FacturableFicheFacturation
    console.log(level);
    console.log(fiche)
    console.log("ficheFact : ",ficheFact)

    if (ficheFacturation) {
      this.newFacturableFicheFacturation = {
        FactFicheFact_Id: uuidv4(),
        Fact_Id: this.selectedFacturable.Fact_Id,
        FichFact_Id: ficheFacturation.FichFact_Id,
        FactFichFact_Description: null,
        FactFichFact_Montant: 0,
        Fact_Nom: null,
      };

      this.selectedFicheFacturation = this.gridConfig.data[levelIndex].FicheFacturations[ficheIndex].FacturableFicheFacturation || [];
      console.log("this.selectedFicheFacturation : ", this.selectedFicheFacturation);
    } else {
      this.selectedFicheFacturation = []; // If no ficheFacturation is selected, reset the array
    }

    this.modalService.open(content, {
      ariaLabelledBy: "modal-basic-title",
      size: "xl",
    });
  }

  saveFacturableFicheFacturation(modal: any): void {
    // Trouver le niveau et la fiche par ID
    const level = this.gridConfig.data.find(x => x.FicheFacturations.some(f => f.FichFact_Id === this.editingFicheFacturationId));
    const fiche = level.FicheFacturations.find(f => f.FichFact_Id === this.editingFicheFacturationId);

    console.log("level : ", level);
    console.log("fiche : ", fiche);

    if (!fiche.FacturableFicheFacturation) {
        fiche.FacturableFicheFacturation = [];
    }

    // Ensure the facturable is linked to the correct fiche facturation
    this.newFacturableFicheFacturation.FichFact_Id = fiche.FichFact_Id;
    this.newFacturableFicheFacturation.Fact_Id = this.selectedFacturable.Fact_Id;

    // Check if the facturable already exists in the array to avoid duplicates
    const alreadyExists = fiche.FacturableFicheFacturation.some((fact) => fact.FactFicheFact_Id === this.newFacturableFicheFacturation.FactFicheFact_Id);

    this.loader.show();

    if (!alreadyExists) {
      // Call the API to create the new facturable fiche facturation
      this.EduosService.CreateFacturableFicheFacturation({
        ...this.newFacturableFicheFacturation,
      }).subscribe(
        (response) => {
          console.log("response CreateFacturableFicheFacturation: ", response);
          if (response == null || response === false) {
            this.loader.hide();
            this.toastr.error("Erreur de création du facturable fiche facturation");
          } else {
            this.toastr.success("Facturable fiche facturation ajouté avec succès");

            this.newFacturableFicheFacturation.Fact_Nom = this.Facturables.find((x) => x.Fact_Id == this.newFacturableFicheFacturation.Fact_Id).Fact_Nom;

            // Only push the facturable fiche facturation after it's confirmed created
            fiche.FacturableFicheFacturation.push({
              ...this.newFacturableFicheFacturation,
            });
            // this.selectedFicheFacturation.push({ ...this.newFacturableFicheFacturation });

            console.log("Facturable fiche de facturation envoyé : ", this.newFacturableFicheFacturation);

            // Reset the form only after successful insertion
            this.resetFacturableFicheFacturationForm();
            this.loader.hide();
            // modal.close();
          }
        },
        (error) => {
          console.error("Erreur CreateFacturableFicheFacturation: ", error);
          this.loader.hide();
          this.toastr.error(error?.error, "Erreur de création du facturable fiche facturation");
        }
      );
    } else {
      console.warn("Duplicate facturable fiche facturation, not adding.");
      this.loader.hide();
    }
  }

  resetFacturableFicheFacturationForm(): void {
    this.newFacturableFicheFacturation = {
      Fact_Id: null,
      FichFact_Id: null,
      FactFichFact_Description: null,
      FactFichFact_Montant: 0,
      FactFicheFact_Id: uuidv4(),
      Fact_Nom: null,
    };
  }
}
