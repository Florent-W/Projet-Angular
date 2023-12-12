import { Component, Input, OnInit } from '@angular/core';
import { Fiche, FichesService } from 'src/app/shared/services/fiches.service';
import { List } from 'src/app/shared/services/lists.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss'],
})
export class ListsComponent implements OnInit {
  @Input() list?: List;
  @Input() format?: 'small' | 'large' = 'large';
  items: Fiche[] = [];

  constructor(private fiches: FichesService) {}
  ngOnInit(): void {
    this.getFicheByListItem();
  }

  getFicheByListItem = () => {
    this.list?.items.map((item: number) => {
      this.fiches
        .getFicheById(item)
        .subscribe((fiche) => this.items.push(fiche));
    });
  };
}
