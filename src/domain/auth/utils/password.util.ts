import { compare, hash } from 'bcrypt';

export class PasswordUtil {
  static createHash(password: string): Promise<string> {
    return hash(password, 10);
  }

  static validate(password: string, hashedPassword: string): Promise<boolean> {
    return compare(password, hashedPassword);
  }
}
