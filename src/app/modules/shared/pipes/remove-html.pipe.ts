import { Pipe, PipeTransform } from '@angular/core';
import { removeHtmlXmlAnnotations } from 'src/app/functions/string.functions';

@Pipe({
    name: 'removeHtml',
})
export class RemoveHtmlPipe implements PipeTransform {
    transform(value: string | null | undefined): string | null {
        if (value == null) {
            return null;
        }
        return removeHtmlXmlAnnotations(value);
    }
}
