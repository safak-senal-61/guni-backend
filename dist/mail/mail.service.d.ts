import { ConfigService } from '@nestjs/config';
export declare class MailService {
    private configService;
    private transporter;
    constructor(configService: ConfigService);
    sendEmailVerification(email: string, token: string, firstName: string): Promise<void>;
    sendPasswordReset(email: string, token: string, firstName: string): Promise<void>;
    sendPasswordChangeConfirmation(email: string, firstName: string): Promise<void>;
    sendPasswordResetEmail(email: string, resetToken: string, firstName: string): Promise<void>;
    sendWelcomeEmail(email: string, firstName: string): Promise<void>;
}
