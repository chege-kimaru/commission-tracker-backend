import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { InvestmentController } from './investment.controller';
import { InvestmentService } from './investment.service';
import { Investment } from './model/investment.model';
import { InvestmentMiddleware } from './middleware/investment.middleware';
import { SequelizeModule } from '@nestjs/sequelize';
import { Investor } from 'src/investor/model/investor.model';

@Module({
  controllers: [InvestmentController],
  providers: [InvestmentService],
  imports: [SequelizeModule.forFeature([Investor, Investment])],
})
export class InvestmentModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(InvestmentMiddleware)
      .exclude(
        { method: RequestMethod.POST, path: 'investments' },
        { method: RequestMethod.GET, path: 'investments' },
        { method: RequestMethod.GET, path: 'investments/stats' }
      )
      .forRoutes(InvestmentController);
  }
}
