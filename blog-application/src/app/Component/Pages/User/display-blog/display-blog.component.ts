import { Component, OnInit } from '@angular/core';
import { BlogServiceService } from '../../../../Shared/Blog/blog-service.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-display-blog',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './display-blog.component.html',
  styleUrl: './display-blog.component.css',
})
export class DisplayBlogComponent implements OnInit {
  constructor(private service: BlogServiceService) {}

  data: any = '';

  ngOnInit(): void {
    this.service.BlogsByToken().subscribe(
      (res) => {
        this.data = res;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  deleteBlog = (id: number) => {
    this.service.DeleteBlog(id).subscribe(
      (res) => {
        this.data = this.data.filter((item: any) => {
          item.id !== id
        });
      },
      (err) => {
        console.log(err);
      }
    );
  };
}
