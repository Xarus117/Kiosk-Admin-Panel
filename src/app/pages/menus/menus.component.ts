import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule, TableLazyLoadEvent } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageService } from 'primeng/api';
import { MenuService } from '../../core/services/menu.service';
import { MenuItem, MenuConfig, CalculatePriceRequest, CalculatePriceResponse } from '../../core/models/menu.model';

@Component({
  selector: 'app-menus',
  imports: [
    CommonModule, FormsModule, CurrencyPipe,
    TableModule, ButtonModule, DrawerModule, TagModule, TooltipModule, InputNumberModule,
  ],
  templateUrl: './menus.component.html',
})
export class MenusComponent implements OnInit {
  private menuService = inject(MenuService);
  private messageService = inject(MessageService);

  menuItems: MenuItem[] = [];
  totalRecords = 0;
  loading = false;
  pageSize = 10;
  currentPage = 0;

  configDrawerVisible = false;
  selectedItemConfig: MenuConfig | null = null;
  configLoading = false;

  priceDrawerVisible = false;
  selectedItemId: number | null = null;
  selectedItemName = '';
  modifierIdsInput = '';
  priceResult: CalculatePriceResponse | null = null;
  priceLoading = false;

  ngOnInit(): void {
    this.loadMenuItems(0);
  }

  loadMenuItems(page: number): void {
    this.loading = true;
    this.menuService.getMenuItems({ page, size: this.pageSize }).subscribe({
      next: p => { this.menuItems = p.content; this.totalRecords = p.totalElements; this.loading = false; },
      error: () => { this.loading = false; this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load menu items' }); }
    });
  }

  onLazyLoad(event: TableLazyLoadEvent): void {
    const page = Math.floor((event.first ?? 0) / this.pageSize);
    this.currentPage = page;
    this.loadMenuItems(page);
  }

  viewConfig(item: MenuItem): void {
    this.selectedItemConfig = null;
    this.configLoading = true;
    this.configDrawerVisible = true;
    this.menuService.getItemConfig(item.itemId).subscribe({
      next: config => { this.selectedItemConfig = config; this.configLoading = false; },
      error: () => { this.configLoading = false; this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load config' }); }
    });
  }

  openPriceCalc(item: MenuItem): void {
    this.selectedItemId = item.itemId;
    this.selectedItemName = item.itemName;
    this.modifierIdsInput = '';
    this.priceResult = null;
    this.priceDrawerVisible = true;
  }

  calculatePrice(): void {
    if (!this.selectedItemId) return;
    this.priceLoading = true;
    const modifierIds = this.modifierIdsInput
      .split(',')
      .map(s => parseInt(s.trim(), 10))
      .filter(n => !isNaN(n));

    const payload: CalculatePriceRequest = { itemId: this.selectedItemId, modifierIds };
    this.menuService.calculatePrice(payload).subscribe({
      next: result => { this.priceResult = result; this.priceLoading = false; },
      error: () => { this.priceLoading = false; this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Price calculation failed' }); }
    });
  }

  configSections(config: MenuConfig): { label: string; items: { id: number; name: string; price: number }[] }[] {
    return [
      { label: 'Sizes', items: config.sizes ?? [] },
      { label: 'Temperatures', items: config.temperatures ?? [] },
      { label: 'Add-ons', items: config.addOns ?? [] },
      { label: 'Sugar Levels', items: config.sugarLevels ?? [] },
      { label: 'Ice Levels', items: config.iceLevels ?? [] },
      { label: 'Drinks', items: config.drinks ?? [] },
    ].filter(s => s.items.length > 0);
  }
}
