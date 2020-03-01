import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterlist'
})
export class FilterlistPipe implements PipeTransform {

  transform(array: any[], field: any): any {
    if(!array) return null;
    if(!field) return array;
    return array.filter(element => {
      return JSON.stringify(element).indexOf(field) >= 0;
    });
  }

}
