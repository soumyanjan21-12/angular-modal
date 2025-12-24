import {
  Injectable,
  inject,
  ComponentRef,
  createComponent,
  EnvironmentInjector,
  ApplicationRef
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Subject, Observable, take } from 'rxjs';
import { ModalWrapperComponent } from './modal-wrapper/modal-wrapper';

export type DataType = Record<string, string | number | boolean>;

interface ModalInstance {
  wrapperRef: ComponentRef<ModalWrapperComponent>;
  dataSubject: Subject<DataType | null>;
  closeSubject: Subject<DataType | null>;
}

@Injectable({ providedIn: 'root' })
export class ModalService {
  private document = inject(DOCUMENT);
  private env = inject(EnvironmentInjector);
  private appRef = inject(ApplicationRef);

  private modals = new Map<string, ModalInstance>();
  private modalCounter = 0;

  openModal(component: any, data?: DataType): Observable<DataType | null> {
    const modalId = `modal-${++this.modalCounter}`;

    try {
      // Create subjects for this specific modal
      const dataSubject = new Subject<DataType | null>();
      const closeSubject = new Subject<DataType | null>();

      // Step 1: Create wrapper
      const wrapperRef = createComponent(ModalWrapperComponent, {
        environmentInjector: this.env,
      });

      // Step 2: Create actual modal component and insert inside wrapper host
      const childRef = wrapperRef.instance.host.createComponent(component, {
        environmentInjector: this.env
      });

      childRef.setInput('modalId', modalId);
      // Step 3: Emit data after component is created
      childRef.setInput('modalData', data||{});


      // Step 4: Append wrapper to DOM
      this.document.body.appendChild(wrapperRef.location.nativeElement);

      // Trigger change detection for both wrapper and child
      wrapperRef.changeDetectorRef.detectChanges();
      childRef.changeDetectorRef.detectChanges();
      this.appRef.tick();

      // Step 5: Set close on backdrop click
      wrapperRef.instance.onBackdropClick = () => {
        this.closeModal(modalId, {});
      };

      // Store modal instance
      this.modals.set(modalId, {
        wrapperRef,
        dataSubject,
        closeSubject
      });

      return closeSubject.asObservable().pipe(take(1));
    } catch (error) {
      console.error('Failed to open modal:', error);
      throw error;
    }
  }

  closeModal(modalId: string, data: DataType): void {
    const modal = this.modals.get(modalId);
    if (!modal) return;

    try {
      // Emit close data
      modal.closeSubject.next(data);
      modal.closeSubject.complete();
      modal.dataSubject.complete();

      // Remove from DOM
      this.document.body.removeChild(modal.wrapperRef.location.nativeElement);

      // Destroy component
      modal.wrapperRef.destroy();

      // Remove from map
      this.modals.delete(modalId);
    } catch (error) {
      console.error('Failed to close modal:', error);
      // Still try to clean up
      this.modals.delete(modalId);
    }
  }

  // Method to close the most recently opened modal
  closeLatestModal(data: DataType = {}): void {
    if (this.modals.size === 0) return;

    const lastModalId = Array.from(this.modals.keys()).pop();
    if (lastModalId) {
      this.closeModal(lastModalId, data);
    }
  }

  // Method to get data for a specific modal
  getData(modalId: string): Observable<DataType | null> | null {
    const modal = this.modals.get(modalId);
    return modal ? modal.dataSubject.asObservable() : null;
  }

  // Clean up all modals (useful for navigation guards or cleanup)
  closeAll(): void {
    this.modals.forEach((_, id) => this.closeModal(id, {}));
  }
}
