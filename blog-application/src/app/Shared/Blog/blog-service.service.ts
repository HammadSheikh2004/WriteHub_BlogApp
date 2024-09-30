import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BlogServiceService {
  constructor(private httpClient: HttpClient) {}

  private blogCreateApi = 'http://localhost:5241/api/Blog/BlogsCreate';
  private getBlogsByToken =
    'http://localhost:5241/api/Blog/BlogsDisplayByToken';
  private displayAllBlogs = 'http://localhost:5241/api/Blog/DisplayBlogs';
  private displayAllCategory = 'http://localhost:5241/api/Blog/DisplayCategory';
  private displayBlogsByCategory =
    'http://localhost:5241/api/Blog/DisplayBlogsByCategory';
  private getBlogById = 'http://localhost:5241/api/Blog/DisplayBlogsById';
  private blogUpdate = 'http://localhost:5241/api/Blog/BlogsUpdate';
  private deleteblog = 'http://localhost:5241/api/Blog/DeleteBlog';
  private blogDetails = 'http://localhost:5241/api/Blog/BlogDetail';

  createBlog = (blogData: any): Observable<any> => {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      enctype: 'multipart/form-data',
    });
    return this.httpClient.post<any>(this.blogCreateApi, blogData, { headers });
  };

  BlogsByToken = (): Observable<any> => {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.httpClient.get<any>(this.getBlogsByToken, { headers });
  };

  DisplayBlogs = (): Observable<any> => {
    return this.httpClient.get<any>(this.displayAllBlogs);
  };

  DisplayCategory = (): Observable<any> => {
    return this.httpClient.get<any>(this.displayAllCategory);
  };

  DisplayBlogsByCat = (cat: string): Observable<any> => {
    return this.httpClient.get<any>(
      `${this.displayBlogsByCategory}?category=${cat}`
    );
  };

  BlogById = (blogId: number): Observable<any> => {
    const url = `${this.getBlogById}?id=${blogId}`;
    return this.httpClient.get<any>(url);
  };

  UpdateBlog = (blogData: any, id: number): Observable<any> => {
    const token = localStorage.getItem('token');
    const url = `${this.blogUpdate}?id=${id}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      enctype: 'multipart/form-data',
    });
    return this.httpClient.put<any>(url, blogData, { headers });
  };

  DeleteBlog = (id: number): Observable<any> => {
    const url = `${this.deleteblog}?id=${id}`;
    return this.httpClient.delete<any>(url);
  };

  BlogDetail = (id: number): Observable<any> => {
    return this.httpClient.get<any>(`${this.blogDetails}?blogId=${id}`);
  };
}
