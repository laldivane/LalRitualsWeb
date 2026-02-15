'use client';

import { useEffect, useState } from 'react';
import { client } from '@/sanity/lib/client';
import { urlForImage } from '@/sanity/lib/image';

// Simple color extraction implementation
function extractColor(img: HTMLImageElement): string {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '#000000';
    
    ctx.drawImage(img, 0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    
    // Auto-Brighten (Neon-ize) like in Visualizer
    const maxVal = Math.max(r, g, b);
    let finalR = r, finalG = g, finalB = b;
    
    if (maxVal < 200 && maxVal > 0) {
        const boost = 255 / maxVal;
        finalR = Math.min(255, Math.floor(r * boost));
        finalG = Math.min(255, Math.floor(g * boost));
        finalB = Math.min(255, Math.floor(b * boost));
    }
    
    return `#${((1 << 24) + (finalR << 16) + (finalG << 8) + finalB).toString(16).slice(1)}`;
}

export default function PalettePageContent() {
    const [rituals, setRituals] = useState<any[]>([]);
    const [paletteMap, setPaletteMap] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRituals = async () => {
            const data = await client.fetch(`*[_type == "ritual"] | order(releaseDate desc) {
                _id,
                title,
                slug,
                coverImage
            }`);
            setRituals(data);
            setLoading(false);
        };
        fetchRituals();
    }, []);

    const handleImageLoad = (id: string, title: string, e: any) => {
        const color = extractColor(e.target);
        setPaletteMap(prev => ({
            ...prev,
            [title.toLowerCase()]: color
        }));
    };

    const copyToClipboard = () => {
        const output = `  const MANUAL_COLOR_OVERRIDES: Record<string, string> = ${JSON.stringify(paletteMap, null, 4)};`;
        navigator.clipboard.writeText(output);
        alert('Renk haritası kopyalandı! Şimdi bunu VoidPlayer.tsx içine yapıştırabilirsin.');
    };

    if (loading) return <div className="p-20 text-white">Yükleniyor...</div>;

    return (
        <div className="min-h-screen bg-black text-white p-12 font-mono">
            <h1 className="text-4xl mb-8 text-crimson font-display">RİTÜEL RENK ANALİZ MERKEZİ</h1>
            
            <button 
                onClick={copyToClipboard}
                className="fixed top-12 right-12 bg-crimson text-white px-8 py-4 rounded-full text-xl hover:bg-white hover:text-black transition-all z-50 font-bold"
            >
                JSON KOPYALA
            </button>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {rituals.map((ritual) => {
                    let imgUrl = null;
                    if (ritual.coverImage) {
                        try {
                            imgUrl = typeof ritual.coverImage === 'string' 
                                ? ritual.coverImage 
                                : urlForImage(ritual.coverImage).url();
                        } catch (e) {
                            console.error('Skipping invalid image:', ritual.title);
                        }
                    }
                    const detectedColor = paletteMap[ritual.title.toLowerCase()];

                    return (
                        <div key={ritual._id} className="border border-white/20 p-4 rounded-xl bg-white/5">
                            <h3 className="text-xl mb-4 truncate">{ritual.title}</h3>
                            {imgUrl && (
                                <div className="relative group aspect-square mb-4">
                                    <img 
                                        src={imgUrl} 
                                        crossOrigin="anonymous"
                                        alt={ritual.title}
                                        className="w-full h-full object-cover rounded-lg"
                                        onLoad={(e) => handleImageLoad(ritual._id, ritual.title, e)}
                                    />
                                    <div 
                                        className="absolute inset-0 opacity-50"
                                        style={{ backgroundColor: detectedColor }}
                                    />
                                </div>
                            )}
                            <div className="flex items-center gap-4">
                                <div 
                                    className="w-12 h-12 rounded-full border-2 border-white"
                                    style={{ backgroundColor: detectedColor }} 
                                />
                                <span className="text-xl font-bold">{detectedColor || 'Analiz ediliyor...'}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-12 p-8 bg-gray-900 rounded-xl overflow-auto">
                <pre className="text-green-400">
                    {`const MANUAL_COLOR_OVERRIDES: Record<string, string> = ${JSON.stringify(paletteMap, null, 4)};`}
                </pre>
            </div>
        </div>
    );
}
