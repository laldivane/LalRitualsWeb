'use client';

import dynamic from 'next/dynamic';

const PalettePageContent = dynamic(() => import('@/components/PalettePageContent'), { ssr: false });

export default function PalettePage() {
    return <PalettePageContent />;
}
