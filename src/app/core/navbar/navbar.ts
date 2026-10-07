import { Component, inject } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { MatToolbar } from "@angular/material/toolbar";
import { MatIcon } from "@angular/material/icon";
import { MatButton } from "@angular/material/button";
import {
  MatButtonToggle,
  MatButtonToggleGroup,
} from "@angular/material/button-toggle";
import { ThemeService } from "../theme/theme";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.html",
  styleUrl: "./navbar.scss",
  imports: [
    MatToolbar,
    MatIcon,
    MatButton,
    MatButtonToggleGroup,
    MatButtonToggle,
    RouterLink,
    RouterLinkActive,
  ],
})
export class Navbar {
  protected readonly theme = inject(ThemeService);
}
