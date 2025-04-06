import { ErrorStateMatcher } from '@angular/material/core';

export class AlwaysShownMatcher implements ErrorStateMatcher {
  isErrorState(): boolean {
    return true;
  }
}
