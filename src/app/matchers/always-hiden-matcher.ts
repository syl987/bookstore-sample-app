import { ErrorStateMatcher } from '@angular/material/core';

export class AlwaysHiddenMatcher implements ErrorStateMatcher {
  isErrorState(): boolean {
    return false;
  }
}
