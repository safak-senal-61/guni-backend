declare namespace Express {
  export interface User {
    id: string;
    email: string;
    role: import('../common/enums/user-roles.enum').UserRole;
    sub?: string; // Added for JWT payload
    refreshToken?: string; // Added for refresh token strategy
  }

  export interface Request {
    user?: User;
  }
}