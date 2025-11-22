import dynamic from 'next/dynamic';

// Avoid Next.js SSR issues by dynamically importing the SPA App with ssr disabled
const SPA = dynamic(() => import('../src/App'), { ssr: false });

export default function IndexPage() {
  return <SPA />;
}
