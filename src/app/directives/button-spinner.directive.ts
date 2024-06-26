import { BooleanInput, coerceBooleanProperty, coerceNumberProperty, NumberInput } from '@angular/cdk/coercion';
import { ComponentRef, Directive, ElementRef, Input, input, OnInit, Renderer2, ViewContainerRef } from '@angular/core';
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
  private readonly spinnerRef: ComponentRef<MatProgressSpinner> = this._viewContainerRef.createComponent(MatProgressSpinner, { index: 0 });

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

  constructor(
    private readonly _elementRef: ElementRef,
    private readonly _viewContainerRef: ViewContainerRef,
    private readonly _renderer: Renderer2,
  ) {
    this.spinnerRef.instance.diameter = 20; // dependent on style positioning
  }

  ngOnInit(): void {
    this.spinnerRef.instance.mode = 'indeterminate';

    const spinnerEl: Element = this.spinnerRef.instance._elementRef.nativeElement;

    this._renderer.appendChild(this._elementRef.nativeElement, spinnerEl);
  }
}
