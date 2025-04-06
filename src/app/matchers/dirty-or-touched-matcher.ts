import { AbstractControl, FormGroupDirective } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

export class DirtyOrTouchedMatcher implements ErrorStateMatcher {
  isErrorState(control: AbstractControl | null, form: FormGroupDirective | null): boolean {
    return !!(control?.invalid && (control.dirty || control.touched || form?.submitted));
  }
}
