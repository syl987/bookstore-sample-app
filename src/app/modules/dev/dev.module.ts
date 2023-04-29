import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ButtonSpinnerDirective } from 'src/app/directives/button-spinner.directive';

import { ComponentsDevPageComponent } from './components/components-dev-page/components-dev-page.component';
import { ExampleDevDialogComponent } from './components/example-dev-dialog/example-dev-dialog.component';
import { DevRoutingModule } from './dev-routing.module';

@NgModule({
  imports: [
    CommonModule,

    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
    MatIconModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,

    ButtonSpinnerDirective,
    DevRoutingModule,
  ],
  declarations: [ComponentsDevPageComponent, ExampleDevDialogComponent],
})
export class DevModule {}
