import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { timer } from 'rxjs';
import { auditTime, map } from 'rxjs/operators';
import { ToastService } from 'src/app/services/toast.service';

import { ExampleDevDialogComponent } from '../example-dev-dialog/example-dev-dialog.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-components-dev-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './components-dev-page.component.html',
  styleUrls: ['./components-dev-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComponentsDevPageComponent {
  readonly disabled$ = timer(0, 3000).pipe(
    map(value => value % 2),
    map(value => !!value),
  );

  readonly progress$ = timer(1000, 35).pipe(
    map(value => value % 100),
    auditTime(140),
  );

  constructor(private readonly dialog: MatDialog, private readonly toastService: ToastService) {}

  openExampleDialog(): void {
    const dialogRef = this.dialog.open(ExampleDevDialogComponent, {
      data: { text: 'Example dialog beautiful content.' },
      maxWidth: '512px',
    });

    dialogRef.beforeClosed().subscribe(result => result === 'action' && this.toastService.showSuccessToast(`Dialog action dispatched.`));
  }

  showSuccessToast(): void {
    this.toastService.showSuccessToast(`Short success message (5 seconds).`);
  }

  showErrorToast(): void {
    this.toastService.showErrorToast(`Short error message (7 seconds).`);
  }

  showInfoToast(): void {
    this.toastService.showInfoToast(`Short info message (custom 9 seconds).`, { duration: 9000 });
  }
}
