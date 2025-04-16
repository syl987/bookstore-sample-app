import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[appAutofocus]',
})
export class AutofocusDirective implements OnInit {
  constructor(private readonly elementRef: ElementRef<Element & { focus?: unknown }>) {}

  ngOnInit(): void {
    if (typeof this.elementRef.nativeElement.focus === 'function') {
      this.elementRef.nativeElement.focus();
    }
  }
}
