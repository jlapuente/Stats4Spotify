import { Pipe, PipeTransform } from '@angular/core';
const unidecode: any = require("unidecode")

@Pipe({
  name: 'characterSanitizer'
})
export class CharacterSanitizerPipe implements PipeTransform {
  transform(value: string): number {
    return unidecode(value).toLowerCase();
  }

}
