import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { timer } from 'rxjs';
import { auditTime, map } from 'rxjs/operators';
import { ToastService } from 'src/app/services/toast.service';

import { DevExampleDialogComponent } from '../dev-example-dialog/dev-example-dialog.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ButtonSpinnerDirective } from 'src/app/directives/button-spinner.directive';

@Component({
  selector: 'app-dev-components-page',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    // MatDialogModule,
    MatDividerModule,
    MatIconModule,
    MatListModule,
    MatProgressSpinnerModule,
    // MatSnackBarModule,
    ButtonSpinnerDirective,
  ],
  templateUrl: './dev-components-page.component.html',
  styleUrls: ['./dev-components-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevComponentsPageComponent {
  readonly disabled$ = timer(0, 3000).pipe(
    map(value => value % 2),
    map(value => !!value),
  );

  readonly progress$ = timer(1000, 35).pipe(
    map(value => value % 100),
    auditTime(140),
  );

  constructor(private readonly dialog: MatDialog, private readonly toastService: ToastService) {}

  openExampleDialog(): void {
    const dialogRef = this.dialog.open(DevExampleDialogComponent, {
      data: { text: 'Example dialog beautiful content.' },
      maxWidth: '512px',
    });

    dialogRef.beforeClosed().subscribe(result => result === 'action' && this.toastService.showSuccessToast(`Dialog action dispatched.`));
  }

  showSuccessToast(): void {
    this.toastService.showSuccessToast(`Short success message (5 seconds).`);
  }

  showErrorToast(): void {
    this.toastService.showErrorToast(`Short error message (7 seconds).`);
  }

  showInfoToast(): void {
    this.toastService.showInfoToast(`Short info message (custom 9 seconds).`, { duration: 9000 });
  }
}
