import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { InvestorService } from './investor.service';
import { InvestorController } from './investor.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Investor } from './model/investor.model';
import { InvestorMiddleware } from './middleware/investor.middleware';

@Module({
  providers: [InvestorService],
  controllers: [InvestorController],
  imports: [SequelizeModule.forFeature([Investor])],
})
export class InvestorModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(InvestorMiddleware)
      .exclude(
        { method: RequestMethod.POST, path: 'investors' },
        { method: RequestMethod.GET, path: 'investors' }
      )
      .forRoutes(InvestorController);
  }
}
