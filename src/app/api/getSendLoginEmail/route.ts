import { authService } from "../authService";
import { emailService } from "../emailService";

// /api/sendLoginEmail?email=myemail@gmail.com
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    console.log("/api/sendLoginEmail email:", email);

    // confirm valid email
    if (!email || !String(email).includes('@')) {
        console.log("Invalid email");
        return new Response("Invalid email", { status: 400 });
    }

    const verifyToken = authService.getEmailVerifyToken(email);
    const url = new URL(req.url);
    const verifyLink = `${url.protocol}//${url.host}/api/getAuthCookie?verifyToken=${verifyToken}`;
    console.log("Sending login email to:", email);

    // send email
    emailService.sendEmail(
        email as string, 
        "Login to ComponentDrafter", 
        "Click the link to verify your email: " + verifyLink, 
        "<a href='" + verifyLink + "'>Verify your email</a>"
    );

    console.log("Email sent");
    return new Response("Email sent", { status: 200 });
}