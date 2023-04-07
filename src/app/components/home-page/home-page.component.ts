import { ChangeDetectionStrategy, Component } from '@angular/core';

// display some welcome message or banner
// display some data protection policy
// display random or newest volumes
// include published books data
// navigate to volume detail

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {}
