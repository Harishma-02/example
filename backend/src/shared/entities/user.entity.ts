export class UserEntity {
  id: number;
  name: string;
  email: string;
  password: string;

  createAt: Date;
  createdBy: string;

  updatedAt: Date;
  updatedBy: string;
}
