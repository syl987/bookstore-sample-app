import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ProviderId } from 'firebase/auth';
import { ButtonSpinnerDirective } from 'src/app/directives/button-spinner.directive';
import { APP_OPTIONS, AppOptions } from 'src/app/models/app.models';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, MatButtonModule, ButtonSpinnerDirective],
  templateUrl: './login-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-grow-1 d-flex flex-column justify-content-center' },
})
export class LoginPageComponent {
  readonly loginPending$ = this.authService.loginPending$;

  constructor(@Inject(APP_OPTIONS) readonly options: AppOptions, private readonly authService: AuthService) {}

  loginWithGoogle(): void {
    this.authService.loginWithProvider(ProviderId.GOOGLE);
  }
}
