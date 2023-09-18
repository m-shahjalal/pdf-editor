interface UploadType {
    data: any;
    url: string;
    options: object | undefined;
}

interface UploadResponseType {
    data: any;
    error: string;
    loading: boolean;
    progress: number;
}