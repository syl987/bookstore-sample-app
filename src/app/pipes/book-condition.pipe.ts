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
        return $localize`New`;
      case BookCondition.VERY_GOOD:
        return $localize`Very good`;
      case BookCondition.VISIBLY_USED:
        return $localize`Visibly used`;
      case BookCondition.DAMAGED:
        return $localize`Damaged`;
      default:
        return value;
    }
  }
}
