import { Document } from "react-pdf";

type PDFViewerComponentProps = {
  file: File;
};

function PDFViewerComponent({ file }: PDFViewerComponentProps) {
  return (
    <div className="pdf-viewer">
      <Document file={file} />
    </div>
  );
}

export default PDFViewerComponent;
