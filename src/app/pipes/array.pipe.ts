import { Pipe, PipeTransform } from '@angular/core';

/**
 * Evaluate whether a value is truthy and map it onto a string according to the selected format.
 */
@Pipe({
  name: 'array',
  standalone: true,
})
export class ArrayPipe implements PipeTransform {
  transform(value: any[] | null | undefined, separator = ', '): string | null {
    if (value == null) {
      return null;
    }
    return value.join(separator);
  }
}
