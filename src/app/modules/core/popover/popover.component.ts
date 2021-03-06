import { Component,
  Input,
  SimpleChange,
  OnInit,
  ViewChild,
  OnChanges,
  AfterContentInit,
  AfterContentChecked,
  ElementRef,
  Renderer2
} from '@angular/core';
import * as erdImported from 'element-resize-detector';
const erd = erdImported;
/**
 * Make a popoper around items
 * @example
 * <popover [open]="open()" placement='right'>
    |  <button (click)="toggle()" style="width:100px;">hey</button>
    |  <div popover="content">Hey to you! I'm on your right!</div>
    </popover>
 */
@Component({
  selector: 'defi-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss']
})
export class DefiPopoverComponent implements AfterContentInit, OnChanges {
  /**
   * Open or close popover;
   * Default: close
   */
  @Input('open') open = false;
  /**
   * Define the placment of popover
   */
  @Input('placement') placement = 'right';
  @ViewChild('popupContainer') popupContainer: ElementRef;
  positionClass = 'popover-right';
  resizeDetector;
  constructor(private renderer: Renderer2) {
    this.resizeDetector = erd({
      strategy: 'scroll' // <- For ultra performance.
    });
  }
  // /**
  //  * Track changes on input open to reflect status on private keys
  //  */
  loadState(open) {
    open ?
      this.renderer.setStyle(this.popupContainer.nativeElement, 'visibility', 'visible') :
      this.renderer.setStyle(this.popupContainer.nativeElement, 'visibility', 'hidden');
  }
  ngOnChanges(changes: { [propName: string]: SimpleChange }) {
    this.loadState(changes['open'].currentValue);
  }
  ngAfterContentInit(): void {
    this.resizeDetector.listenTo(this.popupContainer.nativeElement, (element) => {
      const width = element.offsetWidth;
      const height = element.offsetHeight;
      if (this.placement === 'top' || this.placement === 'bottom') {
        this.renderer.setStyle(this.popupContainer.nativeElement, 'left', '-' + width / 2 + 'px');
      }
    });
  }
}

