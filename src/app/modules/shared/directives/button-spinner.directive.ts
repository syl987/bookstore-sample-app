import { BooleanInput, coerceBooleanProperty, NumberInput } from '@angular/cdk/coercion';
import { ComponentRef, Directive, ElementRef, Input, OnInit, Renderer2, ViewContainerRef } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Directive({
  selector:
    '[mat-button][spinning],[mat-raised-button][spinning],[mat-stroked-button][spinning],[mat-flat-button][spinning],[mat-icon-button][spinning],[mat-fab][spinning],[mat-mini-fab][spinning]',
  host: { class: 'app-button-spinner' },
})
export class ButtonSpinnerDirective implements OnInit {
  private readonly spinnerRef: ComponentRef<MatProgressSpinner> = this._viewContainerRef.createComponent(MatProgressSpinner, { index: 0 });

  @Input() set spinning(value: BooleanInput) {
    this.#spinning = coerceBooleanProperty(value);

    if (this.#spinning) {
      this._elementRef.nativeElement.classList.add('is-spinning');
    } else {
      this._elementRef.nativeElement.classList.remove('is-spinning');
    }
  }
  get spinning(): boolean {
    return this.#spinning;
  }
  #spinning = false;

  @Input() set color(value: ThemePalette) {
    this.spinnerRef.instance.color = value;
  }
  get color(): ThemePalette {
    return this.spinnerRef.instance.color;
  }

  @Input() set strokeWidth(value: NumberInput) {
    this.spinnerRef.instance.strokeWidth = value;
  }
  get strokeWidth(): number {
    return this.spinnerRef.instance.strokeWidth;
  }

  constructor(private readonly _elementRef: ElementRef, private readonly _viewContainerRef: ViewContainerRef, private readonly _renderer: Renderer2) {
    this.spinnerRef.instance.diameter = 20; // dependent on style positioning
  }

  ngOnInit(): void {
    this.spinnerRef.instance.mode = 'indeterminate';

    const spinnerEl: Element = this.spinnerRef.instance._elementRef.nativeElement;

    this._renderer.appendChild(this._elementRef.nativeElement, spinnerEl);
    spinnerEl.setAttribute('aria_label', 'processing');
  }
}
