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
    HasMany,
} from 'sequelize-typescript';
import { User } from 'src/auth/model/user.model';
import { Investor } from 'src/investor/model/investor.model';
import { Payment } from 'src/payment/model/payment.model';

@Table({ tableName: 'investments' })
export class Investment extends Model<Investment> {
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
    @ForeignKey(() => Investor)
    @Column({ type: DataType.UUIDV4, field: 'investor_id', allowNull: false })
    investorId: string;

    @BelongsTo(() => Investor)
    investor: Investor;

    @NotNull
    @Column({ allowNull: false })
    project: string;

    @NotNull
    @Column({ allowNull: false })
    typology: string;

    @NotNull
    @Column({ field: 'unit_number', allowNull: false })
    unitNumber: string;

    @NotNull
    @Column({ field: 'commission_percentage', allowNull: false })
    commissionPercentage: number;

    @NotNull
    @Column({ allowNull: false })
    price: number;

    @CreatedAt
    @Column({ field: 'created_at' })
    createdAt: Date;

    @UpdatedAt
    @Column({ field: 'updated_at' })
    updatedAt: Date;

    @HasMany(() => Payment)
    payments: Payment[];
}
