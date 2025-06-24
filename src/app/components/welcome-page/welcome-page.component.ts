import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, VERSION } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { AppTechnicalFeature, AppTechStackItem } from 'src/app/models/app.models';

import { TitleBarComponent } from '../__base/title-bar/title-bar.component';

const techStack: AppTechStackItem[] = [
  {
    title: `Angular ${VERSION.major}`,
    subtitle: `Main Framework`,
    description: $localize`Leveraging signals, control flows, structured standalone architecture, etc.`,
    image: 'assets/img/logo/angular_gradient.png',
  },
  {
    title: `NGRX`,
    subtitle: `State Management, Logic`,
    description: $localize`Application State and View fully decoupled! View all events in the browser console in real-time.`,
    image: 'https://ngrx.io/assets/images/badge.svg',
  },
  {
    title: `RXJS`,
    subtitle: `Reactive Extensions`,
    description: $localize`Complex reactive processing of API requests and application data for display purposes.`,
    image: 'https://rxjs.dev/generated/images/marketing/home/Rx_Logo-512-512.png',
  },
  {
    title: `Firebase`,
    subtitle: `Backend Services`,
    description: $localize`Using authentication, NoSQL realtime database, file storage and web hosting services.`,
    image: 'assets/img/logo/firebase_full_color.png',
  },
  {
    title: `Material 3`,
    subtitle: `Angular Components`,
    description: $localize`Native Angular components with customized theming, typography and general appearance.`,
    image: 'https://v16.material.angular.io/assets/img/angular-material-logo.svg',
  },
  {
    title: `TypeScript`,
    subtitle: `JavaScript Extended`,
    description: $localize`Strictly configured for null-safety, safe variable initialization and reliable use of types.`,
    image: 'https://iconape.com/wp-content/png_logo_vector/typescript.png',
  },
  {
    title: `TailwindCSS 4`,
    subtitle: `CSS utilities`,
    description: $localize`Consistent global utility syntax. Featuring layout, responsive grid, spacing, typography and more.`,
    image: 'https://tailwindcss.com/_next/static/media/tailwindcss-mark.d52e9897.svg',
    imageClass: 'py-2',
  },
  {
    title: `SCSS`,
    subtitle: `CSS Extended`,
    description: $localize`Fully modular composition, global and component-scoped, variables, mixins, utilities.`,
    image: 'https://sass-lang.com/assets/img/logos/logo.svg',
  },
  {
    title: `Eslint 9`,
    subtitle: `Code Linting`,
    description: $localize`Extensive custom flat configuration and numerous plugins for code automation.`,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/ESLint_logo.svg/192px-ESLint_logo.svg.png',
  },
  {
    title: `Prettier`,
    subtitle: `Code Formatting`,
    description: $localize`Fully automated opinionated code quality tooling for consistency and opinionated appearance.`,
    image: 'https://prettier.io/icon.png',
  },
  {
    title: `Git`,
    subtitle: `Version Management`,
    description: $localize`Structured and persistent development progression using branching, stashing, rebasing.`,
    image: 'https://cdn.freebiesupply.com/logos/large/2x/git-icon-logo-png-transparent.png',
  },
  {
    title: `Github`,
    subtitle: `Code Management`,
    description: $localize`Transparent development experience using pull requests and branch safety options.`,
    image: 'assets/img/logo/github_mark.png',
  },
];

const features: AppTechnicalFeature[] = [
  {
    title: `Authentication`,
    description: $localize`Browse anonymously, login to interact with existing books or create your own.`,
  },
  {
    title: `Internationalization`,
    description: $localize`Fully translated application content with respective locale formatting.`,
  },
  {
    title: `Accessibility`,
    description: $localize`HTML marked up with relevant semantics and accessibility definitions.`,
  },
  {
    title: `Lazy Loading`,
    description: $localize`Reduce startup times by postponing the loading of less directly frequented routes.`,
  },
  {
    title: `Responsive Design`,
    description: $localize`The semi-dynamic application layout fully supports all common device sizes.`,
  },
  {
    title: `Material Theming`,
    description: $localize`Altered appearance of material components based on tokens and overrides.`,
  },
  {
    title: `Intuitive UX`,
    description: $localize`Interactive elements with semantical coloring and icons, descriptive layout and navigation.`,
  },
  {
    title: `Dark Theme`,
    description: $localize`Switch between light and dark theme at any time. Defaults to browser settings.`,
  },
  {
    title: `Interactive Forms`,
    description: $localize`A variety of form fields with consistent offline and on-response validation.`,
  },
  {
    title: `File Upload`,
    description: $localize`Select, crop and upload image files for display alongside with regular data.`,
  },
  {
    title: `NoSQL Database`,
    description: $localize`Any changes by the user are persistently saved using Firebase realtime database.`,
  },
  {
    title: `External API`,
    description: $localize`Find your favorite books with Google Books API and provide custom data.`,
  },
];

@Component({
  selector: 'app-welcome-page',
  imports: [NgClass, MatCardModule, TitleBarComponent],
  templateUrl: './welcome-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomePageComponent {
  readonly techStack = techStack;
  readonly features = features;
}
