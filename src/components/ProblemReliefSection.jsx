import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

const cardData = [
  {
    badge: '원본 파일 보호',
    icon: 'solar:lock-keyhole-bold-duotone',
    title: '가장 높은 보안의 장벽',
    description:
      '원본 파일을 통째로 업로드하지 않습니다. 파이썬이 텍스트만 추출하여 분석합니다. 사내 AI 서버(Azure, Bedrock 등)를 운영 중이라면 API 엔드포인트만 변경하여 사내망 안에서 완결할 수도 있습니다.',
    glowColor: 'bg-accent-deep/25',
    iconBg: 'bg-accent/[0.08]',
    iconBorder: 'border-accent/15',
    iconColor: 'text-accent-bright',
    badgeBorder: 'border-accent/20',
    badgeText: 'text-accent-bright',
  },
  {
    badge: '원터치 GUI 환경',
    icon: 'solar:monitor-smartphone-bold-duotone',
    title: '제로 기술 장벽',
    description:
      '터미널 창(CLI)은 잊으십시오. 일반 앱처럼 설치하고 클릭 한 번으로 실행되는 완벽한 사용자 경험을 제공합니다.',
    glowColor: 'bg-emerald-accent/20',
    iconBg: 'bg-emerald-accent/[0.08]',
    iconBorder: 'border-emerald-accent/15',
    iconColor: 'text-emerald-accent',
    badgeBorder: 'border-emerald-accent/20',
    badgeText: 'text-emerald-accent',
  },
  {
    badge: '스마트 토큰 다이어트',
    icon: 'solar:tuning-square-bold-duotone',
    title: '무제한에 가까운 분석',
    description:
      '리밋(사용량 제한) 걱정 없이 마음껏 분석하십시오. 자체 파이썬 전처리 모듈이 문서의 불순물을 1차로 제거하여 계정 한도 초과를 완벽히 방어합니다.',
    glowColor: 'bg-gold/20',
    iconBg: 'bg-gold/[0.08]',
    iconBorder: 'border-gold/15',
    iconColor: 'text-gold',
    badgeBorder: 'border-gold/20',
    badgeText: 'text-gold-bright',
  },
];

const cardVariant = {
  hidden: { opacity: 0, y: 50 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay: i * 0.15,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

export default function ProblemReliefSection() {
  return (
    <section className="relative py-40 md:py-52 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/10 to-transparent" />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-accent/[0.03] blur-[140px]" />
      </div>

      <div className="relative z-10 section-container">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-28"
        >
          <span className="inline-block px-4 py-1.5 rounded-full border border-accent/15 bg-accent/[0.04] text-accent text-xs font-medium tracking-wider uppercase mb-8">
            Problem & Relief
          </span>
          <h2 className="text-3xl md:text-[2.75rem] font-extrabold text-snow tracking-tight mb-8 leading-[1.25]">
            기술의 장벽은 없애고,
            <br />
            보안의 장벽은 높였습니다.
          </h2>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {cardData.map((card, i) => (
            <motion.div
              key={card.badge}
              custom={i}
              variants={cardVariant}
              initial="hidden"
              whileInView="visible"
              whileHover={{ y: -5, transition: { duration: 0.35, ease: 'easeOut' } }}
              viewport={{ once: true, margin: '-40px' }}
              className="card-bezel group cursor-default"
            >
              <div className="card-bezel-inner h-full flex flex-col min-h-[380px]">
                {/* Ambient glow — shifts position on hover */}
                <div
                  className={`absolute top-0 right-0 w-44 h-44 rounded-full ${card.glowColor} blur-[70px] opacity-50 group-hover:opacity-100 group-hover:translate-x-2 group-hover:-translate-y-2 transition-all duration-700`}
                />

                {/* Badge */}
                <div className="relative z-10 mb-7">
                  <span className={`inline-flex items-center px-3.5 py-1.5 rounded-lg border ${card.badgeBorder} bg-white/[0.02] text-[12px] font-semibold tracking-wide ${card.badgeText}`}>
                    {card.badge}
                  </span>
                </div>

                {/* Icon — spring scale + rotate on hover */}
                <div className="relative z-10 mb-7">
                  <motion.div
                    whileHover={{ scale: 1.15, rotate: 6 }}
                    transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
                    className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${card.iconBg} border ${card.iconBorder}`}
                  >
                    <Icon icon={card.icon} className={`w-7 h-7 ${card.iconColor}`} />
                  </motion.div>
                </div>

                {/* Content */}
                <div className="relative z-10 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-ivory mb-5 tracking-tight">{card.title}</h3>
                  <p className="text-silver text-[15px] leading-[1.9]">{card.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
