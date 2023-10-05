import {
  IsEmail,
  Column,
  CreatedAt,
  DataType,
  Default,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
  Unique,
  UpdatedAt,
  BelongsToMany,
  HasOne,
  AllowNull,
  HasMany,
} from 'sequelize-typescript';
import { Role } from './role.model';
import { UserRole } from './user.role.model';

@Table({ tableName: 'users' })
export class User extends Model<User> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @IsUUID(4)
  @Column
  id: string;

  @Column
  name: string;

  @Unique
  @IsEmail
  @Column
  email: string;

  @Column
  phone: string;

  @Column
  provider: string;

  @Column({ field: 'provider_id' })
  providerId: string;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;

  @BelongsToMany(() => Role, () => UserRole)
  roles: Array<Role & { UserRole: UserRole }>;
}
