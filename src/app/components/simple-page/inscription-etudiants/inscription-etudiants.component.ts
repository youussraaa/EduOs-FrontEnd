import { Component, HostListener, OnInit, TemplateRef } from "@angular/core";
import { NgbModal, NgbModalConfig, NgbNavChangeEvent } from "@ng-bootstrap/ng-bootstrap";
import { EduosService } from "../../../shared/services/Eduos.service";
import { v4 as uuidv4 } from "uuid";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import Swal from "sweetalert2";
import { Observable } from "rxjs";
import { Title } from "@angular/platform-browser";
// import { Annee, Niveau } from "src/app/shared/components/model/dto.model";
import { environment } from "../../../../environments/environment";
import { AppService } from "../../../shared/services/app.service";
// import { TableService } from 'src/app/shared/services/table.service';
// import { environment } from "src/environments/environment";

@Component({
  selector: "app-inscription-etudiants",
  templateUrl: "./inscription-etudiants.component.html",
  styleUrls: ["./inscription-etudiants.component.scss"],
})
export class InscriptionEtudiantsComponent implements OnInit {
  // Etudiants: any[] = [];
  // filterEtudiants: any[] = [];
  filterParams = {
    global: "",
  };
  OnFiltreChange(event, column: string) {
    setTimeout(() => {
      // console.log("OnFiltreChange: ", event)
      // this.filtredEtudiants = this.Etudiants.filter(x => x[column]?.toLowerCase().includes(this.filterParams[column].toLowerCase()))
      this.gridConfig.filtredData = this.gridConfig.data.filter(
        (x) =>
          x.Etd_Nom?.toLowerCase().includes(this.filterParams.global.toLowerCase()) ||
          x.Etd_Prenom?.toLowerCase().includes(this.filterParams.global.toLowerCase()) ||
          x.Etd_Matricule?.toLowerCase().includes(this.filterParams.global.toLowerCase()) ||
          x.Etd_Cin?.toLowerCase().includes(this.filterParams.global.toLowerCase()) ||
          x.Sex_Nom?.toLowerCase().includes(this.filterParams.global.toLowerCase()) ||
          x.Niv_Nom?.toLowerCase().includes(this.filterParams.global.toLowerCase()) ||
          x.Cls_Nom?.toLowerCase().includes(this.filterParams.global.toLowerCase())
        // x.Etd_Adresse?.toLowerCase().includes(this.filterParams.global.toLowerCase()) ||
        // x.Etd_Tel?.toLowerCase().includes(this.filterParams.global.toLowerCase()) ||
        // x.Etd_Mail?.toLowerCase().includes(this.filterParams.global.toLowerCase())
      );

      // this.filtredEtudiants = structuredClone(this.Etudiants);
      // if (column == "Etd_Nom")
      //   // if (this.filterParams.Etd_Nom != null && this.filterParams.Etd_Nom != "")
      //   this.filtredEtudiants = this.filtredEtudiants.filter(x => x.Etd_Nom?.toLowerCase().includes(this.filterParams.Etd_Nom.toLowerCase()))
      // else if (column == "Etd_Prenom")
      //   this.filtredEtudiants = this.filtredEtudiants.filter(x => x['Etd_Prenom']?.toLowerCase().includes(this.filterParams['Etd_Prenom'].toLowerCase()))
    }, 0);
  }

  public tableItem$: Observable<any[]>;
  public searchText;
  total$: Observable<number>;
  EcoleId: string;
  ClasseAnneeForChoose: any[];
  currentEtudiant: any = {};
  currentSelection: string[] = []; // liste EtdClasseAnn_Id
  ListEtdCasSocial: any[] = []; // liste EtdClasseAnn_Id
  MakeThemCasSocial:boolean

  selectedClasseAnnee: string = null;
  selectedCasSocial:boolean

  Enums: {
    ClasseAnnee: any[];
    Annee: any[];
    Niveau: any[];
  } = {
      ClasseAnnee: [],
      Annee: [],
      Niveau: [],
    };

  searchParams = {
    matricule: null,
    nom: null,
    prenom: null,
    TelephoneTuteurs: null,
    niveau: "",
    annee: "",
    classe: "",
  };

  //#region gridConfig
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
  dockManagerConfig: { height: string | null } = { height: null };

  gridConfig: any = {
    GetVisibleColumns: () => {
      return this.gridConfig.columns.filter((col) => col.visible);
    },
    GetEnabledColumns: () => {
      return this.gridConfig.columns.filter((col) => !col.disableHiding);
    },
    title: "Inscrits",
    emptyTemplateText: "Aucun élève chargé",
    height: window.innerHeight - 350 + "px",
    rowHeight: "35px",
    transactions: [],
    primaryKey: "EtdClasseAnn_Id",
    batchEditing: true,
    rowEditable: true,
    allowFiltering: true,
    rowSelection: "multiple",
    cellSelection: "none",
    columnSelection: "none",
    data: [],
    filtredData: [],
    columns: [
      { field: "EtdClasseAnn_Id", header: "Etd_Id", dataType: "string", visible: false, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: true, groupable: true, width: "", },
      { field: "Etd_Id", header: "Etd_Id", dataType: "string", visible: false, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: true, groupable: true, width: "", },
      { field: "ClasseAnn_Id", header: "ClasseAnn_Id", dataType: "string", visible: false, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: true, groupable: true, width: "", },
      { field: "Ann_Id", header: "Année Id", dataType: "number", visible: false, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: true, groupable: true, width: "", },
      { field: "Niv_Id", header: "Niveau Id", dataType: "string", visible: false, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: true, groupable: true, width: "", },
      
      // { field: "Etd_Photo", header: "Photo", dataType: "string", visible: false, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },
      { field: "Etd_Matricule", header: "Matricule", dataType: "string", visible: false, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },
      { field: "Etd_Nom", header: "Nom", dataType: "string", visible: true, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },
      { field: "Etd_Prenom", header: "Prénom", dataType: "string", visible: true, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },
      { field: "Etd_EstCasSocial", header: "Etd_EstCasSocial", dataType: "boolean", visible: false, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: true, groupable: true, width: "", },
      { field: "Sex_Nom", header: "Sexe", dataType: "string", visible: false, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },
      { field: "Ann_Nom", header: "Année", dataType: "string", visible: true, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },
      { field: "Niv_Nom", header: "Niveau", dataType: "string", visible: true, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },
      { field: "Cls_Nom", header: "Classe", dataType: "string", visible: true, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },
      { field: "EtdClasseAnn_EstCasSocial", header: "Cas social", dataType: "boolean", visible: true, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },
      { field: "Tuteurs", header: "Tuteurs", dataType: "string", visible: false, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },
      { field: "TelephoneTuteurs", header: "Téléphone tuteurs", dataType: "string", visible: false, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },
      // { field: "NumeroWhatsappTuteurs", header: "Numéro whatsapp tuteurs", dataType: "string", visible: false, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },
    ],
  };

  //#endregion

  //#region inscriptiob etd
  openinscriptionEtudiantChoseClasseModal(content: TemplateRef<any>, type: string, parcour?: any) {
    this.typeinscription = type;
    if (this.typeinscription == "inscrire") {
      if (this.currentSelection.length == 0) {
        this.toastr.warning(`Veuillez selectionner les élèves à inscrire`);
        return;
      }
      let selectedRowsDS = this.gridConfig.data.filter((x) => this.currentSelection.includes(x.EtdClasseAnn_Id));
      

      let diff = selectedRowsDS.find((x) => x.Niv_Id != selectedRowsDS[0].Niv_Id);
      console.log("diff : ",diff)
      if (diff) {
        this.toastr.warning(`Votre sélection n'est pas homogène, veuillez selectionner les élèves du même niveau`);
        return;
      }
      this.ListEtdCasSocial=selectedRowsDS.filter(x=>x.Etd_EstCasSocial==true)
      console.log("selectedRowsDS : ",selectedRowsDS)
      console.log("currentSelection : ",this.currentSelection)
      console.log("this.ListEtdCasSocial : ",this.ListEtdCasSocial)
      this.ClasseAnneeForChoose = []; //this.Enums.ClasseAnnee.filter(x=>x.Niv_Id!==this.currentSelection[0].Niv_Id)
      if (this.currentSelection.length == 1){ 

        this.currentEtudiant = this.currentSelection[0];
        // this.selectedCasSocial = this.currentEtudiant.Etd_EstCasSocial || false; // Ajouté ici

      }



    } else if (this.typeinscription == "editerInsc") {
      this.currentSelection = [];
      this.currentEtudiant = parcour;
      
      this.selectedClasseAnnee = this.currentEtudiant.ClasseAnn_Id;
      // this.selectedCasSocial = this.currentEtudiant.Etd_EstCasSocial || this.currentEtudiant.EtdClasseAnn_EstCasSocial;
      this.selectedCasSocial = this.currentEtudiant.EtdClasseAnn_EstCasSocial;
      setTimeout(() => {
        this.ClasseAnneeForChoose = this.Enums.ClasseAnnee.filter((x) => x.Niv_Id == this.currentEtudiant.Niv_Id);
        this.defaultselectedEtdClassAnn = structuredClone(parcour);
      }, 0);
    }
    this.editModalContentGet = content;
    this.modalService.open(this.editModalContentGet, { fullscreen: false, size: "md" });
  }

  typeinscription: string = "";
  defaultselectedEtdClassAnn: any = {};

  selectEtudiant(EtdClasseAnn_Id: any) {
    // const index = this.currentSelection.indexOf(student);
    // let student = this.gridConfig.data.find((x) => x.EtdClasseAnn_Id == EtdClasseAnn_Id);

    if (this.currentSelection.includes(EtdClasseAnn_Id)) {
      this.currentSelection = this.currentSelection.filter((x) => x != EtdClasseAnn_Id);
    } else {
      this.currentSelection.push(EtdClasseAnn_Id);
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

  IncrireEtudiant(modal: any): void {
    if (this.typeinscription == "inscrire") {
      let etdClasseToCreate: any[] = [];
      this.currentSelection.forEach((etdclsseann_id: string) => {
        let etdClsAnn = this.gridConfig.data.find((x) => x.EtdClasseAnn_Id == etdclsseann_id);
        if (this.MakeThemCasSocial) {
          console.log("this.MakeThemCasSocial : ",this.MakeThemCasSocial)
          this.selectedCasSocial = etdClsAnn.Etd_EstCasSocial ;
        }else{
          this.selectedCasSocial = false;
        }
        console.log('current etdClsAnn le ici : ',etdClsAnn)

        let newEtdClasseAnnee: any = {
          EtdClasseAnn_Id: uuidv4(),
          ClasseAnn_Id: this.selectedClasseAnnee,
          EtdClasseAnn_EstCasSocial: this.selectedCasSocial,
          Etd_Id: etdClsAnn.Etd_Id,
          Cls_Nom: this.Enums.ClasseAnnee.find((x) => x.ClasseAnn_Id == this.selectedClasseAnnee).Cls_Nom,
          Niv_Nom: this.Enums.ClasseAnnee.find((x) => x.ClasseAnn_Id == this.selectedClasseAnnee).Niv_Nom,
          Ann_Nom: this.Enums.ClasseAnnee.find((x) => x.ClasseAnn_Id == this.selectedClasseAnnee).Ann_Nom,
          Ann_Id: this.Enums.ClasseAnnee.find((x) => x.ClasseAnn_Id == this.selectedClasseAnnee).Ann_Id,
          Niv_Id: this.Enums.ClasseAnnee.find((x) => x.ClasseAnn_Id == this.selectedClasseAnnee).Niv_Id,
        };
        console.log("selectedRowsDS : ", this.currentSelection);
        console.log("newEtdClasseAnnee : ", newEtdClasseAnnee);
        etdClasseToCreate.push(newEtdClasseAnnee);
        console.log("etdClasseToCreate", etdClasseToCreate);
        
      });
      
      // console.log("etdClasseToCreate", etdClasseToCreate);
      
      this.loader.show();
      this.EduosService.CreateEtudiantClasseAnnee(etdClasseToCreate).subscribe(
        (response) => {
          console.log("response CreateEtudiantClasseAnnee: ", response);
          etdClasseToCreate.forEach((element: any) => {
            // let selectedEtudiant = this.currentSelection.find(x=> )
            let etudiant = this.gridConfig.data.find((x) => x.Etd_Id == element.Etd_Id);

            this.gridConfig.data.push({
              EtdClasseAnn_Id: element.EtdClasseAnn_Id,
              Etd_Id: element.Etd_Id,
              ClasseAnn_Id: element.ClasseAnn_Id,
              EtdClasseAnn_EstCasSocial: element.EtdClasseAnn_EstCasSocial,
              Cls_Nom: element.Cls_Nom,
              Niv_Nom: element.Niv_Nom,
              Ann_Nom: element.Ann_Nom,
              Etd_Nom: etudiant.Etd_Nom,
              Etd_Prenom: etudiant.Etd_Prenom,
              Etd_Matricule: etudiant.Etd_Matricule,
              Etd_CIN: etudiant.Etd_CIN,
              Etd_Photo: etudiant.Etd_Photo,
              Sex_Nom: etudiant.Sex_Nom,
              Niv_Id: element.Niv_Id,
              Ann_Id: element.Ann_Id,
            });
          });
          this.toastr.success("Inscription effectuée avec succès");
          this.loader.hide();
          this.currentSelection = [];
        },
        (error) => {
          console.error("Erreur EtudiantClasseAnnees: ", error);
          this.loader.hide();
          this.toastr.error(error?.error, "Erreur de l'inscription de l'élève");
        }
      );
      modal.close(); // Close the modal
    } else if (this.typeinscription == "editerInsc") {
      this.currentEtudiant.ClasseAnn_Id = this.selectedClasseAnnee;
      this.currentEtudiant.EtdClasseAnn_EstCasSocial = this.selectedCasSocial;
      this.loader.show();
      this.EduosService.UpdateEtudiantClasseAnnee(this.currentEtudiant.EtdClasseAnn_Id, this.currentEtudiant).subscribe(
        (response) => {
          console.log("response UpdateEtudiantClasseAnnee: ", response);
          (this.currentEtudiant.Cls_Nom = this.Enums.ClasseAnnee.find((x) => x.ClasseAnn_Id == this.currentEtudiant.ClasseAnn_Id).Cls_Nom),
            (this.currentEtudiant.Niv_Nom = this.Enums.ClasseAnnee.find((x) => x.ClasseAnn_Id == this.currentEtudiant.ClasseAnn_Id).Niv_Nom),
            (this.currentEtudiant.Ann_Nom = this.Enums.ClasseAnnee.find((x) => x.ClasseAnn_Id == this.currentEtudiant.ClasseAnn_Id).Ann_Nom);
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
    this.currentEtudiant = this.defaultselectedEtdClassAnn;
    modal.close();
  }

  deleteEtudiantClasseAnnee() {
    console.log("bv", this.currentSelection);
    if (this.currentSelection.length == 0) {
      this.toastr.warning(`Veuillez selectionner les élèves à inscrire`);
      return;
    }
    let selectedRowsDS = this.gridConfig.data.filter((x) => this.currentSelection.includes(x.EtdClasseAnn_Id));
    let diff = selectedRowsDS.find((x) => x.Niv_Id != selectedRowsDS[0].Niv_Id);
    console.log("dif", diff);

    if (diff) {
      this.toastr.warning(`Votre sélection n'est pas homogène, veuillez selectionner les élèves du même niveau`);
      return;
    }
    Swal.fire({
      title: "La suppression de ces inscriptions supprimera également tous les versements affectés à ces élèves. Voulez-vous continuer ?",
      showCancelButton: true,
      confirmButtonText: "Supprimer",
      confirmButtonColor: "red",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        let etdToDelete = this.currentSelection.map((x) => x);
        let param = {
          ListEtdClsAnn_Id: etdToDelete, //[parcour.EtdClasseAnn_Id]
        };
        this.loader.show();
        this.EduosService.DeleteEtudiantClasseAnnee(param).subscribe(
          (response) => {
            if (response == true) {
              this.loader.hide();
              console.log("response DeleteEtudiantClasseAnnee: ", response);
              this.toastr.success("Suppression effectuée avec succès");
              this.gridConfig.data = this.gridConfig.data.filter((x) => !etdToDelete.includes(x.EtdClasseAnn_Id));
              this.gridConfig.filtredData = this.gridConfig.filtredData.filter((x) => !etdToDelete.includes(x.EtdClasseAnn_Id));
              // this.selectedEtudiant.EtudiantClasseAnnees=this.selectedEtudiant.EtudiantClasseAnnees.filter(x=>x.EtdClasseAnn_Id!=parcour.EtdClasseAnn_Id)
              this.currentSelection = [];
            } else {
              this.toastr.success("Suppression échoué");

            }

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

  ClearData() {
    this.currentSelection = [];
    this.currentEtudiant = null;
    this.gridConfig.data = null;
    this.gridConfig.filtredData = null;
    this.typeinscription = null;
    this.defaultselectedEtdClassAnn = null;
    this.selectedClasseAnnee = null;
  }

  toggleAllSelections(event: any) {
    if (event.target.checked) {
      this.currentSelection = this.gridConfig.filtredData.map((x) => x.EtdClasseAnn_Id);
    } else this.currentSelection = [];
  }
  //#endregion

  filteredStudents: any[] = [];
  filteredNotes: any[] = [];
  niveauFilter: string = ""; // Filtre par niveau
  classeFilter: string = ""; // Filtre par classe
  searchFilter: string = ""; // Filtre de recherche (nom ou prénom)
  editModalContent: TemplateRef<any>;
  editModalContentGet: TemplateRef<any>;

  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private EduosService: EduosService,
    private loader: NgxSpinnerService,
    private toastr: ToastrService,
    public appService: AppService,
    private title: Title
  ) {
    config.backdrop = "static";
    config.keyboard = false;
    this.EcoleId = localStorage.getItem("EcoleId");
    // this.tableItem$ = service.tableItem$;
    // this.total$ = service.total$;
    // this.service.setUserData(this.Etudiants)
    let ecole = localStorage.getItem("Ecole");
    if (ecole != null) this.title.setTitle(`Inscrit - ${JSON.parse(ecole).Ecole_Nom}`);
  }

  GetData() {
    this.loader.show();
    this.EduosService.SearchEtudiantClasseAnnee(this.searchParams).subscribe(
      (response) => {
        console.log("response GetEtudiants ", response);
        this.loader.hide();
        if (response == null || response.length == 0) {
          this.toastr.info("Aucun élève trouvé");
        } else {
          this.gridConfig.data = response;
          this.gridConfig.filtredData = response;
        }
        this.currentSelection = [];
      },
      (error) => {
        console.error("Erreur GetEtudiants: ", error);
        this.loader.hide();
        this.toastr.error(error?.error, "Erreur de récupération des élèves");
      }
    );
  }

  ngOnInit(): void {
    if (this.appService.currentAnnee != null) this.searchParams.annee = this.appService.currentAnnee.Ann_Id;
    if (this.appService.currentEcole != null) this.title.setTitle(`Inscrit - ${this.appService.currentEcole.Ecole_Nom}`);

    this.appService.anneeEmitter.subscribe((item) => {
      this.searchParams.annee = item.Ann_Id;
    });

    this.appService.ecoleEmitter.subscribe((item) => {
      console.log("Test !!!!", item.Ecole_Nom);
      this.title.setTitle(`Inscrit - ${item.Ecole_Nom}`);
    });

    this.EduosService.GetCommunData([
      `${environment.apiUrl}/api/Configuration/GetClasseAnnee?Ecole_Id=${this.EcoleId}`,
      `${environment.apiUrl}/api/Configuration/GetAnnees?Ecole_Id=${this.EcoleId}`,
      `${environment.apiUrl}/api/Configuration/GetNiveau/${this.EcoleId}`,
    ]).subscribe(
      (response: any[]) => {
        console.log("Response GetCommunData: ", response);
        this.Enums.ClasseAnnee = response[0];
        this.Enums.Annee = response[1].sort((a, b) => b.Ann_Nom.localeCompare(a.Ann_Nom));;
        this.Enums.Niveau = response[2];
      },
      (error) => {
        console.error("Error GetCommunData: ", error);
      }
    );
    if (environment.production == false)
      setTimeout(() => {
        this.searchParams.nom = "diaw";
        this.GetData();
      }, 100);
  }
  onAnneeChange(Ann_Id: string) {
    if (Ann_Id == null || Ann_Id == "" || Ann_Id == EduosService.GuidEmpty) this.searchParams.annee = null;
    else this.searchParams.annee = Ann_Id;
  }

  GetClasseAnnee(ann_id: string) {
    this.loader.show();
    this.EduosService.GetClasseAnnee({ Ann_Id: ann_id }).subscribe(
      (response) => {
        console.log("response GetClasseAnnee ", response);
        this.loader.hide();
        if (response == null || response.length == 0) {
          this.toastr.warning("Aucune classe trouvé pour l'année sélectionnée");
        }
        let selectedRowsDS = this.gridConfig.data.filter((x) => this.currentSelection.includes(x.EtdClasseAnn_Id));
        this.ClasseAnneeForChoose = response?.filter((x) => x.Niv_Id !== selectedRowsDS[0].Niv_Id);
      },
      (error) => {
        console.error("Erreur GetClasseAnnee: ", error);
        this.loader.hide();
        this.toastr.error(error?.error, "Erreur de récupération des CLASSES");
      }
    );
  }
  Exporter(){
    this.EduosService.Exporter("Inscrits",this.gridConfig.GetVisibleColumns(),this.gridConfig.data)
  }

  // applyFilters() {
  //   // Filtrage des étudiants
  //   this.filteredStudents = this.students.filter(
  //     (student) =>
  //       (this.niveauFilter === "" || student.niveau === this.niveauFilter) && // Filtre par niveau
  //       (this.classeFilter === "" || student.classe === this.classeFilter) && // Filtre par classe
  //       (this.searchFilter ? student.nom.toLowerCase().includes(this.searchFilter.toLowerCase()) || student.prenom.toLowerCase().includes(this.searchFilter.toLowerCase()) : true) // Filtre par recherche
  //   );

  //   // Filtrage des notes
  //   this.filteredNotes = this.notes.filter(
  //     (note) =>
  //       (this.niveauFilter === "" || note.niveau === this.niveauFilter) && // Filtre par niveau
  //       (this.classeFilter === "" || note.classe === this.classeFilter) && // Filtre par classe
  //       (this.searchFilter ? note.nom.toLowerCase().includes(this.searchFilter.toLowerCase()) || note.prenom.toLowerCase().includes(this.searchFilter.toLowerCase()) : true) // Filtre par recherche
  //   );
  // }
}
