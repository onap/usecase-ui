import { Directive, ElementRef, Renderer2, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NzMessageService } from 'ng-zorro-antd';
import { ClipboardService } from 'ngx-clipboard';

@Directive({
  selector: '[appCodeBlock]'
})
export class CodeBlockDirective {
  @Input() set appCodeBlock(status: string) {
    if (status === 'finished') {
      setTimeout(() => {
        this.setCopyButton();
      }, 0);
      
    }
  }

  constructor(private el: ElementRef, private renderer: Renderer2, private clipboardService: ClipboardService,
    private message: NzMessageService, private translate: TranslateService
  ) { }

  setCopyButton() {
    const preElements = this.el.nativeElement.querySelectorAll('pre');

    preElements.forEach(pre => {
      const codeElement = pre.querySelector('code');
      const copyButtonExists = pre.querySelector('button.copy-button');
      if (codeElement && !copyButtonExists) {
        const copyButton = this.renderer.createElement('button');
        this.renderer.addClass(copyButton, 'copy-button');
        this.renderer.setProperty(copyButton, 'innerHTML', 'Copy');
        this.renderer.listen(copyButton, 'click', () => {
          this.clipboardService.copyFromContent(codeElement.innerText);
          this.message.success(this.translate.instant('maas.copy_to_clipboard'));
        });
        this.renderer.insertBefore(pre, copyButton, codeElement);
      }
    });
  }
}
