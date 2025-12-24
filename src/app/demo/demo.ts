import { Component, inject, input, OnInit } from '@angular/core';
import { ModalService , DataType} from '../modal.service';

@Component({
  selector: 'app-demo',
  imports: [],
  templateUrl: './demo.html',
  styleUrl: './demo.scss',
})
export class Demo implements OnInit {
  modalId = input<string>();
  modalData = input<DataType>();
  private modalService = inject(ModalService);
  ngOnInit() {
   console.log('Modal Data:', this.modalData());
  }
  close() {
    this.modalService.closeLatestModal({test:'test'})
  }
}
