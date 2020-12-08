import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
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

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      dest: './files',
    }),
  )
  update(
    @Param('id') id: string,
    @Body() createRestaurantDto: CreateRestaurantDto,
    @UploadedFile() image,
  ) {
    if (image) {
      createRestaurantDto.image = image.filename;
    }
    return this.restaurantService.updateOne(id, createRestaurantDto);
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
    this.restaurantService
      .findOne(id)
      .then((restaurant) => {
        if (restaurant.image) {
          return res.sendFile(restaurant.image, { root: 'files' });
        } else {
          return res.sendFile('default', { root: 'files' });
        }
      })
      .catch(() => {
        return res
          .status(404)
          .send(
            new HttpException(
              'No logo found for this restaurant',
              HttpStatus.NOT_FOUND,
            ),
          );
      });
  }
}
