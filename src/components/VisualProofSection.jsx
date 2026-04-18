import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useScrollReveal } from '../hooks/useScrollReveal';

const cardReveal = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

// Bottom 3 cards each get a unique accent
const bottomCards = [
  {
    icon: 'solar:file-check-bold-duotone',
    title: '.pptx 다이렉트 출력',
    description: '분석 결과를 즉시 보고 가능한 프레젠테이션 파일로 자동 변환합니다.',
    accentClass: 'text-accent-bright',
    bgClass: 'bg-accent/10',
    borderClass: 'border-accent/15',
    glowClass: 'bg-accent-deep/20',
  },
  {
    icon: 'solar:shield-check-bold-duotone',
    title: '사내 보안 규정 준수',
    description: '원본 파일은 업로드되지 않습니다. 텍스트만 추출하여 분석하므로 보안 감사에 유리합니다.',
    accentClass: 'text-emerald-accent',
    bgClass: 'bg-emerald-accent/10',
    borderClass: 'border-emerald-accent/15',
    glowClass: 'bg-emerald-accent/15',
  },
  {
    icon: 'solar:cpu-bolt-bold-duotone',
    title: '경량화 로컬 전처리',
    description: 'GPU 없는 일반 노트북에서도 원활하게 구동되도록 최적화했습니다.',
    accentClass: 'text-gold',
    bgClass: 'bg-gold/10',
    borderClass: 'border-gold/15',
    glowClass: 'bg-gold/15',
  },
];

function BottomBentoCard({ card, index }) {
  return (
    <motion.div
      custom={index + 3}
      variants={cardReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      whileHover={{ y: -4, transition: { duration: 0.3 } }}
      className="md:col-span-4 card-bezel group cursor-default"
    >
      <div className="card-bezel-inner h-full flex flex-col min-h-[220px]">
        {/* Accent glow */}
        <div className={`absolute top-0 right-0 w-32 h-32 rounded-full ${card.glowClass} blur-[50px] opacity-50 group-hover:opacity-80 transition-opacity duration-500`} />

        <div className="relative z-10">
          <div className={`inline-flex items-center justify-center w-11 h-11 rounded-2xl ${card.bgClass} border ${card.borderClass} mb-5 group-hover:scale-110 transition-transform duration-300`}>
            <Icon icon={card.icon} className={`w-5 h-5 ${card.accentClass}`} />
          </div>
          <h3 className="text-base font-bold text-ivory mb-3.5 tracking-tight">{card.title}</h3>
          <p className="text-silver text-[14px] leading-[1.85]">{card.description}</p>
        </div>
      </div>
    </motion.div>
  );
}

// Animated mock UI with shimmer + processing state
function MockUI() {
  const [processed, setProcessed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setProcessed(true), 1800);
    const cycle = setInterval(() => {
      setProcessed(false);
      setTimeout(() => setProcessed(true), 1800);
    }, 5000);
    return () => { clearTimeout(timer); clearInterval(cycle); };
  }, []);

  return (
    <div className="relative flex-1 mb-8">
      {/* macOS window chrome */}
      <div className="absolute top-0 left-0 right-0 h-8 flex items-center gap-1.5 px-3">
        <div className="w-2.5 h-2.5 rounded-full bg-red-400/50" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/50" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-400/50" />
        <div className="ml-3 flex-1 h-4 rounded shimmer" style={{ maxWidth: '120px' }} />
      </div>

      <div className="pt-12 space-y-3">
        {/* Input documents — shimmer skeleton */}
        {[4, 3, 3.5].map((w, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-lg bg-accent/[0.08] flex items-center justify-center shrink-0">
              <Icon icon="solar:document-text-bold-duotone" className="w-3 h-3 text-accent/50" />
            </div>
            <div className={`h-2.5 rounded-full shimmer`} style={{ width: `${w * 16}%` }} />
            <span className="text-[10px] font-mono text-ash/50 shrink-0">
              {['기획안_v3.pdf', '시장조사.xlsx', '경쟁사분석.pptx'][i]}
            </span>
          </div>
        ))}

        {/* Processing arrow */}
        <div className="flex justify-center py-5">
          <div className="flex flex-col items-center gap-2">
            <div className={`processing-blink text-accent-glow/60`}>
              <Icon icon="solar:cpu-bold-duotone" className="w-7 h-7" />
            </div>
            <span className="text-[10px] font-mono text-ash/60 tracking-wider">
              {processed ? 'COMPLETE' : 'PROCESSING...'}
            </span>
          </div>
        </div>

        {/* Output card — animates in when processed */}
        <AnimatePresence mode="wait">
          {processed ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-accent/[0.08] border border-accent/15"
            >
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                <Icon icon="solar:presentation-graph-bold-duotone" className="w-4 h-4 text-accent-bright" />
              </div>
              <div className="flex-1">
                <div className="h-2.5 rounded-full bg-accent/25 w-full mb-2" />
                <div className="h-2 rounded-full bg-accent/12 w-3/4" />
              </div>
              <span className="text-xs font-mono font-bold text-accent-bright/80 bg-accent/10 px-2 py-1 rounded-lg">.pptx</span>
            </motion.div>
          ) : (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]"
            >
              <div className="w-8 h-8 rounded-lg bg-white/[0.03] flex items-center justify-center shrink-0">
                <Icon icon="solar:presentation-graph-bold-duotone" className="w-4 h-4 text-ash/40" />
              </div>
              <div className="flex-1 space-y-1.5">
                <div className="h-2.5 rounded-full shimmer w-full" />
                <div className="h-2 rounded-full shimmer w-2/3" />
              </div>
              <span className="text-xs font-mono text-ash/30">...</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function VisualProofSection() {
  const { ref, isInView } = useScrollReveal();

  return (
    <section className="relative py-40 md:py-52 overflow-hidden">
      {/* Section background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/10 to-transparent" />
        <div className="absolute top-1/3 left-1/3 w-[600px] h-[600px] rounded-full bg-accent-deep/[0.04] blur-[120px]" />
      </div>

      <div className="relative z-10 section-container" ref={ref}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-28"
        >
          <span className="inline-block px-4 py-1.5 rounded-full border border-accent/15 bg-accent/[0.04] text-accent text-xs font-medium tracking-wider uppercase mb-8">
            Visual Proof
          </span>
          <h2 className="text-3xl md:text-[2.75rem] font-extrabold text-snow tracking-tight mb-8">
            시각적으로 증명합니다
          </h2>
          <p className="text-silver text-lg max-w-2xl mx-auto leading-[1.85] text-center">
            웹 챗봇의 휘발되는 기억력은 잊으십시오.
          </p>
        </motion.div>

        {/* Asymmetric Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Large feature card — 7 cols */}
          <motion.div
            custom={0}
            variants={cardReveal}
            initial="hidden"
            whileInView="visible"
            whileHover={{ y: -3, transition: { duration: 0.3 } }}
            viewport={{ once: true, margin: '-60px' }}
            className="md:col-span-7 card-bezel group cursor-default"
          >
            <div className="card-bezel-inner relative min-h-[360px] flex flex-col justify-between">
              <MockUI />
              <div>
                <h3 className="text-xl font-bold text-ivory mb-3.5 tracking-tight">문서 누적 분석 → 즉시 보고</h3>
                <p className="text-silver text-[15px] leading-relaxed">
                  수십 개의 문서를 누적해서 읽고, 컨설팅 펌의 프레임워크로 논리를 연산하여, 즉시 보고 가능한 형태로 출력합니다.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right column — stacked cards */}
          <div className="md:col-span-5 flex flex-col gap-6">
            <motion.div
              custom={1}
              variants={cardReveal}
              initial="hidden"
              whileInView="visible"
              whileHover={{ y: -4, transition: { duration: 0.3 } }}
              viewport={{ once: true, margin: '-60px' }}
              className="card-bezel group cursor-default flex-1"
            >
              <div className="card-bezel-inner h-full flex flex-col">
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-accent/10 blur-[50px] opacity-50 group-hover:opacity-90 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-6 bg-accent/10 border border-accent/15 group-hover:scale-110 transition-transform duration-300">
                    <Icon icon="solar:database-bold-duotone" className="w-6 h-6 text-accent-bright" />
                  </div>
                  <h3 className="text-lg font-bold text-ivory mb-4 tracking-tight">누적 기억 엔진</h3>
                  <p className="text-silver text-[15px] leading-relaxed">웹 챗봇처럼 대화가 초기화되지 않습니다. 입력한 모든 문서를 영구적으로 학습하여 맥락을 유지합니다.</p>
                </div>
              </div>
            </motion.div>
            <motion.div
              custom={2}
              variants={cardReveal}
              initial="hidden"
              whileInView="visible"
              whileHover={{ y: -4, transition: { duration: 0.3 } }}
              viewport={{ once: true, margin: '-60px' }}
              className="card-bezel group cursor-default flex-1"
            >
              <div className="card-bezel-inner h-full flex flex-col">
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-accent-deep/15 blur-[50px] opacity-50 group-hover:opacity-90 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-6 bg-accent-deep/10 border border-accent-deep/20 group-hover:scale-110 transition-transform duration-300">
                    <Icon icon="solar:chart-square-bold-duotone" className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="text-lg font-bold text-ivory mb-4 tracking-tight">컨설팅 프레임워크</h3>
                  <p className="text-silver text-[15px] leading-relaxed">맥킨지, BCG 등 검증된 프레임워크를 탑재하여, 논리적 구조화를 자동 연산합니다.</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom row — 3 cards with distinct accents */}
          {bottomCards.map((card, i) => (
            <BottomBentoCard key={card.title} card={card} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
