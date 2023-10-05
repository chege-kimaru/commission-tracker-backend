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
import { Investment } from 'src/investment/model/investment.model';

@Table({ tableName: 'investors' })
export class Investor extends Model<Investor> {
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
    @Column({allowNull: false})
    name: string;

    @Column({field: 'tsavorite_number'})
    tsavoriteNumber: string;

    @CreatedAt
    @Column({ field: 'created_at' })
    createdAt: Date;

    @UpdatedAt
    @Column({ field: 'updated_at' })
    updatedAt: Date;

    @HasMany(() => Investment)
    investments: Investment[];
}
