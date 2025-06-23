import { Directive, ElementRef, OnInit, inject } from '@angular/core';

@Directive({
  selector: '[appAutofocus]',
})
export class AutofocusDirective implements OnInit {
  private readonly elementRef = inject(ElementRef);

  ngOnInit(): void {
    if (typeof this.elementRef.nativeElement.focus === 'function') {
      this.elementRef.nativeElement.focus();
    }
  }
}
