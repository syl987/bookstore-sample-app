import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProviderId } from 'firebase/auth';

import { ButtonSpinnerDirective } from 'src/app/directives/button-spinner.directive';
import { APP_OPTIONS } from 'src/app/models/app.models';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login-page',
  imports: [MatButtonModule, MatIconModule, ButtonSpinnerDirective],
  templateUrl: './login-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'grow flex flex-col justify-center' },
})
export class LoginPageComponent {
  protected readonly authService = inject(AuthService);

  readonly options = inject(APP_OPTIONS);

  readonly loginPending = this.authService.loginPending;

  loginWithGoogle(): void {
    this.authService.loginWithProvider(ProviderId.GOOGLE);
  }
}
