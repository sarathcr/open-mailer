import { UserFormInputs } from '../../schemas';
import { History } from './history';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  employeeId: string;
  isActive: boolean;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  histories?: History[];
}

export interface GetUsersQuery {
  users: User[];
}

export interface GetUser {
  user: User;
}

export interface CreateUserMutation {
  createUser: User;
}

export interface UpdateUserMutation {
  updateUser: User;
}

export interface SoftDeleteUser {
  softDeleteUser: User;
}

export interface UserFormProps {
  values: UserFormInputs;
  onClickSubmit?: () => void;
}
