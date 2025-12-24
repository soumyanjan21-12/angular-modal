import { Component, ViewChild, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-modal-wrapper',
  template: `
    <div class="modal-container backdrop">
      <ng-container #host></ng-container>
    </div>
  `,
  styles: [
    `
      :host {
        position: fixed;
        inset: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        height: 100%;
        width: 100%;
      }
      .backdrop {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
      }
      .modal-container {
        position: relative;
        z-index: 10000;
        width: inherit;
        height: inherit;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    `,
  ],
})
export class ModalWrapperComponent {
  @ViewChild('host', { read: ViewContainerRef, static: true })
  host!: ViewContainerRef;

  public onBackdropClick = () => {};
}
