import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogServiceService } from '../../../../Shared/Blog/blog-service.service';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';
import { FormsModule, NgForm, NgModel } from '@angular/forms';

@Component({
  selector: 'app-edit-blog',
  standalone: true,
  imports: [NgxEditorModule, FormsModule],
  templateUrl: './edit-blog.component.html',
  styleUrl: './edit-blog.component.css',
})
export class EditBlogComponent implements OnInit, OnDestroy {
  constructor(
    private route: ActivatedRoute,
    private service: BlogServiceService
  ) {}

  data = {
    Category: '',
    Content: '',
  };

  blogId: number = 0;
  blogData: any;
  editor: Editor | any;

  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  ngOnInit(): void {
    this.route.params.subscribe((para) => {
      this.blogId = para['blogId'];
      this.service.BlogById(this.blogId).subscribe((res) => {
        console.log(res);
        this.blogData = res;
      });
    });

    this.editor = new Editor();
  }

  ngOnDestroy(): void {
    if (this.editor) {
      this.editor.destroy();
    }
  }

  UpdateFormData(formData: NgForm) {
    const imageId = document.getElementById('blog_image') as HTMLInputElement;
    const content = {
      blogCategory: formData.value.Blog_Category,
      blogContent: formData.value.Content,
    };
    const formDataValues = new FormData();
    formDataValues.append('Blog_Cat_Id', formData.value.blogCatId);
    formDataValues.append('Id', formData.value.blogId); 
    formDataValues.append('Blog_Category', content.blogCategory);
    formDataValues.append('Content', content.blogContent);
    if (imageId.files && imageId.files.length > 0) {
      formDataValues.append('BlogImage', imageId.files[0]);
    }

    console.log(formData.value)

    this.service.UpdateBlog(formDataValues, this.blogId).subscribe(
      (res) => {
        console.log(res);
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
