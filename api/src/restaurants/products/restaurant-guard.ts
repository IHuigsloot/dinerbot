import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { RestaurantsService } from 'src/restaurants/restaurants.service';

@Injectable()
export class RestaurantGuard implements CanActivate {
  constructor(
    @Inject('RestaurantsService')
    private readonly restaurantService: RestaurantsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const restaurant = await this.restaurantService.findOne(
      request.params.restaurant,
    );
    request.restaurant = restaurant;

    return !!request.restaurant;
  }
}
