import { Component, OnInit, ViewChild, Renderer2 } from "@angular/core";
import { AddCategoryComponent } from "./modal/add-category/add-category.component";
import { PrintContactComponent } from "./modal/print-contact/print-contact.component";
import { Title } from "@angular/platform-browser";
import Swal from "sweetalert2";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { EduosService } from "../../../shared/services/Eduos.service";
import { environment } from "../../../../environments/environment";
import { forkJoin, of } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { AuthService } from "../../../shared/services/auth.service";
import { keycloakUser } from "../../../shared/components/model/dto.model";

@Component({
  selector: "app-clients",
  templateUrl: "./clients.component.html",
  styleUrls: ["./clients.component.scss"],
})
export class ClientsComponent implements OnInit {
  // @ViewChild("addClient") AddClient: AddClientComponent;
  @ViewChild("addCategory") AddCategory: AddCategoryComponent;
  @ViewChild("print") Print: PrintContactComponent;

  public history: boolean = false;

  CurrentEtudiant: any = null;
  titre: String;
  Etudiants: any[] = [];
  User: keycloakUser | null = null;

  constructor(private title: Title, private router: Router, private EduosService: EduosService, private loader: NgxSpinnerService, private toastr: ToastrService, private renderer: Renderer2, private authService: AuthService) {

    this.titre = this.title.getTitle();

    // this.authService.GetCurrentUser().then((user: any) => {
    //   this.User = user;
    //   if ((this.User.firstName == null || this.User.firstName == "") && (this.User.lastName == null || this.User.lastName == "")) this.User.FullName = this.User.email;
    //   else this.User.FullName = this.User.firstName + " " + this.User.lastName;
    // });
    this.authService.GetCurrentUser().then((user: any) => {
      this.User = user;

      // if ((this.User.firstName == null || this.User.firstName == "") && (this.User.lastName == null || this.User.lastName == "")) {
      //   this.User.FullName = this.User.email;
      // } else if (this.User.lastName == null || this.User.lastName == "") {
      //   this.User.FullName = this.User.firstName;
      // } else {
      //   this.User.FullName = this.User.firstName + " " + this.User.lastName;
      // }
      if (
        (this.User.firstName == null || this.User.firstName == "") &&
        (this.User.lastName == null || this.User.lastName == "")
      ) {
        this.User.FullName = this.User.email;
      } else
        this.User.FullName =
          (this.User.firstName != null &&
            this.User.firstName != "" &&
            this.User.firstName != "undefined"
            ? this.User.firstName
            : "") +
          " " +
          (this.User.lastName != null &&
            this.User.lastName != "" &&
            this.User.lastName != "undefined"
            ? this.User.lastName
            : "");
    });
  }
  // triggerFileInput() {
  //   const fileInput = document.querySelector(".updateimg") as HTMLInputElement;
  //   fileInput.click();
  // }

  // onProfileImageChange(event: any) {
  //   if (event.target.files && event.target.files[0]) {
  //     const file = event.target.files[0];
  //     const fileExtension = file.name.split(".").pop().toLowerCase();
  //     const allowedExtensions = ["jpg", "jpeg", "png"];
  //     const mimeType = file.type;

  //     // Check if the file is an image and has the allowed extension
  //     if (!allowedExtensions.includes(fileExtension) || !mimeType.startsWith("image/")) {
  //       this.toastr.error("Veuillez sélectionner un fichier image valide (jpg, jpeg, png).");
  //       return;
  //     }

  //     const formData = new FormData();
  //     formData.append("file", file, file.name);
  //     formData.append("ClientId", this.CurrentClient.ClientId);

  //     const clientId = this.CurrentClient.ClientId;
  //     const oldExtensions = ["jpg", "jpeg", "png"];

  //     // Créer une requête HTTP pour chaque extension
  //     const checkAndDeleteRequests = oldExtensions.map((ext) => {
  //       return this.clientService.checkImageExists(clientId, ext).pipe(
  //         switchMap((exists: boolean) => {
  //           if (exists) {
  //             return this.clientService.DeleteProfileImage(clientId, ext);
  //           } else {
  //             return of(null); // Si l'image n'existe pas, on continue
  //           }
  //         }),
  //         catchError((err) => {
  //           console.log(`Erreur lors de la suppression de l'image avec extension ${ext}:`, err);
  //           return of(null); // En cas d'erreur, continuer quand même
  //         })
  //       );
  //     });

  //     // Exécuter les suppressions en parallèle
  //     forkJoin(checkAndDeleteRequests).subscribe(() => {
  //       // Après avoir supprimé les anciennes images, uploader la nouvelle
  //       this.clientService.UploadProfileImage(formData).subscribe(
  //         (response: any) => {
  //           // Utilisez le chemin complet avec un timestamp pour forcer le rechargement de l'image
  //           const timestamp = new Date().getTime();
  //           const imageUrl = `${environment.url}/Pieces/${clientId}/profile.${fileExtension}?t=${timestamp}`;

  //           // Mettre à jour l'URL de l'image de profil
  //           this.CurrentClient.ImgSrc = imageUrl;
  //           console.log("Image mise à jour:", this.CurrentClient.ImgSrc);
  //           this.toastr.success("Image de profil mise à jour avec succès");
  //         },
  //         (error: any) => {
  //           this.toastr.error("Erreur lors de l'upload de l'image de profil");
  //         }
  //       );
  //     });
  //   }
  // }

  ngOnInit() {
    // this.getEtudiants();
    this.LoadTous();
  }
  LoadTous() {
    const butonTous = document.getElementById("pills-personal-tab");
    if (butonTous) {
      butonTous.click();
      console.log("bouton cliqued");
    }
  }

  images = ["assets/images/user/2.png", "assets/images/user/user-dp.png", "assets/images/user/1.png", "assets/images/user/2.png", "assets/images/user/2.png", "assets/images/user/2.png", "assets/images/user/2.png"];

  getEtudiants() {
    this.loader.show();
    this.EduosService.GetEtudiants({}).subscribe(
      (response) => {
        console.log("response GetEtudiants: ", response);
        this.loader.hide();
        this.Etudiants = response.map((etudiant) => {
          if (etudiant.Etd_Photo == null) etudiant.Etd_Photo = "assets/images/user/user.png";
          // else etudiant.Etd_Photo = `${environment.url}/${client.Photo}`;
          else etudiant.Etd_Photo = "assets/images/user/user.png";

          return etudiant;
        });
      },
      (error) => {
        console.error("Error fetching clients: ", error);
        this.loader.hide();
      }
    );
  }
  // Function to format Moroccan and French phone numbers
  // formatPhoneNumber(phone: string): string {
  //   if (!phone) return "";

  //   // Check if the phone number starts with the Moroccan or French code
  //   if (phone.startsWith("+212")) {
  //     // Format for Moroccan numbers: +212 6 01 01 00 46
  //     return phone.replace(/^(\+212)(\d{1})(\d{2})(\d{2})(\d{2})(\d{2})$/, "$1 $2 $3 $4 $5 $6");
  //   } else if (phone.startsWith("+33")) {
  //     // Format for French numbers: +33 6 25 00 25 04
  //     return phone.replace(/^(\+33)(\d{1})(\d{2})(\d{2})(\d{2})(\d{2})$/, "$1 $2 $3 $4 $5 $6");
  //   }

  //   // Return the phone as-is if it doesn't match either format
  //   return phone;
  // }
  // Unformat the phone number before saving to remove spaces (optional)
  // unformatPhoneNumber(phone: string): string {
  //   return phone.replace(/\s/g, ""); // Remove all spaces
  // }
  navigateToDetails(Etd_Id: string) {
    this.router.navigate(["/clients/details/", Etd_Id]);
  }
  showHistory() {
    this.history = !this.history;
  }

  OnEtdSelected(id: string) {
    if (this.IsEditingEtd) {
      this.toastr.warning("Veuillez compléter la modification");
      return;
    }

    this.Etudiants = this.Etudiants.map((item) => {
      item.IsSelected = false;
      if (item.ClientId === id) {
        item.IsSelected = true;
        this.CurrentEtudiant = item;
      }
      return item;
    });
  }

  // Méthode pour vérifier l'existence de l'image sans générer d'erreur visible dans la console
  // checkImageExists(url: string, callback: (exists: boolean) => void) {
  //   const img = new Image();

  //   // Si l'image est chargée avec succès
  //   img.onload = () => {
  //     callback(true); // L'image existe
  //   };

  //   // Si l'image échoue à charger (404 ou autre erreur)
  //   img.onerror = () => {
  //     callback(false); // L'image n'existe pas
  //   };

  //   // Désactiver la mise en cache pour éviter les erreurs dues à des images précédemment manquantes
  //   img.src = `${url}?t=${new Date().getTime()}`;
  // }

  sweetAlertDelete(id: string) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-danger",
        cancelButton: "btn btn-light me-2",
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons
      .fire({
        title: "Tu es sûr ?",
        text: "Vous ne pourrez pas revenir en arrière !",
        showCancelButton: true,
        confirmButtonText: "Supprimer",
        cancelButtonText: "Annuler",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.value) {
          this.EduosService.DeleteEtudiant([id]).subscribe(
            () => {
              this.CurrentEtudiant = null;
              this.Etudiants = this.Etudiants.filter((x) => x.Etd_Id != id);
              this.toastr.success("Etudiant supprimé");
              // swalWithBootstrapButtons.fire('Supprimé !', 'Le client est supprimé.', 'success');
            },
            (error) => {
              console.error("Error deleting etudiant: ", error);
              this.toastr.error("Erreur de suppression du etudiant");
              // swalWithBootstrapButtons.fire('Erreur', 'Erreur lors de la suppression du client.', 'error');
            }
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          // swalWithBootstrapButtons.fire('Annulé', 'Le client est en sécurité :)', 'error');
        }
      });
  }

  DeleteEtudiant(id: string) {
    this.CurrentEtudiant = null;
    this.Etudiants = this.Etudiants.filter((x) => x.Etd_Id != id);
  }

  //#region UpdateClient
  public IsEditingEtd: boolean = false;
  EtudiantToUpdate: any = null;
  StartUpdateClient() {
    this.EtudiantToUpdate = structuredClone(this.CurrentEtudiant);
    console.log("EtudiantToUpdate: ", this.EtudiantToUpdate);

    this.IsEditingEtd = true;
  }
  SubmitUpdateClient() {
    if (this.EtudiantToUpdate.Etd_Nom == null || this.EtudiantToUpdate.Etd_Nom == "" || this.EtudiantToUpdate.Etd_Prenom == null || this.EtudiantToUpdate.Etd_Prenom == "") {
      this.toastr.warning("Veuillez saisir le nom et prénom du client.");
      return;
    }
    this.loader.show();
    this.EduosService.UpdateEtudiant(this.EtudiantToUpdate.Etd_Id, this.EtudiantToUpdate).subscribe(
      (response) => {
        console.log("response UpdateEtudiant: ", response);
        this.loader.hide();

        if (response == null || response == false) {
          this.toastr.error("Erreur de modification du etudiant");
        } else {
          this.toastr.success("Enregistrement réussi");

          this.CurrentEtudiant = structuredClone(this.EtudiantToUpdate);
          this.Etudiants = this.Etudiants.map((item) => {
            if (item.Etd_Id == this.EtudiantToUpdate.Etd_Id) {
              item.Etd_Nom = this.EtudiantToUpdate.Etd_Nom;
              item.Etd_Prenom = this.EtudiantToUpdate.Etd_Prenom;
              item.Etd_Mail = this.EtudiantToUpdate.Etd_Mail;
            }
            return item;
          });
          this.IsEditingEtd = false;
          this.EtudiantToUpdate = null;
        }
      },
      (error: any) => {
        console.log("Error UpdateEtudiant: ", error);
        this.toastr.error(`Erreur de modification de etudiant. ${error?.error}`);
        this.loader.hide();
      }
    );
  }
  CancelUpdateClient() {
    this.IsEditingEtd = false;
    this.EtudiantToUpdate = null;
  }
  //#endregion UpdateClient

  OnSaveAddClient(newClientData) {
    console.log("OnSaveAddClient: ", newClientData);
    this.Etudiants.push(newClientData);
  }
}
