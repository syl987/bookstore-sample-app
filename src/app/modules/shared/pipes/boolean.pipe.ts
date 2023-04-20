import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'boolean',
})
export class BooleanPipe implements PipeTransform {
  transform(value: any, format: 'YesNo'): string | null {
    if (value == null) {
      return null;
    }
    switch (format) {
      case 'YesNo':
        return value ? `Yes` : `No`;
      default:
        throw new Error('Format not recognized.');
    }
  }
}
