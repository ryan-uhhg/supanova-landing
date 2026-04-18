import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

export default function FounderNoteSection() {
  return (
    <section className="relative py-40 md:py-52 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/10 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-accent-deep/[0.04] blur-[160px]" />
      </div>

      <div className="relative z-10 section-container max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="card-bezel glow-accent"
        >
          <div className="card-bezel-inner relative py-16 px-8 md:px-20">
            {/* Left vertical accent bar */}
            <div className="absolute left-0 top-12 bottom-12 w-[2px] bg-gradient-to-b from-transparent via-accent/50 to-transparent rounded-full" />

            {/* Decorative quote mark */}
            <div className="absolute top-8 right-8 md:right-12 opacity-10">
              <Icon icon="solar:chat-round-like-bold-duotone" className="w-16 h-16 text-accent" />
            </div>

            {/* Label */}
            <div className="text-center mb-10">
              <span className="inline-block px-4 py-1.5 rounded-full border border-accent/15 bg-accent/[0.04] text-accent text-xs font-medium tracking-wider uppercase">
                Founder&rsquo;s Note
              </span>
            </div>

            {/* Quote title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-2xl md:text-3xl font-extrabold text-snow text-center tracking-tight mb-14 leading-[1.45]"
            >
              &ldquo;기획자의 시간은 텍스트 정리가 아닌,
              <br />
              <span className="bg-gradient-to-r from-accent-bright to-accent bg-clip-text text-transparent">
                결정
              </span>
              에 쓰여야 합니다.&rdquo;
            </motion.h2>

            {/* Body */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="max-w-xl mx-auto"
            >
              <p className="text-silver text-base md:text-lg leading-[2.05] text-center mb-10">
                복잡한 시스템을 설계해 온{' '}
                <span className="text-ivory font-medium">8년 차 UX 기획자</span>로서,
                정보 과잉이 기획자의 인지력을 어떻게 갉아먹는지 뼈저리게 경험했습니다.
              </p>
              <p className="text-silver text-base md:text-lg leading-[2.05] text-center mb-16">
                이 엔진은 단순한 프롬프트가 아닙니다.{' '}
                <span className="text-ivory font-medium">
                  파편화된 지식을 무기로 바꾸기 위해 제가 실무에서 쓰려고 직접 구축한 생존 도구
                </span>
                입니다.
              </p>

              {/* Founder signature area */}
              <div className="flex items-center justify-center gap-4 pt-8 border-t border-white/[0.05]">
                {/* Monogram avatar */}
                <div className="relative w-12 h-12 rounded-full flex items-center justify-center shrink-0">
                  {/* Outer ring */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent/30 to-accent-deep/50" />
                  {/* Inner gradient */}
                  <div className="absolute inset-[1.5px] rounded-full bg-gradient-to-br from-graphite to-carbon flex items-center justify-center">
                    <span className="text-accent-bright font-extrabold text-sm tracking-tight">G</span>
                  </div>
                </div>
                <div>
                  <p className="text-ivory text-sm font-semibold tracking-tight">Founder & UX Architect</p>
                  <p className="text-ash text-xs mt-0.5">8년 차 UX 기획 · 시스템 설계 전문</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

