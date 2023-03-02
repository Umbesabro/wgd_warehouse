import { Test, TestingModule } from '@nestjs/testing';
import sinon from 'sinon';
import { Product } from '../db/model/product';
import { PsqlDatabase } from '../db/psql-database.service';
import { SalesOrderPositionDto } from '../dto/sales-order-position.dto';
import { SalesOrderDto } from '../dto/sales-order.dto';
import { EventLogClient } from '../event-log-client/sales/event-log-client';
import { ProductService } from './product.service';

function createProduct({ id, name, qty }) {
  const product: Product = sinon.createStubInstance(Product);
  product.id = id;
  product.name = name;
  product.qty = qty;
  return product;
}

function createSalesOrder(positions: Array<SalesOrderPositionDto>): SalesOrderDto {
  return {
    id: 1,
    deliveryDate: new Date(),
    orderDate: new Date(),
    positions: positions,
  };
}
describe('ProductService', () => {
  let productService: ProductService;
  let eventLogClient: EventLogClient;
  let psqlDatabase: PsqlDatabase;
  let psqlDatabaseStub;
  let eventLogClientStub;
  let sandbox: sinon.SinonSandbox;

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
    eventLogClientStub = sandbox.createStubInstance(EventLogClient);
    psqlDatabaseStub = sandbox.createStubInstance(PsqlDatabase);

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: EventLogClient, useValue: eventLogClientStub },
        { provide: PsqlDatabase, useValue: psqlDatabaseStub },
      ],
    }).compile();

    productService = moduleRef.get<ProductService>(ProductService);
    eventLogClient = moduleRef.get<EventLogClient>(EventLogClient);
    psqlDatabase = moduleRef.get<PsqlDatabase>(PsqlDatabase);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('dispatchProducts', () => {
    it('should dispatch successful order when products are on stock', async () => {
      const salesOrderDto: SalesOrderDto = createSalesOrder([
        { productId: 1, quantity: 1 },
        { productId: 2, quantity: 1 },
      ]);
      const product1: Product = createProduct({ id: 1, name: 'Product-1', qty: 20 });
      const product2: Product = createProduct({ id: 2, name: 'Product-2', qty: 20 });
      psqlDatabaseStub.findOneById.withArgs(1).resolves(product1);
      psqlDatabaseStub.findOneById.withArgs(2).resolves(product2);

      await productService.dispatchProducts(salesOrderDto);

      sinon.assert.calledWith(eventLogClientStub.dispatchSuccessful, salesOrderDto);
      sinon.assert.calledTwice(psqlDatabaseStub.update);
      sinon.assert.calledWith(psqlDatabaseStub.update.firstCall, sinon.match.has('id', product1.id));
      sinon.assert.calledWith(psqlDatabaseStub.update.secondCall, sinon.match.has('id', product2.id));
    });

    it('should dispatch failed order when products are not on stock', async () => {
      const product1QtyOnStock = 20;
      const salesOrderDto: SalesOrderDto = createSalesOrder([
        { productId: 1, quantity: product1QtyOnStock + 1},
        { productId: 2, quantity: 1 },
      ]);
      const product1: Product = createProduct({ id: 1, name: 'Product-1', qty: product1QtyOnStock });
      const product2: Product = createProduct({ id: 2, name: 'Product-2', qty: 20 });
      psqlDatabaseStub.findOneById.withArgs(1).resolves(product1);
      psqlDatabaseStub.findOneById.withArgs(2).resolves(product2);

      await productService.dispatchProducts(salesOrderDto);

      sinon.assert.calledWith(eventLogClientStub.dispatchFailed, salesOrderDto);
      sinon.assert.notCalled(psqlDatabaseStub.update);
    });
  });
});

