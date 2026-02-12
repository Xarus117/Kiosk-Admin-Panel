import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CategoryService } from '../../core/services/category.service';
import { Category } from '../../core/models/category.model';

@Component({
  selector: 'app-categories',
  imports: [
    CommonModule, ReactiveFormsModule,
    TableModule, ButtonModule, DrawerModule, InputTextModule,
    TextareaModule, SelectModule, ToggleSwitchModule, TagModule, TooltipModule,
  ],
  templateUrl: './categories.component.html',
})
export class CategoriesComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private confirmService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private fb = inject(FormBuilder);

  categories: Category[] = [];
  parentOptions: { label: string; value: number }[] = [];
  loading = false;
  drawerVisible = false;
  isEdit = false;
  editId?: number;

  form = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    active: [true],
    parentId: [null as number | null],
    displayOrder: [0],
  });

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.categoryService.getAll().subscribe({
      next: cats => {
        this.categories = cats;
        this.parentOptions = cats.map(c => ({ label: c.name, value: c.id! }));
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load categories' });
      }
    });
  }

  openNew(): void {
    this.isEdit = false;
    this.editId = undefined;
    this.form.reset({ active: true, displayOrder: 0 });
    this.drawerVisible = true;
  }

  openEdit(cat: Category): void {
    this.isEdit = true;
    this.editId = cat.id;
    this.form.patchValue({
      name: cat.name,
      description: cat.description ?? '',
      active: cat.active,
      parentId: cat.parentId ?? null,
      displayOrder: cat.displayOrder ?? 0,
    });
    this.drawerVisible = true;
  }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const payload = this.form.value as Partial<Category>;
    const op = this.isEdit
      ? this.categoryService.update(this.editId!, payload)
      : this.categoryService.create(payload);

    op.subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: `Category ${this.isEdit ? 'updated' : 'created'}` });
        this.drawerVisible = false;
        this.loadCategories();
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Operation failed' })
    });
  }

  confirmDelete(cat: Category): void {
    this.confirmService.confirm({
      message: `Delete "${cat.name}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-trash',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.deleteCategory(cat.id!)
    });
  }

  private deleteCategory(id: number): void {
    this.categoryService.delete(id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Category removed' });
        this.loadCategories();
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Delete failed' })
    });
  }

  getParentName(parentId?: number): string {
    if (!parentId) return '—';
    return this.parentOptions.find(p => p.value === parentId)?.label ?? '—';
  }
}
