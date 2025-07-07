import { Component, OnInit, Inject } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { NavService } from "../../services/nav.service";
import { LayoutService } from "../../services/layout.service";
import SwiperCore, { Navigation, Pagination, Autoplay } from "swiper";
import { AppService } from "../../services/app.service";
import { EduosService } from "../../services/Eduos.service";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "../../services/auth.service";
import { NgxSpinnerService } from "ngx-spinner";

SwiperCore.use([Navigation, Pagination, Autoplay]);
@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
  public elem: any;
  currentAnn_Id: string | null = null;
  currentAnnee: any = null;
  Annees: any[] = [];
  canViewDashboard: boolean = false;

  constructor(
    public layout: LayoutService,
    public navServices: NavService,
    @Inject(DOCUMENT) private document: any,
    public appService: AppService,
    public eduosService: EduosService,
    private toastr: ToastrService,
    private authService: AuthService,
    private loader: NgxSpinnerService
  ) {
    if (this.authService.CurrentUserHasRole("topManagement", false)) {
      this.canViewDashboard = true;
      console.log("topManagement !!!")
    }

    this.appService.anneeEmitter.subscribe(item => this.currentAnnee = item)

    this.eduosService.GetAnnees()
      .subscribe((response) => {
        console.log("response GetAnnees: ", response)
        this.Annees = response.sort((a, b) => b.Ann_Nom.localeCompare(a.Ann_Nom));
        this.currentAnnee = response.find(x => x.Ann_Encours == true);

        // setTimeout(() => {
        if (localStorage.getItem("selectedAnnee") != null) {
          let selectedAnnee = response.find(x => x.Ann_Id == localStorage.getItem("selectedAnnee"))
          if (selectedAnnee != null) this.appService.anneeEmitter.emit(selectedAnnee);
          else {
            let currentAnnee = response.find(x => x.Ann_Encours);
            if (currentAnnee != null) this.appService.anneeEmitter.emit(currentAnnee);
          }
        } else {
          let currentAnnee = response.find(x => x.Ann_Encours);
          if (currentAnnee != null) this.appService.anneeEmitter.emit(currentAnnee);
        }

      }, (error) => {
        console.error("Erreur getAnnees: ", error)
      })
  }
  ChangeAnnee(ann_id: string) {
    // this.loader.show();
    let annee = this.Annees.find(x => x.Ann_Id == ann_id);
    this.appService.anneeEmitter.emit(annee);
    localStorage.setItem("selectedAnnee", annee.Ann_Id);
    // this.toastr.info("Année modifiée");
    // petit délai pour laisser le spinner s'afficher
    // setTimeout(() => {
    //   this.document.location.reload();            // ← full page reload
    // }, 100);
  }

  ngOnInit() {
    this.elem = document.documentElement;
  }

  sidebarToggle() {
    this.navServices.collapseSidebar = !this.navServices.collapseSidebar;
    this.navServices.megaMenu = false;
    this.navServices.levelMenu = false;
  }

  layoutToggle() {
    if (this.layout.config.settings.layout_version === "dark-only") {
      document.body.classList.toggle("dark-only");
    }
    document.body.classList.remove("some-class");
  }

  searchToggle() {
    this.navServices.search = true;
  }

  languageToggle() {
    this.navServices.language = !this.navServices.language;
  }

  toggleFullScreen() {
    this.navServices.fullScreen = !this.navServices.fullScreen;
    if (this.navServices.fullScreen) {
      if (this.elem.requestFullscreen) {
        this.elem.requestFullscreen();
      } else if (this.elem.mozRequestFullScreen) {
        /* Firefox */
        this.elem.mozRequestFullScreen();
      } else if (this.elem.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        this.elem.webkitRequestFullscreen();
      } else if (this.elem.msRequestFullscreen) {
        /* IE/Edge */
        this.elem.msRequestFullscreen();
      }
    } else {
      if (this.document.exitFullscreen) {
        this.document.exitFullscreen();
      } else if (this.document.mozCancelFullScreen) {
        /* Firefox */
        this.document.mozCancelFullScreen();
      } else if (this.document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        this.document.webkitExitFullscreen();
      } else if (this.document.msExitFullscreen) {
        /* IE/Edge */
        this.document.msExitFullscreen();
      }
    }
  }
}
