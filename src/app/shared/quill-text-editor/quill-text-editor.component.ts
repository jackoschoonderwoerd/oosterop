import { AfterViewInit, Component, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import * as Quill from 'quill';
import { TextEditorService } from '../../services/text-editor.service';

@Component({
    selector: 'app-quill-text-editor',
    imports: [QuillModule, FormsModule],
    templateUrl: './quill-text-editor.component.html',
    styleUrl: './quill-text-editor.component.scss'
})
export class QuillTextEditorComponent implements OnInit, AfterViewInit {
    @ViewChild('quillEditor', { static: false }) quillEditor: any;
    @Input() public initialHtml: string
    @Output() htmlChanged = new EventEmitter<string>;
    textEditorService = inject(TextEditorService)

    quillModules = {
        toolbar: [
            ['bold', 'italic', 'underline'],
            ['blockquote', 'code-block'],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['link', 'image', 'video', 'formula'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['clean']
        ],

    };

    ngOnInit(): void {
        console.log(this.initialHtml)
        this.textEditorService.bodyChanged.subscribe((html: string) => {
            console.log(html)
            const editorInstance = this.quillEditor.quillEditor;
            // const editorInstance = this.quillEditor.quillEditor;
            if (editorInstance) {
                console.log('editorInstance found')
                editorInstance.clipboard.dangerouslyPasteHTML(html);
            }
        })
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            const editorInstance = this.quillEditor.quillEditor;
            // const editorInstance = this.quillEditor.quillEditor;
            if (editorInstance) {
                editorInstance.clipboard.dangerouslyPasteHTML(this.initialHtml);
            }

        }, 500);
    }

    onContentChanged(ampersandedHtml) {

        if (ampersandedHtml) {
            const html = ampersandedHtml.replaceAll('&nbsp;', ' ')
            this.htmlChanged.emit(html)
        }
    }
}
