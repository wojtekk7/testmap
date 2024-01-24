import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FlatMyItem, MyItem } from './myitems';
import { v4 as uuidv4 } from 'uuid';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
  MatTreeModule,
} from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import Konva from 'konva';

export interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
// 20.11.0
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('mykonva') myKonva!: ElementRef;
  title = 'mytest';
  items: MyItem[] = [];
  flatItems: FlatMyItem[] = [];
  originalFlatItems: FlatMyItem[] = [];

  private _transformer = (node: MyItem, level: number) => {
    return {
      expandable: !!node.items && node.items.length > 0,
      name: node.name,
      level: level,
    };
  };

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    (node) => node.level,
    (node) => node.expandable
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.items
  );

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  predefinedColors = [
    '#ff0000', // Red
    '#00ff00', // Green
    '#0000ff', // Blue
    '#800080', // Purple
  ];

  predefinedColorsList = [
    { color: '#ff0000', selected: false },
    { color: '#00ff00', selected: false },
    { color: '#0000ff', selected: false },
    { color: '#800080', selected: false },
  ];
  loading: boolean = false;
  mode: boolean = true;
  stage: any;
  layer: any;

  ngAfterViewInit(): void {
    console.log(this.myKonva);
    this.stage = new Konva.Stage({
      container: this.myKonva.nativeElement,
      width: 1000,
      height: 600,
    });

    this.layer = new Konva.Layer();

    for (let index = 0; index < 20; index++) {
      let rect = new Konva.Rect({
        x: 50,
        y: 50,
        width: 50,
        height: 50,
        fill: 'blue',
        draggable: true,
        dragBoundFunc: (pos) => {
          const containerWidth = this.myKonva.nativeElement.clientWidth;
          const containerHeight = this.myKonva.nativeElement.clientHeight;

          const minX = 0;
          const minY = 0;
          const maxX = containerWidth - rect.width();
          const maxY = containerHeight - rect.height();

          const x = Math.max(minX, Math.min(pos.x, maxX));
          const y = Math.max(minY, Math.min(pos.y, maxY));

          return { x, y };
        },
      });

      const text = new Konva.Text({
        x: rect.x() + 10, // Dostosuj położenie tekstu
        y: rect.y() + 10, // Dostosuj położenie tekstu
        text: `Opis ${index}`,
        fontSize: 12,
        fill: 'white',
      });

      rect.on('dragmove', () => {
        // Zwiąż położenie tekstu z położeniem prostokąta
        text.x(rect.x() + 10);
        text.y(rect.y() + 10);

        this.stage.batchDraw();
      });

      this.layer.add(rect);
      this.layer.add(text);
    }

    const points = [50, 50, 100, 100, 150, 50, 200, 100];

    // Twórz obiekt Line
    const polygon = new Konva.Line({
      points: points,
      fill: 'green',
      closed: true, // Zamknij wielokąt,
      draggable: true,
    });

    // Dodaj wielokąt do warstwy
    this.layer.add(polygon);

    this.stage.add(this.layer);

    const canvasElement = this.myKonva.nativeElement.querySelector('canvas');
    if (canvasElement) {
      canvasElement.style.border = '2px solid #000'; // Dodaj ramkę do canvasu
    }
  }

  ngOnInit(): void {
    for (let index = 1; index < 50; index++) {
      this.items.push({ id: uuidv4(), name: `Sektor ${index}`, items: [] });
    }

    for (const item2 of this.items) {
      for (let index = 1; index < 11; index++) {
        item2.items.push({
          id: uuidv4(),
          name: `${item2.name}-Dział ${index}`,
          items: [],
        });
      }

      for (const item3 of item2.items) {
        for (let index = 1; index < 15; index++) {
          item3.items.push({
            id: uuidv4(),
            name: `${item3.name}-Regał ${index}`,
            items: [],
          });
        }

        for (const item4 of item3.items) {
          for (let index = 1; index < Math.floor(Math.random() * 21); index++) {
            item4.items.push({
              id: uuidv4(),
              name: `${item4.name}-Półka ${index}`,
              items: [],
            });
          }
        }
      }
    }

    this.dataSource.data = this.items;

    this.flat();
  }

  flat() {
    for (const item1 of this.items) {
      if (item1.items.length === 0) {
        this.flatItems.push({ id: uuidv4(), s1: item1.name });
      }

      for (const item2 of item1.items) {
        if (item2.items.length === 0) {
          this.flatItems.push({ id: uuidv4(), s1: item1.name, s2: item2.name });
        }
        for (const item3 of item2.items) {
          if (item3.items.length === 0) {
            this.flatItems.push({
              id: uuidv4(),
              s1: item1.name,
              s2: item2.name,
              s3: item3.name,
              color: this.colorDiv(),
            });
          }

          for (const item4 of item3.items) {
            this.flatItems.push({
              id: uuidv4(),
              s1: item1.name,
              s2: item2.name,
              s3: item3.name,
              s4: item4.name,
              color: this.colorDiv(),
            });
          }
        }
      }
    }

    // const data = [...this.flatItems];
    // this.originalFlatItems = [...this.flatItems];
    // this.flatItems = [...data.slice(0, data.length / 2)];

    // setTimeout(() => {
    //   this.flatItems.push(...data.slice(data.length / 2, data.length));
    // }, 5000);
  }

  colorDiv() {
    const randomIndex = Math.floor(
      Math.random() * this.predefinedColors.length
    );
    return this.predefinedColors[randomIndex];
  }

  async handleCheckboxChange() {
    // this.loading = true;

    const colors = this.predefinedColorsList
      .filter((x) => x.selected)
      .map((x) => x.color);

    // let data: FlatMyItem[];
    if (colors.length === 0) {
      this.flatItems = [...this.originalFlatItems];
    } else {
      this.flatItems = [
        ...this.originalFlatItems.filter((x) => colors.includes(x.color!)),
      ];
    }

    // this.flatItems = [];

    // const chunkSize = 1000;

    // for (let i = 0; i < data.length; i += chunkSize) {
    //   const chunk = data.slice(i, i + chunkSize);
    //   this.flatItems.push(...chunk);
    //   console.log('addding...');
    //   await this.myWait();
    // }

    // this.loading = false;
  }

  myWait() {
    return new Promise((resolve) => setTimeout(resolve, 1000));
  }

  trackByFn(index: number, item: any): any {
    return item.id; // Use a unique identifier for your items
  }
}
