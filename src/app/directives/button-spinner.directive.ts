import { BooleanInput, coerceBooleanProperty, coerceNumberProperty, NumberInput } from '@angular/cdk/coercion';
import { Directive, ElementRef, Input, input, OnInit, Renderer2, ViewContainerRef, inject } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

/**
 * Create a component-like structure that allows to display a spinner on a button based on a boolean input.
 *
 * Supports disabled state.
 */
@Directive({
  selector: '[mat-button][spinning],[mat-raised-button][spinning],[mat-stroked-button][spinning],[mat-flat-button][spinning]',
  standalone: true,
  host: { class: 'app-button-spinner' },
})
export class ButtonSpinnerDirective implements OnInit {
  protected readonly _elementRef = inject(ElementRef);
  protected readonly _viewContainerRef = inject(ViewContainerRef);
  protected readonly _renderer = inject(Renderer2);

  protected readonly spinnerRef = this._viewContainerRef.createComponent(MatProgressSpinner, { index: 0 });

  readonly spinning = input.required<boolean, BooleanInput>({
    transform: value => {
      const result = coerceBooleanProperty(value);

      if (result) {
        this._elementRef.nativeElement.classList.add('is-spinning');
      } else {
        this._elementRef.nativeElement.classList.remove('is-spinning');
      }
      return result;
    },
  });

  @Input() set color(value: string | null | undefined) {
    this.spinnerRef.instance.color = value;
  }
  get color(): string | null | undefined {
    return this.spinnerRef.instance.color;
  }

  @Input() set strokeWidth(value: NumberInput) {
    this.spinnerRef.instance.strokeWidth = coerceNumberProperty(value);
  }
  get strokeWidth(): number {
    return this.spinnerRef.instance.strokeWidth as number;
  }

  constructor() {
    this.spinnerRef.instance.diameter = 20; // dependent on style positioning
  }

  ngOnInit(): void {
    this.spinnerRef.instance.mode = 'indeterminate';

    const spinnerEl: Element = this.spinnerRef.instance._elementRef.nativeElement;

    this._renderer.appendChild(this._elementRef.nativeElement, spinnerEl);
  }
}
