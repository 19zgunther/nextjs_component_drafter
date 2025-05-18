
import { cookies } from 'next/headers';
import { authService } from '../authService';
import { fileService } from '../fileService';

export async function GET() {
    // Get email from auth cookie
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('authCookie');
    const email = authService.getEmailFromAuthCookie(authCookie?.value);

    // Allow all users to access public files
    const files = fileService.getAllFiles(email);
    return Response.json(files);
}

export async function POST(req: Request) {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('authCookie');
    const email = authService.getEmailFromAuthCookie(authCookie?.value);

    // Only allow logged in users to save files
    if (!email) {
        return new Response("Unauthorized", { status: 401 });
    }

    const file = await req.json();

    // verify file has fileName, data, and public
    if (!file.fileName || !file.nodes || !file.edges || typeof file.isPublic !== 'boolean') {
        return new Response("Invalid file", { status: 400 });
    }

    fileService.saveFile(email, file);
    return new Response("File saved", { status: 200 });
}

export async function DELETE(req: Request) {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('authCookie');
    const email = authService.getEmailFromAuthCookie(authCookie?.value);

    if (!email) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { fileName } = await req.json();

    const file = fileService.getFile(email, fileName);
    if (!file) {
        return new Response("File not found, or you do not have permission to delete it", { status: 403 });
    }

    console.log("DELETE", fileName);
    fileService.deleteFile(email, fileName);
    return new Response("File deleted", { status: 200 });
}