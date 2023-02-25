import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { EventDto } from 'src/dto/event.dto';
import { SalesOrderDto } from 'src/dto/sales-order.dto';
import { QUEUES } from 'src/queue/queues';
import { Config } from '../cfg/config';

@Injectable()
export class EventLogClient {
  async dispatchFailed(salesOrder: SalesOrderDto): Promise<EventDto> {
    const r = await axios.post(Config.createEventUrl, {
      payload: salesOrder,
      name: QUEUES.DISPATCH_FAILED,
    });
    return r.data;
  }

  async dispatchSuccessful(salesOrder: SalesOrderDto): Promise<EventDto> {
    const r = await axios.post(Config.createEventUrl, {
      payload: salesOrder,
      name: QUEUES.DISPATCH_SUCCESSFUL,
    });
    return r.data;
  }
}
