import React, { useEffect, useRef } from 'react';

interface Props {
    page: Promise<any>; // Replace 'any' with the actual type of 'page'
}

const ReactPDFViewer: React.FC<Props> = ({ page }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    let width = 0;
    let height = 0;

    const measure = () => {
        if (canvasRef.current) {
            // Implement your logic here for measuring if needed
        }
    };


    useEffect(() => {
        const render = async () => {
            const _page = await page;
            const context = canvasRef.current?.getContext('2d');
    
            if (_page && context) {
                const viewport = _page.getViewport({ scale: 1, rotation: 0 });
                width = viewport.width;
                height = viewport.height;
    
                await _page.render({
                    canvasContext: context,
                    viewport,
                });
    
                measure();
                window.addEventListener('resize', measure);
            }
        }
        render();

        return () => {
            window.removeEventListener('resize', measure);
        };
    }, [page]);

    return (
        <div>
            <canvas
                ref={canvasRef}
                className="max-w-full"
                style={{ width: `${width}px` }}
                width={width}
                height={height}
            />
        </div>
    );
};

export default ReactPDFViewer;
