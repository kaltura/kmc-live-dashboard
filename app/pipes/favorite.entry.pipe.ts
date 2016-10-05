import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'favoriteEntry'})
export class FavoriteEntryPipe implements PipeTransform {

  transform(value = ''): string {

    let favorite = value.indexOf('live-dashboard-favorite') >= 0 ? 'favorite.png' : 'not_favorite.png';

    return 'app/assets/content/common/' + favorite;
  }
}
