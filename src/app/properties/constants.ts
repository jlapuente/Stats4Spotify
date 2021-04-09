export class CONSTANTS {

  static readonly COLORS: string[] = ['rgba(84, 71, 140, 0.6)', 'rgba(44, 105, 154, 0.6)', 'rgba(4, 139, 168, 0.6)', 'rgba(13, 179, 158, 0.6)', 'rgba(22, 219, 147, 0.6)', 'rgba(131, 227, 119, 0.6)', 'rgba(185, 231, 105, 0.6)', 'rgba(239, 234, 90, 0.6)', 'rgba(241, 196, 83, 0.6)', 'rgba(242, 158, 76, 0.6)', 'rgba(255, 56, 100, 0.6)'];
  static readonly BORDER_COLORS: string[] = ['rgba(84, 71, 140, 1)', 'rgba(44, 105, 154, 1)', 'rgba(4, 139, 168, 1)', 'rgba(13, 179, 158, 1)', 'rgba(22, 219, 147, 1)', 'rgba(131, 227, 119, 1)', 'rgba(185, 231, 105, 1)', 'rgba(239, 234, 90, 1)', 'rgba(241, 196, 83, 1)', 'rgba(242, 158, 76, 1)', 'rgba(255, 56, 100, 1)'];
  static readonly SINGLE_ESCALE = 1;
  static readonly TEN_ESCALE = 10;
  static readonly FIVE_ESCALE = 5;
  static readonly assetsFolder: string = 'src/assets';
  static readonly mainFolder: string = '../..';
  static readonly videoFolder: string = '/assets/videos/';
}

export interface InfoNode {
  name: string;
  link?: string;
  children?: InfoNode[];
}

export class Card {
  img?: string;
  title: string;
  subtitle?: string;
  body?: string;
  link?: Link;
  constructor(img, title, subtitle, body, link) {
    this.img = img;
    this.title = title;
    this.subtitle = subtitle;
    this.body = body;
    this.link = link
  }
}
export class Link {
  text: string;
  href: string;
  constructor(text, href) {
    this.text = text;
    this.href = href;
  }
}
export class SelectOption {
  value: string;
  viewValue: string;
}
export class Commit {
  autor: string;
  fecha: Date;
  comentario: string;
  detalle: string;
  constructor(autor, fecha, descripcion: string) {
    this.autor = autor;
    this.fecha = fecha;
    if (descripcion.length > 50) {
      this.comentario = descripcion.substr(0, 50).trim() + "...";
    } else {
      this.comentario = descripcion;
    }
    this.detalle = descripcion;
  }
}