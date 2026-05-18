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
            Brand Experience
          </p>

          <div className="grid gap-8 md:grid-cols-2 md:gap-0 rounded-[1.75rem] border border-white/8 bg-white/[0.025] backdrop-blur-md">
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
