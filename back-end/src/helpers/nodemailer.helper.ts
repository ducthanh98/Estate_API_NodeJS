// @flow
import * as nodemailer from 'nodemailer';
import { SendMailOptions } from 'nodemailer';
import SMTPTransport = require('nodemailer/lib/smtp-transport');
import Mail = require('nodemailer/lib/mailer');
import { Logger } from '@nestjs/common';
import { MailTemplate } from '../constants/mail.constant';
import { from } from 'rxjs/internal/observable/from';
import { Observable } from 'rxjs';

export class NodeMailer {
    private transporter: Mail;
    constructor() {
        const transportOptions: SMTPTransport.Options = {
            host: process.env.MAIL_HOST,
            port: +process.env.MAIL_PORT,
            secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD,
            },
        };
        this.transporter = nodemailer.createTransport(transportOptions);
        this.verifyTransporter();
    }

    private verifyTransporter(): void {
        this.transporter.verify(err => {
            if (err) {
                return Logger.error(err.message, err.stack, 'Node Mailer');
            }
            return Logger.warn('The mail server has been started');
        });
    }

    sendMail(to, content, subject = MailTemplate.SUBJECT): Observable<any> {
        const options: SendMailOptions = {
            from: process.env.MAIL_USER,
            to,
            subject,
            html: content,
        };
        return from(this.transporter.sendMail(options));
    }

    createTemplate(content): string {
        return `${MailTemplate.EMAIL_CONFIRM_MSG_HEADER}<br/>
            <h3><a href=${content} target="blank">${content}<a/></h3>
            ${MailTemplate.EMAIL_CONFIRM_MSG_FOOTER}
        `;
    }
    createTemplateSubcribeMail(content): string {
        return `${MailTemplate.EMAIL_SUBCRIBE_MSG_HEADER}<br/>
            <h3><a href=${content} target="blank">${content}<a/></h3>
            ${MailTemplate.EMAIL_CONFIRM_MSG_FOOTER}
        `;
    }
}
