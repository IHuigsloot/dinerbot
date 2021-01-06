import { RestaurantsService } from 'src/restaurants/restaurants.service';
import { HttpService, Injectable } from '@nestjs/common';
import { PathingService } from 'src/pathing/pathing.service';

@Injectable()
export class RobotsService {
  constructor(
    private httpService: HttpService,
    private pathingService: PathingService,
    private restaurrantService: RestaurantsService,
  ) {}

  findNearestRobot(location) {
    const robot = {
      ip: '192.168.178.37',
      currentLocation: 'A8',
    };
    return Promise.resolve(robot);
  }

  async getRestaurantLocation(id) {
    const restaurant = await this.restaurrantService.findOne(id);
    return restaurant.location;
  }

  sendPathToRobot(ipAdress, startLocation, restaurantLocation, endLocation) {
    const pathToRestaurant = this.pathingService.findShortestPath(
      startLocation,
      restaurantLocation,
    );
    const pathToUser = this.pathingService.findShortestPath(
      restaurantLocation,
      endLocation,
    );

    const path = [...pathToRestaurant.actions, ...pathToUser.actions];

    this.httpService
      .post(`http://${ipAdress}/order`, {
        steps: path,
      })
      .subscribe((res) => {
        console.log(res.data);
      });
  }

  async startRobot(restaurant, endLocation) {
    const restaurantLocation = await this.getRestaurantLocation(restaurant);
    const nearestRobot = await this.findNearestRobot(restaurantLocation);

    this.sendPathToRobot(
      nearestRobot.ip,
      nearestRobot.currentLocation,
      restaurantLocation,
      endLocation,
    );
  }
}
