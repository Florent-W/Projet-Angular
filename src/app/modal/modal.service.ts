import { DOCUMENT } from '@angular/common';
import {
  ComponentFactoryResolver,
  Inject,
  Injectable,
  Injector,
} from '@angular/core';
import { Subject } from 'rxjs';
import { ModalComponent } from './modal.component';

export type ModalVariant = 'ajout-fiche' | 'list-modal' | 'ajout-article';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private componentSubscriber?: Subject<string>;
  private modalNotifier?: Subject<string>;

  constructor(
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
    @Inject(DOCUMENT) private document: Document
  ) {}

  openModal(options: {
    title: string;
    variant?: ModalVariant;
    context?: Record<string, any>;
  }) {
    const ModalComponentFactory =
      this.resolver.resolveComponentFactory(ModalComponent);
    const modalComponent = ModalComponentFactory.create(this.injector);

    modalComponent.instance.title = options?.title;
    modalComponent.instance.variant = options?.variant || 'ajout-fiche';
    modalComponent.instance.context = options?.context || {};
    // modalComponent.instance.closeEvent.subscribe(() => this.closeModal());
    // modalComponent.instance.closeEvent.subscribe(() => this.submitModal());
    modalComponent.hostView.detectChanges();
    this.document.body.appendChild(modalComponent.location.nativeElement);
    this.modalNotifier = new Subject();
    return this.modalNotifier?.asObservable();
  }

  closeModal(id: string) {
    if (this.componentSubscriber) {
      this.modalNotifier?.complete();
    }
    const appModal = this.document
      .querySelector('app-modal')
      ?.remove() as unknown as Element[];
    appModal?.forEach((appBar) => {
      const modalChild = appBar.querySelector(`#${id}`);
      if (modalChild) {
        appBar.remove();
      }
    });
  }

  // submitModal() {
  //   this.modalNotifier?.next('confirm');
  //   this.closeModal();
  // }
}
