import nodemailer from 'nodemailer';


class EmailService {
    private transporter: nodemailer.Transporter | null;
    private email: string;

    constructor(email:string|undefined|null, password:string|undefined|null) {
        if (!email || !password) {
            // throw new Error("Email or password not provided");
            console.error("Failed to create email service");
            this.transporter = null;
            this.email = "";
            return;
        } else {
            this.transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                user: email,
                pass: password
            }
            });
            console.log("Email service created");
            this.email = email;
        }
    }

    /**
     * Send an email to the given email address.
     * @param to - the email address to send the email to
     * @param subject - the subject of the email
     * @param text - the text of the email
     * @param html - the html of the email
     */
    public sendEmail(to: string, subject: string, text: string, html: string) {
        console.log("Sending email; to:", to, "subject:", subject, "text:", text, "html:", html);
        if (this.transporter) {
            const mailOptions = {
                from: this.email,
                to: to,
                subject: subject,
                text: text,
                html: html
            };
        
            this.transporter.sendMail(mailOptions, (error: Error | null, info: nodemailer.SentMessageInfo) => {
                if (error) {
                    return console.error('Error while sending email:', error);
                }
                console.log('Email sent:', info.response);
            });
        }
    }
}

const emailService = new EmailService(process.env.EMAIL_USER, process.env.EMAIL_PASSWORD);

export { emailService };