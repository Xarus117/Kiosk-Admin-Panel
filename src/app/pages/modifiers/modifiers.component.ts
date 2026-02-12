import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TableModule, TableLazyLoadEvent } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ModifierService } from '../../core/services/modifier.service';
import { Modifier } from '../../core/models/modifier.model';

@Component({
  selector: 'app-modifiers',
  imports: [
    CommonModule, ReactiveFormsModule, CurrencyPipe,
    TableModule, ButtonModule, DrawerModule, InputTextModule,
    InputNumberModule, SelectModule, ToggleSwitchModule, TagModule, TooltipModule,
  ],
  templateUrl: './modifiers.component.html',
})
export class ModifiersComponent implements OnInit {
  private modifierService = inject(ModifierService);
  private confirmService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private fb = inject(FormBuilder);

  modifiers: Modifier[] = [];
  totalRecords = 0;
  loading = false;
  drawerVisible = false;
  isEdit = false;
  editId?: number;
  currentPage = 0;
  pageSize = 10;

  typeOptions = [
    { label: 'Size', value: 'SIZE' },
    { label: 'Temperature', value: 'TEMPERATURE' },
    { label: 'Add-on', value: 'ADD_ON' },
    { label: 'Sugar Level', value: 'SUGAR_LEVEL' },
    { label: 'Ice Level', value: 'ICE_LEVEL' },
    { label: 'Drink', value: 'DRINK' },
  ];

  form = this.fb.group({
    name: ['', Validators.required],
    type: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    available: [true],
  });

  ngOnInit(): void {
    this.loadModifiers(0);
  }

  loadModifiers(page: number): void {
    this.loading = true;
    this.modifierService.getAll({ page, size: this.pageSize }).subscribe({
      next: p => { this.modifiers = p.content; this.totalRecords = p.totalElements; this.loading = false; },
      error: () => { this.loading = false; this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load modifiers' }); }
    });
  }

  onLazyLoad(event: TableLazyLoadEvent): void {
    const page = Math.floor((event.first ?? 0) / this.pageSize);
    this.currentPage = page;
    this.loadModifiers(page);
  }

  openNew(): void {
    this.isEdit = false;
    this.editId = undefined;
    this.form.reset({ available: true, price: 0 });
    this.drawerVisible = true;
  }

  openEdit(mod: Modifier): void {
    this.isEdit = true;
    this.editId = mod.id;
    this.form.patchValue({ name: mod.name, type: mod.type, price: mod.price, available: mod.available });
    this.drawerVisible = true;
  }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const payload = this.form.value as Partial<Modifier>;
    const op = this.isEdit
      ? this.modifierService.update(this.editId!, payload)
      : this.modifierService.create(payload);

    op.subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: `Modifier ${this.isEdit ? 'updated' : 'created'}` });
        this.drawerVisible = false;
        this.loadModifiers(this.currentPage);
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Operation failed' })
    });
  }

  confirmDelete(mod: Modifier): void {
    this.confirmService.confirm({
      message: `Delete "${mod.name}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-trash',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.deleteModifier(mod.id!)
    });
  }

  private deleteModifier(id: number): void {
    this.modifierService.delete(id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Modifier removed' });
        this.loadModifiers(this.currentPage);
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Delete failed' })
    });
  }

  getTypeLabel(type: string): string {
    return this.typeOptions.find(t => t.value === type)?.label ?? type;
  }
}
