import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { DESCRIPTION_REGEXP, DISPLAY_NAME_REGEXP } from 'src/app/models/regexp.models';

@Pipe({
    name: 'validationError',
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
                case DISPLAY_NAME_REGEXP:
                case DESCRIPTION_REGEXP:
                    return `Contains invalid characters`;
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
