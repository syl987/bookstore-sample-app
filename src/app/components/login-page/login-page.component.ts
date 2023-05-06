import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ProviderId } from 'firebase/auth';
import { APP_CONFIG, AppConfig } from 'src/app/models/app.models';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-grow-1 d-flex flex-column justify-content-center' },
})
export class LoginPageComponent {
  readonly loginPending$ = this.authService.loginPending$;

  constructor(@Inject(APP_CONFIG) readonly config: AppConfig, private readonly authService: AuthService) {}

  loginWithGoogle(): void {
    this.authService.loginWithProvider(ProviderId.GOOGLE);
  }
}
