export class Status {
  status: StatusEnum;
}

export enum StatusEnum {
  Created = 'created',
  Preparing = 'preparing',
  Prepared = 'prepared',
  Delivery = 'delivery',
  Delivered = 'delivered',
}
