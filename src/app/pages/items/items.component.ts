import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TableModule, TableLazyLoadEvent } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ItemService } from '../../core/services/item.service';
import { CategoryService } from '../../core/services/category.service';
import { Item } from '../../core/models/item.model';
import { Category } from '../../core/models/category.model';

@Component({
  selector: 'app-items',
  imports: [
    CommonModule, ReactiveFormsModule, CurrencyPipe,
    TableModule, ButtonModule, DrawerModule, InputTextModule,
    InputNumberModule, TextareaModule, SelectModule, ToggleSwitchModule,
    TagModule, TooltipModule,
  ],
  templateUrl: './items.component.html',
})
export class ItemsComponent implements OnInit {
  private itemService = inject(ItemService);
  private categoryService = inject(CategoryService);
  private confirmService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private fb = inject(FormBuilder);

  items: Item[] = [];
  categories: { label: string; value: number }[] = [];
  totalRecords = 0;
  loading = false;
  drawerVisible = false;
  isEdit = false;
  editId?: number;
  currentPage = 0;
  pageSize = 10;

  form = this.fb.group({
    name: ['', Validators.required],
    sku: ['', Validators.required],
    description: [''],
    price: [0, [Validators.required, Validators.min(0)]],
    categoryId: [null as number | null, Validators.required],
    available: [true],
    imageUrl: [''],
  });

  ngOnInit(): void {
    this.loadCategories();
    this.loadItems(0);
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: cats => this.categories = cats.map(c => ({ label: c.name, value: c.id! })),
      error: () => {}
    });
  }

  loadItems(page: number): void {
    this.loading = true;
    this.itemService.getAll({ page, size: this.pageSize }).subscribe({
      next: p => { this.items = p.content; this.totalRecords = p.totalElements; this.loading = false; },
      error: () => { this.loading = false; this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load items' }); }
    });
  }

  onLazyLoad(event: TableLazyLoadEvent): void {
    const page = Math.floor((event.first ?? 0) / this.pageSize);
    this.currentPage = page;
    this.loadItems(page);
  }

  openNew(): void {
    this.isEdit = false;
    this.editId = undefined;
    this.form.reset({ available: true, price: 0 });
    this.drawerVisible = true;
  }

  openEdit(item: Item): void {
    this.isEdit = true;
    this.editId = item.id;
    this.form.patchValue({
      name: item.name,
      sku: item.sku,
      description: item.description ?? '',
      price: item.price,
      categoryId: item.categoryId,
      available: item.available,
      imageUrl: item.imageUrl ?? '',
    });
    this.drawerVisible = true;
  }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const payload = this.form.value as Partial<Item>;
    const op = this.isEdit
      ? this.itemService.update(this.editId!, payload)
      : this.itemService.create(payload);

    op.subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: `Item ${this.isEdit ? 'updated' : 'created'}` });
        this.drawerVisible = false;
        this.loadItems(this.currentPage);
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Operation failed' })
    });
  }

  confirmDelete(item: Item): void {
    this.confirmService.confirm({
      message: `Delete "${item.name}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-trash',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.deleteItem(item.id!)
    });
  }

  private deleteItem(id: number): void {
    this.itemService.delete(id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Item removed' });
        this.loadItems(this.currentPage);
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Delete failed' })
    });
  }

  getCategoryName(categoryId: number): string {
    return this.categories.find(c => c.value === categoryId)?.label ?? '—';
  }
}
