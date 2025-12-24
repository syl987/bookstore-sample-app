import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';

import { FooterComponent } from './components/base/footer/footer.component';
import { HeaderComponent } from './components/base/header/header.component';
import { SidenavComponent } from './components/base/sidenav/sidenav.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterModule,
    MatSidenavModule,
    HeaderComponent,
    SidenavComponent,
    FooterComponent,
  ],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
