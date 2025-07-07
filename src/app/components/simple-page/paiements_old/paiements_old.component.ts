import { Component, OnDestroy, OnInit } from "@angular/core";
import { EduosService } from "../../../shared/services/Eduos.service";
import { v4 as uuidv4 } from "uuid";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { NgbActiveModal, NgbModal, ModalDismissReasons, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import { AppService } from "../../../shared/services/app.service";
import { formatDate } from "@angular/common";

@Component({
  selector: "app-paiements_old",
  templateUrl: "./paiements_old.component.html",
  styleUrls: ["./paiements_old.component.scss"],
})
export class Paiements_oldComponent implements OnInit, OnDestroy {
  EtudiantPaiement: any[] = [];
  FacturableByEtudiantClasseAnnee: any[] = [];
  filterEtudiantPaiement: any[] = [];
  filterParams = {
    global: "",
  };
  CurrentAnnee: any;
  OnFiltreChange(event, column: string) {
    setTimeout(() => {
      // console.log("OnFiltreChange: ", event)
      // this.filtredEtudiants = this.Etudiants.filter(x => x[column]?.toLowerCase().includes(this.filterParams[column].toLowerCase()))
      this.filterEtudiantPaiement = this.EtudiantByAnnee.filter(
        (x) =>
          x.Etd_Nom?.toLowerCase().includes(this.filterParams.global.toLowerCase()) ||
          x.Etd_Prenom?.toLowerCase().includes(this.filterParams.global.toLowerCase()) ||
          x.Etd_Matricule?.toLowerCase().includes(this.filterParams.global.toLowerCase()) ||
          x.Etd_Cin?.toLowerCase().includes(this.filterParams.global.toLowerCase())
        // x.Etd_LieuNaissance?.toLowerCase().includes(this.filterParams.global.toLowerCase()) ||
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

  newOperation: any = {
    Ope_Id: uuidv4(),
    Vers_Id: null,
    ModePai_Id: null,
    Ope_Montant: null,
    Ope_Reference: null,
    Ope_Date: null,
    Ope_RefComptable: null,
    Ope_NumRecu: null,
    Ope_Description: null,
    Vers_List: ([] = []),
  };

  levels = ["CP", "CM1", "CM2"]; // Sample levels
  classes = ["Class A", "Class B", "Class C"]; // Sample classes
  public history: boolean = false;

  ModePaiementList: any[] = [];
  TypeModeList = [
    { key: "ac1ee351-094a-4cf2-8ad8-12b4824781e0", libelle: "Cheque" },
    { key: "fd1286cd-c21f-4622-82d4-3ec1f3b5f5e9", libelle: "Virement" },
    { key: "f72d7650-0228-41c8-9fc6-5b9c5d4e75bc", libelle: "Autres" },
    { key: "ca49e3ed-9806-4a45-8b08-5f0b8524b1e3", libelle: "Mandat" },
    { key: "73f3a369-997d-4742-a96f-af2323909c35", libelle: "Espece" },
    { key: "38e7c309-a4d3-4c07-81eb-35f7426c9c1e", libelle: "Wave" },
    { key: "145fd835-99c5-4176-a9d8-3a469e2e1b73", libelle: "Orange Money" },
  ];

  EcoleId: string;
  selectedEtudiant: any = null;
  selectedVersEtd: any[] = [];
  selectedOperation: any;
  EtudiantByAnnee: any;
  Niveaux: [] = [];
  Classes:[]=[];
  Annees:[]=[];

  selectedPayment: any = null;

  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private EduosService: EduosService,
    private loader: NgxSpinnerService,
    private toastr: ToastrService,
    private appService: AppService
  ) {
    config.backdrop = "static";
    config.keyboard = false;
    this.EcoleId = localStorage.getItem("EcoleId");
    //console.log('ecol', this.EcoleId);
  }
  ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
  }
  searchParams: { Ann_Id?:any;Cls_Id?:any; Niv_Id?: any; Etd_Nom?: string; Etd_Prenom?: string; Etd_Matricule?: string } = {
    Niv_Id: "",
    Etd_Nom: "",
    Etd_Prenom: "",
    Etd_Matricule: "",
    Ann_Id:"",
    Cls_Id:""
  };
  ngOnInit(): void {
    console.log("ngOnInit !!!!!!!!!!!!!!!!!!");
    this.searchParams.Niv_Id = "00000000-0000-0000-0000-000000000000";
    // this.searchParams.Ann_Id="00000000-0000-0000-0000-000000000000";
   
    this.loader.show();
    this.appService.anneeEmitter.subscribe((annee) => {
      this.CurrentAnnee=this.appService.currentAnnee?.Ann_Id    
      this.appService.currentAnnee?.Ann_Id 
      this.searchParams.Ann_Id=this.appService.currentAnnee?.Ann_Id 
      console.log("Current Année : ",this.CurrentAnnee)
    }
    )
    this.searchParams.Cls_Id="00000000-0000-0000-0000-000000000000";
    this.GetAnnees()
    this.GetNiveau()
    this.GetClasses()
    // try {
    //   this.appService.anneeEmitter.unsubscribe();
    // } catch (e) {
    //   console.warn("Exception Unsubscribe", e);
    // }
    // this.appService.anneeEmitter.subscribe((item) => {
    //   console.log("Annee has changed: ", item);
    //   this.GetData();
    // });

    setTimeout(() => {
      this.loader.show();
      // if (this.appService.currentAnnee != null) this.GetData();
      this.EduosService.GetModePaiement().subscribe(
        (response) => {
          this.loader.hide();
          if (response == null) {
            this.toastr.error("Erreur de récupération du mode paiement");
          } else {
            console.log("récupération du mode paiement avec succès : ", response);
            this.ModePaiementList = response;
            console.log("La liste des modes : ", this.ModePaiementList);
          }
        },
        (error) => {
          console.error("Erreur lors de récupération du mode paiement : ", error);
          this.loader.hide();
          this.toastr.error("Erreur lors de récupération du mode paiement");
        }
      );
    }, 1000);

    // setTimeout(() => {
    //   this.GetData();
    // }, 10);
    // this.loader.show();
    // this.appService.anneeEmitter.subscribe((annee) => {
    //   this.CurrentAnnee=this.appService.currentAnnee?.Ann_Id
    //   let params = {
    //     Ann_Id: this.appService.currentAnnee?.Ann_Id,
    //   }
    // this.EduosService.GetEtudiantClasseAnneePaiement(params)
    //   .subscribe((response: any) => {
    //     console.log("response GetEtudiantClasseAnneePaiement ", response);
    //     this.loader.hide();
    //     if (response == null) {
    //       this.toastr.error("Erreur de chargement des GetEtudiantClasseAnneePaiement");
    //     } else {
    //       this.EtudiantByAnnee = response;
    //       this.filterEtudiantPaiement=this.EtudiantByAnnee
    //     }
    //   },
    //     (error) => {
    //       console.error("Erreur GetEtudiantClasseAnneePaiement: ", error);
    //       this.loader.hide();
    //       this.toastr.error(error?.error, "Erreur de recuperation de GetEtudiantClasseAnneePaiement.");
    //     });
    //   this.appService.currentAnnee?.Ann_Id })
  }
  charger() {
    if(
      (this.searchParams.Ann_Id === "00000000-0000-0000-0000-000000000000" || this.searchParams.Ann_Id == null || this.searchParams.Ann_Id === "") 
      && (this.searchParams.Cls_Id === "00000000-0000-0000-0000-000000000000" || this.searchParams.Cls_Id == null || this.searchParams.Cls_Id === "") 
      && (this.searchParams.Niv_Id === "00000000-0000-0000-0000-000000000000" || this.searchParams.Niv_Id == null || this.searchParams.Niv_Id === "")
      && (this.searchParams.Etd_Matricule === "" || this.searchParams.Etd_Matricule == null )
      && (this.searchParams.Etd_Nom === "" || this.searchParams.Etd_Nom == null )
      && (this.searchParams.Etd_Prenom === "" || this.searchParams.Etd_Prenom == null )
    ){
      this.toastr.warning("Select en moins un paramètre de recherche")
      console.log("les paramètres envoyé sont : ",this.searchParams)
      return
    }
    console.log("les paramètres envoyé sont : ",this.searchParams)
  
      this.GetData()
    
  }

  GetNiveau() {
    this.loader.show();
    this.EduosService.GetNiveau().subscribe(
      (response) => {
        this.loader.hide();
        console.log("response GetNiveau charger", response);
        if (response == null) {
          this.toastr.error("Erreur de GetNiveau");
        } else {
          this.Niveaux = response;
          console.log("GetNiveau : ", this.Niveaux);
        }
      },
      (error) => {
        this.loader.hide();
        console.error("Erreur GetNiveau: ", error);
        this.toastr.error(error?.error, "Erreur de GetNiveau");
      }
    );
  }
  GetClasses() {
    this.loader.show();

    this.EduosService.GetClasses().subscribe(
      (response) => {
        console.log("response GetClasses: ", response);
        this.loader.hide();
        if (response == null) {
          this.toastr.error("Erreur de recuperation des classes");
        } else {
          this.Classes = response;
        }
      },
      (error) => {
        console.error("Erreur GetClasses: ", error);
        this.loader.hide();
        this.toastr.error(error?.error, "Erreur de recuperation des classes");
      }
    );
  }
  GetAnnees() {
    this.loader.show();

    this.EduosService.GetAnnees().subscribe(
      (response) => {
        console.log("response GetAnnees: ", response);
        this.loader.hide();
        if (response == null) {
          this.toastr.error("Erreur de recuperation des annees");
        } else {
          this.Annees = response;
        }
      },
      (error) => {
        console.error("Erreur GetAnnees: ", error);
        this.loader.hide();
        this.toastr.error(error?.error, "Erreur de recuperation des annees");
      }
    );
  }
  GetData(EtdClasseAnn_Id?: string) {
    // let params: any = { Ann_Id: this.appService.currentAnnee?.Ann_Id };
    let params: any = { 
      Ann_Id: this.searchParams.Ann_Id,
      Niv_Id:this.searchParams.Niv_Id,
      Cls_Id:this.searchParams.Cls_Id,
      Etd_Matricule:this.searchParams.Etd_Matricule,
      Etd_Nom:this.searchParams.Etd_Nom,
      Etd_Prenom:this.searchParams.Etd_Prenom
     };
    if (EtdClasseAnn_Id != null && EtdClasseAnn_Id != "") params.EtdClasseAnn_Id = EtdClasseAnn_Id;
    this.loader.show();
    // console.log("GetData for: ", this.appService.currentAnnee);
    this.EduosService.GetEtudiantClasseAnneePaiement(params).subscribe(
      (response: any) => {
        console.log("response GetEtudiantClasseAnneePaiement ", response);
        this.loader.hide();
        if (response == null) {
          this.toastr.error("Erreur de chargement des GetEtudiantClasseAnneePaiement");
        } else {
          if (EtdClasseAnn_Id == null || EtdClasseAnn_Id == "") {
            this.EtudiantByAnnee = response;
            this.filterEtudiantPaiement = this.EtudiantByAnnee;
          } else {
            this.EtudiantByAnnee = this.EtudiantByAnnee.map((item) => {
              if (item.EtdClasseAnn_Id == EtdClasseAnn_Id) item = response[0];
              return item;
            });
            this.filterEtudiantPaiement = this.EtudiantByAnnee;
            this.selectEtudiant(response[0]);
          }
        }
      },
      (error) => {
        console.error("Erreur GetEtudiantClasseAnneePaiement: ", error);
        this.loader.hide();
        this.toastr.error(error?.error, "Erreur de recuperation de GetEtudiantClasseAnneePaiement.");
      }
    );
  }
  ajouterOperation(modal: any) {
    if (this.selectedVersEtd && this.selectedVersEtd.length > 0) {
      // Créer la liste des règlements
      this.newOperation.Vers_List = this.selectedVersEtd.map((vers) => ({
        Regl_Id: uuidv4(),
        Ope_Id: this.newOperation.Ope_Id,
        Vers_Id: vers.Vers_Id,
        Regl_Montant: vers.Vers_Montant,
        Regl_Remarque: this.newOperation.Ope_Description,
      }));

      console.log(this.newOperation);
      this.loader.show();
      // Appel à ton service pour envoyer l'opération au backend
      this.EduosService.CreateOperation(this.newOperation).subscribe(
        (response) => {
          this.loader.hide();
          if (response == null || response == false) {
            this.toastr.error("Erreur de création de l'operation");
          } else {
            console.log("Opération ajoutée avec succès : ", response);
            // this.loader.hide();
            this.toastr.success("Opération ajoutée avec succès");
            // Créer une copie de l'opération ajoutée et s'assurer que tous les champs sont correctement assignés

            this.GetData(this.selectedEtudiant.EtdClasseAnn_Id);

            const newOp = {
              Ope_Id: this.newOperation.Ope_Id,
              EtdClasseAnn_Id: this.newOperation.Vers_Id,
              ModePai_Id: this.newOperation.ModePai_Id,
              Ope_Montant: this.newOperation.Ope_Montant,
              Ope_Reference: this.newOperation.Ope_Reference,
              Ope_Date: this.newOperation.Ope_Date,
              Ope_RefComptable: this.newOperation.Ope_RefComptable,
              Ope_NumRecu: this.newOperation.Ope_NumRecu,
              Ope_Description: this.newOperation.Ope_Description,
            };

            // Ajouter l'opération à la liste des opérations de selectedPayment
            // this.selectedEtudiant.Operations.push(newOp);
            // this.selectedPayment.Reliquat = this.getResteMontant();

            this.genereRecu(this.newOperation.Ope_Id);

            this.resetOperation();
            modal.close(); // Fermer la modal après l'ajout
          }
        },
        (error) => {
          console.error("Erreur lors de l'ajout de l'opération : ", error);
          this.loader.hide();
          this.toastr.error("Erreur lors de l'ajout de l'opération");
        }
      );
    }
  }
  deleteOperation(id: string) {
    Swal.fire({
      title: "Voulez-vous supprimer l'opération?",
      showCancelButton: true,
      confirmButtonText: "Supprimer",
      confirmButtonColor: "red",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        this.loader.show();
        this.EduosService.DeleteOperation(id).subscribe(
          (response) => {
            console.log("Opération supprimer avec succès : ", response);
            this.loader.hide();
            this.toastr.success("Opération supprimée avec succès");

            this.selectedEtudiant.Operations = this.selectedEtudiant?.Operations.filter((x) => x.Ope_Id !== id);
            this.GetData(this.selectedEtudiant.EtdClasseAnn_Id);

            // this.selectedPayment.Reliquat = this.getResteMontant();
          },
          (error) => {
            console.error("Erreur lors de la suppression de l'opération : ", error);
            this.loader.hide();
            this.toastr.error("Erreur lors de la suppression de l'opération");
          }
        );
      }
    });
  }
  detailOperation(operation, content) {
    this.selectedOperation = operation;
    console.log(this.selectedOperation);
    this.openLg(content);
  }
  resetOperation() {
    this.newOperation = {
      Ope_Id: uuidv4(),
      EtdClasseAnn_Id: null,
      ModePai_Id: null,
      Ope_Montant: null,
      Ope_Reference: null,
      Ope_Date: null,
      Ope_RefComptable: null,
      Ope_NumRecu: null,
      Ope_Description: null,
      Vers_List: ([] = []),
    };
  }
  // getTotalMontant(): number {
  //   return this.selectedPayment?.Operations?.reduce((total, operation) => {
  //     return total + (operation.Ope_Montant || 0); // Ajouter les montants tout en gérant les cas null ou undefined
  //   }, 0);
  // }
  // getResteMontant(): number {
  //   const totalPaye = this.selectedEtudiant?.Operations?.reduce((total, operation) => {
  //     return total + (operation.Ope_Montant || 0); // Ajouter les montants tout en gérant les cas null ou undefined
  //   }, 0);

  //   // Soustraction du total payé au montant total (Vers_Montant)
  //   return (this.selectedPayment?.Vers_Montant || 0) - (this.selectedPayment?.Vers_Remise || 0) - totalPaye;
  // }

  showHistory() {
    this.history = !this.history;
  }

  selectEtudiant(student: any) {
    if (this.selectedEtudiant != null && this.selectedEtudiant.EtdClasseAnn_Id == student.EtdClasseAnn_Id) this.selectedEtudiant = null;
    else {
      this.selectedEtudiant = student;
      console.log(this.selectedEtudiant);
      // Réinitialiser selectedVersEtd pour chaque étudiant sélectionné
      this.selectedVersEtd = [];
    }
  }

  // selectVersEtd(vers: any) {
  //   const index = this.selectedVersEtd.findIndex((v) => v.Vers_Id === vers.Vers_Id);
  //   if (index === -1) {
  //     // Ajouter le versement si non sélectionné
  //     this.selectedVersEtd.push(vers);
  //   } else {
  //     // Supprimer le versement si déjà sélectionné
  //     this.selectedVersEtd.splice(index, 1);
  //   }
  //   console.log("Selected versements:", this.selectedVersEtd);
  // }
  selectVersEtd(vers: any) {
    const isAlreadySelected = this.selectedVersEtd.some((v) => v.Vers_Id === vers.Vers_Id);

    if (!isAlreadySelected) {
      // Ajouter le versement si non sélectionné
      this.selectedVersEtd.push(vers);
    } else {
      // Supprimer le versement si déjà sélectionné
      this.selectedVersEtd = this.selectedVersEtd.filter((v) => v.Vers_Id !== vers.Vers_Id);
    }

    console.log("Selected versements:", this.selectedVersEtd);
  }

  genereRecu(id: string) {
    Swal.fire({
      title: "Voulez-vous générer le reçu?",
      showCancelButton: true,
      confirmButtonText: "Générer",
      confirmButtonColor: "rgba(var(--bs-info-rgb)",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        this.loader.show();
        this.EduosService.GetRecuPaiement(id).subscribe(
          (response) => {
            console.log("Reçu généré avec succès : ", response);

            if (response == null) {
              this.toastr.error("Erreur de récupération des documents.");
              this.loader.hide();
              return;
            } else {
              let blob = new Blob([response], { type: "application/pdf" });
              let fileToDownload = window.URL.createObjectURL(blob);
              var PDF_link = document.createElement("a");
              PDF_link.href = fileToDownload;
              PDF_link.download = "RecuPaiement";
              PDF_link.click();
              this.toastr.success("Reçu généré avec succès");
              this.loader.hide();
            }
          },
          (error) => {
            console.error("Erreur de génération du reçu : ", error);
            this.loader.hide();
            this.toastr.error("Erreur de génération du reçu");
          }
        );
      }
    });
  }

  openLg(content) {
    this.modalService.open(content, { size: "xl" });
  }

  reglerPaiementAdd(payment: any, content) {
    if (!this.selectedVersEtd || this.selectedVersEtd.length === 0) {
      this.toastr.warning("Veuillez sélectionner au moins un versement");
      return;
    }
    // Vérification pour voir si au moins un reliquat est égal à 0
    const hasZeroReliquat = this.selectedVersEtd.some((vers) => vers.Reliquat === 0);
    if (hasZeroReliquat) {
      this.toastr.warning("un versement contient un reliquat à zéro");
      return;
    }
    if (this.selectedVersEtd && this.selectedVersEtd.length > 0) {
      this.newOperation.EtdClasseAnn_Id = this.selectedVersEtd[0].EtdClasseAnn_Id; // Lier l'opération à l'ID du paiement sélectionné
      // this.newOperation.Vers_IdList = this.selectedVersEtd.map(vers => vers.Vers_Id);
      this.newOperation.Ope_Montant = this.selectedVersEtd.reduce((total, vers) => total + vers.Vers_Montant, 0);
      this.newOperation.Ope_Date = new Date().toISOString().split("T")[0]; // Format YYYY-MM-DD
    }
    this.selectedPayment = payment; // Assign the selected payment to a variable
    console.log("Selected payment !!!!", payment);
    this.newOperation.Vers_List = this.selectedPayment;
    console.log("objet envoyé:", this.newOperation);

    console.log("payement à régler est : ", payment);
    this.openLg(content);
  }

  facturerPaiement(Etudiant: any, content) {
    this.loader.show();
    this.EduosService.GetFacturableByEtudiantClasseAnnee(Etudiant.EtdClasseAnn_Id).subscribe(
      (response) => {
        this.loader.hide();
        if (response == null) {
          this.toastr.error("Erreur de récupération des facturable de l'élève");
        } else {
          console.log("récupération des facturable de l'élève avec succès : ", response);
          this.FacturableByEtudiantClasseAnnee = response;
          console.log(this.FacturableByEtudiantClasseAnnee);
        }
      },
      (error) => {
        console.error("Erreur lors de récupération des facturable de l'élève : ", error);
        this.loader.hide();
        this.toastr.error("Erreur lors de récupération des facturable de l'élève");
      }
    );
    this.openLg(content);
  }
  // Liste des objets sélectionnés
  selectedFacturables: any[] = [];
  getFormattedDate(): string {
    const currentDate = new Date();
    return formatDate(currentDate, "dd/MM/yyyy", "en-US"); // Format dd/MM/YYYY
  }
  // Méthode appelée lors du changement d'état de la checkbox
  onCheckboxChange(event: any, facturable: any) {
    // Passez l'objet complet au lieu de seulement l'ID
    if (event.target.checked) {
      // Créer un objet avec les propriétés souhaitées
      const selectedFacturable = {
        FactFicheFact_Id: facturable.FactFicheFact_Id,
        EtdClasseAnn_Id: this.selectedEtudiant.EtdClasseAnn_Id, // Assurez-vous que cette propriété existe dans votre objet
        Vers_Montant: facturable.FactFichFact_Montant,
        VersRec_Id: facturable.VersRec_Id,
        Vers_Remarque: `Facturation manuelle ${this.getFormattedDate()}`, // Nouvelle propriété ajoutée
      };
      this.selectedFacturables.push(selectedFacturable); // Ajouter l'objet à la liste
    } else {
      // Retirer l'objet basé sur son FactFicheFact_Id
      this.selectedFacturables = this.selectedFacturables.filter((item) => item.FactFicheFact_Id !== facturable.FactFicheFact_Id);
    }
    console.log("La liste sélectionnée :", this.selectedFacturables); // Affiche la liste actuelle des objets sélectionnés
  }
  isFacturableSelected(facturableId: string): boolean {
    return this.selectedFacturables.some((f) => f.FactFicheFact_Id === facturableId);
  }

  Facturer(modal) {
    console.log("Facturer : ", this.selectedFacturables);
    this.loader.show();
    // Appel à ton service pour envoyer l'opération au backend
    this.EduosService.CreateFacturerEtudiant(this.selectedFacturables).subscribe(
      (response) => {
        this.loader.hide();
        if (response == null || response == false) {
          this.toastr.error("Erreur de création de facturation ");
        } else {
          console.log("Facturation ajoutée avec succès : ", response);
          this.GetData(this.selectedEtudiant.EtdClasseAnn_Id);
          this.toastr.success("Facturation ajoutée avec succès");

          modal.close(); // Fermer la modal après l'ajout
        }
      },
      (error) => {
        console.error("Erreur lors de l'ajout de la facturation : ", error);
        this.loader.hide();
        this.toastr.error("Erreur lors de l'ajout de la facturation");
      }
    );
  }
  CloseOperation(modal) {
    modal.close();
    this.selectedFacturables = [];
    this.resetOperation();
  }

  deleteVersement(versId: any) {
    // Afficher une boîte de dialogue de confirmation avec Swal
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Voulez-vous vraiment supprimer ce versement ? Cette action est irréversible.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        if (!this.selectedEtudiant || !this.selectedEtudiant.Operations) {
          console.error("selectedEtudiant or Operations is undefined");
          return;
        }

        console.log("this.selectedEtudiant.Operations: ", this.selectedEtudiant.Operations);

        if (this.selectedEtudiant.Operations.length === 0) {
          this.loader.show();
          this.EduosService.DeleteVersement(versId).subscribe(
            (response) => {
              this.loader.hide();
              if (response == null || response == false) {
                this.toastr.error("Erreur de suppression de versement");
              } else {
                console.log("Versement supprimé avec succès : ", response);
                this.GetData(this.selectedEtudiant.EtdClasseAnn_Id);
                this.toastr.success("Versement supprimé avec succès");
              }
            },
            (error) => {
              console.error("Erreur lors de la suppression du versement : ", error);
              this.loader.hide();
              this.toastr.error("Erreur lors de la suppression du versement");
            }
          );
          return;
        }

        this.selectedEtudiant.Operations.forEach((operation) => {
          if (!operation.Reglements || operation.Reglements.length === 0) {
            console.log("Opération n'a aucun réglement");
            return;
          }

          const isVersIdInReglements = operation.Reglements.some((reglement) => reglement.Vers_Id === versId);

          if (!isVersIdInReglements) {
            this.EduosService.DeleteVersement(versId).subscribe(
              (response) => {
                this.loader.hide();
                if (response == null || response == false) {
                  this.toastr.error("Erreur de suppression de versement");
                } else {
                  console.log("Versement supprimé avec succès : ", response);
                  this.GetData(this.selectedEtudiant.EtdClasseAnn_Id);
                  this.toastr.success("Versement supprimé avec succès");
                }
              },
              (error) => {
                console.error("Erreur lors de la suppression du versement : ", error);
                this.loader.hide();
                this.toastr.error("Erreur lors de la suppression du versement");
              }
            );
          } else {
            this.toastr.error("Impossible de supprimer un versement associé à un règlement.");
          }
        });
      }
    });
  }
}
