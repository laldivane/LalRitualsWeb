import { PortableText as PortableTextComponent } from '@portabletext/react'

const components = {
  block: {
    normal: ({ children }: any) => <p className="mb-6">{children}</p>,
    h1: ({ children }: any) => <h1 className="text-4xl font-display mb-8">{children}</h1>,
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-2 border-crimson py-2 pl-6 italic text-crimson/90 font-display text-xl mb-8">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }: any) => <strong className="text-crimson">{children}</strong>,
  },
}

export default function PortableText({ value }: { value: any }) {
  return <PortableTextComponent value={value} components={components} />
}
