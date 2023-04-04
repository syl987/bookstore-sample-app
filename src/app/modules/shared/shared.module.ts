import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import {
  MAT_LEGACY_CHECKBOX_DEFAULT_OPTIONS as MAT_CHECKBOX_DEFAULT_OPTIONS,
  MatLegacyCheckboxModule as MatCheckboxModule,
} from '@angular/material/legacy-checkbox';
import {
  MAT_LEGACY_DIALOG_DEFAULT_OPTIONS as MAT_DIALOG_DEFAULT_OPTIONS,
  MatLegacyDialogModule as MatDialogModule,
} from '@angular/material/legacy-dialog';
import {
  MAT_LEGACY_FORM_FIELD_DEFAULT_OPTIONS as MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatLegacyFormFieldModule as MatFormFieldModule,
} from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import {
  MAT_LEGACY_SNACK_BAR_DEFAULT_OPTIONS as MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatLegacySnackBarModule as MatSnackBarModule,
} from '@angular/material/legacy-snack-bar';
import {
  MAT_LEGACY_TOOLTIP_DEFAULT_OPTIONS as MAT_TOOLTIP_DEFAULT_OPTIONS,
  MatLegacyTooltipModule as MatTooltipModule,
} from '@angular/material/legacy-tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatStepperModule } from '@angular/material/stepper';
import { MatToolbarModule } from '@angular/material/toolbar';

import { ButtonSpinnerDirective } from './directives/button-spinner.directive';
import { DirtyOrTouchedMatcher } from './matchers/dirty-or-touched-matcher';
import { checkboxOptions } from './options/checkbox.options';
import { dialogOptions } from './options/dialog.options';
import { formFieldOptions } from './options/form-field.options';
import { snackBarOptions } from './options/snack-bar.options';
import { tooltipOptions } from './options/tooltip.options';
import { RemoveHtmlPipe } from './pipes/remove-html.pipe';
import { ResponseErrorPipe } from './pipes/response-error.pipe';
import { ValidationErrorPipe } from './pipes/validation-error.pipe';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatStepperModule,
    MatToolbarModule,
    MatTooltipModule,
  ],
  declarations: [ButtonSpinnerDirective, RemoveHtmlPipe, ResponseErrorPipe, ValidationErrorPipe],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatStepperModule,
    MatToolbarModule,
    MatTooltipModule,

    ButtonSpinnerDirective,
    RemoveHtmlPipe,
    ResponseErrorPipe,
    ValidationErrorPipe,
  ],
  providers: [
    { provide: ErrorStateMatcher, useClass: DirtyOrTouchedMatcher },
    { provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: checkboxOptions },
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: dialogOptions },
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: formFieldOptions },
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: snackBarOptions },
    { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: tooltipOptions },
  ],
})
export class SharedModule {
  constructor(iconRegistry: MatIconRegistry) {
    iconRegistry.registerFontClassAlias('fa', 'fa'); // font-awesome
    iconRegistry.setDefaultFontSetClass('fa');
  }
}
