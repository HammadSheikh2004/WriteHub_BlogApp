import { Component } from '@angular/core';
import { BlogServiceService } from '../../../Shared/Blog/blog-service.service';
import { ActivatedRoute } from '@angular/router';
import { CLIENT_RENEG_LIMIT } from 'tls';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [],
  templateUrl: './blog-detail.component.html',
  styleUrl: './blog-detail.component.css',
})
export class BlogDetailComponent {
  blog: any;
  
  blogId: any;
  constructor(
    private service: BlogServiceService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.blog = params.get('blog');
      this.fetchBlogDetail();
    });
  }

  fetchBlogDetail = () => {
    if (this.blog) {
      this.service.BlogDetail(this.blog).subscribe(
        (res) => {
          this.blog = res;
          console.log(res);
        },
        (err) => {
          console.log(err);
        }
      );
    }
  };
  sanitizeContent(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }
}
