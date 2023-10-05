import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { InvestmentService } from '../investment.service';

@Injectable()
export class InvestmentMiddleware implements NestMiddleware {
    constructor(private investmentService: InvestmentService) {
    }

    async use(req: any, res: Response, next: Function) {
        try {
            const investment = await this.investmentService.getInvestmentById(req.params.investmentId);
            if (investment?.id) {
                req.Investment = investment;
                next();
            } else {
                throw new NotFoundException('Investment not found');
            }
        } catch (e) {
            throw e;
        }
    }
}