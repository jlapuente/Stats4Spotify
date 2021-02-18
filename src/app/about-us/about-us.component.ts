import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Commit } from '../properties/constants';
import { MatPaginator, MatTableDataSource } from '@angular/material';

import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';


@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class AboutUsComponent implements OnInit {

  gitHubApi: string = 'https://api.github.com/repos/jlapuente/Stats4Spotify/commits';
  commitList: Commit[] = [];
  displayedColumns: string[] = [];
  screenWidth: number = window.screen.height;
  isMobile: boolean = this.screenWidth < 768 ? true : false;
  parameters: HttpParams = new HttpParams();
  dataSource;
  resultsLength = 0

  faTwitter = faTwitter;
  faGithub = faGithub;

  @ViewChild(MatPaginator, null) paginator: MatPaginator;

  constructor(private http: HttpClient) { }

  ngOnInit() {

    if (this.isMobile) {
      this.displayedColumns = ['autor', 'fecha', 'informacion'];
    } else {
      this.displayedColumns = ['autor', 'fecha', 'comentario', 'informacion'];
    }

    this.searchCommits();
  }

  searchCommits() {
    let headers: HttpHeaders = new HttpHeaders();

    const options = { params: new HttpParams().set('name', 'prueba') };

    return this.http.get<any[]>(this.gitHubApi, options).subscribe(data => {
      data.forEach(element => {
        this.commitList.push(new Commit(element.commit.committer.name, element.commit.author.date, element.commit.message));
      });
      this.dataSource = new MatTableDataSource(this.commitList);
      this.resultsLength = this.commitList.length;
      this.dataSource.paginator = this.paginator;
    })
  }
}
export class TableExpandableRowsExample {
  dataSource;
  columnsToDisplay = ['autor', 'fecha', 'comentario'];
  expandedElement: Commit | null;
}
