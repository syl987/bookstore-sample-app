import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { ComponentsDevPageComponent } from './components/components-dev-page/components-dev-page.component';
import { ExampleDevDialogComponent } from './components/example-dev-dialog/example-dev-dialog.component';
import { DevRoutingModule } from './dev-routing.module';

@NgModule({
    imports: [SharedModule, DevRoutingModule],
    declarations: [ComponentsDevPageComponent, ExampleDevDialogComponent],
})
export class DevModule {}
