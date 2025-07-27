import { PrismaService } from '../prisma/prisma.service';
declare const JwtStrategy_base: new (...args: any) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly prisma;
    constructor(prisma: PrismaService);
    validate(payload: {
        sub: string;
        email: string;
    }): Promise<{
        sub: string;
        id: string;
        userId: string;
        email: string;
        role: import(".prisma/client").$Enums.UserRole;
    } | null>;
}
export {};
