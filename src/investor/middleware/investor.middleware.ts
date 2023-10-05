import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { InvestorService } from '../investor.service';

@Injectable()
export class InvestorMiddleware implements NestMiddleware {
    constructor(private investorService: InvestorService) {
    }

    async use(req: any, res: Response, next: Function) {
        try {
            const investor = await this.investorService.getInvestorById(req.params.investorId);
            if (investor?.id) {
                req.Investor = investor;
                next();
            } else {
                throw new NotFoundException('Investor not found');
            }
        } catch (e) {
            throw e;
        }
    }
}