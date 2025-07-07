import { Component, HostListener, inject, ViewChild } from "@angular/core";
import { NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import { EduosService } from "../../../shared/services/Eduos.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { AppService } from "../../../shared/services/app.service";
// import { BreadcrumbComponent } from "../../../shared/components/breadcrumb/breadcrumb.component";
import { IgxGridComponent, IgxExporterEvent } from "igniteui-angular";
import { environment } from "../../../../environments/environment";
import { Title } from "@angular/platform-browser";
declare var $: any;

@Component({
  selector: "app-recouvrement2",
  templateUrl: "./recouvrement2.component.html",
  styleUrl: "./recouvrement2.component.scss",
})
export class Recouvrement2Component {

  showSearchParams: boolean = true;
  dockManagerConfig: { height: string | null } = { height: null };


  formatter = new Intl.NumberFormat('en-US');


  gridConfig: any = {
    GetVisibleColumns: () => { return this.gridConfig.columns.filter((col) => col.visible); },
    GetEnabledColumns: () => { return this.gridConfig.columns.filter((col) => !col.disableHiding); },
    title: "Recouvrement",
    emptyTemplateText: "Aucune opération trouvée",
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
    columns: [
      { field: "EtdClasseAnn_Id", header: "EtdClasseAnn_Id", dataType: "string", visible: false, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: true, groupable: true, width: "", },
      { field: "Etd_Id", header: "Etd_Id", dataType: "string", visible: false, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: true, groupable: true, width: "", },
      // { field: "Cls_Id", header: "Cls_Id", dataType: "string", visible: false, sortable: false, resizable: false, filterable: false, editable: false, searchable: false, disableHiding: true, groupable: false, width: "", },
      // { field: "Fact_Id", header: "Fact_Id", dataType: "string", visible: false, sortable: false, resizable: false, filterable: false, editable: false, searchable: false, disableHiding: true, groupable: false, width: "", },
      // { field: "Niv_Id", header: "Niv_Id", dataType: "string", visible: false, sortable: false, resizable: false, filterable: false, editable: false, searchable: false, disableHiding: true, groupable: false, width: "", },
      // { field: "Tut_Id", header: "Tut_Id", dataType: "string", visible: false, sortable: false, resizable: false, filterable: false, editable: false, searchable: false, disableHiding: true, groupable: false, width: "", },

      { field: "Etd_Matricule", header: "Matricule", dataType: "string", visible: false, sortable: false, resizable: false, filterable: false, editable: false, searchable: false, disableHiding: false, groupable: false, width: "", },
      { field: "Etd_NomComplet", header: "Elève", dataType: "string", visible: true, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },
      { field: "Cls_Nom", header: "Classe", dataType: "string", visible: true, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },
      { field: "Niv_Nom", header: "Niveau", dataType: "string", visible: false, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },
      { field: "Sex_Nom", header: "Sexe", dataType: "string", visible: false, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },
      { field: "Tuteurs", header: "Tuteurs", dataType: "string", visible: true, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },
      { field: "TelephoneTuteurs", header: "Tel tuteurs", dataType: "string", visible: true, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },

      // { field: "EtdTuteur_ParDefault", header: "Tuteur Par Défaut", dataType: "boolean", visible: false, sortable: false, resizable: false, filterable: false, editable: false, searchable: false, disableHiding: false, groupable: false, width: "", },
      { field: "Etd_Mail", header: "Email", dataType: "string", visible: false, sortable: false, resizable: false, filterable: false, editable: false, searchable: false, disableHiding: false, groupable: false, width: "", },
      { field: "Etd_Tel", header: "Téléphone", dataType: "string", visible: false, sortable: false, resizable: false, filterable: false, editable: false, searchable: false, disableHiding: false, groupable: false, width: "", },
      // { field: "LienParente", header: "Lien de Parenté", dataType: "string", visible: false, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },
      { field: "Vers_NomList", header: "Versements", dataType: "string", visible: true, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },
      { field: "MontantTotalARegler", header: "Total a régler (FCFA)", dataType: "number", visible: true, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", isMontant: true, },

      // { field: "Tut_NomComplet", header: "Nom Complet Tuteur", dataType: "string", visible: false, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },
      // { field: "Tut_Tel", header: "Téléphone Tuteur", dataType: "string", visible: false, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },

    ],
    subGrid: {
      GetVisibleColumns: () => { return this.gridConfig.subGrid.columns.filter((col) => col.visible); },
      GetEnabledColumns: () => { return this.gridConfig.subGrid.columns.filter((col) => !col.disableHiding); },
      primaryKey: 'Vers_Id', key: 'Versements',
      columns: [
        { field: "Vers_Id", header: "Vers_Id", dataType: "string", visible: false, sortable: false, resizable: false, filterable: false, editable: false, searchable: false, disableHiding: true, groupable: false, width: "", },
        { field: "Fact_Nom", header: "Facturable", dataType: "string", visible: true, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },
        { field: "Vers_Nom", header: "Versement", dataType: "string", visible: true, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },
        { field: "Vers_Numero", header: "Numéro Versement", dataType: "number", visible: true, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },

        { field: "Vers_Montant", header: "Montant", dataType: "number", visible: true, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", isMontant: true, },
        { field: "Montant_Regle", header: "Montant Réglé", dataType: "number", visible: true, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", isMontant: true, },
        { field: "Reliquat", header: "Reliquat", dataType: "number", visible: true, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", isMontant: true, },
        { field: "Vers_Dateprevu", header: "Date Prévue", dataType: "date", visible: true, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },
        // { field: "Vers_Estregle", header: "Est Réglé", dataType: "boolean", visible: false, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", },
        { field: "Vers_Remise", header: "Remise", dataType: "number", visible: true, sortable: true, resizable: true, filterable: true, editable: false, searchable: true, disableHiding: false, groupable: true, width: "", isMontant: true, },
        { field: "Vers_Remarque", header: "Remarque", dataType: "string", visible: false, sortable: false, resizable: false, filterable: false, editable: false, searchable: false, disableHiding: false, groupable: false, width: "", },
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


  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private EduosService: EduosService,
    private loader: NgxSpinnerService,
    private toastr: ToastrService,
    private appService: AppService,
    private title: Title,

  ) {
    config.backdrop = "static";
    config.keyboard = false;

    let ecole = localStorage.getItem("Ecole");
    if (ecole != null) this.title.setTitle(`Recouvrement - ${JSON.parse(ecole).Ecole_Nom}`);
  }

  Enums: {
    Annees: any[];
    Niveaux: any[];
    Classes: any[];
    Facturables: any[];
    Versements: any[],
  } = {
      Annees: [],
      Niveaux: [],
      Classes: [],
      Facturables: [],
      Versements: [],
    };

  ngOnInit() {
    if (this.appService.currentAnnee != null)
      this.searchParams.Ann_Id = this.appService.currentAnnee.Ann_Id;
    if (this.appService.currentEcole != null)
      this.title.setTitle(`Recouvrement - ${this.appService.currentEcole.Ecole_Nom}`);

    this.appService.anneeEmitter.subscribe((item) => {
      this.searchParams.Ann_Id = item.Ann_Id;
    });

    this.appService.ecoleEmitter.subscribe((item) => {
      this.title.setTitle(`Recouvrement - ${item.Ecole_Nom}`);
    });

    this.searchParams.Vers_Dateprevu = new Date().toISOString().split("T")[0];

    this.onWindowResize(null);
    this.loader.show();
    this.EduosService.GetData([
      `${environment.apiUrl}/api/Configuration/GetAnnees?Ecole_Id=${localStorage.getItem("EcoleId")}`,
      `${environment.apiUrl}/api/Configuration/GetNiveau/${localStorage.getItem("EcoleId")}`,
      `${environment.apiUrl}/api/Configuration/GetClasses?Ecole_Id=${localStorage.getItem("EcoleId")}`,
      `${environment.apiUrl}/api/Configuration/GetFacturable?Ecole_Id=${localStorage.getItem("EcoleId")}`,
      `${environment.apiUrl}/api/Configuration/GetVersementsEnum?Ecole_Id=${localStorage.getItem("EcoleId")}`,

    ]).subscribe(
      (response: any[]) => {
        console.log("Response GetData: ", response);
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
        this.Enums.Classes = response[2].sort((a, b) => {
          if (a.Cls_Nom > b.Cls_Nom) return 1;
          if (a.Cls_Nom < b.Cls_Nom) return -1;
          return 0;
        });
        this.Enums.Facturables = response[3].sort((a, b) => {
          if (a.Fact_Nom > b.Fact_Nom) return 1;
          if (a.Fact_Nom < b.Fact_Nom) return -1;
          return 0;
        });
        this.Enums.Versements = response[4].sort((a, b) => {
          if (a.Vers_Numero > b.Vers_Numero) return 1;
          if (a.Vers_Numero < b.Vers_Numero) return -1;
          return 0;
        });

        // this.GetData();

        // if (environment.production == false) {
        //   this.searchParams.Niv_Id = "66339f59-ef93-411e-9dbf-d7ef8fe3e6f6"
        //   this.searchParams.Vers_Dateprevu = "2024-01-12"
        //   this.GetData();
        // }
      },
      (error) => {
        console.error("Error GetCommunData: ", error);
        this.loader.hide();
        this.toastr.error("Erreur de recuperation des listes");
      });

    (window as any).recouvrement = this;
  }

  // @HostListener("window:resize", ["$event"])
  // onWindowResize($event) {
  //   console.log("onResize: ", $event);
  //   setTimeout(() => {
  //     let searchBarHeight = document.getElementById("searchBar")?.clientHeight;
  //     if (searchBarHeight == null || searchBarHeight == undefined || searchBarHeight == 0) {
  //       searchBarHeight = -25;
  //     }
  //     // searchBarHeight -= 20;
  //     this.gridConfig.height = window.innerHeight - searchBarHeight - 230 + "px";
  //   }, 100);
  // }
  @HostListener("window:resize", ["$event"])
  onWindowResize($event) {
    setTimeout(() => {
      let searchBarHeight = document.getElementById("searchBar")?.clientHeight;
      if (searchBarHeight == null || searchBarHeight == undefined || searchBarHeight == 0) {
        searchBarHeight = 0;
      } else {
        searchBarHeight += 30;
      }
      let dockManagerHeight = window.innerHeight - searchBarHeight - 180;
      this.dockManagerConfig.height = dockManagerHeight + "px";
      this.gridConfig.height = dockManagerHeight + "px";

    }, 100);
  }
  // private currencyPipe = inject(CurrencyPipe);
  // formatPrice(price: number, currency: string): string | null {
  //   return this.currencyPipe.transform(price, currency, 'symbol-narrow');
  // }
  formatDate(val) {
    if (val == null || val == "") return null;
    let d = new Date(val);
    return ("0" + (d.getDate())).slice(-2) + "/" + ("0" + (d.getMonth() + 1)).slice(-2) + "/" + d.getFullYear();
  }


  // document.getElementById("subTable_${etd_id}").querySelector("td").colSpan = 7
  ShowHideSubGrid(etd_id) {
    let etd = this.gridConfig.data.find(x => x.Etd_Id == etd_id)
    console.log("etd: ", etd)
    if (etd.isSubGridVisible == true) {
      document.getElementById(`subTable_${etd.Etd_Id}`)?.remove();
    } else {
      // Get the target row element
      var targetRow: any = document.getElementById(`row_${etd.Etd_Id}`);

      var newRow = document.createElement("tr");
      newRow.id = `subTable_${etd.Etd_Id}`

      var mainCell = document.createElement("td");
      // mainCell.colSpan = this.gridConfig.GetVisibleColumns().length + 1;
      mainCell.colSpan = this.gridConfig.columns.length + 1;
      mainCell.style.paddingLeft = "35px";
      mainCell.style.paddingRight = "35px";

      // table header
      let ths = ""
      this.gridConfig.subGrid.GetVisibleColumns().forEach((column) => {
        if (column.visible)
          ths += `<th style="color: white; text-align: left;">${column.header}</th>`;
      })

      // table rows
      let trs = "";
      etd.Versements.forEach((item) => {
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
            default: trs += `<span>${item[column.field]}</spand>`; break;
          }
          // <span>
          //   <span>${item[column.field]}</span>
          // </span>
          trs += `</td>`
        })
        trs += `</tr>`
      })

      mainCell.innerHTML = `<table class="table table-light fixed_header"><thead><tr style="background-color: #6f67fbc4;">${ths}</tr></thead><tbody>${trs}</tbody></table>`;
      newRow.appendChild(mainCell);
      targetRow.parentNode.insertBefore(newRow, targetRow.nextSibling);
    }



    this.gridConfig.data = this.gridConfig.data.map((item) => {
      if (item.Etd_Id == etd_id)
        item.isSubGridVisible = !item.isSubGridVisible;
      return item;
    })
  }


  GetData() {
    this.loader.show();
    this.EduosService.GetEtudiantVersements(this.searchParams).subscribe(
      (response) => {
        this.loader.hide();
        console.log("response GetEtudiantVersements: ", response);
        if (response == null) {
          this.toastr.error("Erreur de GetEtudiantVersements");
        }
        else if (response.length == 0) {
          this.toastr.info("Aucun résultat trouvé");
        }
        else {
          if (this.gridConfig.data.filter(x => x.isSubGridVisible).length > 0) {
            this.gridConfig.data.filter(x => x.isSubGridVisible).forEach((item) => {
              document.getElementById(`subTable_${item.Etd_Id}`)?.remove();
            })
          }
          // this.EtudiantVersements = response.map((item) => {
          //   item.Etd_NomComplet = item.Etd_Nom + " " + item.Etd_Prenom;
          //   return item;
          // });

          let etudiants: any[] = []
          response.forEach((item) => {
            if (etudiants.find(x => x.EtdClasseAnn_Id == item.EtdClasseAnn_Id) == null) {
              etudiants.push({
                EtdClasseAnn_Id: item.EtdClasseAnn_Id,
                Etd_Id: item.Etd_Id,
                Etd_NomComplet: item.Etd_NomComplet,
                Etd_Nom: item.Etd_Nom,
                Etd_Prenom: item.Etd_Prenom,
                Etd_Matricule: item.Etd_Matricule,
                Etd_Tel: item.Etd_Tel,
                Etd_Mail: item.Etd_Mail,
                Niv_Id: item.Niv_Id,
                Niv_Nom: item.Niv_Nom,
                Cls_Id: item.Cls_Id,
                Cls_Nom: item.Cls_Nom,
                Tuteurs: item.Tuteurs,
                Sex_Nom: item.Sex_Nom,
                TelephoneTuteurs: item.TelephoneTuteurs,
                MontantTotalARegler: 0,
                isSubGridVisible: false,
                Versements: [item],
              })
            } else {
              etudiants = etudiants.map((e) => {
                if (e.EtdClasseAnn_Id == item.EtdClasseAnn_Id) e.Versements.push(item);
                return e;
              })
            }
          });

          this.gridConfig.data = etudiants
            .map((item) => {
              // item.MontantTotalARegler = item.Versements.reduce((acc, val) => acc + val.Reliquat);
              item.MontantTotalARegler = item.Versements.map(x => x.Reliquat).reduce((a, b) => { return a + b; })
              item.Vers_NomList = item.Versements.map(x => x.Vers_Nom).join(" ; ")
              return item;
            })
            .sort((a: any, b: any) => {
              if (a.Etd_NomComplet > b.Etd_NomComplet) return 1;
              if (a.Etd_NomComplet < b.Etd_NomComplet) return -1;
              if (a.Niv_Nom > b.Niv_Nom) return 1;
              if (a.Niv_Nom < b.Niv_Nom) return -1;
              if (a.Fac_Nom > b.Fac_Nom) return 1;
              if (a.Fac_Nom < b.Fac_Nom) return -1;
              return 0;
            })
          // .slice(0, 100);
          this.toggleSearchParams();
          this.onWindowResize(null);
        }
      },
      (error) => {
        this.loader.hide();
        console.error("Erreur GetEtudiantVersements: ", error);
        this.toastr.error(error?.error, "Erreur de GetEtudiantVersements");
      }
    );
  }
  Exporter(){
    this.EduosService.Exporter("Recouvrement",this.gridConfig.GetVisibleColumns(),this.gridConfig.data)
  }

  imprimer() {

    this.loader.show();
    this.EduosService.GetRecouvrementPDF(this.searchParams).subscribe(
      (response) => {
        console.log("Recouvrement généré avec succès : ", response);

        if (response == null) {
          this.toastr.error("Erreur de récupération des documents.");
          this.loader.hide();
          return;
        } else {
          let blob = new Blob([response], { type: "application/pdf" });
          let fileToDownload = window.URL.createObjectURL(blob);
          var PDF_link = document.createElement("a");
          PDF_link.href = fileToDownload;
          PDF_link.download = "Recouvrement";
          PDF_link.click();
          this.toastr.success("Recouvrement généré avec succès");
          this.loader.hide();
        }
      },
      (error) => {
        console.error("Erreur de génération du Recouvrement : ", error);
        this.loader.hide();
        this.toastr.error("Erreur de génération du Recouvrement");
      }
    );
  }
  GenererFacture() {
    console.log("searchParams: ", this.searchParams);

    this.loader.show();
    this.EduosService.GenererFacture(this.searchParams).subscribe(
      (response) => {
        console.log("Facture généré avec succès : ", response);

        if (response == null) {
          this.toastr.error("Erreur de récupération des factures.");
          this.loader.hide();
          return;
        } else {
          let blob = new Blob([response], { type: "application/pdf" });
          let fileToDownload = window.URL.createObjectURL(blob);
          var PDF_link = document.createElement("a");
          PDF_link.href = fileToDownload;
          PDF_link.download = "Facture";
          PDF_link.click();
          this.toastr.success("Factures généré avec succès");
          this.loader.hide();
        }
      },
      (error) => {
        console.error("Erreur de génération du Facture : ", error);
        this.loader.hide();
        this.toastr.error("Erreur de génération des Factures");
      }
    );
  }
  // Méthode pour basculer l'expansion des groupes
  toggleExpandGroup(group) {
    // this.table.groupHeader.toggleExpandGroup(group);
  }

  openNewModal(newModal, EtdVers) {
    console.log("le details de EtdVers : ", EtdVers);
    this.modalService.open(newModal, { ariaLabelledBy: "modal-basic-title", size: "xl" });
  }

  toggleSearchParams() {
    this.showSearchParams = !this.showSearchParams;
    this.onWindowResize(null);
  }

  // Exporter() {
   
  //   let workbook = new $.ig.excel.Workbook();
  //   let sheet = workbook.worksheets().add("Recouvrement");

  //   sheet.columns(0).width(10000); //A
  //   sheet.columns(1).width(4000); //B
  //   sheet.columns(2).width(12000); //C
  //   sheet.columns(3).width(6000); //D
  //   sheet.columns(4).width(8000); //E
  //   sheet.columns(5).width(5000); //F

  //   sheet.columns(6).width(4000); //G
  //   sheet.columns(7).width(4000); //H
  //   sheet.columns(8).width(4000); //I
  //   sheet.columns(9).width(4000); //J
  //   sheet.columns(10).width(4000); //K
  //   sheet.columns(11).width(4000); //L


  //   let rowIndex = 0;
  //   let colIndex = 0;
  //   this.gridConfig.GetVisibleColumns()
  //     .forEach((column) => {
  //       sheet.rows(rowIndex).cells(colIndex).value(new $.ig.excel.FormattedString(column.header)).getFont(0).bold(true);
  //       colIndex++;
  //       // sheet.rows(row).cells(0).cellFormat().formatString("dd-mm-yyy");
  //     })

  //   rowIndex++;

  //   this.gridConfig.data.forEach((item) => {
  //     colIndex = 0;
  //     this.gridConfig.GetVisibleColumns()
  //       .forEach((column) => {
  //         let value = item[column.field];
  //         // if (column.dataType == "string")
  //         //   while (value.includes(";"))
  //         //     value = value.replace(";", ",")
  //         sheet.rows(rowIndex).cells(colIndex).value(value);
  //         colIndex++;
  //       })
  //     rowIndex++;
  //   })


  //   workbook.save(
  //     (data) => {
  //       let dd: any = null;
  //       let df: any = null;

  //       let fileName = "Recouvrement " + GetFormattedDate(new Date());

  //       // if (GetFormattedDate(dd) == GetFormattedDate(df)) fileName += GetFormattedDate(dd) + "";
  //       // else fileName += GetFormattedDate(dd) + " - " + GetFormattedDate(df);
  //       fileName += ".xls";

  //       downloadExcelFile(fileName, data);
  //       return true;
  //     },
  //     function (error) {
  //       console.error("Error workbook.save", error);
  //       return false;
  //     }
  //   );

  //   //return workbook;

  //   function GetFormattedDate(date) {
  //     date = new Date(date);
  //     let d = date.getDate();
  //     let m = date.getMonth() + 1;
  //     let y = date.getFullYear();
  //     if (d < 10) d = "0" + d;
  //     if (m < 10) m = "0" + m;
  //     return d + "-" + m + "-" + y;
  //   }

  //   function downloadExcelFile(filename, data) {
  //     var link = document.createElement("a");
  //     link.href = "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64," + encodeURIComponent(data);
  //     // link.style = "visibility:hidden";
  //     link.download = filename;
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //   }
  // }
}
