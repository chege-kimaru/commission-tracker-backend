import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { Payment } from './model/payment.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { Investment } from 'src/investment/model/investment.model';
import { PaymentMiddleware } from './middleware/payment.middleware';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService],
  imports: [SequelizeModule.forFeature([Payment, Investment])],
})
export class PaymentModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PaymentMiddleware)
      .exclude(
        { method: RequestMethod.POST, path: 'payments' },
        { method: RequestMethod.GET, path: 'payments' }
      )
      .forRoutes(PaymentController);
  }
}
