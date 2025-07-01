import { Injectable } from '@nestjs/common';

@Injectable()
export class FavoritesService {
  // Bạn có thể để trống hoặc thêm hàm tạm
  getAllFavorites() {
    return ['Favorite 1', 'Favorite 2'];
  }
}
