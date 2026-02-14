import { useEffect, useRef, useState } from 'react';

export default function Visualizer({ data, color, imageUrl }: { data: number[], color?: string, imageUrl?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [extractedColor, setExtractedColor] = useState<string | undefined>(undefined);

  // Color Extraction Logic
  useEffect(() => {
    if (color) return; // If we have a color prop, no need to extract
    if (!imageUrl) return;

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imageUrl;

    img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.drawImage(img, 0, 0, 1, 1);
            try {
                const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
                setExtractedColor(`rgb(${r},${g},${b})`);
            } catch (e) {
                // partial support or cors issue
            }
        }
    };
  }, [imageUrl, color]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Determine finalized color
    const finalColor = color || extractedColor;

    // Parse Color
    let r = 220, g = 20, b = 60; // Default Crimson
    
    if (finalColor) {
        if (finalColor.startsWith('#')) {
            const hex = finalColor.replace('#', '');
            const bigint = parseInt(hex, 16);
            r = (bigint >> 16) & 255;
            g = (bigint >> 8) & 255;
            b = bigint & 255;
        } else if (finalColor.startsWith('rgb')) {
            const match = finalColor.match(/\d+/g);
            if (match && match.length >= 3) {
                r = parseInt(match[0], 10);
                g = parseInt(match[1], 10);
                b = parseInt(match[2], 10);
            }
        }
    }

    // Auto-Brighten / Neon-ize the color
    // If the color is too dark, the visualizer won't be visible on the dark background.
    // We boost the brightness while preserving the hue.
    const maxVal = Math.max(r, g, b);
    if (maxVal < 200 && maxVal > 0) {
        const boost = 255 / maxVal;
        r = Math.min(255, Math.floor(r * boost));
        g = Math.min(255, Math.floor(g * boost));
        b = Math.min(255, Math.floor(b * boost));
    }
    // Ensure we don't end up with pure white or black if something went wrong
    if (r < 50 && g < 50 && b < 50) {
        r = 220; g = 20; b = 60; // Fallback to Crimson if result is too dark
    }

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.5; // Base radius

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Subtle base circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius - 5, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(255, 255, 255, 0.05)`;
    ctx.stroke();

    // 4-Lobe "Full Circle" Symmetry
    // Peaks at N, S, E, W. Troughs at NE, SE, SW, NW.
    
    // 1. Focus on the active frequency range
    const activeData = data.slice(0, 24); 
    
    // 2. Create one "Mountain" lobe
    const lobe = [...[...activeData].reverse(), ...activeData];
    
    // 3. Repeat 4 times
    const mirroredData = [...lobe, ...lobe, ...lobe, ...lobe];
    
    const bars = mirroredData.length;
    const step = (Math.PI * 2) / bars;

    // Background mask
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius - 2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(10, 10, 10, 0.8)'; 
    ctx.fill();

    mirroredData.forEach((value, i) => {
      // value is 0-255
      const barHeight = 4 + (value / 255) * 120; 
      
      const angle = i * step - (Math.PI / 2) - (Math.PI / 4);

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle);

      // Bar Style
      const alpha = Math.max(0.1, value / 255);
      
      // Dynamic Glow
      ctx.shadowBlur = 10;
      ctx.shadowColor = `rgba(${r}, ${g}, ${b}, ${alpha})`;
      
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`; 
      
      const barWidth = (Math.PI * 2 * radius / bars) * 1.1; 
      ctx.fillRect(-barWidth/2, radius, barWidth, barHeight);

      if (value > 40) {
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.5})`;
        ctx.fillRect(-barWidth/2, radius, barWidth, 2);
      }

      ctx.restore();
    });

  }, [data, color]);

  return (
    <canvas 
      ref={canvasRef} 
      width={1000} 
      height={1000} 
      className="w-full h-full object-contain opacity-90"
    />
  );
}
