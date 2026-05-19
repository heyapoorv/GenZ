import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import api from '../api/client';
import ProductCard from '../components/product/ProductCard';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import AnimeHero3D from '../components/layout/AnimeHero3D';
import TextReveal from '../components/effects/TextReveal';
import Magnetic from '../components/effects/Magnetic';

export default function Home() {
  const scrollRef = useRef(null);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { scrollY, scrollYProgress } = useScroll();
  const heroY = useTransform(scrollY, [0, 1000], [0, 300]);
  const heroOpacity = useTransform(scrollY, [0, 800], [1, 0]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await api.get('/products?pageSize=8');
        setFeaturedProducts(data.products || []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === 'left' ? -400 : 400;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <main className="pt-[80px] bg-transparent relative">
      <Helmet>
        <title>Zenith Arcade | Premium Streetwear & Performance Gear</title>
        <meta name="description" content="Engineered for high-performance athletes who demand technical precision and cinematic style. Shop our Elite Series." />
      </Helmet>
      
      {/* 3D Background */}
      <div className="fixed inset-0 z-[-2] pointer-events-none bg-[#020205]">
        <Suspense fallback={null}>
          <Canvas camera={{ position: [0, 0, 10], fov: 45 }} dpr={[1, 2]}>
            <AnimeHero3D scrollYProgress={scrollYProgress} />
          </Canvas>
        </Suspense>
      </div>

      {/* Cinematic Hero Banner */}
      <section className="relative h-[95vh] w-full flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0 z-[-1]">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10"></div>
        </motion.div>
        
        <div className="relative z-10 px-margin-mobile md:px-margin-desktop w-full max-w-container-max mx-auto text-center pointer-events-none">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-5xl mx-auto flex flex-col items-center pointer-events-auto"
          >
            <motion.div variants={fadeInUp} className="flex items-center justify-center gap-4 mb-6">
              <div className="h-[1px] w-12 bg-primary"></div>
              <span className="font-label-caps text-label-caps text-primary tracking-[0.5em] uppercase text-xs">DROP 01 // ASCENSION</span>
              <div className="h-[1px] w-12 bg-primary"></div>
            </motion.div>
            
            <h1 className="font-display-xl text-[clamp(3.5rem,10vw,8.5rem)] uppercase leading-[0.9] mb-8 tracking-tighter text-on-surface drop-shadow-[0_0_30px_rgba(255,255,255,0.1)] flex flex-col items-center select-none">
              <span className="flex flex-wrap justify-center">
                <TextReveal text="ELITE" variant="chars" delay={0.2} />
                <span className="w-4 inline-block" />
                <span className="text-transparent" style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.6)' }}>
                  <TextReveal text="JERSEY" variant="chars" delay={0.4} />
                </span>
              </span>
              <span className="text-primary drop-shadow-[0_0_20px_rgba(182,196,255,0.3)] flex flex-wrap justify-center">
                <TextReveal text="SERIES" variant="chars" delay={0.6} />
                <span className="w-4 inline-block" />
                <TextReveal text="01" variant="chars" delay={0.8} />
              </span>
            </h1>
            
            <motion.p variants={fadeInUp} className="font-body-lg text-body-lg text-on-surface-variant mb-12 max-w-2xl opacity-80 leading-relaxed font-light backdrop-blur-sm p-4 rounded-lg bg-surface/10">
              Engineered for those who transcend limits. Technical precision meets cinematic aesthetic. 
              Forge your legacy in the arcade of performance.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-6 items-center">
              <Link to="/shop" className="group relative px-12 py-6 bg-primary text-on-primary font-button-text text-button-text uppercase overflow-hidden rounded-md shadow-[0_0_20px_rgba(182,196,255,0.3)] hover:shadow-[0_0_40px_rgba(182,196,255,0.6)] transition-all duration-300 inline-block cursor-none" data-cursor="pointer">
                <span className="relative z-10 flex items-center gap-2">SHOP THE ARCHIVE <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span></span>
                <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out opacity-20"></div>
              </Link>
              <Link to="/shop?category=Anime" className="px-12 py-6 border border-outline-variant/50 text-on-surface font-button-text text-button-text uppercase hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-300 rounded-md backdrop-blur-md inline-block cursor-none" data-cursor="pointer">
                VIEW LOOKBOOK
              </Link>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
        >
          <span className="font-label-caps text-[10px] tracking-[0.4em] uppercase text-primary">Explore</span>
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-[1px] h-16 bg-gradient-to-b from-primary via-primary/50 to-transparent"
          ></motion.div>
        </motion.div>
      </section>

      {/* Domain Selection: Bento Grid */}
      <section className="py-32 px-margin-mobile md:px-margin-desktop w-full max-w-container-max mx-auto relative z-10">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="flex justify-between items-end mb-16"
        >
          <div className="space-y-2">
            <span className="font-label-caps text-xs text-primary tracking-widest uppercase">Select your path</span>
            <h2 className="font-display-xl text-headline-lg uppercase tracking-tighter drop-shadow-lg">DOMAIN SELECTION</h2>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[800px]">
          {/* Anime Domain */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="md:col-span-8 group relative overflow-hidden bg-surface-container rounded-2xl shadow-2xl border border-outline-variant/10 hover:border-primary/30 transition-colors h-[400px] md:h-auto cursor-none"
            data-cursor="explore"
          >
            <Link to="/shop?category=Anime" className="block w-full h-full cursor-none">
              <img loading="lazy" className="w-full h-full object-cover grayscale brightness-[0.4] group-hover:brightness-[0.8] group-hover:scale-105 transition-all duration-[1.5s] ease-out pointer-events-none" alt="Anime category" src="https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=1200" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-12 z-10">
                <span className="font-label-caps text-xs text-primary tracking-[0.4em] mb-3 block">PROTO: 01</span>
                <h3 className="font-display-xl text-display-sm uppercase group-hover:text-primary transition-colors drop-shadow-md">ANIME</h3>
                <p className="font-body-md text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity duration-500 max-w-sm mt-4 font-light">
                  Cyber-inspired aesthetics meets traditional spirit in our flagship collection.
                </p>
              </div>
            </Link>
          </motion.div>
          
          <div className="md:col-span-4 flex flex-col gap-6">
            {/* Gym Domain */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex-1 group relative overflow-hidden bg-surface-container rounded-2xl border border-outline-variant/10 hover:border-primary/30 transition-colors h-[300px] md:h-auto cursor-none"
              data-cursor="explore"
            >
              <Link to="/shop?category=Gym" className="block w-full h-full cursor-none">
                <img loading="lazy" className="w-full h-full object-cover grayscale brightness-[0.5] group-hover:brightness-[0.9] group-hover:scale-105 transition-all duration-[1.5s] ease-out pointer-events-none" alt="Gym category" src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8 z-10">
                  <span className="font-label-caps text-[10px] text-primary tracking-[0.4em] mb-2 block">STRENGTH</span>
                  <h3 className="font-display-xl text-headline-md uppercase group-hover:text-primary transition-colors">GYM LAB</h3>
                </div>
              </Link>
            </motion.div>
 
            {/* Sports Domain */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex-1 group relative overflow-hidden bg-surface-container rounded-2xl border border-outline-variant/10 hover:border-primary/30 transition-colors h-[300px] md:h-auto cursor-none"
              data-cursor="explore"
            >
              <Link to="/shop?category=Sports" className="block w-full h-full cursor-none">
                <img loading="lazy" className="w-full h-full object-cover grayscale brightness-[0.5] group-hover:brightness-[0.9] group-hover:scale-105 transition-all duration-[1.5s] ease-out pointer-events-none" alt="Sports category" src="https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=800" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8 z-10">
                  <span className="font-label-caps text-[10px] text-primary tracking-[0.4em] mb-2 block">COMPETITION</span>
                  <h3 className="font-display-xl text-headline-md uppercase group-hover:text-primary transition-colors">SPORTS</h3>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Scrolling Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-surface-container-lowest/50 backdrop-blur-sm z-0"></div>
        <div className="relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="px-margin-mobile md:px-margin-desktop w-full max-w-container-max mx-auto mb-16 flex justify-between items-end"
          >
            <div className="space-y-2">
              <span className="font-label-caps text-xs text-primary tracking-widest uppercase">Trending now</span>
              <h2 className="font-display-xl text-headline-lg uppercase tracking-tighter">FEATURED PIECES</h2>
            </div>
            <div className="flex gap-4">
              <button onClick={() => scroll('left')} className="w-14 h-14 rounded-full flex items-center justify-center border border-outline-variant/30 hover:border-primary bg-surface-container-low/50 backdrop-blur-md transition-all hover:text-primary hover:bg-surface-container hover:scale-105 active:scale-95 cursor-none" data-cursor="pointer">
                <span className="material-symbols-outlined">west</span>
              </button>
              <button onClick={() => scroll('right')} className="w-14 h-14 rounded-full flex items-center justify-center border border-outline-variant/30 hover:border-primary bg-surface-container-low/50 backdrop-blur-md transition-all hover:text-primary hover:bg-surface-container hover:scale-105 active:scale-95 cursor-none" data-cursor="pointer">
                <span className="material-symbols-outlined">east</span>
              </button>
            </div>
          </motion.div>
          
          <div ref={scrollRef} className="flex overflow-x-auto gap-10 px-margin-mobile md:px-margin-desktop no-scrollbar pb-16 scroll-smooth items-stretch">
            {loading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="min-w-[350px] md:min-w-[400px] aspect-[4/5] bg-surface-container-high animate-pulse rounded-xl border border-outline-variant/10"></div>
              ))
            ) : featuredProducts.map((product, i) => (
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                key={product._id} 
                className="min-w-[300px] md:min-w-[380px]"
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission / Technical Specs Section */}
      <section className="py-40 text-white relative overflow-hidden z-10 bg-black/40 backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 translate-x-1/3 mix-blend-overlay"></div>
        <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-primary/10 to-transparent mix-blend-screen opacity-50 blur-3xl"></div>
        
        <div className="px-margin-mobile md:px-margin-desktop w-full max-w-container-max mx-auto grid md:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-12 relative z-10"
          >
            <div className="inline-block px-4 py-2 bg-surface-container-high rounded-full border border-primary/20 backdrop-blur-md">
              <span className="font-label-caps text-primary tracking-[0.4em] uppercase text-[10px]">TECHNICAL SPECIFICATIONS</span>
            </div>
            <h2 className="font-display-xl text-[clamp(2.5rem,5vw,4.5rem)] uppercase leading-[0.9] tracking-tighter drop-shadow-xl">ENGINEERED FOR <br/><span className="text-primary">THE ELITE</span></h2>
            
            <div className="space-y-10">
              {[
                { num: "01", title: "Hydro-Shield Fabric", desc: "Advanced moisture-wicking polymers keep you dry under extreme physical strain with molecular breathability." },
                { num: "02", title: "Kinetic Seams", desc: "Reinforced 3D stitching patterns designed to move seamlessly with your body's natural mechanics." },
                { num: "03", title: "Aura-Reflect Print", desc: "Low-light reactive graphics for high-visibility during night missions and urban exploration." }
              ].map((spec, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.2 }}
                  className="flex gap-8 group" 
                  key={spec.num}
                >
                  <span className="font-display-xl text-primary opacity-20 text-5xl group-hover:opacity-60 transition-opacity">{spec.num}</span>
                  <div>
                    <h4 className="font-label-caps text-sm mb-3 tracking-widest uppercase text-on-surface group-hover:text-primary transition-colors">{spec.title}</h4>
                    <p className="font-body-md text-on-surface-variant opacity-70 font-light leading-relaxed">{spec.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="aspect-square bg-surface-container rounded-full overflow-hidden border border-outline-variant/20 p-8 shadow-[0_0_50px_rgba(182,196,255,0.1)] relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-50 z-10 mix-blend-overlay rounded-full"></div>
              <img className="w-full h-full object-cover rounded-full grayscale brightness-75 hover:grayscale-0 hover:brightness-100 transition-all duration-1000 ease-out" alt="Technical gear" src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800" />
            </div>
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -bottom-10 -left-10 bg-surface-container-highest backdrop-blur-xl border border-primary/30 text-on-surface p-12 rounded-2xl shadow-2xl"
            >
              <span className="font-display-xl text-7xl text-primary drop-shadow-[0_0_15px_rgba(182,196,255,0.4)]">100%</span>
              <p className="font-label-caps text-xs tracking-[0.3em] mt-2 opacity-80 uppercase">PERFORMANCE RATIO</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-40 relative overflow-hidden z-10 bg-transparent">
        <div className="px-margin-mobile md:px-margin-desktop w-full max-w-container-max mx-auto text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="inline-block p-4 border border-primary/30 bg-surface/50 backdrop-blur-md rounded-lg mb-10"
          >
            <span className="font-label-caps text-label-caps text-primary tracking-[0.5em] block uppercase text-xs">JOIN THE ASCENSION</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-display-xl text-[clamp(2rem,6vw,4.5rem)] uppercase mb-12 max-w-4xl mx-auto tracking-tighter leading-[0.9] drop-shadow-lg"
          >
            THE FUTURE IS NOW.<br/>ACCESS THE ARCHIVES.
          </motion.h2>
          
          <motion.form 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col md:flex-row gap-0 max-w-3xl mx-auto border border-outline-variant/40 p-2 bg-surface-container-low/80 backdrop-blur-xl rounded-xl focus-within:border-primary transition-colors shadow-2xl"
          >
            <input className="flex-grow bg-transparent px-8 py-6 font-body-md text-on-surface focus:outline-none placeholder:text-on-surface-variant/40 placeholder:uppercase placeholder:tracking-widest" placeholder="Enter System Email" type="email" />
            <button className="bg-primary text-on-primary font-button-text text-button-text px-14 py-6 uppercase hover:bg-inverse-primary transition-all rounded-lg active:scale-95 whitespace-nowrap shadow-[0_0_20px_rgba(182,196,255,0.3)] hover:shadow-[0_0_30px_rgba(182,196,255,0.5)]">
              SUBSCRIBE
            </button>
          </motion.form>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-10 font-label-caps text-[10px] text-on-surface-variant/50 tracking-[0.3em] uppercase"
          >
            Secured by Zenith Encryption Protocols.
          </motion.p>
        </div>
      </section>
    </main>
  );
}
