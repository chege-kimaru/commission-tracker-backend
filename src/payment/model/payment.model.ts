import {
    Column,
    CreatedAt,
    DataType,
    Default,
    IsUUID,
    Model,
    PrimaryKey,
    Table,
    UpdatedAt,
    BelongsTo,
    ForeignKey,
    NotNull,
} from 'sequelize-typescript';
import { User } from 'src/auth/model/user.model';
import { Investment } from 'src/investment/model/investment.model';

@Table({ tableName: 'payments' })
export class Payment extends Model<Payment> {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @IsUUID(4)
    @Column
    id: string;

    @NotNull
    @ForeignKey(() => User)
    @Column({ type: DataType.UUIDV4, field: 'user_id', allowNull: false })
    userId: string;

    @BelongsTo(() => User)
    user: User;

    @NotNull
    @ForeignKey(() => Investment)
    @Column({ type: DataType.UUIDV4, field: 'investment_id', allowNull: false })
    investmentId: string;

    @BelongsTo(() => Investment)
    investment: Investment;

    @NotNull
    @Column({type: DataType.DATEONLY, field: 'paid_on', allowNull: false})
    paidOn: Date;

    @NotNull
    @Column({allowNull: false})
    amount: number;

    @CreatedAt
    @Column({ field: 'created_at' })
    createdAt: Date;

    @UpdatedAt
    @Column({ field: 'updated_at' })
    updatedAt: Date;
}
