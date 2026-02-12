import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { TableModule, TableLazyLoadEvent } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { DrawerModule } from 'primeng/drawer';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { OrderService } from '../../core/services/order.service';
import { Order, OrderStatus } from '../../core/models/order.model';

@Component({
  selector: 'app-orders',
  imports: [
    CommonModule, FormsModule, CurrencyPipe, DatePipe,
    TableModule, ButtonModule, SelectModule, TagModule, TooltipModule, DrawerModule,
  ],
  templateUrl: './orders.component.html',
})
export class OrdersComponent implements OnInit {
  private orderService = inject(OrderService);
  private confirmService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  orders: Order[] = [];
  totalRecords = 0;
  loading = false;
  currentPage = 0;
  pageSize = 10;

  drawerVisible = false;
  selectedOrder: Order | null = null;
  newStatus = '';

  statusOptions: { label: string; value: string }[] = [
    { label: 'Pending', value: 'PENDING' },
    { label: 'Confirmed', value: 'CONFIRMED' },
    { label: 'Preparing', value: 'PREPARING' },
    { label: 'Ready', value: 'READY' },
    { label: 'Completed', value: 'COMPLETED' },
    { label: 'Cancelled', value: 'CANCELLED' },
  ];

  ngOnInit(): void {
    this.loadOrders(0);
  }

  loadOrders(page: number): void {
    this.loading = true;
    this.orderService.getAll({ page, size: this.pageSize, sortBy: 'createdAt', sortDir: 'desc' }).subscribe({
      next: p => { this.orders = p.content; this.totalRecords = p.totalElements; this.loading = false; },
      error: () => { this.loading = false; this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load orders' }); }
    });
  }

  onLazyLoad(event: TableLazyLoadEvent): void {
    const page = Math.floor((event.first ?? 0) / this.pageSize);
    this.currentPage = page;
    this.loadOrders(page);
  }

  openStatusPanel(order: Order): void {
    this.selectedOrder = order;
    this.newStatus = order.status;
    this.drawerVisible = true;
  }

  updateStatus(): void {
    if (!this.selectedOrder?.id || !this.newStatus) return;
    this.orderService.updateStatus(this.selectedOrder.id, this.newStatus).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Updated', detail: 'Order status updated' });
        this.drawerVisible = false;
        this.loadOrders(this.currentPage);
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Update failed' })
    });
  }

  confirmDelete(order: Order): void {
    this.confirmService.confirm({
      message: `Delete order "${order.orderNumber ?? '#' + order.id}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-trash',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.deleteOrder(order.id!)
    });
  }

  private deleteOrder(id: number): void {
    this.orderService.delete(id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Order removed' });
        this.loadOrders(this.currentPage);
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Delete failed' })
    });
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    const map: Record<string, 'success' | 'info' | 'warn' | 'danger' | 'secondary'> = {
      PENDING: 'warn', CONFIRMED: 'info', PREPARING: 'info',
      READY: 'success', COMPLETED: 'success', CANCELLED: 'danger',
    };
    return map[status] ?? 'secondary';
  }
}
