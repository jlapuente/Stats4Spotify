import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'msToSeconds'
})
export class MsToSecondsPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return null;
  }

}
