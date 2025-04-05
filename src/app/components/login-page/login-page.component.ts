import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ProviderId } from 'firebase/auth';
import { ButtonSpinnerDirective } from 'src/app/directives/button-spinner.directive';
import { APP_OPTIONS, AppOptions } from 'src/app/models/app.models';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login-page',
  imports: [MatButtonModule, ButtonSpinnerDirective],
  templateUrl: './login-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-grow-1 d-flex flex-column justify-content-center' },
})
export class LoginPageComponent {
  readonly options = inject<AppOptions>(APP_OPTIONS);
  private readonly authService = inject(AuthService);

  readonly loginPending = this.authService.loginPending;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  loginWithGoogle(): void {
    this.authService.loginWithProvider(ProviderId.GOOGLE);
  }
}
