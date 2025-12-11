import { Component, inject } from '@angular/core';
import { ModalService } from '../modal.service';

@Component({
  selector: 'app-demo',
  imports: [],
  templateUrl: './demo.html',
  styleUrl: './demo.scss',
})
export class Demo {
  private modalService = inject(ModalService);
  consturctor() {
    this.modalService.getData().subscribe((data) => {
      console.log('Received modal data:', data);
    });
  }
  close() {
    this.modalService.closeModal({ closed: true });
  }
}
