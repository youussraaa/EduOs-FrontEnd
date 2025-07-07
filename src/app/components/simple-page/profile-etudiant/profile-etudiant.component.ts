import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

interface Student {
  nom: string;
  prenom: string;
  dateNaissance: string;
  lieuNaissance: string;
  niveau: string;
  classe: string;
  adresse: string;
  tel: string;
  photo: string;
}
@Component({
  selector: 'app-profile-etudiant',
  templateUrl: './profile-etudiant.component.html',
  styleUrl: './profile-etudiant.component.scss'
})
export class ProfileEtudiantComponent implements OnInit {

  student: Student | undefined;
  
    constructor(private route: ActivatedRoute, private router: Router) {}
  
    ngOnInit(): void {
      // Obtenir l'ID de l'étudiant depuis l'URL
      const studentId = this.route.snapshot.paramMap.get('id');
      if (studentId) {
        this.getStudentDetails(studentId);
      }
    }
  
    // Simuler la récupération des détails de l'étudiant
    getStudentDetails(id: string): void {
      // Simuler une API ou une base de données qui renvoie les informations d'un étudiant
      // Ici, nous utilisons un étudiant fictif pour démonstration
      this.student = {
        nom: 'Dupont',
        prenom: 'Jean',
        dateNaissance: '2001-05-12',
        lieuNaissance: 'Paris',
        niveau: 'CM2',
        classe: 'A',
        adresse: '123 Rue de Paris',
        tel: '0601020304',
        photo: 'https://via.placeholder.com/150'
      };
    }
  
    // Méthode pour modifier l'étudiant
    editStudent(): void {
      // Rediriger vers la page d'édition de l'étudiant
      if (this.student) {
        this.router.navigate(['/edit-student', this.student.nom]);
      }
    }
  
    // Méthode pour supprimer l'étudiant
    deleteStudent(): void {
      if (confirm(`Voulez-vous vraiment supprimer ${this.student?.nom} ${this.student?.prenom} ?`)) {
        alert(`L'élève ${this.student?.nom} a été supprimé.`);
        // Implémentez ici la logique de suppression réelle
        this.router.navigate(['/students-list']); // Redirection vers la liste des étudiants
      }
    }
  }
  
