import { Component, OnInit, Input } from '@angular/core';
import { trigger, state, transition, animate, style } from '@angular/animations';
import { Subject } from 'rxjs';
import { FormGroup } from '@angular/forms';
/**
 * Display a popup
 * @example
 * popup.open().subscibe(result=>{
 * |  // result = undefined or 'ok'
 * })
 * <popup #popup>
 * |  <div title>Some templating</div>
 * |  <div body>Some templating</div>
 * </popup>
 *
 * formGroup: FormGroup
 * popupWithBind.bindForm(formGroup).open().subscibe(result=>{
 * |  // result = undefined or formGroup.value
 * })
 * <popup #popupWithBind>
 * |  <div title>Some templating</div>
 * |  <div body>Some templating with input control etc...</div>
 * </popup>
 *
 * data = { $implicit: 'Hello', name:'world' }
 * popupWithContext.open(data).subscibe(result=>{
 * |  // result = undefined or 'ok'
 * })
 * <popup #popupWithContext>
 * |  <div title>Some templating</div>
 * |  <div body>Some templating with context like: {{popupWithContext.context.hello}} {{popupWithContext.context.name}} !</div>
 * </popup>
 */
@Component({
  selector: 'popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
  animations: [
    trigger('openState', [
      state('open', style({
        'display': 'flex',
        'opacity': '1'
      })),
      state('close', style({
        'display': 'none',
        'opacity': '0'
      })),
      transition('open => close', animate('100ms ease-in')),
      transition('close => open', animate('100ms ease-out'))
    ])
  ]
})
export class PopupComponent {

  @Input() body = '';
  @Input() title: string;

  @Input() cancelButton = 'Annuler';
  @Input() validateButton = 'Valider';

  @Input() width = 'auto';
  @Input() height = 'auto';

  @Input() mainColor = '#343a40';

  @Input() noActions = false;

  context: any;

  _open = false;
  state = 'close';

  result: Subject<any>;

  form: FormGroup;

  open(context?): Subject<any> {
    this.context = context;
    this.result = new Subject();
    this._open = true;
    this.state = 'open';
    return this.result;
  }
  close($event?: Event) {
    if ($event) { this.stopPropagation($event); }
    this._open = false;
    this.state = 'close';
    if (this.result) {
      this.result.unsubscribe();
      this.result = null;
     }
  }

  bindForm(form: FormGroup) {
    this.form = form;
    return this;
  }

  stopPropagation($event: Event) {
    $event.stopPropagation();
  }

  out(isValidate, $event?: Event, value?: any) {
    if ($event) { $event.preventDefault(); }
    if (!isValidate) this.result.next(null);
    else if (this.form) this.result.next(this.form.value);
    else this.result.next(value || 'ok');
    this.close();
  }

}