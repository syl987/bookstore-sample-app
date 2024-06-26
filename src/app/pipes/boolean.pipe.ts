import { Pipe, PipeTransform } from '@angular/core';

/**
 * Evaluate whether a value is truthy and map it onto a string according to the selected format.
 */
@Pipe({
  name: 'boolean',
  standalone: true,
})
export class BooleanPipe implements PipeTransform {
  transform(value: any, format: 'YesNo'): string | null {
    if (value == null) {
      return null;
    }
    switch (format) {
      case 'YesNo':
        return value ? $localize`Yes` : $localize`No`;
      default:
        throw new Error('Format not recognized.');
    }
  }
}
