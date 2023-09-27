import { useEffect, useRef, useState } from 'react';

interface EditModalProps {
    data: string;
    handleClose: () => void;
    image: File | null;
    text: string;
}

const EditModal = ({ data, handleClose, image, text }: EditModalProps) => {
    console.log(image, text)
    const canvasRefs = useRef<Array<HTMLCanvasElement | null>>([]);
    const [activePage, setActivePage] = useState(1);
    const [pages, setPages] = useState([]);

    useEffect(() => {
        const pdfjsLib = window['pdfjs-dist/build/pdf'];
        pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';

        const loadingTask = pdfjsLib.getDocument({ data });
        loadingTask.promise.then(function (pdf: any) {
            console.log('PDF loaded');

            const numPages = pdf.numPages;
            const pagePromises = [];

            for (let i = 1; i <= numPages; i++) {
                pagePromises.push(pdf.getPage(i));
            }

            Promise.all(pagePromises).then((pages) => {
                setPages(pages);
            });
        }, function (reason: unknown) {
            console.error(reason);
        });
    }, [data])

    const renderPage = (page: any, index: number) => {
        const canvas = canvasRefs.current[index];
        if (canvas) {
            const scale = 1.4;
            const viewport = page.getViewport({ scale });
            const context = canvas.getContext('2d')!;

            canvas.height = viewport.height;
            canvas.width = viewport.width;

            context.clearRect(0, 0, canvas.width, canvas.height);

            const renderContext = {
                canvasContext: context,
                viewport: viewport
            };

            const renderTask = page.render(renderContext);
            renderTask.promise.then(function () {
                console.log(`Page ${index + 1} rendered`);
            });
        }
    };

    useEffect(() => {
        pages.forEach((page, index) => {
            renderPage(page, index);
        });
    }, [pages]);

    return (
        <div className="flex flex-col justify-between items-stretch h-full">
            <div className="flex justify-between mb-4 text-xl">
                <div>Edit PDF</div>
                <div onClick={handleClose} className="relative bottom-2 font-mono text-xl bg-red-500 text-white cursor-pointer w-6 h-6 justify-center flex items-center rounded-full">x</div>
            </div>

            <div className='p-4 rounded-lg my-4'>
                {pages.map((page, index) => (
                    <canvas
                        onClick={() => setActivePage(index + 1)}
                        className={`border-gray-500 ${activePage === index + 1 ? 'border-blue-500 border-2' : ''}`}
                        key={index}
                        ref={(canvas) => (canvasRefs.current[index] = canvas)} // Assign the ref to the corresponding index
                        id={`canvas-${index}`}
                    ></canvas>))}
            </div>

            <div className="flex gap-3 mb-4">
                <button className="btn-primary justify-self-end" onClick={handleClose}>Save</button>
                <button className="btn-danger justify-self-end" onClick={handleClose}>Close</button>
            </div>
        </div>
    )
}

export default EditModal
