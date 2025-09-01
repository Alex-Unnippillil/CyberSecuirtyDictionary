import React, { useEffect, useRef, useState } from "react";

// Simple canvas based pull quote generator. Allows a user to type a quote,
// pick colors and font, and export the result as a PNG image using
// `HTMLCanvasElement.toDataURL`.
const fonts = ["serif", "sans-serif", "monospace", "cursive", "fantasy"];

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(" ");
  let line = "";
  const lines: string[] = [];

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      lines.push(line);
      line = words[n] + " ";
    } else {
      line = testLine;
    }
  }
  lines.push(line);

  const totalHeight = lines.length * lineHeight;
  let drawY = y - totalHeight / 2 + lineHeight / 2;
  for (const l of lines) {
    ctx.fillText(l.trim(), x, drawY);
    drawY += lineHeight;
  }
}

const PullQuoteGenerator: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [text, setText] = useState("Your pull quote here");
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [font, setFont] = useState(fonts[0]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = fgColor;
    ctx.font = `24px ${font}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    wrapText(ctx, text, width / 2, height / 2, width - 40, 30);
  }, [text, fgColor, bgColor, font]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "pull-quote.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div>
      <canvas ref={canvasRef} width={600} height={400} style={{ border: "1px solid #ccc" }} />
      <div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          style={{ width: "100%", marginTop: "1rem" }}
        />
      </div>
      <div style={{ marginTop: "1rem" }}>
        <label>
          Text Color:
          <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} />
        </label>
        <label style={{ marginLeft: "1rem" }}>
          Background Color:
          <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
        </label>
        <label style={{ marginLeft: "1rem" }}>
          Font:
          <select value={font} onChange={(e) => setFont(e.target.value)}>
            {fonts.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </label>
      </div>
      <button onClick={download} style={{ marginTop: "1rem" }}>
        Download PNG
      </button>
    </div>
  );
};

export default PullQuoteGenerator;

