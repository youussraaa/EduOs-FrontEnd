import { Component, PLATFORM_ID, Inject, AfterViewInit, HostListener } from "@angular/core";
// import { isPlatformBrowser } from '@angular/common';
import { LoadingBarService } from "@ngx-loading-bar/core";
import { map, delay, withLatestFrom } from "rxjs/operators";
import { AuthService } from "./shared/services/auth.service";
import { UserIdleService } from "angular-user-idle";
import { ToastrService } from "ngx-toastr";
import { EduosService } from "./shared/services/Eduos.service";
import { NgxSpinnerService } from "ngx-spinner";
import { Title } from "@angular/platform-browser";
import { IPaginatorResourceStrings, IGridResourceStrings, changei18n } from "igniteui-angular";
import { environment } from "../environments/environment";

import { IgxResourceStringsFR } from "igniteui-angular-i18n";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements AfterViewInit {
  // For Progressbar
  // loaders = this.loaderBar.progress$.pipe(
  //   delay(1000),
  //   withLatestFrom(this.loaderBar.progress$),
  //   map((v) => v[1])
  // );

  constructor(
    // @Inject(PLATFORM_ID) private platformId: Object,
    private loaderBar: LoadingBarService,
    private loader: NgxSpinnerService,
    private authService: AuthService,
    private eduosService: EduosService,
    private userIdleService: UserIdleService,
    private toastr: ToastrService,
    private title: Title
  ) {
    // if (isPlatformBrowser(this.platformId)) {
    //   translate.setDefaultLang('en');
    //   translate.addLangs(['en', 'de', 'es', 'fr', 'pt', 'cn', 'ae']);
    // }
  }
  public paginatorResourceStrings: IPaginatorResourceStrings = {
    igx_paginator_label: "",
    igx_paginator_pager_text: "",
  };
  public gridResourceStrings: IGridResourceStrings = {
    igx_grid_row_edit_btn_done: "",
    igx_grid_row_edit_btn_cancel: "",
    igx_grid_filter: "",
    igx_grid_filter_row_close: "",
    igx_grid_filter_row_reset: "",
    igx_grid_filter_row_placeholder: "",
  };

  RemoveWatermark() {
    setTimeout(() => {
      try {
        document.querySelector("igc-dockmanager")?.shadowRoot?.querySelector("igc-trial-watermark")?.remove();
      } catch (e) {
        /* console.warn("Exception: ", e); */
      }
      try {
        document.querySelector("#__ig_wm__")?.remove();
      } catch (e) {
        /* console.warn("Exception: ", e); */
      }
      try {
        document.querySelector("igc-trial-watermark")?.remove();
      } catch (e) {
        /* console.warn("Exception: ", e); */
      }
    }, 500);
  }
  ngAfterViewInit() {
    this.RemoveWatermark();
  }

  @HostListener("window:focus", ["$event"])
  onFocus(event: any): void {
    this.RemoveWatermark();
  }

  @HostListener("window:blur", ["$event"])
  onBlur(event: any): void {
    this.RemoveWatermark();
  }

  ngOnInit(): void {
    this.RemoveWatermark();
    changei18n(IgxResourceStringsFR);
    if (this.authService.isLoggedIn()) {
      this.authService.GetCurrentUser().then(
        (response: any) => {
          console.log("GetCurrentUser: ", response);
          if (!environment.production) console.log("response GetCurrentUser: ", response);
          if (response == null) {
            this.toastr.error("Erreur de chargement du profile de l'utilisateur");
          } else {
            if (response.attributes.EcoleId != null && response.attributes.EcoleId.length > 0) {
              if (response.attributes.EcoleId[0] != null && response.attributes.EcoleId[0] != "") {
                localStorage.setItem("EcoleId", response.attributes.EcoleId[0]);
                this.InitEcole(response.attributes.EcoleId);
              }
            } else {
              console.error("No EcoleID !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
            }
            if (response.attributes.CaisseId != null && response.attributes.CaisseId.length > 0) {
              if (response.attributes.CaisseId[0] != null && response.attributes.CaisseId[0] != "") {
                localStorage.setItem("CaisseId", response.attributes.CaisseId[0]);
                // this.InitEcole(response.attributes.EcoleId);
              }
            } else {
              console.error("No CaisseId !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
            }
          }
        },
        (error) => {
          console.error("Erreur getUser: ", error);
        });
      this.userIdleService.startWatching();
      this.userIdleService
        .onTimerStart()
        // .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe();
      this.userIdleService
        .onTimeout()
        // .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          // alert('Your session has timed out. Please log in again.');
          // this.toastr.info("idle detected !!!");
          console.log("Your session has timed out. Please log in again.");
          // this.authenticationService.logout();
          this.userIdleService.resetTimer();
        });
    } else {
      console.log("not logged");
    }
  }

  InitEcole(data: any[]) {
    // this.loader.show();
    // this.RemoveWatermark();
    this.eduosService.GetEcole(data).subscribe(
      (response) => {
        // this.loader.hide();
        if (response == null) {
          console.error("Error get Ecole: ", response);
        } else {
          localStorage.setItem("UserEcoles", JSON.stringify(response));
          localStorage.setItem("Ecole", JSON.stringify(response[0]));
          if (this.title.getTitle() == "Edu-OS")
            this.title.setTitle(response[0].Ecole_Nom);
        }
      },
      (error) => {
        // this.loader.hide();
        this.toastr.error("Erreur de chargement d'ecole");
      }
    );
  }
}
