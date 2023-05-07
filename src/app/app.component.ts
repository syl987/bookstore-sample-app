import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';

import { FooterComponent } from './components/__base/footer/footer.component';
import { HeaderComponent } from './components/__base/header/header.component';
import { SidenavComponent } from './components/__base/sidenav/sidenav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, MatSidenavModule, HeaderComponent, SidenavComponent, FooterComponent],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
