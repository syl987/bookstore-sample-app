import { Pipe, PipeTransform } from '@angular/core';
import { toResponseErrorMessage } from 'src/app/helpers/error.helpers';
import { ResponseError } from 'src/app/models/error.models';

@Pipe({
  name: 'responseError',
})
export class ResponseErrorPipe implements PipeTransform {
  transform(value: ResponseError | null | undefined): string | null {
    if (value == null) {
      return null;
    }
    return toResponseErrorMessage(value);
  }
}
