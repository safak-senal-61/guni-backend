export declare class UploadsController {
    uploadFile(file: Express.Multer.File): {
        filename: string;
        originalname: string;
        size: number;
    };
}
