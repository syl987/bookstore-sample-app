import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { auditTime, map, timer } from 'rxjs';
import { ButtonSpinnerDirective } from 'src/app/directives/button-spinner.directive';
import { ToastService } from 'src/app/services/toast.service';

import { TitleBarComponent } from '../__base/title-bar/title-bar.component';
import { DevExampleDialogComponent, ExampleDevDialogData } from '../dev-example-dialog/dev-example-dialog.component';

@Component({
  selector: 'app-dev-components-page',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDividerModule, MatIconModule, MatListModule, MatProgressSpinnerModule, TitleBarComponent, ButtonSpinnerDirective],
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
    const data: ExampleDevDialogData = { text: 'Example dialog beautiful content.' };

    const dialogRef = this.dialog.open(DevExampleDialogComponent, { data, maxWidth: '512px' });

    dialogRef.beforeClosed().subscribe(result => result === 'action' && this.toastService.showSuccessToast('Dialog action dispatched.'));
  }

  showSuccessToast(): void {
    this.toastService.showSuccessToast('Short success message (5 seconds).');
  }

  showErrorToast(): void {
    this.toastService.showErrorToast('Short error message (7 seconds).');
  }

  showInfoToast(): void {
    this.toastService.showInfoToast('Short info message (custom 9 seconds).', { duration: 9000 });
  }
}
