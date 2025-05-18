import { FlowFile } from "../components/interfaces";


class FileService {
    /**
     * NOTE: This is a temporary in-memory volatile file service. It should be replaced with a database in the future.
     */

    private files: { [key: string]: FlowFile } = {};

    constructor() {
        this.files = {};
    }

    getFile(email: string, fileName: string): FlowFile | null {
        const file = this.files[email + fileName];
        if (!file) {
            return null;
        }
        return file;
    }

    getAllFiles(email: string): FlowFile[] {
        return Object.values(this.files).filter(file => file.email === email || file.isPublic);
    }

    saveFile(email: string, file: FlowFile): void {
        file.email = email;
        this.files[email + file.fileName] = file;
    }

    deleteFile(email: string, fileName: string): void {
        delete this.files[email + fileName];
    }
}

const fileService = new FileService();

export { fileService };

