import { Link } from 'react-router-dom';

export function LegalLayout({ title, lastUpdated, children }) {
  return (
    <div className="section-container max-w-3xl py-24 md:py-32">
      <div className="mb-12">
        <span className="text-accent text-[11px] font-semibold tracking-widest uppercase">Legal</span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-snow tracking-[-0.04em] mt-4 mb-3">{title}</h1>
        <p className="text-ash text-[13px]">최종 업데이트: {lastUpdated}</p>
      </div>
      <div>{children}</div>
    </div>
  );
}

export function LegalSection({ title, children }) {
  return (
    <div className="mb-10">
      <h2 className="text-ivory font-bold text-[16px] mb-4 pb-3 border-b border-white/[0.06]">{title}</h2>
      <div className="text-silver text-[13.5px] leading-[1.9] space-y-3">{children}</div>
    </div>
  );
}
