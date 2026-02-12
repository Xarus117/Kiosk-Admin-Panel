import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { Toast } from 'primeng/toast';
import { ConfirmDialog } from 'primeng/confirmdialog';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Toast, ConfirmDialog],
  templateUrl: './shell.component.html',
})
export class ShellComponent {
  navItems = [
    { label: 'Dashboard', icon: 'pi pi-home', route: '/dashboard' },
    { label: 'Items', icon: 'pi pi-box', route: '/items' },
    { label: 'Categories', icon: 'pi pi-tags', route: '/categories' },
    { label: 'Modifiers', icon: 'pi pi-sliders-h', route: '/modifiers' },
    { label: 'Orders', icon: 'pi pi-shopping-cart', route: '/orders' },
    { label: 'Users', icon: 'pi pi-users', route: '/users' },
    { label: 'Menus', icon: 'pi pi-book', route: '/menus' },
    { label: 'Payments', icon: 'pi pi-credit-card', route: '/payments' },
  ];
}
