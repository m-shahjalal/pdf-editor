import { useEffect, useState } from "react";
import { readAsPDF } from "../utils/asyncReader";

interface EditModalProps {
    data: Blob | string;
    handleClose: () => void;
}

const EditModal = ({ data, handleClose }: EditModalProps) => {

    const [pdfDetails, setPdfDetails] = useState<{
        numPages: number;
        pageNumber: number;
        scale: number;
        filename: string;
        allObjects: any[];
        pagesScale: number[];
        pages: any[];
        selectPage?: number;
    }>({
        numPages: 0,
        pageNumber: 1,
        scale: 1,
        filename: 'data.pdf',
        pages: [],
        allObjects: [],
        pagesScale: [],
        selectPage: 1,
    });

    useEffect(() => {
        async function addPDF() {
            try {
                const pdf = await readAsPDF(data);
                console.log(pdf)

                console.log(pdf.numPages)

                setPdfDetails((prevState) => ({
                    ...prevState,
                    numPages: pdf.numPages,
                    pages: Array(pdf.numPages).fill(null).map((_, i): any => pdf.getPage(i + 1)),
                    allObjects: Array(pdf.numPages).fill(null).map(() => []),
                    pagesScale: Array(pdf.numPages).fill(1),
                    selectPage: 1,
                }));
            } catch (e) {
                console.log("Failed to add pdf.");
                throw e;
            }
        }
        addPDF();
    }, [data]);


    return (
        <div className="flex flex-col justify-between items-stretch h-full">










            {pdfDetails.pages.map((page, pIndex) => (
                <div
                    key={pIndex}
                    className="p-5 w-full flex flex-col items-center overflow-hidden"
                    onMouseDown={() => setPdfDetails({ ...pdfDetails, selectPage: pIndex })}
                    onTouchStart={() => setPdfDetails({ ...pdfDetails, selectPage: pIndex })}
                >
                    <div
                        className={`relative ${pIndex === pdfDetails.selectPage ? "shadow-outline" : ""
                            }`}
                    >
                        <PDFPage
                            onMeasure={(e) => onMeasure(e.detail.scale, pIndex)}
                            {...page}
                        />
                        <div
                            className="absolute top-0 left-0 transform origin-top-left"
                            style={{
                                transform: `scale(${pdfDetails.pagesScale[pIndex]})`,
                                touchAction: "none",
                            }}
                        >
                        </div>
                    </div>
                </div>
            ))}
























            <div className="flex gap-3">
                <button className="btn-primary justify-self-end" onClick={handleClose}>Save</button>
                <button className="btn-danger justify-self-end" onClick={handleClose}>Close</button>
            </div>
        </div>
    )
}

export default EditModal