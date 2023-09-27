import { useState } from "react";
import { readAsDataURL } from "../utils/asyncReader";
import axios, { AxiosProgressEvent } from "axios";

const Form = () => {
    const [form, setForm] = useState<FormStateType>({
        file: null,
        error: '',
        loading: false,
        progress: 0
    })

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            setForm({ ...form, file: form.file ? [...form.file, ...files] : files })
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (form.loading) return;
        setForm({ ...form, loading: true, error: '' });
        if (!form.file) return setForm({ ...form, error: 'Please select a file' });

        try {
            const files = Array.from(form.file);
            const dataPromises = files.map(async (file: File) => {
                return await readAsDataURL(file);
            });
            const dataArray = await Promise.all(dataPromises);
            await axios.post('http://localhost:8000/resource', dataArray, {
                onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                    console.log(progressEvent);
                    const progress = Math.round((progressEvent.loaded / (progressEvent.total ?? 1)) * 100);
                    setForm({ ...form, progress });
                }
            })
        } catch (error) {
            console.log(error);
            setForm({ ...form, error: 'Something went wrong' });
        } finally {
            setForm({ ...form, loading: false });
        }
    };

    return (
        <form className="mt-4a gap-2" onSubmit={handleSubmit}>
            <label className="border text-white w-96 block rounded px-3 py-2 cursor-pointer" htmlFor="pdf">
                Upload PDF ...
                <input onChange={handleFileChange} className="hidden" type="file" name="pdf" id="pdf" />
            </label>

            {form.file && (
                <div className="border p-2 my-3 rounded">
                    {
                        [...form.file].map((file, index: number) => {
                            return <p key={file.name} className="text-white py-1 flex justify-start items-center gap-2">
                                <span className="bg-indigo-400 w-6 h-6 rounded-full flex justify-center items-start">{index + 1}</span>
                                <span className="flex-1">{file.name}</span>
                            </p>
                        })
                    }
                </div>
            )}
            {form.progress > 0 && form.progress !== 100 && (
                <div className={`mt-4 ${form.progress > 0 && form.progress !== 100 ? 'block' : 'hidden'}`}>
                    <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                            <div>
                                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-teal-600 bg-teal-200">
                                    In Progress
                                </span>
                            </div>
                            <div className="text-right">
                                <span className="text-xs font-semibold inline-block text-white">
                                    {form.progress}%
                                </span>
                            </div>
                        </div>
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-teal-200">
                            <div
                                style={{ width: `${form.progress}%` }}
                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-teal-500 transition-all duration-100 ease-linear "
                            ></div>
                        </div>
                    </div>
                </div>

            )}

            {form.file && (
                <div className="flex gap-3 mt-4">
                    <button className="btn-primary" type="submit">Save</button>
                    <button className="btn-danger" type="button" onClick={() => setForm({ ...form, file: null })}>Cancel</button>
                </div>
            )}
        </form>
    )
}

export default Form;