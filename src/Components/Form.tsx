import axios from "axios";
import { useEffect, useState } from "react";

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
        if (!form.file) return setForm({ ...form, error: 'Please select a file' })

        const formData = new FormData();
        [...form.file as any].forEach((file: any) => {
            formData.append('pdf', file)
        })
        const response = await axios.post('http://localhost:5173', formData, {
            onUploadProgress: ({ loaded, total = 0 }) => {
                let percent = Math.floor((loaded * 100) / total);
                setForm(prev => ({ ...prev, loading: true, error: '', progress: percent }))
            }
        })

    }

    useEffect(() => {
        console.log(form.progress)
    }, [form.progress])

    return (
        <form className="mt-4a gap-2" onSubmit={handleSubmit}>
            <label className="border text-white w-96 block rounded px-3 py-2 cursor-pointer" htmlFor="pdf">
                Upload PDF ...
                <input onChange={handleFileChange} className="hidden" type="file" name="pdf" id="pdf" />
            </label>

            {form.file && (
                <div className="border p-2 my-3 rounded">
                    {
                        [...form.file as any].map((file: any, index: number) => {
                            return <p key={file.name} className="text-white py-1 flex justify-start items-center gap-2">
                                <span className="bg-indigo-400 w-6 h-6 rounded-full flex justify-center items-start">{index + 1}</span>
                                <span className="flex-1">{file.name}</span>
                            </p>
                        })
                    }
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