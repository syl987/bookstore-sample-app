import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl } from '@angular/forms';

/**
 * Map a form control onto any validation error message. If the control contains multiple errors, only one message will be chosen based on internal priority.
 *
 * Note that this pipe is impure as it needs to observe the internal state of a control.
 */
@Pipe({
  name: 'validationError',
  standalone: true,
  pure: false,
})
export class ValidationErrorPipe implements PipeTransform {
  transform(control: AbstractControl | null | undefined): string | null {
    if (control == null) {
      return null;
    }

    // default validators
    if (control.hasError('required')) {
      return `Required`;
    }
    if (control.hasError('minlength')) {
      return `Minimal length ${control.getError('minlength').requiredLength}`;
    }
    if (control.hasError('maxlength')) {
      return `Maximal length exceeded by ${control.getError('maxlength').actualLength - control.getError('maxlength').requiredLength}`;
    }
    if (control.hasError('min')) {
      return `Min value ${control.getError('min').min}`;
    }
    if (control.hasError('max')) {
      return `Max value ${control.getError('max').max}`;
    }
    if (control.hasError('email')) {
      return `Invalid e-mail`;
    }
    if (control.hasError('pattern')) {
      switch (control.getError('pattern').requiredPattern) {
        default:
          return `Invalid text`;
      }
    }

    // material validators
    if (control.hasError('matDatepickerParse')) {
      return `Invalid date`;
    }
    if (control.hasError('matStartDateInvalid')) {
      return `Invalid start date`;
    }
    if (control.hasError('matEndDateInvalid')) {
      return `Invalid end date`;
    }
    return null;
  }
}