import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ButtonSpinnerDirective } from 'src/app/directives/button-spinner.directive';
import { ImageDTO } from 'src/app/models/image.models';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [CommonModule, MatButtonModule, ButtonSpinnerDirective],
  templateUrl: './image-upload.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageUploadComponent {
  readonly images = input<ImageDTO[], ImageDTO[] | null | undefined>([], { transform: value => value ?? [] });

  readonly readonly = input<boolean, BooleanInput>(false, { transform: coerceBooleanProperty });
  readonly uploading = input<boolean, BooleanInput>(false, { transform: coerceBooleanProperty });

  /* readonly progress = input<boolean, BooleanInput>(false, { transform: coerceBooleanProperty }); */

  @Output() readonly fileSelect = new EventEmitter<File>();

  /* @Output() readonly remove = new EventEmitter<ImageDTO>(); */
  @Output() readonly removeAll = new EventEmitter<void>();
}
