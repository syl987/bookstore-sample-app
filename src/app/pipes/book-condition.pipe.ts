import { Pipe, PipeTransform } from '@angular/core';
import { BookCondition } from 'src/app/models/book.models';

@Pipe({
  name: 'bookCondition',
  standalone: true,
})
export class BookConditionPipe implements PipeTransform {
  transform(value: BookCondition | null | undefined): string | null {
    if (value == null) {
      return null;
    }
    switch (value) {
      case BookCondition.NEW:
        return `New`;
      case BookCondition.VERY_GOOD:
        return `Very good`;
      case BookCondition.VISIBLY_USED:
        return `Visibly used`;
      case BookCondition.DAMAGED:
        return `Damaged`;
      default:
        return value;
    }
  }
}
