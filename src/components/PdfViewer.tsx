import { useEffect, useRef, useState } from "react";

export function PdfViewer({ url }: { url: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const pdfjs = await import("pdfjs-dist");
        const worker = await import("pdfjs-dist/build/pdf.worker.min.mjs?url");
        pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
        const pdf = await pdfjs.getDocument({ url: new URL(url, window.location.href).href }).promise;
        const box = ref.current;
        if (!box || cancelled) return;
        box.innerHTML = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const scale = (box.clientWidth / page.getViewport({ scale: 1 }).width) * window.devicePixelRatio;
          const vp = page.getViewport({ scale });
          const canvas = document.createElement("canvas");
          canvas.width = vp.width;
          canvas.height = vp.height;
          canvas.className = "w-full h-auto rounded-lg shadow-sm bg-card";
          box.appendChild(canvas);
          await page.render({ canvasContext: canvas.getContext("2d")!, viewport: vp, canvas }).promise;
          if (cancelled) return;
        }
        setStatus("ready");
      } catch (e) {
        console.error(e);
        if (!cancelled) setStatus("error");
      }
    })();
    return () => { cancelled = true; };
  }, [url]);

  return (
    <div>
      {status === "loading" && <p className="text-muted-foreground">Loading document…</p>}
      {status === "error" && <p className="text-destructive">Couldn't load the preview — please use Download instead.</p>}
      <div ref={ref} className="space-y-4" />
    </div>
  );
}
