import { Routes } from "@angular/router";
import { AuthGuard } from "../guard/auth.guard";

export const content: Routes = [
  { path: "", loadChildren: () => import("../../components/simple-page/simple-page.module").then((m) => m.SimplePageModule), canActivate: [AuthGuard], },
];
