interface FormStateType {
    file: FileList | File[] | null;
    error: string;
    loading: boolean;
    progress: number;
}