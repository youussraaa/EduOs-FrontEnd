import { Component, OnInit } from "@angular/core";
import { EduosService } from "../../../shared/services/Eduos.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { Title } from "@angular/platform-browser";

interface Classe {
  name: string;
}

interface Versement {
  name: string;
  montant: number;
}

interface Level {
  name: string;
  classes: Classe[];
  versements: Versement[];
  showDetails: boolean;
}

@Component({
  selector: "app-resume",
  templateUrl: "./resume.component.html",
})
export class ResumeComponent implements OnInit {
  constructor(private EduosService: EduosService, private loader: NgxSpinnerService, private toastr: ToastrService,private title: Title) { 
    let ecole = localStorage.getItem("Ecole");
    if (ecole != null) this.title.setTitle(`Résumé - ${JSON.parse(ecole).Ecole_Nom}`);
  }
  levels: Level[] = [];
  resumeConfig: any[] = [];
  ngOnInit(): void {
    this.loader.show();
    this.EduosService.GetResumeConfig().subscribe(
      (response) => {
        console.log("response GetResumeConfig: ", response);
        this.loader.hide();
        if (response == null || response == false) {

          this.toastr.error("Erreur de GetResumeConfig");
        } else {
          this.resumeConfig = response;
        }
      },
      (error) => {
        console.error("Erreur GetResumeConfig: ", error);
        this.loader.hide();
        this.toastr.error(error?.error, "Erreur de GetResumeConfig");
      }
    );
    this.levels = [
      {
        name: "CP",
        classes: [{ name: "CP - A" }, { name: "CP - B" }],
        versements: [
          { name: "frais de scolarite", montant: 3000 },
          { name: "frais de transport", montant: 200 },
        ],
        showDetails: false,
      },
      {
        name: "CE1",
        classes: [{ name: "CE1 -A " }, { name: "CE1 - B" }],
        versements: [
          { name: "frais de scolarite", montant: 4000 },
          { name: "frais de transport", montant: 200 },
        ],
        showDetails: false,
      },
    ];
  }

  toggleDetails(level: Level): void {
    level.showDetails = !level.showDetails;
  }
}
