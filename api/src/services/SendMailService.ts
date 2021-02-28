import nodemailer, { Transporter } from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';

class SendMailService {
  private client: Transporter;

  constructor() {
    nodemailer.createTestAccount().then((account) => {
      const transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      });

      this.client = transporter;
    });
  }

  async execute(to: string, subject: string, attributes: {}, path: string) {
    // retorna o buffer de leitura do arquivo como utf8
    const templateFileContent = fs.readFileSync(path).toString('utf8');

    // compila o buffer retornado anteriormente
    const mailTemplateParse = handlebars.compile(templateFileContent);

    // realiza o parse do template, passando as variaveis para o html/hbs
    const html = mailTemplateParse(attributes);

    // realiza envio do email
    const message = await this.client.sendMail({
      to,
      subject,
      html,
      from: 'NPS <no-reply@nps.com.br>',
    });

    console.log('Message sent: %s', message.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
  }
}

export default new SendMailService();
