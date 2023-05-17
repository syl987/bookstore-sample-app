import { Pipe, PipeTransform } from '@angular/core';
import { removeHtmlXmlAnnotations } from 'src/app/functions/string.functions';

/**
 * Remove any XML annotations from a string.
 */
@Pipe({
  name: 'removeHtml',
  standalone: true,
})
export class RemoveHtmlPipe implements PipeTransform {
  transform(value: string | null | undefined): string | null {
    if (value == null) {
      return null;
    }
    return removeHtmlXmlAnnotations(value);
  }
}
