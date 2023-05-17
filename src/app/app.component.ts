import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, isDevMode } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';

import { FooterComponent } from './components/__base/footer/footer.component';
import { HeaderComponent } from './components/__base/header/header.component';
import { SidenavComponent } from './components/__base/sidenav/sidenav.component';
import { APP_NAV_LINKS } from './models/app.models';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, MatSidenavModule, HeaderComponent, SidenavComponent, FooterComponent],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly LINKS = APP_NAV_LINKS.filter(link => !link.dev || isDevMode());
  readonly PUBLIC_LINKS = this.LINKS.filter(link => !link.user);
  readonly USER_LINKS = this.LINKS.filter(link => link.user);
}
