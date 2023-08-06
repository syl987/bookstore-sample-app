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
      return $localize`Required`;
    }
    if (control.hasError('minlength')) {
      return $localize`Minimal length ${control.getError('minlength').requiredLength}`;
    }
    if (control.hasError('maxlength')) {
      return $localize`Maximal length exceeded by ${control.getError('maxlength').actualLength - control.getError('maxlength').requiredLength}`;
    }
    if (control.hasError('min')) {
      return $localize`Minimal value ${control.getError('min').min}`;
    }
    if (control.hasError('max')) {
      return $localize`Maximal value ${control.getError('max').max}`;
    }
    if (control.hasError('email')) {
      return $localize`Invalid e-mail`;
    }
    if (control.hasError('pattern')) {
      switch (control.getError('pattern').requiredPattern) {
        default:
          return $localize`Invalid text`;
      }
    }

    // material validators
    if (control.hasError('matDatepickerParse')) {
      return $localize`Invalid date`;
    }
    if (control.hasError('matStartDateInvalid')) {
      return $localize`Invalid start date`;
    }
    if (control.hasError('matEndDateInvalid')) {
      return $localize`Invalid end date`;
    }
    return null;
  }
}
