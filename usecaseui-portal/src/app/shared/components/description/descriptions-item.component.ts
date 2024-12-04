
import { Component, Input, OnInit, TemplateRef, ViewChild, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-descriptions-item',
  template: `
    <ng-template>
      <ng-content></ng-content>
    </ng-template>
  `,
})
export class DescriptionItemComponent implements OnDestroy {
  @ViewChild(TemplateRef) content: TemplateRef<void>;
  @Input() nzSpan: number = 1;
  @Input() nzTitle: string = '';

  readonly inputChange$ = new Subject<void>();

  ngOnChanges(): void {
    this.inputChange$.next();
  }

  ngOnDestroy(): void {
    this.inputChange$.complete();
  }
  
}
