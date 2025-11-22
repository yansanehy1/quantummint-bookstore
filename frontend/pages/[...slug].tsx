import dynamic from 'next/dynamic';
const SPA = dynamic(() => import('../src/App'), { ssr: false });
export default function CatchAll() {
  return <SPA />;
}