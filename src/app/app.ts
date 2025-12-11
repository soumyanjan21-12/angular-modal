import { Component, signal, inject } from '@angular/core';
import { ModalService, DataType } from './modal.service';
import { Demo } from './demo/demo';
@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  modalService = inject(ModalService);
  protected readonly title = signal('angular-modal');
  openModal() {
    this.modalService.openModal(Demo, { exampleData: 'Hello Modal' }).subscribe((data:DataType|null) => {
      console.log('Modal closed with data:', data);
    });
  }

  // parent(event: Event) {
  //   console.log('Parent clicked',event.target);
  // }

  // child(event: Event) {
  //    event.stopPropagation();
  //    console.log('child clicked',event.target);
  // }
}
