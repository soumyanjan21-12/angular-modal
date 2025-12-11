import {
  Injectable,
  inject,
  ComponentRef,
  Injector,
  createComponent,
  EnvironmentInjector
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Subject, Observable, take } from 'rxjs';
import { ModalWrapperComponent } from './modal-wrapper/modal-wrapper';

export type DataType = Record<string, string | number | boolean>;

@Injectable({ providedIn: 'root' })
export class ModalService {
  private document = inject(DOCUMENT);
  // private injector = inject(Injector);
  private env = inject(EnvironmentInjector);

  private modalData = new Subject<DataType | null>();
  private closeModalData = new Subject<DataType | null>();
  private modalRef: ComponentRef<any> | null = null;

  openModal(component: any, data?: DataType): Observable<DataType | null> {
    if (data) this.modalData.next(data);

    // Step 1: Create wrapper
    const wrapperRef = createComponent(ModalWrapperComponent, {
      environmentInjector: this.env,
    });

    this.modalRef = wrapperRef;

    // Step 2: Create actual modal component and insert inside wrapper host
    const childRef = wrapperRef.instance.host.createComponent(component, {
      environmentInjector: this.env
    });

    // Step 3: Append wrapper to DOM
    this.document.body.appendChild(wrapperRef.location.nativeElement);
    wrapperRef.changeDetectorRef.detectChanges();

    // Step 4: Set close on backdrop click
    wrapperRef.instance.onBackdropClick = () => {
      this.closeModal({});
    };

    return this.closeModalData.asObservable().pipe(take(1));
  }

  closeModal(data: DataType): void {
    if (!this.modalRef) return;

    this.closeModalData.next(data);

    this.document.body.removeChild(this.modalRef.location.nativeElement);
    this.modalRef.destroy();
    this.modalRef = null;
  }

  getData(): Observable<DataType | null> {
    return this.modalData.asObservable();
  }
}
