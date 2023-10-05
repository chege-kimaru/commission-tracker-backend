import { BadRequestException, Injectable } from '@nestjs/common';
import { Investment } from './model/investment.model';
import { Payment } from 'src/payment/model/payment.model';
import { Investor } from 'src/investor/model/investor.model';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/auth/model/user.model';
import { CreateInvestmentDto, UpdateInvestmentDto } from './dto/investment.dto';
import * as moment from 'moment';

@Injectable()
export class InvestmentService {
    constructor(
        @InjectModel(Investment) private investmentModel: typeof Investment,
        @InjectModel(Investor) private investorModel: typeof Investor
    ) { }

    async addInvestment(investmentDto: CreateInvestmentDto, user: User): Promise<Investment> {
        try {
            const investor = await this.investorModel.findOne({ where: { id: investmentDto.investorId, userId: user.id } });
            if (!investor) throw new BadRequestException('Investor not found');
            return this.investmentModel.create({ ...investmentDto, userId: user.id });
        } catch (e) {
            throw e;
        }
    }

    updateInvestment(investment: Investment, investmentDto: UpdateInvestmentDto): Promise<Investment> {
        return investment.update(investmentDto);
    }

    getInvestments(user: User): Promise<Investment[]> {
        return this.investmentModel.findAll({ where: { userId: user.id }, include: [Investor] });
    }

    getInvestmentById(investmentId: string): Promise<Investment> {
        return this.investmentModel.findByPk(investmentId);
    }

    async getInvestmentDetails(investmentId: string, user: User): Promise<any> {
        try {
            let investment = await this.investmentModel.findOne({ where: { id: investmentId, userId: user.id }, include: [Payment, Investor] });
            return this.calculateInvestmentStats(investment);
        } catch (e) {
            throw e;
        }
    }

    deleteInvestment(investment: Investment): Promise<void> {
        return investment.destroy();
    }

    async getInvestmentsStats(user: User) {
        try {
            const data = { thisMonthTotalCommission: 0, investments: [] };
            const investments = await this.investmentModel.findAll({ where: { userId: user.id }, include: [Investor, {model: Payment, order: ['paidOn', 'DESC']}] });
            for (const investment of investments) {
                const investmentStat = this.calculateInvestmentStats(investment);
                data.investments.push(investmentStat);
                data.thisMonthTotalCommission += investmentStat.thisMonthCommission;
            }
            return data;
        } catch (e) {
            throw e;
        }
    }

    calculateInvestmentStats(investment: Investment) {
        const investmentStat: any = { investor: investment.investor, investment: investment };

        const totalPayments = investment.payments.reduce((acc, payment) => acc + payment.amount, 0);
        investmentStat.totalPayments = totalPayments;

        const percentagePaid = totalPayments / investment.price * 100;
        investmentStat.percentagePaid = percentagePaid;

        const twentyPercent = investment.price * 20 / 100;
        investmentStat.twentyPercent = twentyPercent;

        const balanceToTwentyPercent = twentyPercent - totalPayments;
        investmentStat.balanceToTwentyPercent = balanceToTwentyPercent >= 0 ? balanceToTwentyPercent : 0;

        const startDate = this.getSecondLastFriday(moment().subtract(1, 'month')).add(1, 'day').startOf('day');
        investmentStat.startDate = startDate;

        const endDate = this.getSecondLastFriday().endOf('day');
        investmentStat.endDate = endDate;

        const thisMonthPayments = investment.payments.filter(payment => moment(payment.paidOn).isBetween(startDate, endDate));
        investmentStat.thisMonthPayments = thisMonthPayments;

        const thisMonthPaymentsTotal = thisMonthPayments.reduce((acc, payment) => acc + payment.amount, 0);
        investmentStat.thisMonthPaymentsTotal = thisMonthPaymentsTotal;

        let thisMonthCommission = 0;
        if(balanceToTwentyPercent >= 0) {
            thisMonthCommission = thisMonthPaymentsTotal * investment.commissionPercentage / 100;
        } else if(totalPayments - thisMonthPaymentsTotal >= twentyPercent) {
            thisMonthCommission = 0;
        } else {
            const extra = totalPayments - twentyPercent;
            const commissionFrom = thisMonthPaymentsTotal - extra;
            thisMonthCommission = commissionFrom * investment.commissionPercentage / 100;
        }
        investmentStat.thisMonthCommission = thisMonthCommission;

        // sort payments by paidOn date
        investment.payments.sort((a, b) => moment(a.paidOn).isBefore(moment(b.paidOn)) ? 1 : -1);

        return investmentStat;
    }

    calculateCommission(investment: Investment) {
        const totalPayments = investment.payments.reduce((acc, payment) => acc + payment.amount, 0);
        const twentyPercent = investment.price * 20 / 100;
        const balanceToTwentyPercent = twentyPercent - totalPayments;
        if(balanceToTwentyPercent <= 0) {
            return 
        }
    }

    getSecondLastFriday(date?: moment.Moment): moment.Moment {
        let fridayCount = 0;
        let day = (date ? date : moment()).endOf('month').startOf('day');
        while (true) {
            day = day.subtract(1, 'day');
            if (day.day() === 5) fridayCount++;
            if (fridayCount === 2) return day;
        }
    }
}
