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

const STANDALONE_VIDEO = {
  videoMp4: "/videos/flower-bloom.mp4",
  videoWebm: "",
  poster: ""
};

type SelectedContentVisual = {
  id: string;
  imageSrc?: string | null;
  alt: string;
  caption?: string;
  surfaceClassName: string;
};

type SelectedContentCategory = {
  id: string;
  label: string;
  description: string;
  boardClassName: string;
  visuals: SelectedContentVisual[];
};

type EmailCampaign = {
  id: string;
  brand: string;
  campaignType: string;
  description: string;
  previewSrc: string;
  previewTitle: string;
};

type LandingPagePanel = {
  id: string;
  brand: string;
  pageType: string;
  description: string;
  previewType: "iframe" | "image";
  previewSrc?: string;
  imageSrc?: string | null;
  alt: string;
  previewTitle: string;
};

type OutcomeCard = {
  id: string;
  metric: string;
  label: string;
  explanation: string;
  graphPath: string;
  dot: {
    cx: number;
    cy: number;
  };
};

const SELECTED_CONTENT_CATEGORIES: SelectedContentCategory[] = [
  {
    id: "destination",
    label: "Destination",
    description: "Editorial visuals for travel, recreation, and lifestyle moments built around place and atmosphere.",
    boardClassName: "bg-[radial-gradient(circle_at_28%_22%,rgba(166,138,86,0.2),transparent_28%),radial-gradient(circle_at_80%_64%,rgba(80,105,92,0.26),transparent_34%),linear-gradient(135deg,#090909_0%,#11100c_48%,#050505_100%)]",
    visuals: [
      {
        id: "destination-landscape",
        imageSrc: null,
        alt: "Destination content placeholder for landscape and lifestyle storytelling.",
        caption: "Destination",
        surfaceClassName: "bg-[radial-gradient(circle_at_34%_18%,rgba(255,255,255,0.16),transparent_18%),radial-gradient(circle_at_28%_64%,rgba(185,151,107,0.26),transparent_34%),linear-gradient(165deg,#1a221d_0%,#101711_54%,#050505_100%)]"
      },
      {
        id: "destination-vertical",
        imageSrc: null,
        alt: "Destination content placeholder for recreation and travel visuals.",
        caption: "Lifestyle",
        surfaceClassName: "bg-[radial-gradient(circle_at_58%_22%,rgba(255,255,255,0.12),transparent_16%),linear-gradient(180deg,#2b2a22_0%,#111610_58%,#070707_100%)]"
      },
      {
        id: "destination-detail",
        imageSrc: null,
        alt: "Destination content placeholder for atmospheric content detail.",
        caption: "Place",
        surfaceClassName: "bg-[radial-gradient(circle_at_48%_70%,rgba(185,151,107,0.2),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.015))]"
      }
    ]
  },
  {
    id: "product",
    label: "Product",
    description: "Product-focused content that makes features, use cases, and retail value feel clear and desirable.",
    boardClassName: "bg-[radial-gradient(circle_at_72%_22%,rgba(185,151,107,0.18),transparent_30%),radial-gradient(circle_at_20%_72%,rgba(255,255,255,0.08),transparent_28%),linear-gradient(135deg,#050505_0%,#111111_48%,#0b0805_100%)]",
    visuals: [
      {
        id: "product-hero",
        imageSrc: null,
        alt: "Product content placeholder for a focused retail visual.",
        caption: "Retail",
        surfaceClassName: "bg-[radial-gradient(circle_at_58%_42%,rgba(255,255,255,0.22),transparent_14%),radial-gradient(circle_at_58%_42%,rgba(185,151,107,0.24),transparent_34%),linear-gradient(135deg,#171717_0%,#0c0c0c_100%)]"
      },
      {
        id: "product-caption",
        imageSrc: null,
        alt: "Product content placeholder for use case communication.",
        caption: "Use Case",
        surfaceClassName: "bg-[radial-gradient(circle_at_46%_24%,rgba(185,151,107,0.2),transparent_28%),linear-gradient(135deg,rgba(185,151,107,0.11),rgba(255,255,255,0.025))]"
      },
      {
        id: "product-crop",
        imageSrc: null,
        alt: "Product content placeholder for launch and value messaging.",
        caption: "Launch",
        surfaceClassName: "bg-[radial-gradient(circle_at_50%_72%,rgba(255,255,255,0.1),transparent_20%),linear-gradient(160deg,#2a2117_0%,#121212_56%,#070707_100%)]"
      }
    ]
  },
  {
    id: "professional",
    label: "Professional Content",
    description: "Polished content systems for professional ideas, thought leadership, and B2B brand-building.",
    boardClassName: "bg-[radial-gradient(circle_at_28%_24%,rgba(185,151,107,0.15),transparent_26%),radial-gradient(circle_at_74%_74%,rgba(100,118,132,0.16),transparent_32%),linear-gradient(135deg,#060606_0%,#101010_48%,#050505_100%)]",
    visuals: [
      {
        id: "professional-feature",
        imageSrc: null,
        alt: "Professional content placeholder for thought leadership.",
        caption: "Editorial",
        surfaceClassName: "bg-[radial-gradient(circle_at_38%_20%,rgba(185,151,107,0.15),transparent_24%),linear-gradient(135deg,rgba(255,255,255,0.09),rgba(255,255,255,0.018))]"
      },
      {
        id: "professional-stack",
        imageSrc: null,
        alt: "Professional content placeholder for B2B brand systems.",
        caption: "Systems",
        surfaceClassName: "bg-[radial-gradient(circle_at_66%_30%,rgba(100,118,132,0.18),transparent_28%),linear-gradient(135deg,rgba(100,118,132,0.13),rgba(255,255,255,0.018))]"
      },
      {
        id: "professional-vertical",
        imageSrc: null,
        alt: "Professional content placeholder for clear content ideas.",
        caption: "Clarity",
        surfaceClassName: "bg-[radial-gradient(circle_at_50%_78%,rgba(185,151,107,0.14),transparent_24%),linear-gradient(180deg,#171717_0%,#0f1112_54%,#070707_100%)]"
      }
    ]
  }
];

const EMAIL_CAMPAIGNS: EmailCampaign[] = [
  {
    id: "michaelpro",
    brand: "MichaelPro",
    campaignType: "Product storytelling and retail promotion",
    description: "Product-focused email campaigns for new releases, holiday promotions, seasonal sales, and feature-driven product storytelling.",
    previewSrc: "/emails/michaelpro.html",
    previewTitle: "MichaelPro product email campaign preview"
  },
  {
    id: "grantties",
    brand: "GrantTies",
    campaignType: "Offer awareness and customer conversion",
    description: "Conversion-focused email campaigns built around offer awareness, promotional messaging, and customer follow-up.",
    previewSrc: "/emails/grantties.html",
    previewTitle: "GrantTies offer awareness email campaign preview"
  }
];

const LANDING_PAGES: LandingPagePanel[] = [
  {
    id: "michaelpro",
    brand: "MichaelPro",
    pageType: "Product landing page",
    description: "Product-focused landing pages built to highlight features, communicate value, and support retail-driven customer action.",
    previewType: "iframe",
    previewSrc: "/landing-pages/michaelpro.html",
    alt: "MichaelPro product landing page preview.",
    previewTitle: "MichaelPro product landing page preview"
  },
  {
    id: "revpie",
    brand: "RevPie",
    pageType: "B2B platform landing page",
    description: "B2B landing page work focused on explaining platform value, simplifying complex offers, and guiding partner interest.",
    previewType: "image",
    imageSrc: null,
    alt: "RevPie platform landing page preview placeholder.",
    previewTitle: "RevPie platform landing page preview"
  }
];

const SELECTED_OUTCOMES: OutcomeCard[] = [
  {
    id: "followers",
    metric: "55,000+",
    label: "Follower Growth",
    explanation: "Audience growth supported through consistent content, social strategy, and brand-focused storytelling.",
    graphPath: "M8 102 C 48 92, 72 98, 104 76 S 176 50, 252 24",
    dot: { cx: 252, cy: 24 }
  },
  {
    id: "views",
    metric: "5M+",
    label: "Views Generated",
    explanation: "Short-form and campaign-driven content created to expand reach and increase brand visibility.",
    graphPath: "M8 100 C 42 88, 70 100, 104 82 S 170 28, 252 34",
    dot: { cx: 252, cy: 34 }
  },
  {
    id: "roas",
    metric: "4.2x",
    label: "ROAS on Social Campaigns",
    explanation: "Paid social performance supported through stronger creative, clearer messaging, and campaign optimization.",
    graphPath: "M8 104 C 44 96, 62 58, 104 66 S 176 58, 252 22",
    dot: { cx: 252, cy: 22 }
  },
  {
    id: "engagement",
    metric: "140%",
    label: "Engagement Growth",
    explanation: "Improved interaction driven by content direction, message clarity, and more relevant creative.",
    graphPath: "M8 102 C 48 98, 70 72, 106 68 S 180 42, 252 28",
    dot: { cx: 252, cy: 28 }
  }
];

const CORE_COMPETENCY_ROWS = {
  top: [
    "Social Media Marketing",
    "Content Production",
    "Email Campaigns",
    "Email / SMS Marketing",
    "Meta Ads",
    "Google Ads",
    "Landing Page Creation",
    "Landing Page Optimization",
    "AI Automations"
  ],
  bottom: [
    "Klaviyo",
    "Mailchimp",
    "Shopify",
    "Google Analytics",
    "Meta Business Suite",
    "Adobe Photoshop",
    "Adobe Premiere Pro",
    "Canva",
    "Google Sheets",
    "ChatGPT"
  ]
};

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
          href="/resume.pdf"
          className="hidden md:flex col-start-3 justify-self-end items-center min-h-[44px] text-[13px] font-semibold tracking-[0.12em] uppercase text-white/78 transition-colors duration-300 hover:text-white"
        >
          View Resume
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
            className="mb-8 inline-block text-[11px] font-bold tracking-[0.32em] uppercase text-[#E8D8BC] drop-shadow-[0_1px_12px_rgba(0,0,0,0.35)] md:mb-10"
          >
            B2C MARKETING · BRAND GROWTH · DIGITAL CAMPAIGNS
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 max-w-4xl font-editorial text-6xl font-semibold leading-[1.02] tracking-normal text-brand-white md:text-8xl lg:text-[7.25rem]"
          >
            Building brands people <span className="italic">remember.</span>
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

        <div className="full-bleed-strip flex min-h-[72px] items-center justify-center border-t border-white/5 bg-brand-black/30 px-6 py-0 text-center backdrop-blur-sm md:min-h-[80px]">
          <p className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[10px] font-bold uppercase leading-none tracking-[0.26em] text-white/50 md:gap-x-8 md:tracking-[0.3em]">
            <span>CONTENT CREATION</span> <span>·</span> <span>PAID MEDIA</span> <span>·</span> <span>EMAIL CAMPAIGNS</span> <span>·</span> <span>LANDING PAGES</span> <span>·</span> <span>BRAND SYSTEMS</span>
          </p>
        </div>
      </div>
    </section>
  );
};

const BrandExperienceStrip = () => {
  const handleCardPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--work-glow-x", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--work-glow-y", `${event.clientY - rect.top}px`);
  };

  const items = [
    { company: "SFA", role: "Marketing Consultant", dates: "2022–2024" },
    { company: "Trend Capital", role: "Marketing & Analytics Specialist", dates: "2025" }
  ];

  return (
    <section className="relative border-t border-white/5 bg-brand-black px-6 py-14 md:py-16 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-earth/30 to-transparent" />
      <div className="max-w-6xl mx-auto">
        <SectionReveal>
          <p className="mb-10 text-center text-[10px] font-bold uppercase tracking-[0.35em] text-brand-earth/85 md:mb-12">
            Work Experience
          </p>

          <div
            className="work-experience-card grid gap-8 md:grid-cols-2 md:gap-0 rounded-[1.75rem] border border-white/8 bg-white/[0.025] backdrop-blur-md transition-shadow duration-500 hover:shadow-[0_0_34px_rgba(185,151,107,0.08)]"
            onPointerMove={handleCardPointerMove}
          >
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

const SelectedContentVisualCard = ({ visual, index }: { visual: SelectedContentVisual; index: number; key?: React.Key }) => (
  <article
    className={`group relative aspect-[4/5] min-h-0 overflow-hidden rounded-[1.35rem] border border-white/10 bg-white/[0.025] shadow-2xl backdrop-blur-md transition-transform duration-500 md:aspect-[3/4] ${
      index === 1 ? "md:translate-y-8" : ""
    }`}
  >
    {visual.imageSrc ? (
      <img
        src={visual.imageSrc}
        alt={visual.alt}
        className="h-full w-full object-cover"
      />
    ) : (
      <div className={`absolute inset-0 ${visual.surfaceClassName}`} />
    )}
    <div className="absolute inset-0 bg-gradient-to-b from-white/[0.08] via-transparent to-black/38" />
    <div className="absolute inset-x-5 top-5 h-px bg-gradient-to-r from-brand-earth/45 via-white/18 to-transparent" />
    <div className="absolute bottom-5 left-5 right-5">
      <div className="mb-3 grid gap-2">
        <div className="h-px w-3/4 bg-white/22" />
        <div className="h-px w-1/2 bg-white/12" />
      </div>
      {visual.caption && (
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/46">
          {visual.caption}
        </p>
      )}
    </div>
  </article>
);

const SelectedContent = () => {
  const [activeCategoryId, setActiveCategoryId] = useState(SELECTED_CONTENT_CATEGORIES[0].id);
  const activeCategory = SELECTED_CONTENT_CATEGORIES.find((category) => category.id === activeCategoryId) || SELECTED_CONTENT_CATEGORIES[0];

  return (
    <section className="relative overflow-hidden bg-brand-black px-6 pb-24 pt-16 md:pb-32 md:pt-20">
      <div className="relative z-10 mx-auto max-w-7xl">
        <SectionReveal>
          <p className="mb-10 text-center text-[10px] font-bold uppercase tracking-[0.35em] text-brand-earth/85 md:mb-12">
            Content Creation
          </p>

          <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
            <div className="max-w-xl">
              <h2 className="mb-6 font-editorial text-5xl font-semibold leading-none text-white md:text-7xl">
                Selected Content
              </h2>
              <p className="mb-9 text-base font-light leading-relaxed text-white/62 md:text-lg">
                A visual archive of content styles created for lifestyle, product, and professional brand storytelling.
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
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] border border-white/8 bg-white/[0.025] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.36)] backdrop-blur-md sm:p-5 md:p-6">
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
                  className="relative z-10 grid gap-4 pt-14 sm:grid-cols-3 sm:gap-3 md:gap-5 md:pb-8 md:pt-16"
                >
                  {activeCategory.visuals.map((visual, index) => (
                    <SelectedContentVisualCard key={visual.id} visual={visual} index={index} />
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

const EmailCampaigns = () => (
  <section className="relative overflow-hidden bg-brand-black px-6 py-24 md:py-32">
    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
    <div className="relative z-10 mx-auto max-w-7xl">
      <SectionReveal>
        <p className="mb-10 text-center text-[10px] font-bold uppercase tracking-[0.35em] text-brand-earth/85 md:mb-12">
          EMAIL CAMPAIGNS
        </p>
        <div className="mx-auto mb-12 max-w-5xl text-center md:mb-14">
          <h2 className="font-editorial text-5xl font-semibold leading-none text-white md:text-7xl lg:whitespace-nowrap">
            Built for opens, clicks, and conversions.
          </h2>
        </div>
      </SectionReveal>

      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
        {EMAIL_CAMPAIGNS.map((campaign, index) => (
          <motion.article
            key={campaign.id}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: index * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="email-campaign-card group relative overflow-hidden rounded-[2rem] border border-white/8 bg-white/[0.025] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.35)] transition-all duration-500 hover:-translate-y-1 hover:border-brand-earth/28 hover:shadow-[0_28px_90px_rgba(0,0,0,0.48)] sm:p-5 md:p-6"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(185,151,107,0.12),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.04),transparent_36%)] opacity-70" />

            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: 0.1 + index * 0.1, duration: 0.55, ease: "easeOut" }}
                className="mb-5"
              >
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.28em] text-brand-earth/80">
                  {campaign.campaignType}
                </p>
                <h3 className="font-editorial text-4xl font-semibold leading-none text-white md:text-5xl">
                  {campaign.brand}
                </h3>
                <p className="mt-4 text-sm font-light leading-relaxed text-white/58 md:text-base">
                  {campaign.description}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 18, scale: 0.99 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="email-preview-frame"
              >
                <div className="flex h-11 items-center justify-between border-b border-white/8 bg-white/[0.035] px-4">
                  <div className="flex gap-2">
                    <span className="h-2 w-2 rounded-full bg-white/20" />
                    <span className="h-2 w-2 rounded-full bg-brand-earth/45" />
                    <span className="h-2 w-2 rounded-full bg-white/12" />
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-[0.24em] text-white/34">
                    Email Preview
                  </span>
                </div>
                <iframe
                  src={campaign.previewSrc}
                  title={campaign.previewTitle}
                  loading="lazy"
                  className="h-[460px] w-full border-0 bg-[#f5efe4] md:h-[580px]"
                />
              </motion.div>

            </div>
          </motion.article>
        ))}
      </div>
    </div>
  </section>
);

const BrowserTopBar = ({ label }: { label: string }) => (
  <div className="flex h-10 items-center justify-between border-b border-white/8 bg-white/[0.035] px-4">
    <div className="flex gap-2">
      <span className="h-2 w-2 rounded-full bg-white/18" />
      <span className="h-2 w-2 rounded-full bg-brand-earth/45" />
      <span className="h-2 w-2 rounded-full bg-white/12" />
    </div>
    <span className="text-[9px] font-bold uppercase tracking-[0.24em] text-white/34">
      {label}
    </span>
  </div>
);

const RevPieLandingPlaceholder = ({ alt }: { alt: string }) => (
  <div
    role="img"
    aria-label={alt}
    className="relative min-h-full overflow-hidden bg-[#f3efe8] text-[#16130f]"
  >
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(185,151,107,0.22),transparent_30%),radial-gradient(circle_at_82%_72%,rgba(35,48,58,0.14),transparent_34%)]" />
    <div className="relative grid min-h-full grid-cols-[0.92fr_1.08fr] gap-5 p-5 sm:p-7">
      <div className="flex flex-col justify-between">
        <div>
          <div className="mb-5 h-2 w-20 rounded-full bg-[#b9976b]/50" />
          <h4 className="max-w-[13rem] font-editorial text-2xl font-semibold leading-none text-[#15120f] sm:text-3xl">
            Monetization built into the user journey.
          </h4>
          <p className="mt-4 max-w-[14rem] text-[10px] font-semibold uppercase leading-relaxed tracking-[0.16em] text-[#16130f]/48">
            A platform-focused landing page designed to explain value clearly.
          </p>
        </div>
        <div className="mt-5 flex gap-2">
          <span className="h-8 w-24 rounded-full bg-[#15120f]" />
          <span className="h-8 w-10 rounded-full border border-[#15120f]/12" />
        </div>
      </div>
      <div className="grid content-center gap-3">
        <div className="rounded-2xl border border-[#15120f]/8 bg-white/72 p-3 shadow-[0_18px_50px_rgba(22,19,15,0.1)]">
          <div className="mb-3 flex items-center justify-between">
            <span className="h-2 w-16 rounded-full bg-[#15120f]/18" />
            <span className="h-6 w-6 rounded-full bg-[#b9976b]/28" />
          </div>
          <div className="grid gap-2">
            <span className="h-10 rounded-xl bg-[#15120f]/8" />
            <span className="h-10 rounded-xl bg-[#b9976b]/18" />
            <span className="h-10 rounded-xl bg-[#15120f]/8" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <span className="h-14 rounded-2xl bg-[#15120f]/8" />
          <span className="h-14 rounded-2xl bg-[#b9976b]/22" />
          <span className="h-14 rounded-2xl bg-[#15120f]/8" />
        </div>
      </div>
    </div>
  </div>
);

const LandingPagePreview = ({ page }: { page: LandingPagePanel }) => (
  <div className="landing-preview-frame">
    <BrowserTopBar label={page.previewType === "iframe" ? "HTML Preview" : "Image Preview"} />
    <div className="landing-preview-canvas">
      {page.previewType === "iframe" && page.previewSrc ? (
        <iframe
          src={page.previewSrc}
          title={page.previewTitle}
          loading="lazy"
          className="h-full w-full border-0 bg-[#f5efe4]"
        />
      ) : page.imageSrc ? (
        <img
          src={page.imageSrc}
          alt={page.alt}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      ) : (
        <RevPieLandingPlaceholder alt={page.alt} />
      )}
    </div>
  </div>
);

const LandingPages = () => (
  <section className="relative overflow-hidden bg-brand-black px-6 py-24 md:py-32">
    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
    <div className="relative z-10 mx-auto max-w-7xl">
      <SectionReveal>
        <p className="mb-10 text-center text-[10px] font-bold uppercase tracking-[0.35em] text-brand-earth/85 md:mb-12">
          LANDING PAGES
        </p>
        <div className="mx-auto mb-12 max-w-5xl text-center md:mb-14">
          <h2 className="font-editorial text-5xl font-semibold leading-none text-white md:text-7xl lg:whitespace-nowrap">
            Pages that move people to act.
          </h2>
        </div>
      </SectionReveal>

      <div className="mx-auto grid max-w-6xl gap-8 md:gap-10">
        {LANDING_PAGES.map((page, index) => (
          <motion.article
            key={page.id}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: index * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="landing-page-card group relative overflow-hidden rounded-[2rem] border border-white/8 bg-white/[0.025] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.35)] transition-all duration-500 hover:-translate-y-1 hover:border-brand-earth/28 hover:shadow-[0_28px_90px_rgba(0,0,0,0.48)] sm:p-5 md:p-6"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_24%_0%,rgba(185,151,107,0.11),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.04),transparent_38%)] opacity-70" />
            <div className="relative z-10 grid gap-6 lg:grid-cols-[0.34fr_0.66fr] lg:items-center">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: 0.1 + index * 0.1, duration: 0.55, ease: "easeOut" }}
                className="lg:pr-4"
              >
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.28em] text-brand-earth/80">
                  {page.pageType}
                </p>
                <h3 className="font-editorial text-4xl font-semibold leading-none text-white md:text-5xl">
                  {page.brand}
                </h3>
                <p className="mt-4 text-sm font-light leading-relaxed text-white/58 md:text-base">
                  {page.description}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 18, scale: 0.99 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                <LandingPagePreview page={page} />
              </motion.div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  </section>
);

const MiniOutcomeGraph = ({ path, dot, index }: { path: string; dot: OutcomeCard["dot"]; index: number }) => {
  const ref = useRef<SVGSVGElement | null>(null);
  const isInView = useInView(ref, { amount: 0.65, once: false });
  const graphDelay = index * 0.08;

  return (
    <svg
      ref={ref}
      className="outcome-graph h-28 w-full overflow-visible md:h-32"
      viewBox="0 0 260 116"
      fill="none"
      role="img"
      aria-label="Minimal upward trend line"
    >
      <motion.path
        d={path}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: [0, 0.34, 0.06] } : { pathLength: 0, opacity: 0 }}
        transition={{
          pathLength: { delay: isInView ? 0.12 + graphDelay : 0, duration: isInView ? 2.15 : 0.01, ease: [0.42, 0, 0.16, 1] },
          opacity: { delay: isInView ? 0.12 + graphDelay : 0, duration: isInView ? 2.15 : 0.01, times: [0, 0.58, 1], ease: "easeInOut" }
        }}
        className="outcome-graph-glow stroke-[#E8D8BC]"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <motion.path
        d={path}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ delay: isInView ? 0.18 + graphDelay : 0, duration: isInView ? 2.05 : 0.01, ease: [0.42, 0, 0.16, 1] }}
        className="outcome-graph-line stroke-[#B9976B]"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <motion.circle
        cx={dot.cx}
        cy={dot.cy}
        r="4.5"
        initial={{ opacity: 0, scale: 0.35 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.35 }}
        transition={{ delay: isInView ? 2.28 + graphDelay : 0, duration: isInView ? 0.42 : 0.01, ease: [0.16, 1, 0.3, 1] }}
        className="outcome-graph-dot fill-[#E8D8BC]"
      />
    </svg>
  );
};

const SelectedOutcomes = () => (
  <section className="relative overflow-hidden bg-brand-black px-6 py-24 md:py-32">
    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
    <div className="relative z-10 mx-auto max-w-7xl">
      <SectionReveal>
        <p className="mb-10 text-center text-[10px] font-bold uppercase tracking-[0.35em] text-brand-earth/85 md:mb-12">
          SELECTED OUTCOMES
        </p>
        <div className="mx-auto mb-12 max-w-5xl text-center md:mb-14">
          <h2 className="font-editorial text-5xl font-semibold leading-none text-white md:text-7xl lg:whitespace-nowrap">
            Measured marketing growth.
          </h2>
        </div>
      </SectionReveal>

      <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-2 md:gap-5">
        {SELECTED_OUTCOMES.map((outcome, index) => (
          <motion.article
            key={outcome.id}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.32 }}
            transition={{ delay: index * 0.06, duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
            className="outcome-card flex min-h-[230px] flex-col justify-between rounded-[1.5rem] border border-white/8 bg-white/[0.025] p-6 transition-colors duration-500 hover:border-brand-earth/28 md:min-h-[250px] md:p-7"
          >
            <div>
              <p className="font-editorial text-6xl font-semibold leading-none text-white md:text-[4.4rem]">
                {outcome.metric}
              </p>
              <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/48 md:text-[11px]">
                {outcome.label}
              </p>
            </div>
            <div className="mt-7 w-full overflow-visible opacity-95 md:mt-8">
              <MiniOutcomeGraph path={outcome.graphPath} dot={outcome.dot} index={index} />
            </div>
            <div className="outcome-card-reveal">
              <p>{outcome.explanation}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  </section>
);

const StandaloneVideoSection = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hasVideoSource = Boolean(STANDALONE_VIDEO.videoMp4 || STANDALONE_VIDEO.videoWebm);

  const handlePlay = () => {
    if (!hasVideoSource || !videoRef.current) {
      return;
    }

    const playPromise = videoRef.current.play();
    if (playPromise) {
      playPromise.catch(() => undefined);
    }
  };

  const handlePause = () => {
    if (!hasVideoSource || !videoRef.current) {
      return;
    }

    videoRef.current.pause();

    try {
      videoRef.current.currentTime = 0;
    } catch {
      // Some browsers can reject seeking before enough metadata is loaded.
    }
  };

  return (
    <section className="relative overflow-hidden bg-brand-black px-6 py-[4.5rem] md:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionReveal>
          <div className="standalone-video-frame">
            {hasVideoSource ? (
              <video
                ref={videoRef}
                muted
                loop
                playsInline
                preload="metadata"
                poster={STANDALONE_VIDEO.poster || undefined}
                className="h-full w-full object-cover"
              >
                {STANDALONE_VIDEO.videoWebm && <source src={STANDALONE_VIDEO.videoWebm} type="video/webm" />}
                {STANDALONE_VIDEO.videoMp4 && <source src={STANDALONE_VIDEO.videoMp4} type="video/mp4" />}
              </video>
            ) : (
              <div className="standalone-video-placeholder" aria-hidden="true" />
            )}
            <div
              className="standalone-video-hover-zone"
              onMouseEnter={handlePlay}
              onMouseLeave={handlePause}
              aria-hidden="true"
            />
          </div>
        </SectionReveal>
      </div>
    </section>
  );
};

const CompetencyMarqueeRow = ({ items, direction = "left" }: { items: string[]; direction?: "left" | "right" }) => {
  const repeatedItems = [...items, ...items];

  return (
    <div className="competency-marquee">
      <div
        className={`competency-marquee-track ${direction === "right" ? "competency-marquee-track-reverse" : ""}`}
        aria-hidden="true"
      >
        {repeatedItems.map((item, index) => (
          <span key={`${item}-${index}`} className="competency-card">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

const CoreCompetenciesMarquee = () => (
  <section className="relative overflow-hidden bg-brand-black px-6 py-24 md:py-32">
    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
    <div className="relative z-10 mx-auto max-w-7xl">
      <SectionReveal>
        <div className="mx-auto mb-14 max-w-4xl text-center md:mb-16">
          <p className="mb-10 text-center text-[10px] font-bold uppercase tracking-[0.35em] text-brand-earth/85 md:mb-12">
            CORE COMPETENCIES
          </p>
          <h2 className="font-editorial text-5xl font-semibold leading-none text-white md:text-7xl">
            Skills across content, ads, email, and automation.
          </h2>
        </div>
      </SectionReveal>

      <ul className="sr-only">
        {[...CORE_COMPETENCY_ROWS.top, ...CORE_COMPETENCY_ROWS.bottom].map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <div className="grid gap-4 md:gap-5">
        <CompetencyMarqueeRow items={CORE_COMPETENCY_ROWS.top} />
        <CompetencyMarqueeRow items={CORE_COMPETENCY_ROWS.bottom} direction="right" />
      </div>
    </div>
  </section>
);

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
        <SelectedOutcomes />
        <StandaloneVideoSection />
        <EmailCampaigns />
        <LandingPages />
        <CoreCompetenciesMarquee />
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
