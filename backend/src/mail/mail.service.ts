import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

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

  async sendSponsorPortalAccessEmail(input: {
    to: string;
    name: string;
    companyName: string;
    portalUrl: string;
  }) {
    const from = process.env.MAIL_FROM ?? 'noreply@intradebas.local';

    await this.transporter.sendMail({
      from,
      to: input.to,
      subject: 'Acesso ao portal do patrocinador - INTRADEBAS 2026',
      text: [
        `Ola, ${input.name}.`,
        '',
        `Seu acesso ao portal do patrocinador da ${input.companyName} esta disponivel no link abaixo:`,
        input.portalUrl,
        '',
        'Se voce nao reconhece esta solicitacao, ignore este e-mail.',
      ].join('\n'),
      html: `
        <p>Ola, ${input.name}.</p>
        <p>Seu acesso ao portal do patrocinador da <strong>${input.companyName}</strong> esta disponivel no link abaixo:</p>
        <p><a href="${input.portalUrl}">Abrir portal do patrocinador</a></p>
        <p>Se voce nao reconhece esta solicitacao, ignore este e-mail.</p>
      `,
    });
  }

  async sendAthleteRegistrationConfirmationEmail(input: {
    to: string;
    name: string;
    confirmationUrl: string;
  }) {
    const from = process.env.MAIL_FROM ?? 'noreply@intradebas.local';

    await this.transporter.sendMail({
      from,
      to: input.to,
      subject: 'Confirme sua inscricao - INTRADEBAS 2026',
      text: [
        `Ola, ${input.name}.`,
        '',
        'Recebemos sua inscricao no INTRADEBAS 2026.',
        'Confirme seu e-mail para liberar sua area do atleta:',
        input.confirmationUrl,
        '',
        'Se voce nao fez esta inscricao, ignore este e-mail.',
      ].join('\n'),
      html: `
        <p>Ola, ${input.name}.</p>
        <p>Recebemos sua inscricao no INTRADEBAS 2026.</p>
        <p><a href="${input.confirmationUrl}">Confirmar inscricao e abrir area do atleta</a></p>
        <p>Se voce nao fez esta inscricao, ignore este e-mail.</p>
      `,
    });
  }
}
