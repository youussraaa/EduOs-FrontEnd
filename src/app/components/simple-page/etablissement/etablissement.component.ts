import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { of } from "rxjs/internal/observable/of";
import { Ecole } from "../../../shared/components/model/dto.model";
import { EduosService } from "../../../shared/services/Eduos.service";
import { v4 as uuidv4 } from "uuid";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";
import { AppService } from "../../../shared/services/app.service";
import { Title } from "@angular/platform-browser";

@Component({
  selector: "app-etablissement",
  templateUrl: "./etablissement.component.html",
  styleUrl: "./etablissement.component.scss",
})
export class EtablissementComponent {
  options$: Observable<string[]>;
  constructor(private cdr: ChangeDetectorRef, private EduosService: EduosService, private loader: NgxSpinnerService, private toastr: ToastrService, private router: Router,private appService: AppService,private title: Title) {
    this.EcoleId = localStorage.getItem("EcoleId");
    let ecole = localStorage.getItem("Ecole");
    if (ecole != null) this.title.setTitle(`Etablissement - ${JSON.parse(ecole).Ecole_Nom}`);

   }
  Etablissement: Ecole;
  Enums: {
    EcoleType: any[],
  } = {
    EcoleType : [],
  }
  EcoleId: string | null = null;
  // selectedTypeEcole: string = "";
  // TypeEcoleList = [
  //   { key: "71ddc85c-6119-4ff1-a70a-c3f41f93c22c", libelle: "Primaire" },
  //   { key: "f7499eed-559f-4c67-91d8-e3e2793d7ad5", libelle: "Collège" },
  //   { key: "f86a5003-994f-4a3a-964b-33678395ac4e", libelle: "Lycée" },
  //   { key: "7e43e7be-7284-4c8b-a493-aede666879ad", libelle: "Université" },
  // ];
  newEtablissement = {
    Ecole_Id: uuidv4(),
    EcoleTypeIds: [] as string[],
    Ecole_Nom: "",
    Ecole_Adresse: "",
    Ecole_Mail: "",
    Ecole_Tel: "",
    Ecole_Gsm: "",
    Ecole_Description: "",
    Ecole_Logo: "",
  };
  selectedTypeEcole: string[] = [];

  onCheckboxChange(event: any) {
    const checkboxValue = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
      this.selectedTypeEcole.push(checkboxValue); // Ajouter le type sélectionné
    } else {
      const index = this.selectedTypeEcole.indexOf(checkboxValue);
      if (index !== -1) {
        this.selectedTypeEcole.splice(index, 1); // Retirer le type désélectionné
      }
    }
  }
  isChecked(typeId: string): boolean {
    return this.selectedTypeEcole.includes(typeId);
  }
  
  onSubmit() {
    
    // Convertir le tableau `selectedTypeEcole` en une chaîne de caractères séparée par des virgules
    // this.newEtablissement.EcoleTypeIds = [...this.selectedTypeEcole]; // Utilisation correcte du tableau de chaînes
    this.Etablissement.EcoleTypeIds = [...this.selectedTypeEcole]

    console.log(this.newEtablissement);

    this.loader.show();

    this.EduosService.UpdateEtablissement(this.Etablissement.Ecole_Id, this.Etablissement)
      .subscribe(
        (response) => {
          console.log("response CreateEtablissement: ", response);
          this.loader.hide();
          if (response == null || response === false) {
            this.toastr.error("Erreur de modification de l'établissement");
          } else {
            this.toastr.success("Enregistrement réussi");
            localStorage.setItem("Ecole", JSON.stringify(this.Etablissement));
          }
        },
        (error) => {
          console.error("Erreur CreateEtablissement: ", error);
          this.loader.hide();
          this.toastr.error(error?.error, "Erreur de création de l'établissement");
        });
    // this.EduosService.CreateEtablissement(this.newEtablissement).subscribe(
    //   (response) => {
    //     console.log("response CreateEtablissement: ", response);
    //     if (response == null || response === false) {
    //       this.loader.hide();
    //       this.toastr.error("Erreur de création de l'établissement");
    //     } else {
    //       this.toastr.success("Établissement ajouté avec succès");
    //       this.loader.hide();
    //       this.gotToDomaine();
    //     }
    //   },
    //   (error) => {
    //     console.error("Erreur CreateEtablissement: ", error);
    //     this.loader.hide();
    //     this.toastr.error(error?.error, "Erreur de création de l'établissement");
    //   }
    // );
  }
  // onImageSelected(event) {
  //   const file: File = event.target.files[0];
  //   if (file) {
  //     // gérer le fichier ici, par exemple le convertir en base64 pour l'envoyer
  //     this.newEtablissement.Ecole_Logo = file.name; // Ou une autre logique pour le traitement du fichier
  //   }
  // }
  onImageSelected(event) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64Logo = e.target.result.split(",")[1]; // Extraire la partie base64
        this.newEtablissement.Ecole_Logo = base64Logo; // Sauvegarder dans l'objet newEtablissement
      };
      reader.readAsDataURL(file); // Lire le fichier comme une URL de données
    }
  }
  gotToDomaine() {
    this.router.navigate(["/domaine"])
  }
  goToNiveaux() {
    this.router.navigate(["/niveaux"]);
  }

  ngOnInit(): void {
    
    this.loader.show();
    this.EduosService.GetEcole([this.EcoleId])
      .subscribe((response: any) => {
        console.log("response GetEcole: ", response);
        this.loader.hide();
        if (response == null) {
          this.toastr.error("Erreur de recuperation de l'ecole");
        }
        else {
          this.Etablissement = response[0];
          let typeecole = response[0].EcoleTypes.map(x=>x.EcoleType_Id)          
          this.selectedTypeEcole.push(...typeecole)
        }
      }, (error) => {
        this.loader.hide();
        this.toastr.error("Erreur de recuperation de l'ecole");
      })

      this.EduosService.GetCommunData([
        `${environment.apiUrl}/api/Configuration/GetEcoleType`,  
      ])
        .subscribe((response: any[]) => {
          console.log("Response GetCommunData: ", response)
          this.Enums.EcoleType = response[0];               
        }, (error) => {
          console.error("Error GetCommunData: ", error)
        })
  
  }
}
// ngAfterViewInit() {
//   // Si des changements sont effectués après la détection initiale
//   this.cdr.detectChanges();
// }
