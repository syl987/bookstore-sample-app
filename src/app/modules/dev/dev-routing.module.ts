import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ComponentsDevPageComponent } from './components/components-dev-page/components-dev-page.component';

const routes: Routes = [{ path: '', component: ComponentsDevPageComponent, title: `Component Collection` }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DevRoutingModule {}
