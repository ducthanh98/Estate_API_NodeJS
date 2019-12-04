import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styles: [
    `
      li:hover,a:hover{
        cursor:pointer;
      }
    `
  ]
})
export class PaginationComponent implements OnInit {
  pageNumber = 1;
  private totalPage = 1;
  numbers: number[];
  @Output() selectPage = new EventEmitter<number>();
  constructor() { }

  ngOnInit() {
  }
  @Input() set totalPages(value: number) {
    this.totalPage = value;
    this.numbers = Array(this.totalPage).fill(1).map((x, i) => i + 1);
  }
  get totalPages() {
    return this.totalPage;
  }

  changePage(page: number) {
    this.pageNumber = page;
    this.selectPage.emit(page);
  }

  nextOrPrevPage(isNext: boolean) {
    if (isNext && this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.selectPage.emit(this.pageNumber);
    }
    if (!isNext && this.pageNumber > 1) {
      this.pageNumber--;
      this.selectPage.emit(this.pageNumber);
    }
  }
}
