import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';

export default function CTABanner({ headline, subCopy, primaryLabel, primaryHref, secondaryLabel, secondaryHref }) {
  return (
    <section className="w-full py-24 md:py-32">
      <div className="section-container">
        <div className="card-bezel">
          <div className="card-bezel-inner text-center py-20 md:py-24">
            {/* Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] rounded-full bg-accent/[0.06] blur-[80px] pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-extrabold text-snow tracking-[-0.04em] leading-[1.3] mb-7">
                {headline}
              </h2>
              {subCopy && (
                <p className="text-silver text-[15px] leading-[1.9] mb-12 max-w-xl mx-auto text-center">{subCopy}</p>
              )}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                <Link to={primaryHref}>
                  <button className="cta-pulse group inline-flex items-center gap-3 px-9 py-4 rounded-2xl bg-gradient-to-r from-accent-deep via-accent-glow to-accent font-semibold text-white text-[15px] transition-all duration-300 hover:shadow-[0_0_60px_rgba(139,92,246,0.4)] hover:scale-[1.03] active:scale-[0.98] cursor-pointer">
                    {primaryLabel}
                    <Icon icon="solar:arrow-right-bold" className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </Link>
                {secondaryLabel && secondaryHref && (
                  <Link to={secondaryHref}>
                    <button className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl border border-white/[0.08] text-silver text-[15px] font-medium hover:bg-white/[0.04] hover:text-pearl transition-all duration-300 cursor-pointer">
                      {secondaryLabel}
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
