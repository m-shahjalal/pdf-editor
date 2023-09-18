import axios from "axios";
import { useState } from "react";


const useUpload = async ({ data, url = 'http://localhost:5173', options = {} }: UploadType) => {
    const [response, setResponse] = useState<UploadResponseType>({
        data: null,
        error: '',
        loading: false,
        progress: 0
    })

    setResponse({ ...response, loading: true })
    try {
        const response = await axios.post(url, data, {
            ...options,
            onUploadProgress: ({ loaded, total = 0 }) => {
                let percent = Math.floor((loaded * 100) / total);
                setResponse(prev => ({ ...prev, progress: percent }))
            }
        })
        setResponse((prev) => ({ ...prev, data: response.data }))
    } catch (error) {
        setResponse({ ...response, error: 'Something went wrong' })
    } finally {
        setResponse({ ...response, loading: false })
    }

    return response;
};

export default useUpload;
