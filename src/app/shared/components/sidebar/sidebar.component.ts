import { Component, ViewEncapsulation, HostListener, TemplateRef } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Menu, NavService } from '../../services/nav.service';
import { LayoutService } from '../../services/layout.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppService } from '../../services/app.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SidebarComponent {


  public iconSidebar;
  public menuItems: Menu[];
  menuTitle: string = null;

  // For Horizontal Menu
  public margin: any = 0;
  public width: any = window.innerWidth;
  public leftArrowNone: boolean = true;
  public rightArrowNone: boolean = false;
  editModalContentGet: TemplateRef<any>;
  Ecoles: any[];

  constructor(
    private router: Router,
    public navServices: NavService,
    public layout: LayoutService,
    private modalService: NgbModal,
    public appService: AppService,
  ) {
    setTimeout(() => {
      this.menuTitle = JSON.parse(localStorage.getItem("Ecole"))?.Ecole_Nom
    }, 1000);

    this.navServices.items.subscribe(menuItems => {
      this.menuItems = menuItems;
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          menuItems.filter(items => {
            if (items.path === event.url) {
              this.setNavActive(items);
            }
            if (!items.children) { return false; }
            items.children.filter(subItems => {
              if (subItems.path === event.url) {
                this.setNavActive(subItems);
              }
              if (!subItems.children) { return false; }
              subItems.children.filter(subSubItems => {
                if (subSubItems.path === event.url) {
                  this.setNavActive(subSubItems);
                }
              });
            });
          });
        }
      });
    });
    setTimeout(() => {
      this.Ecoles = JSON.parse(localStorage.getItem("UserEcoles"))
    }, 500);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.width = event.target.innerWidth - 500;
  }

  sidebarToggle() {
    this.navServices.collapseSidebar = !this.navServices.collapseSidebar;
  }

  // Active Nave state
  setNavActive(item) {
    this.menuItems.filter(menuItem => {
      if (menuItem !== item) {
        menuItem.active = false;
      }
      if (menuItem.children && menuItem.children.includes(item)) {
        menuItem.active = true;
      }
      if (menuItem.children) {
        menuItem.children.filter(submenuItems => {
          if (submenuItems.children && submenuItems.children.includes(item)) {
            menuItem.active = true;
            submenuItems.active = true;
          }
        });
      }
    });
  }

  // Click Toggle menu
  toggletNavActive(item) {
    if (!item.active) {
      this.menuItems.forEach(a => {
        if (this.menuItems.includes(item)) {
          a.active = false;
        }
        if (!a.children) { return false; }
        a.children.forEach(b => {
          if (a.children.includes(item)) {
            b.active = false;
          }
        });
      });
    }
    item.active = !item.active;
  }

  ChooseEcole(content: TemplateRef<any>) {
    this.editModalContentGet = content;
    this.modalService.open(this.editModalContentGet, { ariaLabelledBy: "dialogEcole", fullscreen: false, size: "xl" });
  }
  onEcoleClick(ecole: any, content: any) {
    this.appService.ecoleEmitter.emit(ecole);
    setTimeout(() => {
      const currentUrl = this.router.url;
      if (currentUrl === '/') {
        this.router.navigateByUrl('/etablissement', { skipLocationChange: true }).then(() => {
          this.router.navigate([currentUrl]);
        });
      } else {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate([currentUrl]);
        });
      }
      this.menuTitle = JSON.parse(localStorage.getItem("Ecole"))?.Ecole_Nom
      this.appService.ecoleEmitter.emit(ecole);
      content.close()
    }, 10);

  }
  // For Horizontal Menu
  scrollToLeft() {
    if (this.margin >= -this.width) {
      this.margin = 0;
      this.leftArrowNone = true;
      this.rightArrowNone = false;
    } else {
      this.margin += this.width;
      this.rightArrowNone = false;
    }
  }

  scrollToRight() {
    if (this.margin <= -3051) {
      this.margin = -3464;
      this.leftArrowNone = false;
      this.rightArrowNone = true;
    } else {
      this.margin += -this.width;
      this.leftArrowNone = false;
    }
  }
}
