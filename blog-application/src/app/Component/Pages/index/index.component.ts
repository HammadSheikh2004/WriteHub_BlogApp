import { Component, OnInit } from '@angular/core';
import { BlogServiceService } from '../../../Shared/Blog/blog-service.service';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ButtonComponent } from '../../../ReuseableComp/button/button.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SearchserviceService } from '../../../Shared/Search/searchservice.service';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule, ButtonComponent, RouterLink],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
})
export class IndexComponent implements OnInit {
  data: any = '';
  cat: any = '';
  category: any | null = null;
  filteredData: any[] = [];
  searchQuery: string = '';
  constructor(
    private service: BlogServiceService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private searchService: SearchserviceService
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.category = params.get('category');
      this.fetchBlogs();
    });

    this.service.DisplayCategory().subscribe(
      (res) => {
        console.log(res);
        this.cat = res;
      },
      (err) => {
        console.log(err);
      }
    );

    this.searchService.currentSearchQuery.subscribe((query) => {
      this.searchQuery = query;
      this.filterData();
    });
  }

  filterData() {
    if (!this.searchQuery) {
      this.filteredData = this.data;
    } else {
      this.filteredData = this.data.filter((item: any) =>
        (item.content ?? item.blogContent)
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase())
      );
    }
  }

  fetchBlogs(): void {
    if (this.category) {
      this.service.DisplayBlogsByCat(this.category).subscribe(
        (res) => {
          this.data = res;
          this.filteredData = res;
        },
        (err) => {
          console.log(err);
        }
      );
    } else {
      this.service.DisplayBlogs().subscribe(
        (res) => {
          this.data = res;
          this.filteredData = res;
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  sanitizeContent(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }
}
