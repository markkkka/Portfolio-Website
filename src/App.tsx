import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useInView
} from 'motion/react';
import {
  ArrowRight,
  Download,
  Menu,
  Play,
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
  { label: "Contact", href: "#contact" }
];
const SHOW_HEADER_CONTACT = false;

const STANDALONE_VIDEO = {
  videoMp4: "/videos/flower-bloom.mp4",
  videoWebm: "",
  poster: ""
};

type SelectedContentVisual = {
  id: string;
  alt: string;
  caption: "Destination" | "Product" | "Business" | "Podcast" | "Animations";
  posterSrc?: string;
  videoAspect?: string;
} & ({ imageSrc: string; videoSrc?: never } | { videoSrc: string; imageSrc?: never });

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
  description: string;
  previewSrc: string;
  previewTitle: string;
};

type LandingPagePanel = {
  id: string;
  brand: string;
  pageType: string;
  description: string;
  imageSrc: string;
  imageHeight: number;
  alt: string;
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
    id: "consumer",
    label: "Consumer Content",
    description: "Consumer-facing visuals for products, destinations, and lifestyle moments built around clarity, atmosphere, and retail appeal.",
    boardClassName: "bg-[radial-gradient(circle_at_28%_22%,rgba(166,138,86,0.2),transparent_28%),radial-gradient(circle_at_80%_64%,rgba(80,105,92,0.26),transparent_34%),linear-gradient(135deg,#090909_0%,#11100c_48%,#050505_100%)]",
    visuals: [
      {
        id: "destination-vertical",
        imageSrc: "/selected-content/Destination/DSCF0149.JPG",
        alt: "Tipis at a mountain retreat",
        caption: "Destination"
      },
      {
        id: "destination-retreat",
        imageSrc: "/selected-content/Destination/DSCF0308.JPG",
        alt: "Traveler relaxing in an outdoor pool",
        caption: "Destination"
      },
      {
        id: "destination-detail",
        imageSrc: "/selected-content/Destination/DSCF0824.JPG",
        alt: "Outdoor gear beside a mountain lake",
        caption: "Product"
      },
      {
        id: "destination-pagoda",
        imageSrc: "/selected-content/Destination/DSCF2015.JPG",
        alt: "Red pagoda in warm evening light",
        caption: "Destination"
      },
      {
        id: "destination-landscape",
        imageSrc: "/selected-content/Destination/DSCF2173.jpg",
        alt: "Mountain landscape and retreat buildings",
        caption: "Destination"
      },
      {
        id: "destination-landmark",
        imageSrc: "/selected-content/Destination/DSCF2704.JPG",
        alt: "Tower seen from below",
        caption: "Destination"
      },
      {
        id: "destination-architecture",
        imageSrc: "/selected-content/Destination/IMG_2658.JPG",
        alt: "Illuminated pagoda at night",
        caption: "Destination"
      },
      {
        id: "destination-kayak",
        imageSrc: "/selected-content/Destination/IMG_9710.PNG",
        alt: "Guest kayaking beside a hillside retreat",
        caption: "Destination"
      },
      {
        id: "destination-hot-tub",
        imageSrc: "/selected-content/Destination/IMG_9711.PNG",
        alt: "Guest relaxing in an outdoor hot tub by the river",
        caption: "Destination"
      },
      {
        id: "destination-tennis",
        imageSrc: "/selected-content/Destination/IMG_9712.PNG",
        alt: "Two people playing tennis with mountain views",
        caption: "Destination"
      },
      {
        id: "product-motorbike",
        imageSrc: "/selected-content/Product/DE1A5602-2.jpg",
        alt: "Rider on a red electric dirt bike",
        caption: "Product"
      },
      {
        id: "product-crop",
        imageSrc: "/selected-content/Product/GrandTies Main Image.png",
        alt: "GrandTies water bottles in lifestyle campaign imagery",
        caption: "Product"
      },
      {
        id: "product-hero",
        imageSrc: "/selected-content/Product/Product Photo.webp",
        alt: "GrandTies chef knife in its presentation box",
        caption: "Product"
      }
    ]
  },
  {
    id: "business",
    label: "Business Content",
    description: "B2B visuals for platform education, partner-facing campaigns, and professional ideas.",
    boardClassName: "bg-[radial-gradient(circle_at_28%_24%,rgba(185,151,107,0.15),transparent_26%),radial-gradient(circle_at_74%_74%,rgba(100,118,132,0.16),transparent_32%),linear-gradient(135deg,#060606_0%,#101010_48%,#050505_100%)]",
    visuals: [
      {
        id: "business-podcast",
        videoSrc: "/selected-content/Business Content/Podcast.mp4",
        posterSrc: "/selected-content/Business Content/podcast-poster.jpg",
        videoAspect: "16 / 9",
        alt: "RevPie partnerships podcast video",
        caption: "Podcast"
      },
      {
        id: "business-animation",
        videoSrc: "/selected-content/Business Content/P32 CM copy 2.mp4",
        posterSrc: "/selected-content/Business Content/animation-poster.jpg",
        videoAspect: "4 / 5",
        alt: "RevPie campaign animation video",
        caption: "Animations"
      },
      {
        id: "business-partner",
        imageSrc: "/selected-content/Business Content/P33 RevPie + True copy.png",
        alt: "RevPie and True partner campaign graphic",
        caption: "Business"
      },
      {
        id: "business-account-types",
        imageSrc: "/selected-content/Business Content/P39 Account Types copy.png",
        alt: "RevPie managed and self-serve campaign options",
        caption: "Business"
      },
      {
        id: "business-source-bid",
        imageSrc: "/selected-content/Business Content/Source Bid copy.png",
        alt: "RevPie source bidding explainer",
        caption: "Business"
      }
    ]
  }
];

const EMAIL_CAMPAIGNS: EmailCampaign[] = [
  {
    id: "michaelpro",
    brand: "Product Launches",
    description: "New release and product-focused emails designed to introduce features, communicate value, and drive interest.",
    previewSrc: "/emails/michaelpro.html",
    previewTitle: "MichaelPro product email campaign preview"
  },
  {
    id: "grantties",
    brand: "Sale Campaigns",
    description: "Promotional email campaigns built around timely offers, seasonal messaging, and customer conversion.",
    previewSrc: "/emails/grantties.html",
    previewTitle: "GrantTies offer awareness email campaign preview"
  }
];

const LANDING_PAGES: LandingPagePanel[] = [
  {
    id: "grandties",
    brand: "GrandTies",
    pageType: "Ecommerce website",
    description: "Ecommerce page design focused on lifestyle product storytelling, seasonal collections, and retail-driven discovery.",
    imageSrc: "/landing-pages/GrandTies Website.png",
    imageHeight: 9234,
    alt: "GrandTies full-page website preview"
  },
  {
    id: "michaelpro",
    brand: "MichaelPro",
    pageType: "Product website",
    description: "Product-focused websites built to highlight features, communicate value, and support retail-driven customer action.",
    imageSrc: "/landing-pages/MichaelPro Website.png",
    imageHeight: 8838,
    alt: "MichaelPro full-page website preview"
  },
  {
    id: "revpie",
    brand: "RevPie",
    pageType: "B2B platform website",
    description: "B2B website work focused on explaining platform value, simplifying complex offers, and guiding partner interest.",
    imageSrc: "/landing-pages/RevPie Website.png",
    imageHeight: 10672,
    alt: "RevPie full-page website preview"
  }
];

const SELECTED_OUTCOMES: OutcomeCard[] = [
  {
    id: "followers",
    metric: "55,000+",
    label: "Follower Growth",
    explanation: "Audience growth supported through consistent content, social strategy, and brand-focused storytelling.",
    graphPath: "M-35 102 C 5 92, 72 98, 104 76 S 176 50, 252 24",
    dot: { cx: 252, cy: 24 }
  },
  {
    id: "views",
    metric: "5M+",
    label: "Views Generated",
    explanation: "Short-form and campaign-driven content created to expand reach and increase brand visibility.",
    graphPath: "M-35 100 C 1 88, 70 100, 104 82 S 170 28, 252 34",
    dot: { cx: 252, cy: 34 }
  },
  {
    id: "roas",
    metric: "4.2x",
    label: "ROAS on Social Campaigns",
    explanation: "Paid social performance supported through stronger creative, clearer messaging, and campaign optimization.",
    graphPath: "M-35 104 C 2 96, 62 58, 104 66 S 176 58, 252 22",
    dot: { cx: 252, cy: 22 }
  },
  {
    id: "engagement",
    metric: "140%",
    label: "Engagement Growth",
    explanation: "Improved interaction driven by content direction, message clarity, and more relevant creative.",
    graphPath: "M-35 102 C 5 98, 70 72, 106 68 S 180 42, 252 28",
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
    "Website Creation",
    "Website Optimization",
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
  const [videoReady, setVideoReady] = useState(false);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-brand-black">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(166,138,86,0.22),transparent_34%),radial-gradient(circle_at_70%_65%,rgba(255,255,255,0.08),transparent_32%),linear-gradient(135deg,#000000_0%,#0b0b0b_45%,#15110a_100%)]" />
        <motion.video
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1.02, opacity: videoReady ? 1 : 0 }}
          transition={{ duration: 2, ease: "easeOut" }}
          autoPlay
          loop
          muted
          playsInline
          className="absolute min-w-full min-h-full object-cover"
          style={{ filter: 'grayscale(0.2)' }}
          preload="metadata"
          onLoadedData={() => setVideoReady(true)}
          onError={() => setVideoReady(false)}
        >
          <source src={src} type="video/mp4" />
        </motion.video>
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-b from-brand-black/60 via-brand-black/20 to-brand-black/90 pointer-events-none" />
      )}
    </div>
  );
};

const hideBrokenImage = (event: React.SyntheticEvent<HTMLImageElement>) => {
  event.currentTarget.style.visibility = "hidden";
};

const ResumeModal = ({ onClose }: { onClose: () => void }) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-3 backdrop-blur-xl sm:p-6" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-labelledby="resume-dialog-title" className="flex h-[min(90vh,900px)] w-full max-w-[780px] flex-col overflow-hidden rounded-[1.5rem] border border-brand-earth/25 bg-[#11100e] shadow-[0_30px_100px_rgba(0,0,0,0.65)]">
        <div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3 sm:px-6">
          <h2 id="resume-dialog-title" className="font-editorial text-2xl font-semibold text-white sm:text-3xl">Resume</h2>
          <div className="flex items-center gap-2">
            <a href="/resume.pdf" download="Mark-Anastasiadi-Resume.pdf" className="flex min-h-10 items-center gap-2 rounded-full border border-brand-earth/35 px-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/80 transition-colors hover:border-brand-earth hover:text-white">
              <Download size={15} /> Download
            </a>
            <button ref={closeButtonRef} type="button" aria-label="Close resume" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-white/40 hover:text-white">
              <X size={19} />
            </button>
          </div>
        </div>
        <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto bg-white">
          <img src="/images/resume-preview.png" alt="Mark Anastasiadi resume" width={1530} height={1980} loading="eager" decoding="async" onError={hideBrokenImage} className="block h-auto w-full" />
        </div>
      </div>
    </div>,
    document.body
  );
};

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const resumeButtonRef = useRef<HTMLButtonElement>(null);
  const closeResume = () => {
    setResumeOpen(false);
    resumeButtonRef.current?.focus();
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 safe-pt flex items-center ${
        scrolled ? 'py-4 bg-[#000000]/58 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)]' : 'py-4 md:py-6 bg-transparent'
      }`}
    >
      <div className="site-header-inner w-full grid grid-cols-[1fr_auto] md:grid-cols-[1fr_auto_1fr] items-center gap-4">
        <a href="#" className="col-start-1 justify-self-start font-editorial text-[1.5rem] md:text-[1.9rem] font-semibold tracking-normal hover:opacity-85 transition-opacity tap-target !justify-start">
          Mark Anastasiadi
        </a>

        {SHOW_HEADER_CONTACT && <div className="hidden md:flex col-start-2 justify-self-center items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.065] p-1.5 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.16)]">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-6 py-3 text-[13px] font-semibold tracking-[0.09em] text-white/80 transition-all duration-300 hover:bg-white/10 hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>}

        <button
          ref={resumeButtonRef}
          type="button"
          onClick={() => setResumeOpen(true)}
          className="flex col-start-2 justify-self-end items-center min-h-[44px] text-[10px] font-semibold tracking-[0.12em] uppercase text-white/78 transition-colors duration-300 hover:text-white md:col-start-3 md:text-[13px]"
        >
          View Resume
        </button>

        {SHOW_HEADER_CONTACT && <button
          className="mobile-menu-button col-start-2 justify-self-end min-h-[44px] min-w-[44px] items-center justify-center p-2 text-brand-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>}
      </div>

      <AnimatePresence>
        {SHOW_HEADER_CONTACT && mobileMenuOpen && (
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
    {resumeOpen && <ResumeModal onClose={closeResume} />}
    </>
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
            I create content, campaigns, websites, and marketing systems that help consumer brands look sharper, communicate clearly, and grow with intention.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex w-full flex-col items-stretch justify-center gap-4 px-4 sm:w-auto sm:flex-row"
          >
            <a href="#selected-content" className="w-full sm:w-auto px-8 py-4 sm:py-3.5 bg-brand-white text-brand-black rounded-full font-semibold hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.15)] tap-target">
              View Work <ArrowRight size={18} />
            </a>
            <a href="#contact" className="w-full sm:w-auto px-8 py-4 sm:py-3.5 bg-white/[0.03] border border-white/10 rounded-full hover:bg-white/[0.08] text-white/80 font-medium transition-all flex items-center justify-center gap-2 tap-target">
              Get in Touch
            </a>
          </motion.div>
        </motion.div>

        <div className="full-bleed-strip flex min-h-[72px] items-center justify-center bg-brand-black/30 px-6 py-0 text-center backdrop-blur-sm md:min-h-[80px]">
          <p className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[10px] font-bold uppercase leading-none tracking-[0.26em] text-white/50 md:gap-x-8 md:tracking-[0.3em]">
            <span>CONTENT CREATION</span> <span>·</span> <span>EMAIL CAMPAIGNS</span> <span>·</span> <span>WEBSITES</span> <span>·</span> <span>AI AUTOMATION</span>
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
    { company: "SFA", role: "Brand Manager", dates: "2021-2025" },
    { company: "Trend Capital", role: "Marketing & Analytics Manager", dates: "2025-Present" }
  ];

  return (
    <section id="work" className="relative bg-brand-black px-6 py-14 md:py-16 overflow-hidden scroll-mt-24">
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

const SelectedContentVisualCard = ({ visual, isBusiness, isActive, eager }: { visual: SelectedContentVisual; isBusiness: boolean; isActive: boolean; eager: boolean }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playVideo = () => videoRef.current?.play().catch(() => undefined);

  useEffect(() => {
    if (!isActive) videoRef.current?.pause();
  }, [isActive]);

  return (
    <article className="group overflow-hidden rounded-[1.35rem] border border-white/10 bg-[#0c0c0c] shadow-2xl">
      <div className={`selected-content-media aspect-[4/5] overflow-hidden md:aspect-[3/4] ${isBusiness ? visual.videoSrc ? "selected-content-media--business-video" : "selected-content-media--business-image" : ""}`}>
        {isBusiness && visual.videoSrc && (
          <img
            src={visual.posterSrc}
            alt=""
            aria-hidden="true"
            loading={eager ? "eager" : "lazy"}
            decoding="async"
            onError={hideBrokenImage}
            className="selected-content-media-backdrop"
          />
        )}
        {visual.videoSrc ? (
          <div className="relative z-10 flex h-full w-full items-center justify-center">
            <video
              ref={videoRef}
              src={visual.videoSrc}
              poster={visual.posterSrc}
              aria-label={visual.alt}
              preload="metadata"
              playsInline
              controls={isPlaying}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
              style={{ aspectRatio: visual.videoAspect }}
              className="selected-content-media-foreground block max-h-full w-full bg-transparent object-contain"
            />
            {!isPlaying && (
              <button
                type="button"
                aria-label={`Play ${visual.caption.toLowerCase()} video`}
                onClick={playVideo}
                className="absolute inset-0 flex items-center justify-center bg-black/15 transition-colors hover:bg-black/30"
              >
                <span className="grid h-16 w-16 place-items-center rounded-full border border-white/40 bg-black/55 text-white shadow-[0_8px_30px_rgba(0,0,0,0.4)] backdrop-blur-sm">
                  <Play size={24} fill="currentColor" />
                </span>
              </button>
            )}
          </div>
        ) : (
          <img
            src={visual.imageSrc}
            alt={visual.alt}
            loading={eager ? "eager" : "lazy"}
            decoding="async"
            onError={hideBrokenImage}
            className={`selected-content-media-foreground relative z-10 block h-full w-full object-cover transition-transform duration-500 ${isBusiness ? "" : "group-hover:scale-[1.04]"}`}
          />
        )}
      </div>
      <p className="px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60">
        {visual.caption}
      </p>
    </article>
  );
};

const SelectedContent = () => {
  const [activeCategoryId, setActiveCategoryId] = useState(SELECTED_CONTENT_CATEGORIES[0].id);
  const activeCategory = SELECTED_CONTENT_CATEGORIES.find((category) => category.id === activeCategoryId) || SELECTED_CONTENT_CATEGORIES[0];
  const contentScrollRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const scrollContent = (direction: number) => {
    const container = contentScrollRefs.current[activeCategory.id];
    if (!container) return;
    const card = container.firstElementChild as HTMLElement | null;
    container.scrollBy({ left: direction * ((card?.offsetWidth ?? container.clientWidth) + 16), behavior: "smooth" });
  };

  return (
    <section id="selected-content" className="relative overflow-hidden bg-brand-black px-6 pb-16 pt-16 scroll-mt-24 md:pb-20 md:pt-20">
      <div className="relative z-10 mx-auto max-w-7xl">
        <SectionReveal>
          <p className="mb-10 text-center text-[10px] font-bold uppercase tracking-[0.35em] text-brand-earth/85 md:mb-12">
            Content Creation
          </p>

          <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
            <div className="max-w-xl">
              <h2 className="mb-6 font-editorial text-5xl font-semibold leading-none text-white md:text-7xl">
                Selected Content
              </h2>
              <p className="mb-9 text-base font-light leading-relaxed text-white/62 md:text-lg">
                A visual archive of consumer and business content created for clear, compelling brand storytelling.
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

              <p className="mb-5 min-h-[4.5rem] text-sm font-light leading-relaxed text-white/58 md:text-base">
                {activeCategory.description}
              </p>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] border border-white/8 bg-white/[0.025] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.36)] backdrop-blur-md sm:p-5 md:p-6">
              <div className={`absolute inset-0 ${activeCategory.boardClassName}`} />
              <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.08),transparent_30%,rgba(0,0,0,0.35)_100%)]" />
              <div className="absolute left-6 top-6 z-20 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.24em] text-white/50 backdrop-blur-md">
                {activeCategory.label}
              </div>

              {SELECTED_CONTENT_CATEGORIES.map((category) => {
                const isActive = category.id === activeCategory.id;
                return (
                  <div key={category.id} hidden={!isActive} className="relative z-10 pt-14 md:pt-16">
                    {category.visuals.length > 0 ? (
                      <>
                        <div ref={(element) => { contentScrollRefs.current[category.id] = element; }} className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
                          {category.visuals.map((visual, index) => (
                            <div key={visual.id} className="w-[78%] shrink-0 snap-start sm:w-[46%] lg:w-[31%]">
                              <SelectedContentVisualCard visual={visual} isBusiness={category.id === "business"} isActive={isActive} eager={index < 3} />
                            </div>
                          ))}
                        </div>
                        <div className="mt-5 flex justify-end gap-2">
                          <button type="button" aria-label={`Scroll ${category.label.toLowerCase()} left`} onClick={() => scrollContent(-1)} className="grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-black/30 text-white/75 transition-colors hover:border-brand-earth/60 hover:text-white">
                            <ArrowRight size={17} className="rotate-180" />
                          </button>
                          <button type="button" aria-label={`Scroll ${category.label.toLowerCase()} right`} onClick={() => scrollContent(1)} className="grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-black/30 text-white/75 transition-colors hover:border-brand-earth/60 hover:text-white">
                            <ArrowRight size={17} />
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="h-[280px] md:h-[360px]" />
                    )}
                  </div>
                );
              })}

              <div className="absolute inset-x-8 bottom-8 h-px bg-gradient-to-r from-transparent via-brand-earth/35 to-transparent" />
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
};

const EmailCampaigns = () => (
  <section className="relative overflow-hidden bg-brand-black px-6 py-16 md:py-20">
    <div className="relative z-10 mx-auto max-w-7xl">
      <SectionReveal>
        <p className="mb-10 text-center text-[10px] font-bold uppercase tracking-[0.35em] text-brand-earth/85 md:mb-12">
          EMAIL CAMPAIGNS
        </p>
        <div className="mx-auto mb-12 max-w-5xl text-center md:mb-14">
          <h2 className="font-editorial text-5xl font-semibold leading-none text-white md:text-7xl lg:whitespace-nowrap">
            Built for clicks, conversions and sales.
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
                <h3 className="font-editorial text-4xl font-semibold leading-none text-white md:text-5xl">
                  {campaign.brand}
                </h3>
                <p className="mt-4 text-sm font-light leading-relaxed text-white/58 md:text-base">
                  {campaign.description}
                </p>
              </motion.div>

              <div className="email-preview-frame">
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
                  className="block h-[460px] w-full border-0 bg-[#f5efe4] md:h-[580px]"
                />
              </div>

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
    <span className="text-[9px] font-bold uppercase tracking-[0.24em] text-white/34">{label}</span>
  </div>
);

const LandingPagePreview = ({ page }: { page: LandingPagePanel }) => {
  const frameRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(frameRef, { once: true, amount: 0.35 });
  const [canScrollPreview, setCanScrollPreview] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupDismissed, setPopupDismissed] = useState(false);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const observer = new IntersectionObserver(([entry]) => {
      const viewportHeight = entry.rootBounds?.height ?? window.innerHeight;
      const visibleHeight = Math.min(entry.boundingClientRect.height, viewportHeight);
      setCanScrollPreview(visibleHeight > 0 && entry.intersectionRect.height / visibleHeight >= 0.85);
    }, { threshold: Array.from({ length: 21 }, (_, index) => index / 20) });

    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (page.id !== "grandties" || !isInView || popupDismissed) return;
    const popupImage = new Image();
    popupImage.src = "/landing-pages/GrandTies Popup.png";
    const timer = window.setTimeout(() => setShowPopup(true), 3500);
    return () => window.clearTimeout(timer);
  }, [page.id, isInView, popupDismissed]);

  return (
    <div ref={frameRef} className="landing-preview-frame">
      <BrowserTopBar label="Website Preview" />
      <div className={`landing-preview-canvas${canScrollPreview ? " landing-preview-canvas--interactive" : ""}`} tabIndex={canScrollPreview ? 0 : -1} aria-label={`Scroll ${page.brand} website screenshot`}>
        <div className={`landing-preview-document ${page.id === "michaelpro" ? "landing-preview-document--michaelpro" : ""}`}>
          <img src={page.imageSrc} alt={page.alt} width={2940} height={page.imageHeight} loading="lazy" decoding="async" onError={hideBrokenImage} />
          {page.id === "revpie" && (
            <div className="revpie-marquee-section" aria-hidden="true">
              <div className="revpie-marquee-track">
                <span>We generate industry leading revenue for publishers and advertisers.</span>
                <span>We generate industry leading revenue for publishers and advertisers.</span>
              </div>
              <p>Our diverse reach spans multiple verticals. We drive results in fintech, rewards, home services, insurance, and more.</p>
              <span className="revpie-marquee-button">Get Started</span>
            </div>
          )}
        </div>
      </div>
      {showPopup && (
        <div className="grandties-popup" role="dialog" aria-label="GrandTies promotional preview">
          <div className="grandties-popup-image">
            <img
              src="/landing-pages/GrandTies Popup.png"
              alt="GrandTies first purchase discount promotion"
              width={1370}
              height={1286}
              loading="eager"
              decoding="async"
              onError={hideBrokenImage}
            />
            <button
              type="button"
              className="grandties-popup-close"
              aria-label="Close GrandTies promotion"
              onClick={() => {
                setShowPopup(false);
                setPopupDismissed(true);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const LandingPages = () => (
  <section className="relative overflow-hidden bg-brand-black px-6 py-16 md:py-20">
    <div className="relative z-10 mx-auto max-w-7xl">
      <SectionReveal>
        <p className="mb-10 text-center text-[10px] font-bold uppercase tracking-[0.35em] text-brand-earth/85 md:mb-12">
          WEBSITES
        </p>
        <div className="mx-auto mb-12 max-w-5xl text-center md:mb-14">
          <h2 className="font-editorial text-5xl font-semibold leading-none text-white md:text-7xl lg:whitespace-nowrap">
            Pages built to convert.
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

              <div>
                <LandingPagePreview page={page} />
              </div>
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
  <section className="relative overflow-hidden bg-brand-black px-6 py-16 md:py-20">
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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const hasVideoSource = Boolean(STANDALONE_VIDEO.videoMp4 || STANDALONE_VIDEO.videoWebm);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const frame = frameRef.current;
    if (!video || !canvas || !frame) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let scrollFrame: number | null = null;
    let targetTime = 0;
    let lastRenderedTime = -1;

    const renderFrame = () => {
      if (video.readyState < 2 || !video.videoWidth) return;
      const width = Math.min(video.videoWidth, Math.max(1, Math.ceil(frame.clientWidth * window.devicePixelRatio)));
      const height = Math.round(width * video.videoHeight / video.videoWidth);
      if (canvas.width === width && Math.abs(video.currentTime - lastRenderedTime) < 0.01) return;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) return;
      context.drawImage(video, 0, 0, width, height);
      const pixels = context.getImageData(0, 0, width, height);
      for (let i = 0; i < pixels.data.length; i += 4) {
        const red = pixels.data[i];
        const green = pixels.data[i + 1];
        const blueCast = pixels.data[i + 2] - red;
        if (blueCast > 5 && green >= red - 2) {
          pixels.data[i + 3] = Math.max(0, 255 - (blueCast - 5) * 28);
        }
      }
      context.putImageData(pixels, 0, 0);
      lastRenderedTime = video.currentTime;
    };

    const seekToTarget = () => {
      if (video.readyState < 2 || !Number.isFinite(video.duration) || video.seeking) return;
      if (Math.abs(video.currentTime - targetTime) < 0.04) {
        renderFrame();
      } else {
        video.currentTime = targetTime;
      }
    };

    const updateFromScroll = () => {
      scrollFrame = null;
      const viewportHeight = window.innerHeight;
      const progress = Math.min(1, Math.max(0, (viewportHeight - frame.getBoundingClientRect().top) / (viewportHeight * 0.82)));
      // The source opens in its first half, then closes in its second half.
      targetTime = reducedMotion.matches ? 0 : progress * video.duration / 2;
      seekToTarget();
    };

    const scheduleScrollUpdate = () => {
      if (scrollFrame === null) scrollFrame = requestAnimationFrame(updateFromScroll);
    };

    const handleSeeked = () => {
      renderFrame();
      if (Math.abs(video.currentTime - targetTime) >= 0.04) seekToTarget();
    };

    const handleLoadedData = () => {
      renderFrame();
      scheduleScrollUpdate();
    };

    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("seeked", handleSeeked);
    window.addEventListener("scroll", scheduleScrollUpdate, { passive: true });
    window.addEventListener("resize", scheduleScrollUpdate);
    reducedMotion.addEventListener("change", scheduleScrollUpdate);
    if (video.readyState >= 2) handleLoadedData();

    return () => {
      if (scrollFrame !== null) cancelAnimationFrame(scrollFrame);
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("seeked", handleSeeked);
      window.removeEventListener("scroll", scheduleScrollUpdate);
      window.removeEventListener("resize", scheduleScrollUpdate);
      reducedMotion.removeEventListener("change", scheduleScrollUpdate);
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-brand-black px-6 py-12 md:py-16">
      <div className="mx-auto max-w-6xl">
        <SectionReveal>
          <div ref={frameRef} className="standalone-video-frame">
            {hasVideoSource ? (
              <>
                <video
                  ref={videoRef}
                  muted
                  playsInline
                  preload="auto"
                  poster={STANDALONE_VIDEO.poster || undefined}
                  className="pointer-events-none absolute inset-0 h-full w-full opacity-0"
                  aria-hidden="true"
                >
                  {STANDALONE_VIDEO.videoWebm && <source src={STANDALONE_VIDEO.videoWebm} type="video/webm" />}
                  {STANDALONE_VIDEO.videoMp4 && <source src={STANDALONE_VIDEO.videoMp4} type="video/mp4" />}
                </video>
                <canvas ref={canvasRef} className="h-full w-full object-cover" aria-label="Flower blooming" role="img" />
              </>
            ) : (
              <div className="standalone-video-placeholder" aria-hidden="true" />
            )}
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
  <section className="relative overflow-hidden bg-brand-black px-6 py-16 md:py-20">
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

const ContactSection = () => (
  <section id="contact" className="py-16 md:py-20 px-6 bg-[#050505] scroll-mt-24">
    <div className="max-w-7xl mx-auto">
      <SectionReveal>
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.75fr)] lg:gap-20">
          <div className="max-w-3xl">
            <span className="text-[10px] font-bold tracking-[0.35em] uppercase text-brand-earth mb-5 block">
              Contact
            </span>
            <h2 className="mb-6 font-editorial text-3xl font-semibold leading-none text-white md:text-5xl">
              Get in touch
            </h2>
            <p className="text-base md:text-lg text-white/55 font-light leading-relaxed mb-10">
              Interested in working together or viewing more examples of my work?
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="https://www.linkedin.com/in/mark-anastasiadi-1388481bb/" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto px-7 py-3.5 bg-white/[0.03] border border-white/10 rounded-full hover:bg-white/[0.08] text-white/80 font-medium transition-all flex items-center justify-center gap-2 tap-target">
                LinkedIn
              </a>
              <a href="https://www.instagram.com/markkiadi/" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto px-7 py-3.5 bg-white/[0.03] border border-white/10 rounded-full hover:bg-white/[0.08] text-white/80 font-medium transition-all flex items-center justify-center gap-2 tap-target">
                Instagram
              </a>
              <a href="mailto:mark.anastasiadi@gmail.com" className="w-full sm:w-auto px-7 py-3.5 bg-brand-white text-brand-black rounded-full font-semibold hover:bg-white/90 transition-all flex items-center justify-center gap-2 tap-target">
                Email
              </a>
            </div>
          </div>
          <div className="portrait-orbit mx-auto aspect-[4/5] w-full max-w-[360px] overflow-hidden rounded-[1.75rem] border border-white/8 bg-[#11100e] shadow-[0_24px_70px_rgba(0,0,0,0.35)] lg:ml-auto">
            <img
              src="/images/mark-portrait.jpg"
              alt="Portrait of Mark Anastasiadi"
              width={945}
              height={1315}
              loading="lazy"
              decoding="async"
              onError={hideBrokenImage}
              className="block h-full w-full object-cover object-top"
            />
          </div>
        </div>
      </SectionReveal>
    </div>
  </section>
);

const CompactFooter = () => (
  <footer className="bg-[#050505] px-6 pb-8 pt-3 text-center text-[10px] font-medium uppercase tracking-[0.18em] text-white/35 md:pb-10">
    © {new Date().getFullYear()} Mark Anastasiadi. All rights reserved.
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

      <main>
        <Hero />
        <BrandExperienceStrip />
        <SelectedContent />
        <SelectedOutcomes />
        <StandaloneVideoSection />
        <EmailCampaigns />
        <LandingPages />
        <CoreCompetenciesMarquee />
        <ContactSection />
      </main>
      <CompactFooter />
    </div>
  );
}
