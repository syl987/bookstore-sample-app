import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { ButtonSpinnerDirective } from 'src/app/directives/button-spinner.directive';
import { ImageDTO } from 'src/app/models/image.models';

@Component({
  selector: 'app-image-upload',
  imports: [MatButtonModule, MatIconModule, ButtonSpinnerDirective],
  templateUrl: './image-upload.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageUploadComponent {
  readonly images = input<ImageDTO[], ImageDTO[] | null | undefined>([], { transform: value => value ?? [] });

  readonly readonly = input<boolean, BooleanInput>(false, { transform: coerceBooleanProperty });
  readonly uploading = input<boolean, BooleanInput>(false, { transform: coerceBooleanProperty });

  /* readonly progress = input<boolean, NumberInput>(false, { transform: coerceNumberProperty }); */

  readonly fileSelect = output();

  /* readonly remove = output<ImageDTO>(); */
  readonly removeAll = output();
}
