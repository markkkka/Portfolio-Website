import React, { useEffect, useRef, useState } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useInView
} from 'motion/react';
import {
  ArrowRight,
  Instagram,
  Mail,
  Menu,
  X
} from 'lucide-react';

// --- Constants & Assets ---
const VIDEOS = {
  hero: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_074327_a4d6275d-82d9-4c83-bfbe-f1fb2213c17c.mp4",
  split: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4",
  reel1: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_145119_f4ec4d9f-3ecd-4116-baa3-26e8cf2df976.mp4",
  reel2: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260419_065931_e3ca7b53-d32e-4ad5-81de-dc9d6fcfda6d.mp4",
  reel3: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260422_191657_800d4e1f-7ab3-41af-90b6-9bd3039eb294.mp4",
  cta: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260417_061226_74f0749c-a22d-42b3-895e-5d6203bc741c.mp4"
};

const NAV_LINKS = [
  { label: "Experience", href: "#experience" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" }
];

type SelectedContentVisual = {
  id: string;
  layoutClassName: string;
  surfaceClassName: string;
  accentClassName?: string;
  imageSrc?: string;
  caption?: string;
};

type SelectedContentCategory = {
  id: string;
  label: string;
  description: string;
  tags: string[];
  boardClassName: string;
  visuals: SelectedContentVisual[];
};

const SELECTED_CONTENT_CATEGORIES: SelectedContentCategory[] = [
  {
    id: "destination",
    label: "Destination",
    description: "Editorial visuals for travel, recreation, and lifestyle moments built around place and atmosphere.",
    tags: ["Place", "Lifestyle", "Recreation"],
    boardClassName: "bg-[radial-gradient(circle_at_28%_22%,rgba(166,138,86,0.2),transparent_28%),radial-gradient(circle_at_80%_64%,rgba(80,105,92,0.26),transparent_34%),linear-gradient(135deg,#090909_0%,#11100c_48%,#050505_100%)]",
    visuals: [
      {
        id: "destination-landscape",
        layoutClassName: "left-5 right-16 top-8 h-52 md:left-8 md:right-32 md:top-10 md:h-64",
        surfaceClassName: "bg-[linear-gradient(135deg,rgba(255,255,255,0.11),rgba(255,255,255,0.02)),radial-gradient(circle_at_30%_65%,rgba(185,151,107,0.28),transparent_34%),linear-gradient(165deg,#1a221d_0%,#101711_54%,#050505_100%)]",
        accentClassName: "left-6 right-10 bottom-9 h-px bg-white/20"
      },
      {
        id: "destination-vertical",
        layoutClassName: "right-5 top-24 h-64 w-32 md:right-12 md:top-28 md:h-72 md:w-40",
        surfaceClassName: "bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.16),transparent_20%),linear-gradient(180deg,#2b2a22_0%,#111610_58%,#070707_100%)]",
        accentClassName: "left-4 top-5 h-16 w-px bg-brand-earth/45"
      },
      {
        id: "destination-detail",
        layoutClassName: "bottom-12 left-8 h-24 w-52 md:bottom-14 md:left-16 md:h-28 md:w-64",
        surfaceClassName: "bg-[linear-gradient(135deg,rgba(255,255,255,0.07),rgba(255,255,255,0.015))]",
        accentClassName: "left-5 top-5 h-2 w-20 rounded-full bg-brand-earth/45"
      }
    ]
  },
  {
    id: "product",
    label: "Product",
    description: "Product-focused content that makes features, use cases, and retail value feel clear and desirable.",
    tags: ["Retail", "Use Cases", "Launch"],
    boardClassName: "bg-[radial-gradient(circle_at_72%_22%,rgba(185,151,107,0.18),transparent_30%),radial-gradient(circle_at_20%_72%,rgba(255,255,255,0.08),transparent_28%),linear-gradient(135deg,#050505_0%,#111111_48%,#0b0805_100%)]",
    visuals: [
      {
        id: "product-hero",
        layoutClassName: "left-6 right-10 top-10 h-64 md:left-10 md:right-24 md:h-72",
        surfaceClassName: "bg-[radial-gradient(circle_at_58%_42%,rgba(255,255,255,0.2),transparent_14%),radial-gradient(circle_at_58%_42%,rgba(185,151,107,0.24),transparent_34%),linear-gradient(135deg,#171717_0%,#0c0c0c_100%)]",
        accentClassName: "right-10 top-10 h-24 w-24 rounded-full border border-brand-earth/30"
      },
      {
        id: "product-caption",
        layoutClassName: "bottom-12 left-8 h-32 w-56 md:bottom-16 md:left-14 md:h-36 md:w-72",
        surfaceClassName: "bg-[linear-gradient(135deg,rgba(185,151,107,0.11),rgba(255,255,255,0.025))]",
        accentClassName: "left-5 top-6 h-px w-24 bg-white/30"
      },
      {
        id: "product-crop",
        layoutClassName: "bottom-20 right-5 h-44 w-28 md:bottom-14 md:right-12 md:h-52 md:w-36",
        surfaceClassName: "bg-[linear-gradient(160deg,#2a2117_0%,#121212_56%,#070707_100%)]",
        accentClassName: "bottom-6 left-5 right-5 h-px bg-brand-earth/50"
      }
    ]
  },
  {
    id: "professional",
    label: "Professional Content",
    description: "Polished content systems for professional ideas, thought leadership, and B2B brand-building.",
    tags: ["Thought Leadership", "B2B", "Content Systems"],
    boardClassName: "bg-[radial-gradient(circle_at_28%_24%,rgba(185,151,107,0.15),transparent_26%),radial-gradient(circle_at_74%_74%,rgba(100,118,132,0.16),transparent_32%),linear-gradient(135deg,#060606_0%,#101010_48%,#050505_100%)]",
    visuals: [
      {
        id: "professional-feature",
        layoutClassName: "left-5 right-8 top-8 h-56 md:left-10 md:right-20 md:top-10 md:h-64",
        surfaceClassName: "bg-[linear-gradient(135deg,rgba(255,255,255,0.09),rgba(255,255,255,0.018))]",
        accentClassName: "left-6 top-7 h-2 w-24 rounded-full bg-brand-earth/40"
      },
      {
        id: "professional-stack",
        layoutClassName: "bottom-14 left-8 h-36 w-60 md:bottom-16 md:left-14 md:h-40 md:w-72",
        surfaceClassName: "bg-[linear-gradient(135deg,rgba(100,118,132,0.13),rgba(255,255,255,0.018))]",
        accentClassName: "left-5 right-8 top-8 h-px bg-white/20"
      },
      {
        id: "professional-vertical",
        layoutClassName: "bottom-12 right-5 h-56 w-32 md:bottom-12 md:right-12 md:h-64 md:w-40",
        surfaceClassName: "bg-[linear-gradient(180deg,#171717_0%,#0f1112_54%,#070707_100%)]",
        accentClassName: "left-5 top-6 h-20 w-px bg-brand-earth/45"
      }
    ]
  }
];

interface SectionRevealProps {
  children: React.ReactNode;
  className?: string;
}

const SectionReveal = ({ children, className = "" }: SectionRevealProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const VideoBackground = ({ src, overlay = true }: { src: string, overlay?: boolean }) => {
  const [videoFailed, setVideoFailed] = useState(false);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-brand-black">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(166,138,86,0.22),transparent_34%),radial-gradient(circle_at_70%_65%,rgba(255,255,255,0.08),transparent_32%),linear-gradient(135deg,#000000_0%,#0b0b0b_45%,#15110a_100%)]" />
      {!videoFailed && (
        <motion.video
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1.02, opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          autoPlay
          loop
          muted
          playsInline
          className="absolute min-w-full min-h-full object-cover"
          style={{ filter: 'grayscale(0.2)' }}
          preload="metadata"
          onError={() => setVideoFailed(true)}
        >
          <source src={src} type="video/mp4" onError={() => setVideoFailed(true)} />
        </motion.video>
      )}
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-b from-brand-black/60 via-brand-black/20 to-brand-black/90 pointer-events-none" />
      )}
    </div>
  );
};

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 safe-pt flex items-center ${
        scrolled ? 'py-4 bg-[#000000]/58 backdrop-blur-xl border-b border-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.12)]' : 'py-4 md:py-6 bg-transparent'
      }`}
    >
      <div className="site-header-inner w-full grid grid-cols-[1fr_auto] md:grid-cols-[1fr_auto_1fr] items-center gap-4">
        <a href="#" className="col-start-1 justify-self-start font-display text-lg md:text-[1.35rem] font-semibold tracking-tight hover:opacity-85 transition-opacity tap-target !justify-start">
          Mark Anastasiadi
        </a>

        <div className="hidden md:flex col-start-2 justify-self-center items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.065] p-1.5 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.16)]">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-6 py-3 text-[13px] font-semibold tracking-[0.09em] text-white/80 transition-all duration-300 hover:bg-white/10 hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>

        <a
          href="#contact"
          className="hidden md:flex col-start-3 justify-self-end items-center min-h-[44px] text-[13px] font-semibold tracking-[0.12em] uppercase text-white/78 transition-colors duration-300 hover:text-white"
        >
          Get in Touch
        </a>

        <button
          className="mobile-menu-button col-start-2 justify-self-end min-h-[44px] min-w-[44px] items-center justify-center p-2 text-brand-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 pt-[80px] safe-pt bg-[#000000]/98 backdrop-blur-xl z-40 p-10 safe-px safe-pb flex flex-col gap-8 md:hidden h-screen overflow-y-auto"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-3xl font-display tap-target !justify-start"
              >
                {link.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, -60]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      <VideoBackground src={VIDEOS.hero} />

      <div className="relative z-10 grid min-h-screen grid-rows-[1fr_auto] px-6 pt-36 md:pt-44">
        <motion.div
          style={{ y, opacity }}
          className="mx-auto flex max-w-5xl flex-col items-center justify-center self-center pb-16 text-center md:pb-20"
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8 inline-block text-[11px] font-bold tracking-[0.32em] uppercase text-brand-earth md:mb-10"
          >
            B2C MARKETING · BRAND GROWTH · DIGITAL CAMPAIGNS
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 max-w-4xl font-editorial text-6xl font-semibold leading-[1.02] tracking-normal text-brand-white md:text-8xl lg:text-[7.25rem]"
          >
            Building brands people remember.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mx-auto mb-11 max-w-2xl px-2 text-base font-light leading-relaxed text-brand-white/78 md:text-lg"
          >
            I create content, campaigns, landing pages, and marketing systems that help consumer brands look sharper, communicate clearly, and grow with intention.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex w-full flex-col items-stretch justify-center gap-4 px-4 sm:w-auto sm:flex-row"
          >
            <a href="#experience" className="w-full sm:w-auto px-8 py-4 sm:py-3.5 bg-brand-white text-brand-black rounded-full font-semibold hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.15)] tap-target">
              View Experience <ArrowRight size={18} />
            </a>
            <a href="#contact" className="w-full sm:w-auto px-8 py-4 sm:py-3.5 bg-white/[0.03] border border-white/10 rounded-full hover:bg-white/[0.08] text-white/80 font-medium transition-all flex items-center justify-center gap-2 tap-target">
              Get in Touch
            </a>
          </motion.div>
        </motion.div>

        <div className="mx-auto flex w-full max-w-6xl justify-center border-t border-white/5 bg-brand-black/20 px-4 py-6 text-center backdrop-blur-sm safe-pb md:py-8">
          <p className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-[10px] font-bold uppercase tracking-[0.26em] text-white/50 md:gap-x-8 md:tracking-[0.3em]">
            <span>CONTENT CREATION</span> <span>·</span> <span>PAID MEDIA</span> <span>·</span> <span>EMAIL CAMPAIGNS</span> <span>·</span> <span>LANDING PAGES</span> <span>·</span> <span>BRAND SYSTEMS</span>
          </p>
        </div>
      </div>
    </section>
  );
};

const BrandExperienceStrip = () => {
  const items = [
    { company: "SFA", role: "Marketing Consultant", dates: "2022–2024" },
    { company: "Trend Capital", role: "Marketing & Analytics Specialist", dates: "2025" }
  ];

  return (
    <section className="relative border-y border-white/5 bg-brand-black/95 px-6 py-10 md:py-12 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-earth/30 to-transparent" />
      <div className="max-w-6xl mx-auto">
        <SectionReveal>
          <p className="mb-8 text-center text-[10px] font-bold uppercase tracking-[0.35em] text-brand-earth/85">
            Work Experience
          </p>

          <div className="work-experience-card grid gap-8 md:grid-cols-2 md:gap-0 rounded-[1.75rem] border border-white/8 bg-white/[0.025] backdrop-blur-md transition-shadow duration-500 hover:shadow-[0_0_34px_rgba(185,151,107,0.08)]">
            {items.map((item, index) => (
              <div key={item.company} className="relative flex flex-col items-center px-8 py-8 text-center md:py-10">
                {index > 0 && (
                  <div className="hidden md:block absolute left-0 top-1/2 h-16 w-px -translate-y-1/2 bg-white/10" />
                )}
                <h2 className="font-editorial text-4xl md:text-5xl font-semibold tracking-normal text-white">
                  {item.company}
                </h2>
                <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55">
                  {item.role}
                </p>
                <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-brand-earth/75">
                  {item.dates}
                </p>
              </div>
            ))}
          </div>
        </SectionReveal>
      </div>
    </section>
  );
};

const SelectedContentVisualCard = ({ visual }: { visual: SelectedContentVisual; key?: React.Key }) => (
  <div
    className={`absolute overflow-hidden rounded-[1.25rem] border border-white/10 bg-white/[0.025] shadow-2xl backdrop-blur-md ${visual.layoutClassName}`}
  >
    {visual.imageSrc ? (
      <img
        src={visual.imageSrc}
        alt={visual.caption || ""}
        className="h-full w-full object-cover"
      />
    ) : (
      <div className={`absolute inset-0 ${visual.surfaceClassName}`} />
    )}
    <div className="absolute inset-0 bg-gradient-to-b from-white/[0.08] via-transparent to-black/30" />
    {visual.accentClassName && (
      <div className={`absolute ${visual.accentClassName}`} />
    )}
    <div className="absolute bottom-5 left-5 right-5">
      {visual.caption ? (
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/60">
          {visual.caption}
        </p>
      ) : (
        <div className="grid gap-2">
          <div className="h-px w-3/4 bg-white/20" />
          <div className="h-px w-1/2 bg-white/10" />
        </div>
      )}
    </div>
  </div>
);

const SelectedContent = () => {
  const [activeCategoryId, setActiveCategoryId] = useState(SELECTED_CONTENT_CATEGORIES[0].id);
  const activeCategory = SELECTED_CONTENT_CATEGORIES.find((category) => category.id === activeCategoryId) || SELECTED_CONTENT_CATEGORIES[0];

  return (
    <section className="relative overflow-hidden border-t border-white/5 bg-[#030303] px-6 py-24 md:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(166,138,86,0.1),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.025),transparent_36%)]" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <SectionReveal>
          <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
            <div className="max-w-xl">
              <span className="mb-5 block text-[10px] font-bold uppercase tracking-[0.35em] text-brand-earth">
                Content Creation
              </span>
              <h2 className="mb-6 font-editorial text-5xl font-semibold leading-none text-white md:text-7xl">
                Selected Content
              </h2>
              <p className="mb-9 text-base font-light leading-relaxed text-white/62 md:text-lg">
                A curated look at content directions across destination, product, and professional brand systems.
              </p>

              <div className="mb-8 flex gap-2 overflow-x-auto pb-1 no-scrollbar lg:flex-col lg:overflow-visible lg:pb-0">
                {SELECTED_CONTENT_CATEGORIES.map((category) => {
                  const isActive = category.id === activeCategory.id;

                  return (
                    <button
                      key={category.id}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => setActiveCategoryId(category.id)}
                      className={`min-w-max rounded-full border px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] transition-all duration-300 lg:min-w-0 lg:rounded-2xl lg:px-5 lg:py-4 ${
                        isActive
                          ? "border-brand-earth/45 bg-brand-earth/10 text-white shadow-[0_0_28px_rgba(166,138,86,0.08)]"
                          : "border-white/8 bg-white/[0.025] text-white/45 hover:border-white/18 hover:text-white/70"
                      }`}
                    >
                      {category.label}
                    </button>
                  );
                })}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <p className="mb-5 text-sm font-light leading-relaxed text-white/58 md:text-base">
                    {activeCategory.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {activeCategory.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/8 bg-white/[0.025] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="relative min-h-[460px] overflow-hidden rounded-[2rem] border border-white/8 bg-white/[0.025] shadow-[0_24px_80px_rgba(0,0,0,0.36)] backdrop-blur-md md:min-h-[560px]">
              <div className={`absolute inset-0 ${activeCategory.boardClassName}`} />
              <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.08),transparent_30%,rgba(0,0,0,0.35)_100%)]" />
              <div className="absolute left-6 top-6 z-20 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.24em] text-white/50 backdrop-blur-md">
                {activeCategory.label}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory.id}
                  initial={{ opacity: 0, y: 16, scale: 0.99 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -12, scale: 0.99 }}
                  transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0"
                >
                  {activeCategory.visuals.map((visual) => (
                    <SelectedContentVisualCard key={visual.id} visual={visual} />
                  ))}
                </motion.div>
              </AnimatePresence>

              <div className="absolute inset-x-8 bottom-8 h-px bg-gradient-to-r from-transparent via-brand-earth/35 to-transparent" />
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
};

const PlaceholderSection = ({ id, title, copy }: { id: string, title: string, copy: string }) => (
  <section id={id} className="py-24 md:py-32 px-6 bg-brand-black border-t border-white/5 scroll-mt-24">
    <div className="max-w-7xl mx-auto">
      <SectionReveal className="max-w-3xl">
        <span className="text-[10px] font-bold tracking-[0.35em] uppercase text-brand-earth mb-5 block">
          {title}
        </span>
        <h2 className="text-3xl md:text-5xl font-display font-medium tracking-tighter mb-6 text-white">
          {title}
        </h2>
        <p className="text-base md:text-lg text-white/55 font-light leading-relaxed">
          {copy}
        </p>
      </SectionReveal>
    </div>
  </section>
);

const ContactSection = () => (
  <section id="contact" className="py-24 md:py-32 px-6 bg-[#050505] border-t border-white/5 scroll-mt-24">
    <div className="max-w-7xl mx-auto">
      <SectionReveal className="max-w-3xl">
        <span className="text-[10px] font-bold tracking-[0.35em] uppercase text-brand-earth mb-5 block">
          Contact
        </span>
        <h2 className="text-3xl md:text-5xl font-display font-medium tracking-tighter mb-6 text-white">
          Get in touch
        </h2>
        <p className="text-base md:text-lg text-white/55 font-light leading-relaxed mb-10">
          Interested in working together or viewing more examples of my work?
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a href="#" className="w-full sm:w-auto px-7 py-3.5 bg-white/[0.03] border border-white/10 rounded-full hover:bg-white/[0.08] text-white/80 font-medium transition-all flex items-center justify-center gap-2 tap-target">
            LinkedIn
          </a>
          <a href="#" className="w-full sm:w-auto px-7 py-3.5 bg-white/[0.03] border border-white/10 rounded-full hover:bg-white/[0.08] text-white/80 font-medium transition-all flex items-center justify-center gap-2 tap-target">
            Instagram
          </a>
          <a href="mailto:hello@example.com" className="w-full sm:w-auto px-7 py-3.5 bg-brand-white text-brand-black rounded-full font-semibold hover:bg-white/90 transition-all flex items-center justify-center gap-2 tap-target">
            Email
          </a>
        </div>
      </SectionReveal>
    </div>
  </section>
);

const Footer = () => (
  <footer className="py-14 px-6 bg-brand-black border-t border-white/10 text-white/40 safe-px safe-pb">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between gap-8 md:items-end">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tighter text-white/90 mb-4">
            Mark Anastasiadi
          </h2>
          <p className="max-w-sm text-sm font-light leading-relaxed">
            B2C marketing, content, campaigns, and digital experiences.
          </p>
        </div>
        <div className="flex gap-4">
          <a href="#" className="p-4 rounded-full bg-white/5 border border-white/10 hover:border-brand-earth/50 transition-colors tap-target" aria-label="Instagram">
            <Instagram size={20} />
          </a>
          <a href="mailto:hello@example.com" className="p-4 rounded-full bg-white/5 border border-white/10 hover:border-brand-earth/50 transition-colors tap-target" aria-label="Email">
            <Mail size={20} />
          </a>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mt-12 pt-8 border-t border-white/5 text-[10px] font-medium tracking-widest uppercase">
        <p>© 2026 Mark Anastasiadi. All rights reserved.</p>
        <p className="mt-6 md:mt-0">Portfolio</p>
      </div>
    </div>
  </footer>
);

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-brand-black min-h-screen text-brand-white overflow-x-hidden selection:bg-brand-earth scroll-smooth">
      <AnimatePresence>
        {loading && (
          <motion.div
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-brand-black flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.5 }}
              className="max-w-[200px] h-px bg-brand-earth"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Navbar />

      <main className={loading ? 'hidden' : 'block'}>
        <Hero />
        <BrandExperienceStrip />
        <SelectedContent />
        <PlaceholderSection
          id="experience"
          title="Experience"
          copy="A mix of B2C brand work, paid media, email campaigns, landing pages, content creation, and modern marketing systems."
        />
        <PlaceholderSection
          id="about"
          title="About"
          copy="I work across creative and digital marketing to help brands communicate clearly, launch better campaigns, and build systems that support growth."
        />
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
}
