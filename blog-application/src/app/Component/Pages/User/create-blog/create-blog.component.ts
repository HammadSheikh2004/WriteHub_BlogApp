import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';
import { BlogServiceService } from '../../../../Shared/Blog/blog-service.service';
import { Node, Schema } from 'prosemirror-model';

@Component({
  selector: 'app-create-blog',
  standalone: true,
  imports: [NgxEditorModule, FormsModule, RouterLink],
  templateUrl: './create-blog.component.html',
  styleUrl: './create-blog.component.css',
})
export class CreateBlogComponent implements OnInit, OnDestroy {
  editor: Editor | any;
  constructor(private service: BlogServiceService) {}


  formData = {
    Blog_Category: '',
    Content: '',
  };

  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    ['link'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  ngOnInit(): void {
    this.editor = new Editor();
  }

  ngOnDestroy(): void {
    if (this.editor) {
      this.editor.destroy();
    }
  }

  submitFormData(form: NgForm) {
    const imageId = document.getElementById('blog_image') as HTMLInputElement;
    const content = {
      Blog_Category: form.value.Blog_Category,
      Content: form.value.Content
    };

    const formDataValues = new FormData();

    formDataValues.append("Blog_Category", content.Blog_Category);
    formDataValues.append("Content", content.Content);

    if(imageId.files && imageId.files.length > 0){
      formDataValues.append("BlogImage", imageId.files[0]);
    }

    this.service.createBlog(formDataValues).subscribe(
      (res) => {
        console.log('Data Submitted SuccessFully', res);
      },
      (err) => {
        console.log(err);
      }
    );
    console.log('Submitted Content:', content);
  }
}
