import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';
import { ItemService } from '../../core/services/item.service';
import { CategoryService } from '../../core/services/category.service';
import { ModifierService } from '../../core/services/modifier.service';
import { OrderService } from '../../core/services/order.service';
import { Order } from '../../core/models/order.model';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink, TableModule, TagModule, CardModule, SkeletonModule, CurrencyPipe, DatePipe],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  private itemService = inject(ItemService);
  private categoryService = inject(CategoryService);
  private modifierService = inject(ModifierService);
  private orderService = inject(OrderService);

  loading = true;
  stats = { items: 0, categories: 0, modifiers: 0, orders: 0 };
  recentOrders: Order[] = [];

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading = true;
    let completed = 0;
    const done = () => { if (++completed === 4) this.loading = false; };

    this.itemService.getAll({ size: 1 }).subscribe({ next: p => { this.stats.items = p.totalElements; done(); }, error: done });
    this.categoryService.getAll().subscribe({ next: c => { this.stats.categories = c.length; done(); }, error: done });
    this.modifierService.getAll({ size: 1 }).subscribe({ next: p => { this.stats.modifiers = p.totalElements; done(); }, error: done });
    this.orderService.getAll({ size: 5, sortBy: 'createdAt', sortDir: 'desc' }).subscribe({
      next: p => { this.stats.orders = p.totalElements; this.recentOrders = p.content; done(); },
      error: done
    });
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    const map: Record<string, 'success' | 'info' | 'warn' | 'danger' | 'secondary'> = {
      PENDING: 'warn',
      CONFIRMED: 'info',
      PREPARING: 'info',
      READY: 'success',
      COMPLETED: 'success',
      CANCELLED: 'danger',
    };
    return map[status] ?? 'secondary';
  }
}
