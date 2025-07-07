import { Component, OnInit } from "@angular/core";
import { EduosService } from "../../../shared/services/Eduos.service";
import { v4 as uuidv4 } from "uuid";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Params } from "@angular/router";
import { Title } from "@angular/platform-browser";

@Component({
  selector: "app-candidature",
  templateUrl: "./candidature.component.html",
  styleUrl: "./candidature.component.scss",
})
export class CandidatureComponent implements OnInit {


  Ecole_Code: string = null;
  Ecole: any = null;

  constructor(
    private title: Title,
    private route: ActivatedRoute,
    private EduosService: EduosService,
    private loader: NgxSpinnerService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute) {

    this.activatedRoute.queryParams.subscribe((params: Params) => {
      console.log(" params =====> ", params);
      if (params == null || params.ec == null) {
        this.toastr.warning("Lien d'inscription invalide")
      } else {
        this.Ecole_Code = params.ec;

        this.loader.show()
        this.EduosService.GetEcoleByCode(this.Ecole_Code)
          .subscribe((response) => {
            console.log("response GetEcoleByCode: ", response)
            this.loader.hide()

            if (response == null) {

            } else {
              this.Ecole = response;
            }
          }, (error) => {
            this.loader.hide()
            console.error("Error GetEcoleByCode: ", error)
          })
        // getEcoleNom
      }
    });

  }

  selectedTypeSexe: any = null;
  selectedCandidat: any;
  code: string | null = null;
  ecole: string;

  TypeSexeList = [
    { key: "d2821b37-77e9-4b20-b67e-5995adbd825e", libelle: "Masculin" },
    { key: "5cbda9a3-22a9-49f1-873d-5fb23e0d1156", libelle: "Feminin" },
    { key: "e603dabf-4159-4e0b-bef4-c8339da8c5cc", libelle: "Undefined" },
  ];
  newCandidat: any = {
    Cnd_Id: uuidv4(),
    // Ecole_Id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    Sex_Id: null,
    Cnd_Nom: null,
    Cnd_Prenom: null,
    Cnd_Matricule: null,
    Cnd_Photo: null,
    Cnd_DateNaissance: null,
    Cnd_LieuNaissance: null,
    Cnd_CIN: null,
    Cnd_Tel: null,
    Cnd_Mail: null,
    Cnd_Adresse: null,
  };
  onSubmit() {
    // Assigner l'ID du sexe
    this.newCandidat.Sex_Id = this.selectedTypeSexe;
    this.newCandidat.Cnd_Matricule = "Etd" + this.newCandidat.Cnd_CIN;

    if (this.newCandidat.Cnd_Nom == "" || this.newCandidat.Cnd_Nom == null || this.newCandidat.Cnd_Prenom == "" || this.newCandidat.Cnd_Prenom == null || this.newCandidat.Cnd_CIN == "" || this.newCandidat.Cnd_CIN == null || this.newCandidat.Sex_Id == "" || this.newCandidat.Sex_Id == null || this.newCandidat.Cnd_Tel == "" || this.newCandidat.Cnd_Tel == null) {
      this.toastr.warning("Veuillez remplir tous les champs (Nom,Prenom,Sexe,CIN,Téléphone)", "Champs manquant !");
    } else {
      this.loader.show();
      console.log(this.newCandidat);
      this.EduosService.CreateCandidat(this.newCandidat).subscribe(
        (response) => {
          console.log("response CreateCandidat: ", response);
          if (response == null || response == false) {
            this.loader.hide();

            this.toastr.error("Erreur de postuler la candidature");
          } else {
            this.loader.hide();
            this.toastr.success("Candidature postulé avec succès");
            console.log(this.newCandidat);

            this.resetAddNewCandidatForm();
          }
        },
        (error) => {
          console.error("Erreur CreateCandidat: ", error);
          this.loader.hide();
          this.toastr.error(error?.error, "Erreur de potuler la candidature");
        }
      );
    }
  }

  onImageSelected(event) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64Logo = e.target.result.split(",")[1]; // Extraire la partie base64
        this.newCandidat.Cnd_Photo = base64Logo; // Sauvegarder dans l'objet newEtablissement
      };
      reader.readAsDataURL(file); // Lire le fichier comme une URL de données
    }
  }
  resetAddNewCandidatForm() {
    this.newCandidat = {
      Cnd_Id: uuidv4(),
      // Ecole_Id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      Sex_Id: null,
      Cnd_Nom: null,
      Cnd_Prenom: null,
      Cnd_Matricule: null,
      Cnd_Photo: null,
      Cnd_DateNaissance: null,
      Cnd_LieuNaissance: null,
      Cnd_CIN: null,
      Cnd_Tel: null,
      Cnd_Mail: null,
      Cnd_Adresse: null,
    };
    this.selectedTypeSexe = null;
    // Réinitialiser le champ d'upload de photo (input type file)
    const photoInput = document.getElementById("photoUpload") as HTMLInputElement;
    if (photoInput) {
      photoInput.value = ""; // Vider le champ du fichier
    }
  }
  ngOnInit() {
    // Récupérer le paramètre de requête "code"
    this.route.queryParams.subscribe((params) => {
      this.code = params["code"];
      if (this.code == "keurebadianemai") {
        this.ecole = "Keure Badiane Mai";
        this.title.setTitle(this.ecole);
      }
      if (this.code == "alwaha") {
        this.ecole = "Al Waha";
        this.title.setTitle(this.ecole);
      }
      console.log("Code récupéré:", this.code);
    });
  }
}
