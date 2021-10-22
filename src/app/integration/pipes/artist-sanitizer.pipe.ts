import { Pipe, PipeTransform } from '@angular/core';
const unidecode: any = require("unidecode")

@Pipe({
  name: 'artistSanitizer'
})
export class ArtistSanitizerPipe implements PipeTransform {
  transform(value: string): number {
    return unidecode(value);
  }

}
