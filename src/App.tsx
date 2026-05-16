import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { 
  motion, 
  AnimatePresence, 
  useScroll, 
  useTransform, 
  useInView 
} from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  ArrowRight, 
  CheckCircle2, 
  Mail, 
  Calendar, 
  ChevronDown, 
  Instagram, 
  Menu, 
  X,
  Target,
  Zap,
  BarChart3,
  Search,
  Layout,
  Camera
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

// --- Helper Components ---
interface SectionRevealProps {
  children: React.ReactNode;
  className?: string;
  key?: React.Key;
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

const VideoBackground = ({ src, overlay = true }: { src: string, overlay?: boolean }) => (
  <div className="absolute inset-0 z-0 overflow-hidden">
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
    >
      <source src={src} type="video/mp4" />
    </motion.video>
    {overlay && (
      <div className="absolute inset-0 bg-gradient-to-b from-brand-black/60 via-brand-black/20 to-brand-black/90 pointer-events-none" />
    )}
  </div>
);

const MobileSlider = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`flex flex-col gap-6 md:grid ${className}`}>
    {children}
  </div>
);

const Marquee = ({ items, reverse = false }: { items: string[], reverse?: boolean }) => {
  return (
    <div className="flex w-full overflow-hidden whitespace-nowrap [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <motion.div
        className="flex shrink-0 items-center"
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        {[...items, ...items, ...items, ...items].map((item, i) => (
          <div key={i} className="mx-2 p-6 md:p-8 border border-white/5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] hover:border-brand-earth/20 transition-colors flex items-center justify-center text-center min-w-[200px] md:min-w-[280px]">
            <span className="text-sm font-medium tracking-wide uppercase text-white/70">{item}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

// --- Main Components ---

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
        scrolled ? 'py-4 bg-[#000000]/80 backdrop-blur-md border-b border-white/5' : 'py-6 md:py-8 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 safe-px flex justify-between items-center w-full">
        <a href="#" className="font-display text-2xl font-bold tracking-tighter hover:opacity-80 transition-opacity tap-target !justify-start">
          CNOR CREATIVE
        </a>
        
        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
          <a href="#services" className="hover:text-brand-earth transition-colors hover-underline">Services</a>
          <a href="#process" className="hover:text-brand-earth transition-colors hover-underline">Process</a>
          <a href="#contact" className="px-6 py-2.5 bg-brand-white text-brand-black rounded-full hover:bg-white/80 transition-colors shadow-sm font-semibold">
            Book a Call
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 text-brand-white tap-target"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 pt-[80px] safe-pt bg-[#000000]/98 backdrop-blur-xl z-40 p-10 safe-px safe-pb flex flex-col gap-8 md:hidden h-screen overflow-y-auto"
          >
            <a href="#services" onClick={() => setMobileMenuOpen(false)} className="text-3xl font-display tap-target !justify-start">Services</a>
            <a href="#process" onClick={() => setMobileMenuOpen(false)} className="text-3xl font-display tap-target !justify-start">Process</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="text-3xl font-display text-brand-earth border-t border-white/10 pt-8 mt-4 tap-target !justify-start">Book a Call</a>
            <div className="mt-auto flex gap-6 pb-12">
              <a href="mailto:connor@cnor.creative" className="p-4 rounded-full border border-white/10 shrink-0 tap-target"><Mail size={24} /></a>
              <a href="#" className="p-4 rounded-full border border-white/10 shrink-0 tap-target"><Instagram size={24} /></a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      <VideoBackground src={VIDEOS.hero} />
      
      <motion.div 
        style={{ y, opacity }}
        className="relative z-10 max-w-5xl mx-auto px-6 text-center"
      >
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-block mb-6 text-xs font-bold tracking-[0.4em] uppercase text-brand-earth"
        >
          CNOR CREATIVE
        </motion.span>
        
        <div className="text-5xl md:text-7xl lg:text-[5.5rem] font-display font-medium tracking-tighter leading-[0.95] mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-brand-white"
          >
            Creative marketing systems
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-white/40 italic font-light mt-1 md:mt-2"
          >
            built to move.
          </motion.div>
        </div>

        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="max-w-2xl mx-auto text-base md:text-lg text-brand-white/70 leading-relaxed font-light mb-12 px-4"
        >
          We help product, outdoor, lifestyle, and e-commerce brands connect creative direction, 
          paid media, and automation into one sharper growth system.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-stretch justify-center gap-4 px-4 w-full sm:w-auto"
        >
          <a href="#contact" className="w-full sm:w-auto px-8 py-4 sm:py-3.5 bg-brand-white text-brand-black rounded-full font-semibold hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.15)] tap-target">
            Book a call <ArrowRight size={18} />
          </a>
          <a href="mailto:connor@cnor.creative" className="w-full sm:w-auto px-8 py-4 sm:py-3.5 bg-white/[0.03] border border-white/10 rounded-full hover:bg-white/[0.08] text-white/80 font-medium transition-all flex items-center justify-center gap-2 tap-target">
            Email CNOR Creative
          </a>
        </motion.div>
      </motion.div>

      <motion.div 
        animate={{ y: [0, 10, 0] }} 
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-24 sm:bottom-10 left-1/2 -translate-x-1/2 text-white/40 cursor-pointer tap-target"
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        aria-label="Scroll down"
      >
        <ChevronDown size={32} strokeWidth={1.5} />
      </motion.div>

      <div className="hidden sm:flex absolute bottom-0 left-0 right-0 p-8 safe-pb justify-center border-t border-white/5 bg-brand-black/20 backdrop-blur-sm">
        <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/50 flex flex-wrap justify-center gap-x-8 gap-y-2 text-center">
          <span>Strategy</span> <span>•</span> <span>Paid Media</span> <span>•</span> <span>Shopify</span> <span>•</span> <span>Creative Direction</span> <span>•</span> <span>Reporting</span> <span>•</span> <span>Automation</span>
        </p>
      </div>
    </section>
  );
};

const TextReveal = ({ children }: { children: string }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 85%", "end 50%"]
  });

  const words = children.split(" ");
  return (
    <p ref={containerRef} className="text-2xl md:text-4xl lg:text-5xl font-display tracking-tight leading-[1.3] flex flex-wrap gap-x-2 gap-y-1 md:gap-x-3">
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + (1 / words.length);
        const opacity = useTransform(scrollYProgress, [start, end], [0.15, 1]);
        const y = useTransform(scrollYProgress, [start, end], [10, 0]);
        return (
          <motion.span key={i} style={{ opacity, y }} className="inline-block relative text-brand-black">
            {word}
          </motion.span>
        );
      })}
    </p>
  );
};

const Introduction = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    
    mm.add("(prefers-reduced-motion: no-preference)", () => {
        const items = gsap.utils.toArray('.intro-pillar');
        gsap.fromTo(items, 
            { y: 80, autoAlpha: 0, scale: 0.95 },
            {
                y: 0,
                autoAlpha: 1,
                scale: 1,
                duration: 1,
                stagger: 0.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 75%",
                }
            }
        );
    });

    return () => mm.revert();
  }, []);

  return (
    <section className="py-32 md:py-56 px-6 bg-brand-white overflow-hidden relative">
      <div className="absolute top-0 right-0 w-1/2 h-[500px] bg-brand-earth/5 mix-blend-multiply blur-[100px] rounded-full pointer-events-none transition-transform duration-[10s] hover:scale-110" />
      <div className="absolute bottom-0 left-0 w-1/3 h-[400px] bg-brand-earth/5 mix-blend-multiply blur-[100px] rounded-full pointer-events-none transition-transform duration-[15s] hover:scale-110" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-32 max-w-5xl">
          <TextReveal>
            Most brands do not have one marketing problem. They have disconnected ads, scattered creative, unclear reporting, under-optimized pages, and automations that do not connect to decisions.
          </TextReveal>
          
          <div className="mt-16 md:mt-24 pl-4 md:pl-6 border-l-2 border-brand-earth">
            <SectionReveal>
              <h2 className="text-2xl md:text-4xl font-display font-medium tracking-tight text-brand-black max-w-3xl italic">
                CNOR Creative brings the pieces together.
              </h2>
            </SectionReveal>
          </div>
        </div>

        <div ref={containerRef} className="grid md:grid-cols-3 gap-12 md:gap-16 relative">
          <div className="absolute top-0 left-0 right-0 h-px bg-brand-black/5 hidden md:block" />
          {[
            { title: "See what is working.", desc: "Clear reporting that leads to faster decisions and eliminates wasted ad spend." },
            { title: "Sharpen what people see.", desc: "Creative direction that speaks to real performance, backed by audience data." },
            { title: "Build systems that improve.", desc: "Marketing funnels and automations that get easier to run every single week." }
          ].map((item, i) => (
            <div key={i} className="intro-pillar flex flex-col pt-8 md:pt-12 border-t md:border-t-0 border-brand-black/5 group">
              <div className="flex items-center gap-4 mb-6 text-brand-earth">
                <span className="font-display text-2xl md:text-3xl font-light opacity-40 group-hover:opacity-100 transition-opacity">0{i + 1}</span>
              </div>
              <h3 className="text-xl md:text-2xl font-display font-medium mb-3 max-w-[250px] leading-snug group-hover:-translate-y-1 transition-transform duration-500 text-brand-black">
                {item.title}
              </h3>
              <p className="text-brand-black/60 font-light text-base leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const SplitMedia = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const mm = gsap.matchMedia();
    
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const scaledVideo = videoRef.current;
      if (!scaledVideo) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=120%",
          scrub: true,
          pin: true,
        }
      });

      // Zoom background video smoothly
      tl.to(scaledVideo, 
        { scale: 1.2, ease: "none" }
      );

      // Card fades in gracefully
      gsap.fromTo(contentRef.current, 
        { autoAlpha: 0, y: 50 },
        { 
          autoAlpha: 1, 
          y: 0, 
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 20%",
          }
        }
      );
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(contentRef.current, { autoAlpha: 1, y: 0 });
      gsap.set(videoRef.current, { scale: 1 });
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative h-screen bg-brand-black text-brand-white overflow-hidden flex items-center justify-center border-t border-white/5">
      <div className="absolute inset-0 flex items-center justify-center z-0 overflow-hidden bg-brand-black">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover will-change-transform origin-center"
          style={{ filter: 'grayscale(0.2)' }}
        >
          <source src={VIDEOS.split} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-brand-black/50" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 safe-px flex items-center justify-center md:justify-end h-full">
        <div className="w-full md:w-[50%] lg:w-[40%] text-left">
          <div ref={contentRef} className="p-6 sm:p-8 md:p-12 lg:p-14 bg-black/40 backdrop-blur-3xl border border-white/10 rounded-3xl md:rounded-[2.5rem] shadow-2xl">
            <span className="text-[10px] md:text-xs font-bold tracking-[0.4em] uppercase text-brand-earth mb-6 block">CORE PHILOSOPHY</span>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-display font-medium tracking-tight mb-6 text-white leading-tight">
              Creative direction backed by performance thinking.
            </h2>
            <p className="text-sm md:text-base text-white/60 font-light leading-relaxed mb-10">
              The work should look good, but it also needs to sell, teach, convert, and report. 
              CNOR Creative connects the visual side of brand-building with the practical systems 
              that turn attention into measurable growth.
            </p>
            <ul className="grid gap-4">
              {["Systematic creative development", "Data-informed hooks & concepts", "Seamless Shopify integration"].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-white/70 text-sm font-light">
                  <div className="w-1 h-1 rounded-none bg-white/50" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

const Services = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const services = [
    { title: "Growth Strategy", icon: <Target />, desc: "Turn scattered tactics into a clear plan for what to fix, test, build, and measure.", tags: ["Roadmap", "Audits"] },
    { title: "Paid Media Systems", icon: <Zap />, desc: "Structure Meta and Google campaigns around clearer testing, cleaner decisions, and stronger feedback.", tags: ["Meta", "Google"] },
    { title: "Shopify & Landing Pages", icon: <Layout />, desc: "Improve the path from first impression to product understanding to checkout.", tags: ["CRO", "Shopify"] },
    { title: "Creative Direction", icon: <Camera />, desc: "Build hooks, concepts, content briefs, UGC angles, and campaign ideas with performance in mind.", tags: ["Hooks", "Production"] },
    { title: "Reporting & Analytics", icon: <BarChart3 />, desc: "Turn weekly performance into decision-ready summaries instead of messy spreadsheets.", tags: ["Dashboards", "LTV"] },
    { title: "Marketing Automation", icon: <Search />, desc: "Use AI and workflow automation to reduce repetitive work and connect tools.", tags: ["AI", "Workflows"] }
  ];

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const cards = gsap.utils.toArray('.service-card') as HTMLElement[];
      
      gsap.fromTo(cards, 
        { opacity: 0, scale: 0.95, x: (i) => i % 2 === 0 ? -40 : 40 },
        { 
          opacity: 1, 
          scale: 1, 
          x: 0, 
          duration: 1, 
          stagger: 0.15, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".services-grid",
            start: "top 75%",
          }
        }
      );
    });

    mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
      const cards = gsap.utils.toArray('.service-card') as HTMLElement[];
      
      gsap.fromTo(cards, 
        { opacity: 0, y: 40 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          stagger: 0.15, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".services-grid",
            start: "top 85%",
          }
        }
      );
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="services" ref={containerRef} className="py-24 md:py-32 bg-[#050505] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 safe-px">
        <div className="mb-16 md:mb-24">
          <SectionReveal>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-medium tracking-tighter mb-6 text-white">What CNOR Creative builds.</h2>
            <p className="text-white/50 max-w-xl text-lg font-light leading-relaxed">
              We specialize in the intersection of high-end brand storytelling and the technical systems 
              required to grow a modern product business.
            </p>
          </SectionReveal>
        </div>

        <div className="services-grid grid md:grid-cols-2 gap-6 lg:gap-8 pb-20">
          {services.map((item, i) => (
            <div 
              key={i} 
              className="service-card w-full"
            >
              <div className="group h-full p-6 sm:p-8 md:p-10 bg-[#111111] border border-white/5 rounded-3xl flex flex-col justify-between gap-8 md:gap-12 transition-all duration-300 hover:border-white/15 overflow-hidden relative">
                
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                
                <div className="relative z-10 flex flex-col h-full justify-between gap-8 md:gap-12">
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-xl bg-[#1A1A1A] flex items-center justify-center text-white border border-white/5 transition-all duration-300 group-hover:bg-white/10">
                        {item.icon}
                    </div>
                    <div className="text-white font-display text-4xl md:text-5xl font-light opacity-10 transition-all duration-500">
                        0{i + 1}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl md:text-2xl font-display font-medium mb-3 text-white tracking-tight group-hover:text-white transition-colors duration-300">{item.title}</h3>
                    <p className="text-sm md:text-base text-white/50 font-light leading-relaxed mb-6">{item.desc}</p>
                    
                    <div className="flex flex-wrap gap-2">
                        {item.tags.map(tag => (
                        <span key={tag} className="text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 bg-white/5 border border-white/5 rounded-full text-white/50 group-hover:border-white/10 group-hover:bg-white/10 group-hover:text-white/80 transition-all duration-300">
                            {tag}
                        </span>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ParallaxVideo = ({ src, overlay = true }: { src: string, overlay?: boolean }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
        scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
        }
        });

        // Animate the video's vertical position for a parallax effect
        tl.fromTo(videoRef.current, 
        { y: "-15%" },
        { y: "15%", ease: "none" }
        );
    });

    return () => mm.revert();
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute w-full h-[130%] -top-[15%] object-cover"
        style={{ filter: 'grayscale(0.2)' }}
        preload="metadata"
      >
        <source src={src} type="video/mp4" />
      </video>
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-b from-brand-black/90 via-brand-black/40 to-brand-black/90 pointer-events-none z-10" />
      )}
    </div>
  );
};

const StudioReel = () => {
    const textRef = useRef<HTMLHeadingElement>(null);

    useLayoutEffect(() => {
        gsap.registerPlugin(ScrollTrigger);
        const mm = gsap.matchMedia();

        mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
            if (!textRef.current) return;
            const lines = gsap.utils.toArray('.reel-line', textRef.current);
            gsap.fromTo(lines, 
                { y: 50, autoAlpha: 0, rotationX: -20 },
                { 
                    y: 0, autoAlpha: 1, rotationX: 0, 
                    duration: 1.2, stagger: 0.1, ease: "power3.out",
                    scrollTrigger: { trigger: textRef.current, start: "top 80%" }
                }
            );
        });
        return () => mm.revert();
    }, []);

    return (
        <section className="relative py-24 md:py-40 px-6 bg-brand-black text-brand-white overflow-hidden">
            <ParallaxVideo src={VIDEOS.reel1} overlay={true} />
            <div className="relative z-10 max-w-7xl mx-auto flex flex-col gap-20 h-full justify-between items-start min-h-[60vh]">
            <div className="w-full max-w-3xl">
                <SectionReveal>
                    <div className="xl:p-14 md:p-10 p-6 bg-brand-black/30 backdrop-blur-xl md:backdrop-blur-2xl border border-white/10 rounded-[2rem] md:rounded-[3rem] shadow-2xl">
                        <h2 ref={textRef} className="text-3xl md:text-5xl lg:text-5xl font-display font-medium tracking-tighter leading-[1.15] mb-6 [perspective:1000px]">
                            <div className="reel-line will-change-transform">Built for brands with</div>
                            <div className="reel-line text-brand-earth italic font-light will-change-transform">products, places,</div>
                            <div className="reel-line text-brand-earth italic font-light will-change-transform">and stories.</div>
                        </h2>
                        <SectionReveal>
                            <p className="mt-6 text-base md:text-lg text-white/70 font-light leading-relaxed max-w-xl">
                            The best marketing systems do not erase the brand. They make the brand easier to see, 
                            easier to understand, and easier to act on.
                            </p>
                        </SectionReveal>
                    </div>
                </SectionReveal>
            </div>

            <div className="w-full flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-8 -mx-6 px-6 md:pb-0 md:mx-0 md:px-0">
                {[
                { num: "01", title: "Outdoor / Lifestyle Content" },
                { num: "02", title: "Product Storytelling" },
                { num: "03", title: "Campaign Motion" }
                ].map((item, i) => (
                <div key={i} className="min-w-[85vw] snap-center shrink-0 md:min-w-0 md:w-1/3 p-8 bg-black/40 backdrop-blur-md rounded-[2rem] flex flex-col gap-6 hover:bg-black/60 transition-colors border border-white/5 shadow-xl group">
                    <span className="text-brand-earth font-bold text-xs uppercase tracking-[0.3em]">{item.num}</span>
                    <h3 className="text-xl md:text-2xl font-display font-medium text-white group-hover:text-brand-earth transition-colors">{item.title}</h3>
                </div>
                ))}
            </div>
            </div>
        </section>
    );
};

const Process = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    // Only apply horizontal scroll on desktop
    const mm = gsap.matchMedia();
    
    mm.add("(min-width: 768px)", () => {
      const scrollTrack = scrollRef.current;
      const trackContainer = scrollTrack?.parentElement;
      if (!scrollTrack || !trackContainer || !containerRef.current) return;
      
      const getScrollAmount = () => scrollTrack.scrollWidth - trackContainer.offsetWidth;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1,
          start: "top top",
          end: () => `+=${getScrollAmount()}`,
          invalidateOnRefresh: true,
        }
      });
      
      tl.to(scrollTrack, {
        x: () => -getScrollAmount(),
        ease: "none"
      });
    });
    
    return () => mm.revert();
  }, []);

  const steps = [
    { title: "Audit & Discover", desc: "We review the ads, site, analytics, creative, email, reporting, and current workflows to find gaps.", id: "01" },
    { title: "Strategic Map", desc: "Find what is working, what is wasting time or money, and define exactly where the fastest improvements lie.", id: "02" },
    { title: "System Build", desc: "Create better pages, campaign structures, creative briefs, reporting systems, flows, and automations.", id: "03" },
    { title: "Continuous Optimization", desc: "Rely on weekly data and creative feedback loops to iterate and keep improving the marketing system.", id: "04" }
  ];

  return (
    <section id="process" ref={containerRef} className="relative py-24 md:py-0 md:h-screen w-full bg-[#050505] text-white overflow-hidden flex md:items-center items-start">
      <div className="absolute inset-0 bg-brand-earth/5 mix-blend-multiply blur-[100px] rounded-full pointer-events-none md:scale-150" />
      
      <div className="w-full flex flex-col md:flex-row gap-16 md:gap-0 relative z-10 px-6 max-w-7xl mx-auto md:max-w-none md:px-0 h-full">
        <div className="w-full md:w-[40vw] shrink-0 relative md:px-16 lg:px-32 flex flex-col justify-center">
          <SectionReveal>
            <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-brand-earth mb-6 block">OUR METHODOLOGY</span>
            <h2 className="text-3xl md:text-5xl font-display font-medium tracking-tight mb-6">
              From scattered <br className="hidden md:block" />
              <span className="italic text-brand-earth">to systematic.</span>
            </h2>
            <p className="text-white/60 text-sm md:text-base font-light leading-relaxed max-w-sm">
              A proven methodology out in the open. Step by step, we realign every moving piece into a unified growth engine.
            </p>
          </SectionReveal>
        </div>

        <div className="w-full md:flex-grow overflow-hidden relative">
          <div ref={scrollRef} className="flex flex-col md:flex-row gap-8 md:gap-0 h-auto md:h-full w-max md:items-center">
            {steps.map((step, i) => (
              <div key={i} className="process-step group relative flex flex-col md:w-[45vw] lg:w-[35vw] shrink-0 justify-center h-auto md:h-full px-0 md:px-12">
                <div className="w-full h-full flex flex-col justify-center py-4 md:py-0">
                  <div className="flex flex-col md:flex-row gap-6 md:gap-8 w-full">
                    <div className="text-4xl md:text-5xl font-display font-light text-white/10 group-hover:text-brand-earth/30 transition-colors duration-500 select-none">
                      {step.id}
                    </div>

                    <div className="flex flex-col gap-3 flex-grow border-l border-white/10 pl-6 md:pl-8">
                      <h3 className="text-xl md:text-2xl font-display font-medium group-hover:text-brand-white transition-colors duration-500">{step.title}</h3>
                      <p className="text-sm md:text-base text-white/50 font-light leading-relaxed max-w-xs transition-colors duration-500">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const ProofSection = () => {
  const competencies = [
    "Meta + Google Ads", "Shopify CRO", "Klaviyo Email/SMS", "Executive Reporting",
    "Creative Direction", "Marketing Automation", "Event Marketing", "Outdoor Content"
  ];
  return (
   <section className="py-24 px-6 bg-brand-black border-t border-white/5 overflow-hidden">
    <div className="max-w-7xl mx-auto">
      <SectionReveal className="mb-16 text-center">
        <h2 className="text-2xl md:text-4xl font-display font-medium mb-3 text-white">Operator experience, not agency theater.</h2>
        <p className="text-brand-earth/80 text-xs uppercase tracking-[0.3em] font-bold mt-4">CORE COMPETENCIES</p>
      </SectionReveal>
      
      <Marquee items={competencies} />
      <div className="mt-4">
        <Marquee items={competencies.slice().reverse()} reverse={true} />
      </div>
    </div>
  </section>
  );
};

const FitSection = () => (
  <section className="py-24 md:py-32 px-6 bg-[#090909] text-brand-white border-t border-white/5">
    <div className="max-w-7xl mx-auto">
      <SectionReveal className="mb-16 md:mb-20 text-center md:text-left">
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-medium tracking-tighter">A strong fit for brands ready to get clearer.</h2>
      </SectionReveal>

      <MobileSlider className="md:grid md:grid-cols-2 items-stretch gap-6 md:gap-8 gap-y-6 relative">
        <div className="bg-[#111111] p-8 md:p-14 rounded-3xl border border-white/5 flex flex-col h-full items-start relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 text-brand-earth pointer-events-none group-hover:scale-110 group-hover:opacity-10 transition-all duration-700">
            <CheckCircle2 size={120} />
          </div>
          <h3 className="text-2xl md:text-3xl font-display font-medium mb-10 flex items-center gap-3 relative z-10 text-white">
            <div className="w-8 h-8 rounded-full bg-brand-earth/10 text-brand-earth ring-1 ring-brand-earth/20 flex items-center justify-center italic text-sm">+</div>
            This is a fit if:
          </h3>
          <ul className="grid gap-6 relative z-10">
            {[
              "You sell physical products or experiences",
              "You are spending on ads but need clearer strategy",
              "You have traffic but need better conversion",
              "Your creative needs stronger direction",
              "Your reporting is too slow or confusing",
              "You want senior marketing thinking without agency bloat"
            ].map((item, i) => (
              <li key={i} className="flex gap-4 items-start">
                <CheckCircle2 size={20} className="text-brand-earth shrink-0 mt-0.5" />
                <p className="text-sm md:text-base font-light text-white/80 leading-snug">{item}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-brand-black p-8 md:p-14 rounded-3xl border border-white/5 flex flex-col h-full items-start relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 opacity-5 text-white pointer-events-none group-hover:scale-110 transition-all duration-700">
            <X size={120} />
          </div>
          <h3 className="text-2xl md:text-3xl font-display font-medium mb-10 flex items-center gap-3 relative z-10 text-white">
             <div className="w-8 h-8 rounded-full bg-white/5 text-white/50 ring-1 ring-white/10 flex items-center justify-center italic text-sm">x</div>
             This is not a fit if:
          </h3>
          <ul className="grid gap-6 relative z-10">
            {[
              "You want overnight results",
              "You only want vanity metrics",
              "You are not ready to improve the offer or website",
              "You want generic AI tools without strategy",
              "You want random tactics instead of a system"
            ].map((item, i) => (
              <li key={i} className="flex gap-4 items-start">
                <X size={20} className="text-white/20 shrink-0 mt-0.5" />
                <p className="text-sm md:text-base font-light text-white/60 leading-snug">{item}</p>
              </li>
            ))}
          </ul>
        </div>
      </MobileSlider>
    </div>
  </section>
);

const EngagementCards = () => {
  const options = [
    { 
      title: "Growth Audit", 
      level: "A focused review",
      who: "For brands who need a prioritized roadmap before they build.",
      what: ["Ad account audit", "Shopify/CRO review", "Technical automation scan", "Actionable growth plan"],
      cta: "Get Started"
    },
    { 
      title: "Monthly Growth Partner", 
      level: "Ongoing strategy & execution",
      who: "For brands ready to scale with senior strategic-creative support.",
      what: ["Weekly strategic direction", "Paid media management", "Creative hooks & content briefs", "Live performance reporting"],
      cta: "Inquire Now",
      highlight: true
    },
    { 
      title: "Build Sprint", 
      level: "Project-based work",
      who: "For brands needing a specific piece of the system built now.",
      what: ["Shopify landing page build", "Klaviyo flow overhaul", "Reporting dashboard setup", "Automation system build"],
      cta: "Book a Project"
    }
  ];

  return (
    <section className="py-24 md:py-40 px-6 bg-brand-black">
      <div className="max-w-7xl mx-auto">
        <SectionReveal className="mb-16 md:mb-20 text-center">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-medium tracking-tighter mb-4 text-white">Choose your level of support.</h2>
          <p className="text-white/50 max-w-xl mx-auto font-light">From discrete audits to ongoing strategic partnerships.</p>
        </SectionReveal>

        <MobileSlider className="md:grid lg:grid-cols-3 items-stretch relative gap-6">
          {options.map((option, i) => (
            <SectionReveal key={i} className={`relative group flex flex-col p-8 md:p-12 rounded-3xl border transition-all duration-500 overflow-hidden ${
              option.highlight ? 'bg-brand-white text-brand-black border-brand-white shadow-xl hover:-translate-y-2' : 'bg-[#111] text-brand-white border-white/5 hover:-translate-y-2 hover:border-white/20'
            }`}>
              {option.highlight && (
                <div className="absolute inset-0 bg-gradient-to-br from-brand-earth/10 via-transparent to-transparent opacity-100 pointer-events-none" />
              )}
              <div className={`relative z-10 text-[10px] font-bold tracking-[0.3em] uppercase mb-6 ${option.highlight ? 'text-brand-earth' : 'text-white/40'}`}>
                {option.level}
              </div>
              <h3 className={`text-2xl md:text-3xl font-display font-medium mb-4 tracking-tight ${option.highlight ? '!text-brand-black' : ''}`}>{option.title}</h3>
              <p className={`text-sm md:text-base font-light mb-8 leading-relaxed ${option.highlight ? 'text-brand-black/70' : 'text-white/50'}`}>
                {option.who}
              </p>
              
              <div className={`h-px w-full mb-8 ${option.highlight ? 'bg-black/10' : 'bg-white/10'}`} />
              
              <ul className="grid gap-4 mb-10 flex-grow">
                {option.what.map((item, j) => (
                  <li key={j} className="flex gap-3 text-xs md:text-sm font-medium">
                    <CheckCircle2 size={16} className={option.highlight ? 'text-brand-earth' : 'text-brand-earth'} />
                    <span className={option.highlight ? "text-black/80" : "text-white/80"}>{item}</span>
                  </li>
                ))}
              </ul>

              <a 
                href="#contact" 
                className={`w-full py-4 rounded-full text-center text-sm font-semibold transition-all ${
                  option.highlight ? 'bg-brand-black text-brand-white hover:bg-brand-earth shadow-lg' : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {option.cta}
              </a>
            </SectionReveal>
          ))}
        </MobileSlider>
      </div>
    </section>
  );
};

const ContactCTA = () => (
  <section id="contact" className="relative py-32 md:py-56 px-6 bg-brand-black overflow-hidden group">
    <VideoBackground src={VIDEOS.cta} />
    
    <div className="relative z-10 max-w-4xl mx-auto text-center">
      <SectionReveal>
        <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-brand-earth mb-8 block drop-shadow-md">THE FINAL PIECE</span>
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-medium tracking-tighter leading-[1] mb-8 text-white">
          Ready to make your marketing clearer, sharper, and <span className="italic font-light">easier to grow?</span>
        </h2>
        <p className="text-base md:text-lg text-white/70 font-light leading-relaxed max-w-2xl mx-auto mb-12">
          Let’s connect your ads, creative, website, reporting, and automations into a system your team can actually use.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#" className="w-full sm:w-auto px-10 py-4 bg-brand-white text-brand-black rounded-full font-medium hover:scale-[1.02] active:scale-[0.98] hover:bg-white/90 transition-all flex items-center justify-center gap-2 group/btn shadow-[0_0_20px_rgba(255,255,255,0.15)]">
            Book a strategy call <ArrowRight size={16} />
          </a>
          <a href="mailto:connor@cnor.creative" className="w-full sm:w-auto px-10 py-4 bg-white/[0.03] border border-white/10 rounded-full font-medium text-white hover:bg-white/[0.08] transition-all flex items-center justify-center gap-2">
            Email CNOR Creative
          </a>
        </div>
      </SectionReveal>
    </div>
  </section>
);

const Footer = () => (
  <footer className="py-20 px-6 bg-brand-black border-t border-white/10 text-white/40 safe-px safe-pb">
    <div className="max-w-7xl mx-auto mb-[100px] md:mb-0">
      <div className="grid md:grid-cols-12 gap-16 md:gap-8 mb-20">
        <div className="md:col-span-5">
          <h2 className="font-display text-2xl font-bold tracking-tighter text-white/90 mb-6 underline decoration-brand-earth decoration-2">CNOR CREATIVE</h2>
          <p className="max-w-sm text-sm font-light leading-relaxed mb-8">
            Creative marketing systems for product, outdoor, and lifestyle brands built to move. 
            Based in the Pacific Northwest, operating globally.
          </p>
          <div className="flex gap-4">
            <a href="#" className="p-4 rounded-full bg-white/5 border border-white/10 hover:border-brand-earth/50 transition-colors tap-target"><Instagram size={20} /></a>
            <a href="mailto:connor@cnor.creative" className="p-4 rounded-full bg-white/5 border border-white/10 hover:border-brand-earth/50 transition-colors tap-target"><Mail size={20} /></a>
          </div>
        </div>
        
        <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
          <div className="flex flex-col gap-4">
            <p className="text-[10px] font-bold tracking-widest uppercase text-brand-earth">Expertise</p>
            <a href="#" className="py-2 text-sm hover:text-white transition-colors">Marketing Strategy</a>
            <a href="#" className="py-2 text-sm hover:text-white transition-colors">Paid Media</a>
            <a href="#" className="py-2 text-sm hover:text-white transition-colors">Shopify CRO</a>
          </div>
          <div className="flex flex-col gap-4">
            <p className="text-[10px] font-bold tracking-widest uppercase text-brand-earth">Studio</p>
            <a href="#" className="py-2 text-sm hover:text-white transition-colors">Creative Direction</a>
            <a href="#" className="py-2 text-sm hover:text-white transition-colors">Reporting</a>
            <a href="#" className="py-2 text-sm hover:text-white transition-colors">Automation</a>
          </div>
          <div className="flex flex-col gap-4 col-span-2 md:col-span-1">
            <p className="text-[10px] font-bold tracking-widest uppercase text-brand-earth">Location</p>
            <p className="py-2 text-sm">Pacific Northwest</p>
            <p className="text-xs italic opacity-60">Remote, Hybrid & Select Onsite</p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 text-[10px] font-medium tracking-widest uppercase">
        <p>© 2026 CNOR CREATIVE. ALL RIGHTS RESERVED.</p>
        <div className="flex gap-8 mt-6 md:mt-0">
          <p>BUILT TO MOVE</p>
        </div>
      </div>
    </div>
  </footer>
);

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Artificial load to ensure smoothness or just instant start
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
        <Introduction />
        <SplitMedia />
        <Services />
        <StudioReel />
        <Process />
        <ProofSection />
        <FitSection />
        <EngagementCards />
        <ContactCTA />
      </main>

      <Footer />
      
      {/* Sticky Bottom CTA for Mobile */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 2 }}
        className="fixed left-1/2 -translate-x-1/2 z-40 md:hidden w-[calc(100%-48px)] max-w-sm"
        style={{ bottom: 'max(env(safe-area-inset-bottom), 1.5rem)' }}
      >
        <a href="#contact" className="flex items-center justify-center gap-2 bg-brand-earth text-white py-4 min-h-[56px] rounded-full font-bold shadow-2xl shadow-black/80 ring-1 ring-white/20 tap-target">
          Book a call <ArrowRight size={18} />
        </a>
      </motion.div>
    </div>
  );
}
