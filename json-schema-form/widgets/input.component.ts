import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'input-widget',
  template: `
    <div [formGroup]="formGroup">
      <input
        [formControlName]="layoutNode?.name"
        [id]="layoutNode?.name"
        [class]="layoutNode?.fieldHtmlClass"
        [type]="layoutNode?.type === 'integer' ? 'number' : layoutNode?.type"
        [name]="layoutNode?.name"
        [attr.minlength]="layoutNode?.minLength || layoutNode?.minlength"
        [attr.maxlength]="layoutNode?.maxLength || layoutNode?.maxlength"
        [attr.pattern]="layoutNode?.pattern"
        [attr.placeholder]="layoutNode?.placeholder"
        [attr.readonly]="layoutNode?.readonly ? 'readonly' : null"
        [attr.value]="layoutNode?.value"
        [attr.required]="layoutNode?.required">
    </div>`,
})
export class InputComponent {
  @Input() formGroup: FormGroup; // parent FormGroup
  @Input() layoutNode: any; // JSON Schema Form layout node
  @Input() formOptions: any; // Global form defaults and options
}