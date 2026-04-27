import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST ?? 'mailhog',
    port: Number(process.env.MAIL_PORT ?? 1025),
    secure: false,
  });

  async sendPasswordResetEmail(input: { to: string; name: string; resetUrl: string }) {
    const from = process.env.MAIL_FROM ?? 'noreply@intradebas.local';

    await this.transporter.sendMail({
      from,
      to: input.to,
      subject: 'Recuperacao de senha - INTRADEBAS 2026',
      text: [
        `Ola, ${input.name}.`,
        '',
        'Recebemos uma solicitacao para redefinir sua senha administrativa.',
        `Use o link a seguir para cadastrar uma nova senha: ${input.resetUrl}`,
        '',
        'Se voce nao solicitou esta alteracao, ignore este e-mail.',
      ].join('\n'),
      html: `
        <p>Ola, ${input.name}.</p>
        <p>Recebemos uma solicitacao para redefinir sua senha administrativa.</p>
        <p><a href="${input.resetUrl}">Redefinir senha</a></p>
        <p>Se voce nao solicitou esta alteracao, ignore este e-mail.</p>
      `,
    });
  }
}
