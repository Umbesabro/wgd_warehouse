import { Injectable } from '@nestjs/common';
import { JsDatabase } from 'src/db/plain-js-in-mem-db/js-database';

@Injectable()
export class QueueService {
  constructor(private readonly database: JsDatabase) {}
}
