import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_CHECKBOX_DEFAULT_OPTIONS, MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipModule } from '@angular/material/tooltip';

import { ButtonSpinnerDirective } from './directives/button-spinner.directive';
import { checkboxOptions } from './options/checkbox.options';
import { dialogOptions } from './options/dialog.options';
import { formFieldOptions } from './options/form-field.options';
import { snackBarOptions } from './options/snack-bar.options';
import { tooltipOptions } from './options/tooltip.options';
import { BookConditionPipe } from './pipes/book-condition.pipe';
import { BooleanPipe } from './pipes/boolean.pipe';
import { RemoveHtmlPipe } from './pipes/remove-html.pipe';
import { ResponseErrorPipe } from './pipes/response-error.pipe';
import { ValidationErrorPipe } from './pipes/validation-error.pipe';

@NgModule({
  imports: [
    CommonModule,

    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
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
  declarations: [ButtonSpinnerDirective, RemoveHtmlPipe, ResponseErrorPipe, ValidationErrorPipe, BookConditionPipe, BooleanPipe],
  exports: [
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
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
    BookConditionPipe,
    BooleanPipe,
  ],
  providers: [
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
