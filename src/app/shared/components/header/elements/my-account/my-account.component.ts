import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { keycloakUser } from "../../../model/dto.model";
import { AuthService } from "../../../../../shared/services/auth.service";
import { environment } from "../../../../../../environments/environment";

@Component({
  selector: "app-my-account",
  templateUrl: "./my-account.component.html",
  styleUrls: ["./my-account.component.scss"],
})
export class MyAccountComponent implements OnInit {
  public userName: string;
  public profileImg: "assets/images/dashboard/profile.jpg";

  user: keycloakUser;
  version: string = null;

  constructor(public router: Router, private authService: AuthService) {
    this.version = environment.version;
    this.authService.GetCurrentUser()
      .then((user: any) => {
        this.user = user;
        if ((this.user.firstName == null || this.user.firstName == "") && (this.user.lastName == null || this.user.lastName == "")) this.user.FullName = this.user.email;
        else this.user.FullName = this.user.firstName + " " + this.user.lastName;
      });
    if (JSON.parse(localStorage.getItem("user"))) {
    } else {
    }
  }

  ngOnInit() { }

  logoutFunc() {
    localStorage.clear()
    this.authService.Logout();
  }
  userProfile() {
    window.open(`${environment.keycloak.serverUrl}/realms/${environment.keycloak.realm}/account/#/personal-info`, "_blank");
  }
}
