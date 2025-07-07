import { Component } from '@angular/core';

@Component({
  selector: 'app-ninth-page',
  templateUrl: './ninth-page.component.html',
})
export class NinthPageComponent {
  newStudent: any = {};

  addStudent() {
    // Vous pouvez ajouter une logique ici pour traiter les informations de l'étudiant
    console.log('Étudiant ajouté:', this.newStudent);
    this.newStudent = {};  // Réinitialiser le formulaire après l'ajout
  }
}
