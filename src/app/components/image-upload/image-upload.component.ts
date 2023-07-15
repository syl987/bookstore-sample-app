import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
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

  @Input() uploading?: boolean | null;
  /* @Input() progress?: number | null; */

  @Input() defaultAlt?: string | null;

  /* @Input() placeholderSrc?: string | null; */
  /* @Input() placeholderAlt?: string | null; */

  @Output() readonly fileSelect = new EventEmitter<File>();

  /* @Output() readonly remove = new EventEmitter<ImageDTO>(); */
  @Output() readonly removeAll = new EventEmitter<void>();
}
