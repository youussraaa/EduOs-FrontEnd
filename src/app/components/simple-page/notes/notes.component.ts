import { Component, OnInit, TemplateRef } from "@angular/core";
import { NgbModal, NgbNavChangeEvent } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-notes",
  templateUrl: "./notes.component.html",
  styleUrl: "./notes.component.scss",
})
export class NotesComponent {
  public history: boolean = false;

  students: any[] = [
    {
      photo: "assets/images/user/1.jpg",
      nom: "Dupont",
      prenom: "Jean",
      dateNaissance: "2005-04-12",
      lieuNaissance: "Paris",
      adresse: "10 rue de Paris, 75001 Paris",
      tel: "0123456789",
      niveau: "CM2",
      classe: "A",
      id: 1,
    },
    {
      photo: "assets/images/user/1.jpg",
      nom: "Martin",
      prenom: "Marie",
      dateNaissance: "2006-07-23",
      lieuNaissance: "Lyon",
      adresse: "25 rue de Lyon, 69001 Lyon",
      tel: "0987654321",
      niveau: "CP",
      classe: "A",
      id: 2,
    },
    // Ajoutez plus d'exemples si nécessaire
  ];

  notes: any[] = [
    {
      photo: "assets/images/user/1.jpg",
      nom: "Dupont",
      prenom: "Jean",
      niveau: "CM2",
      classe: "A",
      matieres: {
        Mathématiques: 15,
        Physique: 12,
        Français: 14,
      },
    },
    {
      photo: "assets/images/user/1.jpg",
      nom: "Martin",
      prenom: "Marie",
      niveau: "CP",
      classe: "A",
      matieres: {
        Mathématiques: 13,
        Physique: 14,
        Français: 16,
      },
    },
    // Ajoutez plus d'exemples si nécessaire
  ];

  niveaux: string[] = ["CP", "CE1", "CM2"]; // Liste des niveaux disponibles
  classes: string[] = ["A", "B", "C"]; // Liste des classes disponibles
  subjects: string[] = ["Mathématiques", "Physique", "Français"]; // Liste des matières disponibles

  filteredStudents: any[] = [];
  filteredNotes: any[] = [];
  niveauFilter: string = ""; // Filtre par niveau
  classeFilter: string = ""; // Filtre par classe
  searchFilter: string = ""; // Filtre de recherche (nom ou prénom)
  selectedStudent: any = {};
  editModalContent: TemplateRef<any>;

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {
    // Initialisation des données et application des filtres
    this.filteredStudents = [...this.students];
    this.filteredNotes = [...this.notes];
  }
  showHistory() {
    this.history = !this.history;
  }
  applyFilters() {
    // Filtrage des étudiants
    this.filteredStudents = this.students.filter(
      (student) =>
        (this.niveauFilter === "" || student.niveau === this.niveauFilter) && // Filtre par niveau
        (this.classeFilter === "" || student.classe === this.classeFilter) && // Filtre par classe
        (this.searchFilter ? student.nom.toLowerCase().includes(this.searchFilter.toLowerCase()) || student.prenom.toLowerCase().includes(this.searchFilter.toLowerCase()) : true) // Filtre par recherche
    );

    // Filtrage des notes
    this.filteredNotes = this.notes.filter(
      (note) =>
        (this.niveauFilter === "" || note.niveau === this.niveauFilter) && // Filtre par niveau
        (this.classeFilter === "" || note.classe === this.classeFilter) && // Filtre par classe
        (this.searchFilter ? note.nom.toLowerCase().includes(this.searchFilter.toLowerCase()) || note.prenom.toLowerCase().includes(this.searchFilter.toLowerCase()) : true) // Filtre par recherche
    );
  }

  openEditModal(content: TemplateRef<any>, student: any) {
    this.selectedStudent = { ...student };
    this.editModalContent = content;
    this.modalService.open(this.editModalContent, { ariaLabelledBy: "dialogueetudiant", fullscreen: false, size: "xl" });
  }

  saveChanges() {
    // Logique pour sauvegarder les changements dans la liste des étudiants
    const index = this.students.findIndex((student) => student.id === this.selectedStudent.id);
    if (index !== -1) {
      this.students[index] = this.selectedStudent;

      // Mettez également à jour la liste des notes
      const noteIndex = this.notes.findIndex((note) => note.nom === this.selectedStudent.nom && note.prenom === this.selectedStudent.prenom);
      if (noteIndex !== -1) {
        this.notes[noteIndex].nom = this.selectedStudent.nom;
        this.notes[noteIndex].prenom = this.selectedStudent.prenom;
        this.notes[noteIndex].classe = this.selectedStudent.niveau;
      }

      this.applyFilters(); // Réappliquer les filtres après la modification
    }
    this.modalService.dismissAll();
  }

  deleteStudent(index: number) {
    const studentToDelete = this.students[index];

    // Supprimer l'étudiant de la liste des étudiants
    this.students.splice(index, 1);

    // Supprimer les notes associées à cet étudiant
    const noteIndex = this.notes.findIndex((note) => note.nom === studentToDelete.nom && note.prenom === studentToDelete.prenom);
    if (noteIndex !== -1) {
      this.notes.splice(noteIndex, 1);
    }

    this.applyFilters(); // Réappliquer les filtres après la suppression
  }

  public active1 = 1;
  public active2 = 1;
  public active3 = 1;
  public active4 = 1;
  disabled = true;

  onNavChange1(changeEvent: NgbNavChangeEvent) {
    if (changeEvent.nextId === 3) {
      changeEvent.preventDefault();
    }
  }

  onNavChange(changeEvent: NgbNavChangeEvent) {
    if (changeEvent.nextId === 3) {
      changeEvent.preventDefault();
    }
  }
}
