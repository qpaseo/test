import { UserRow } from "../../types/entity/user.entity";
import { CreateUserInput } from "../../types/internal";

export interface IUserRepository {
  findByEmail(email: string): Promise<UserRow | null>;
  findById(id: string): Promise<UserRow | null>;
  create(input: CreateUserInput): Promise<UserRow>;
  update(id: string, updates: Partial<CreateUserInput>): Promise<UserRow>;
  delete(id: string): Promise<void>;
}
