import { TemplateRef } from "@angular/core";

export interface DescriptionItemRenderProps {
    title: string | TemplateRef<void>;
    span: number;
    content: TemplateRef<void>;
  }