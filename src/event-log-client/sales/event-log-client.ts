import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { EventDto } from '../../dto/event.dto';
import { SalesOrderDto } from '../../dto/sales-order.dto';
import { QUEUES } from '../../queue/queues';
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
