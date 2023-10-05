import { BadRequestException, Injectable } from '@nestjs/common';
import { Payment } from './model/payment.model';
import { CreatePaymentDto, UpdatePaymentDto } from './dto/payment.dto';
import { Investment } from 'src/investment/model/investment.model';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/auth/model/user.model';
import { Investor } from 'src/investor/model/investor.model';

@Injectable()
export class PaymentService {
    constructor(
        @InjectModel(Payment) private paymentModel: typeof Payment,
        @InjectModel(Investment) private investmentModel: typeof Investment
    ) { }

    async addPayment(paymentDto: CreatePaymentDto, user: User): Promise<Payment> {
        try {
            const investment = await this.investmentModel.findOne({ where: { id: paymentDto.investmentId, userId: user.id } });
            if (!investment) throw new BadRequestException('Investment not found');
            return this.paymentModel.create({ ...paymentDto, userId: user.id });
        } catch (e) {
            throw e;
        }
    }

    updatePayment(payment: Payment, paymentDto: UpdatePaymentDto): Promise<Payment> {
        return payment.update(paymentDto);
    }

    getPayments(user: User): Promise<Payment[]> {
        return this.paymentModel.findAll({ where: { userId: user.id }, include: [{ model: Investment, include: [Investor] }] });
    }

    getPaymentById(paymentId: string): Promise<Payment> {
        return this.paymentModel.findByPk(paymentId);
    }

    getPaymentDetails(paymentId: string, user: User): Promise<Payment> {
        return this.paymentModel.findOne({ where: { id: paymentId, userId: user.id }, include: [{ model: Investment, include: [Investor] }] });
    }

    deletePayment(payment: Payment): Promise<void> {
        return payment.destroy();
    }
}
