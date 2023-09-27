import React, { useEffect, useRef } from "react";

interface Props {
  page: Promise<any>;
}

const ReactComponent: React.FC<Props> = ({ page }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  let width = 0;
  let height = 0;

  function measure() {
    if (canvasRef.current) {
      const scale = canvasRef.current.clientWidth / width;
      // Do something with the 'scale' value if needed
    }
  }

  async function render() {
    try {
      const _page = await page;
      if (!canvasRef.current) return;

      const context = canvasRef.current.getContext("2d");
      if (!context) return;

      const viewport = _page.getViewport({ scale: 1, rotation: 0 });
      width = viewport.width;
      height = viewport.height;

      await _page.render({
        canvasContext: context,
        viewport,
      }).promise;
      measure();
      window.addEventListener("resize", measure);
    } catch (error) {
      console.error("Error rendering PDF:", error);
    }
  }

  useEffect(() => {
    render();
    return () => {
      window.removeEventListener("resize", measure);
    };
  }, []);

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

export default ReactComponent;
