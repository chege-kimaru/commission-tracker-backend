import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Investor } from './model/investor.model';
import { InvestorDto } from './dto/investor.dto';
import { User } from 'src/auth/model/user.model';
import { Investment } from 'src/investment/model/investment.model';

@Injectable()
export class InvestorService {
    constructor(@InjectModel(Investor) private investorModel: typeof Investor) { }

    addInvestor(investor: InvestorDto, user: User): Promise<Investor> {
        return this.investorModel.create({ ...investor, userId: user.id });
    }

    updateInvestor(investor: Investor, investorDto: InvestorDto): Promise<Investor> {
        return investor.update(investorDto);
    }

    getInvestors(user: User): Promise<Investor[]> {
        return this.investorModel.findAll({ where: { userId: user.id }, include: [Investment] });
    }

    getInvestorById(investorId: string): Promise<Investor> {
        return this.investorModel.findByPk(investorId);
    }

    getInvestorDetails(investorId: string, user: User): Promise<Investor> {
        return this.investorModel.findOne({ where: { id: investorId, userId: user.id }, include: [Investment] });
    }

    deleteInvestor(investor: Investor): Promise<void> {
        return investor.destroy();
    }
}
