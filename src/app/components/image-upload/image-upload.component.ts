import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, output } from '@angular/core';
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
  @Input() images?: ImageDTO[] | null;

  @Input() readonly?: boolean | null;
  @Input() uploading?: boolean | null;
  /* @Input() progress?: number | null; */

  /* @Input() placeholderSrc?: string | null; */
  /* @Input() placeholderAlt?: string | null; */

  readonly fileSelect = output<void>();

  /* readonly remove = output<ImageDTO>(); */
  readonly removeAll = output<void>();
}
