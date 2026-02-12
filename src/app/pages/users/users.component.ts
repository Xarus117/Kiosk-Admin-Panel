import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-users',
  imports: [
    CommonModule, ReactiveFormsModule, DatePipe,
    TableModule, ButtonModule, DrawerModule, InputTextModule, TooltipModule,
  ],
  templateUrl: './users.component.html',
})
export class UsersComponent implements OnInit {
  private userService = inject(UserService);
  private confirmService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private fb = inject(FormBuilder);

  users: User[] = [];
  loading = false;
  drawerVisible = false;

  form = this.fb.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: [''],
  });

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getAll().subscribe({
      next: users => { this.users = users; this.loading = false; },
      error: () => { this.loading = false; this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load users' }); }
    });
  }

  openNew(): void {
    this.form.reset();
    this.drawerVisible = true;
  }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const val = this.form.value;
    this.userService.create({ username: val.username!, email: val.email!, password: val.password || undefined }).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User created' });
        this.drawerVisible = false;
        this.loadUsers();
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create user' })
    });
  }

  confirmDelete(user: User): void {
    this.confirmService.confirm({
      message: `Delete user "${user.username}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-trash',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.deleteUser(user.id!)
    });
  }

  private deleteUser(id: number): void {
    this.userService.delete(id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'User removed' });
        this.loadUsers();
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Delete failed' })
    });
  }
}
