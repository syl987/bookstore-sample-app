import { CommonModule, getCurrencySymbol } from '@angular/common';
import { ChangeDetectionStrategy, Component, DEFAULT_CURRENCY_CODE, Inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { auditTime, map, timer } from 'rxjs';
import { ButtonSpinnerDirective } from 'src/app/directives/button-spinner.directive';
import { ValidationErrorPipe } from 'src/app/pipes/validation-error.pipe';
import { ToastService } from 'src/app/services/toast.service';

import { TitleBarComponent } from '../__base/title-bar/title-bar.component';
import { DevExampleDialogComponent, ExampleDevDialogData } from '../dev-example-dialog/dev-example-dialog.component';

@Component({
  selector: 'app-dev-components-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    TitleBarComponent,
    ButtonSpinnerDirective,
    ValidationErrorPipe,
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

  readonly disabled = toSignal(this.disabled$, { initialValue: false });

  readonly progress$ = timer(0, 35).pipe(
    map(value => value % 100),
    auditTime(140),
  );

  readonly progress = toSignal(this.progress$, { initialValue: 0 });

  readonly form = new FormGroup({
    email: new FormControl(),
    number: new FormControl(),
    select: new FormControl(),
    area: new FormControl(),
  });

  readonly currencySymbol = getCurrencySymbol(this.currency, 'narrow');

  constructor(
    @Inject(DEFAULT_CURRENCY_CODE) private readonly currency: string,
    private readonly dialog: MatDialog,
    private readonly toastService: ToastService,
  ) {}

  openExampleDialog(): void {
    const data: ExampleDevDialogData = { text: 'Example dialog beautiful content.' };

    this.dialog
      .open(DevExampleDialogComponent, { data, maxWidth: '512px' })
      .beforeClosed()
      .subscribe(result => result === 'action' && this.toastService.showSuccessToast('Dialog action dispatched.'));
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

  submitForm(): void {
    this.toastService.showInfoToast('Form has been submitted.');
  }

  invalidateForm(): void {
    this.form.get('email')?.setErrors({ pattern: true });
    this.form.get('number')?.setErrors({ pattern: true });
    this.form.get('select')?.setErrors({ pattern: true });
    this.form.get('area')?.setErrors({ pattern: true });
    this.form.markAllAsTouched();
    this.toastService.showInfoToast('Form has been invalidated.');
  }
}
