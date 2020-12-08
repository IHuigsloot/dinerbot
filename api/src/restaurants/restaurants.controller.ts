import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { imageFileFilter } from './image.utils';
import { RestaurantsService } from './restaurants.service';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private restaurantService: RestaurantsService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      dest: './files',
    }),
  )
  create(
    @Body() createRestaurantDto: CreateRestaurantDto,
    @UploadedFile() image,
  ) {
    if (image) {
      createRestaurantDto.image = image.filename;
    }
    return this.restaurantService.create(createRestaurantDto);
  }

  @Get()
  getAll() {
    return this.restaurantService.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.restaurantService.findOne(id);
  }

  @Get(':id/logo')
  getLogo(@Param('id') id: string, @Res() res) {
    this.restaurantService.findOne(id).then((restaurant) => {
      if (restaurant.image) {
        return res.sendFile(restaurant.image, { root: 'files' });
      } else {
        return res.sendFile('default', { root: 'files' });
      }
    });
  }
}
