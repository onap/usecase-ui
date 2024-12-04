import { Component, ContentChildren, EventEmitter, Input, OnDestroy, OnInit, QueryList } from '@angular/core';
import { Subject } from 'rxjs';
import { DescriptionItemComponent } from './descriptions-item.component';
import { DescriptionItemRenderProps } from './description.type';
@Component({
  selector: 'app-descriptions',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.less'],
})
export class DescriptionComponent implements OnInit, OnDestroy {
  @ContentChildren(DescriptionItemComponent) items: QueryList<DescriptionItemComponent>;

  @Input() nzColumn: number = 3;
  @Input() nzTitle: string = '';
  @Input() nzColon: boolean = true;

  itemMatrix: DescriptionItemRenderProps[][] = [];
  private destroy$ = new Subject<void>();
  constructor() { }

  ngOnInit() {
  }

  ngAfterContentInit(): void {
    this.prepareMatrix();
  }


  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

   /**
   * Prepare the render matrix according to description items' spans.
   */
   private prepareMatrix(): void {
    if (!this.items) {
      return;
    }

    let currentRow: DescriptionItemRenderProps[] = [];
    let width = 0;

    const column = this.nzColumn;
    const items = this.items.toArray();
    const length = items.length;
    const matrix: DescriptionItemRenderProps[][] = [];
    const flushRow = (): void => {
      matrix.push(currentRow);
      currentRow = [];
      width = 0;
    };

    for (let i = 0; i < length; i++) {
      const item = items[i];
      const { nzTitle: title, content, nzSpan: span } = item;

      width += span;

      if (width >= column) {
        if (width > column) {
          console.warn(`"nzColumn" is ${column} but we have row length ${width}`);
          flushRow();
        }
        currentRow.push({ title, content, span });
        flushRow();
      } else if (i === length - 1) {
        currentRow.push({ title, content, span: column - (width - span) });
        flushRow();
      } else {
        currentRow.push({ title, content, span });
      }
    }

    this.itemMatrix = matrix;
  }

}