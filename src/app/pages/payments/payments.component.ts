import { Component, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { SelectModule } from 'primeng/select';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PaymentService } from '../../core/services/payment.service';
import { Transaction, ProcessPaymentRequest } from '../../core/models/payment.model';

@Component({
  selector: 'app-payments',
  imports: [
    CommonModule, FormsModule, CurrencyPipe, DatePipe,
    TableModule, ButtonModule, DrawerModule, InputTextModule,
    InputNumberModule, TagModule, TooltipModule, SelectModule,
  ],
  templateUrl: './payments.component.html',
})
export class PaymentsComponent {
  private paymentService = inject(PaymentService);
  private confirmService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  searchOrderId: number | null = null;
  transactions: Transaction[] = [];
  loading = false;

  processDrawerVisible = false;
  refundDrawerVisible = false;
  refundOrderId: number | null = null;
  refundAmount: number | null = null;

  processForm: ProcessPaymentRequest = { orderId: 0, amount: 0, method: 'CARD' };
  processLoading = false;
  refundLoading = false;

  methodOptions = [
    { label: 'Card', value: 'CARD' },
    { label: 'Cash', value: 'CASH' },
    { label: 'Online', value: 'ONLINE' },
  ];

  search(): void {
    if (!this.searchOrderId) return;
    this.loading = true;
    this.paymentService.getOrderTransactions(this.searchOrderId).subscribe({
      next: txns => { this.transactions = txns; this.loading = false; },
      error: () => { this.loading = false; this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No transactions found for this order' }); }
    });
  }

  openProcess(): void {
    this.processForm = { orderId: 0, amount: 0, method: 'CARD' };
    this.processDrawerVisible = true;
  }

  processPayment(): void {
    if (!this.processForm.orderId || !this.processForm.amount) {
      this.messageService.add({ severity: 'warn', summary: 'Validation', detail: 'Order ID and amount are required' });
      return;
    }
    this.processLoading = true;
    this.paymentService.processPayment(this.processForm).subscribe({
      next: txn => {
        this.processLoading = false;
        this.processDrawerVisible = false;
        this.messageService.add({ severity: 'success', summary: 'Payment Processed', detail: `Transaction ID: ${txn.id}` });
        if (this.searchOrderId === this.processForm.orderId) this.search();
      },
      error: () => { this.processLoading = false; this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Payment processing failed' }); }
    });
  }

  openRefund(orderId: number): void {
    this.refundOrderId = orderId;
    this.refundAmount = null;
    this.refundDrawerVisible = true;
  }

  confirmRefund(): void {
    if (!this.refundOrderId) return;
    this.confirmService.confirm({
      message: `Issue refund for order #${this.refundOrderId}${this.refundAmount ? ' ($' + this.refundAmount + ')' : ' (full amount)'}?`,
      header: 'Confirm Refund',
      icon: 'pi pi-dollar',
      accept: () => this.processRefund()
    });
  }

  private processRefund(): void {
    if (!this.refundOrderId) return;
    this.refundLoading = true;
    this.paymentService.refund(this.refundOrderId, this.refundAmount ?? undefined).subscribe({
      next: () => {
        this.refundLoading = false;
        this.refundDrawerVisible = false;
        this.messageService.add({ severity: 'success', summary: 'Refunded', detail: 'Refund processed successfully' });
        if (this.searchOrderId === this.refundOrderId) this.search();
      },
      error: () => { this.refundLoading = false; this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Refund failed' }); }
    });
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    const map: Record<string, 'success' | 'info' | 'warn' | 'danger' | 'secondary'> = {
      COMPLETED: 'success', PENDING: 'warn', FAILED: 'danger', REFUNDED: 'info',
    };
    return map[status] ?? 'secondary';
  }
}
