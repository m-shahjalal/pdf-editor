import { useEffect, useState } from 'react';

interface PDFListProps {
	data: string;
	handleActive: (blob: any) => void;
}

const PDFViewer = ({ data, handleActive }: PDFListProps) => {
	const [pdfURL, setPdfURL] = useState('');
	const [blob, setBlob] = useState<Blob | null>(null);

	useEffect(() => {
		const base64 = data.split(',')[1];
		const pdfData = atob(base64);

		const pdfBlob = new Blob([new Uint8Array(Array.from(pdfData, (c) => c.charCodeAt(0)))], {
			type: 'application/pdf',
		});

		setBlob(pdfBlob);
		const pdfURL = URL.createObjectURL(pdfBlob);

		setPdfURL(pdfURL);

		return () => {
			URL.revokeObjectURL(pdfURL);
		};
	}, [data]);

	return (
		<div className='rounded-lg iframe'>
			<iframe title="PDF Viewer" width="100%" height="500" src={pdfURL}></iframe>
			<div className='flex justify-end btn-group'>
				<button className='btn-edit' onClick={() => blob !== null && handleActive(blob)}>✏️</button>
			</div>
		</div>
	);
};

export default PDFViewer;
