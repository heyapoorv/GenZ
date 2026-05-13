import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import api from '../api/client';
import ProductCard from '../components/product/ProductCard';

export default function Home() {
  const scrollRef = useRef(null);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <main className="pt-[80px]">
      <Helmet>
        <title>Zenith Arcade | Elite Performance Streetwear</title>
        <meta name="description" content="Engineered for high-performance athletes who demand technical precision and cinematic style. Shop our Elite Jersey Series." />
      </Helmet>
      
      {/* Cinematic Hero Banner */}
      <section className="relative h-[90vh] w-full flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img className="w-full h-full object-cover grayscale brightness-[0.3] scale-105 animate-slow-zoom" alt="Cinematic athlete" src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2000" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent"></div>
        </div>
        <div className="relative z-10 px-margin-mobile md:px-margin-desktop w-full max-w-container-max mx-auto">
          <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-[1px] w-12 bg-primary"></div>
              <span className="font-label-caps text-label-caps text-primary tracking-[0.5em] uppercase text-xs">DROP 01 // ASCENSION</span>
            </div>
            <h1 className="font-display-xl text-[clamp(3rem,10vw,8rem)] uppercase leading-[0.8] mb-8 tracking-tighter">
              ELITE <span className="text-outline text-transparent">JERSEY</span><br/>
              <span className="text-primary">SERIES</span> 01
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-xl opacity-80 leading-relaxed">
              Engineered for those who transcend limits. Technical precision meets cinematic aesthetic. 
              Forge your legacy in the arcade of performance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/shop" className="group relative px-10 py-5 bg-primary text-on-primary font-button-text text-button-text uppercase overflow-hidden">
                <span className="relative z-10">SHOP THE ARCHIVE</span>
                <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 opacity-20"></div>
              </Link>
              <Link to="/shop?category=Anime" className="px-10 py-5 border border-outline-variant text-on-surface font-button-text text-button-text uppercase hover:border-primary hover:text-primary transition-all duration-300">
                VIEW LOOKBOOK
              </Link>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-40">
          <span className="font-label-caps text-[10px] tracking-[0.3em] uppercase">Scroll to Explore</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent"></div>
        </div>
      </section>

      {/* Domain Selection: Bento Grid */}
      <section className="py-24 px-margin-mobile md:px-margin-desktop w-full max-w-container-max mx-auto">
        <div className="flex justify-between items-end mb-16">
          <div className="space-y-2">
            <span className="font-label-caps text-xs text-primary tracking-widest uppercase">Select your path</span>
            <h2 className="font-display-xl text-headline-lg uppercase tracking-tighter">DOMAIN SELECTION</h2>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-auto md:h-[700px]">
          {/* Anime Domain */}
          <Link to="/shop?category=Anime" className="md:col-span-8 group relative overflow-hidden bg-surface-container shadow-2xl">
            <img loading="lazy" className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 opacity-40 group-hover:opacity-100" alt="Anime category" src="https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=1200" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-12 z-10">
              <span className="font-label-caps text-xs text-primary tracking-[0.3em] mb-2 block">PROTO: 01</span>
              <h3 className="font-display-xl text-headline-lg uppercase group-hover:text-primary transition-colors">ANIME</h3>
              <p className="font-body-md text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity duration-500 max-w-xs mt-2">
                Cyber-inspired aesthetics meets traditional spirit.
              </p>
            </div>
          </Link>
          
          {/* Gym Domain */}
          <Link to="/shop?category=Gym" className="md:col-span-4 group relative overflow-hidden bg-surface-container">
            <img loading="lazy" className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 opacity-40 group-hover:opacity-100" alt="Gym category" src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 z-10">
              <span className="font-label-caps text-xs text-primary tracking-[0.3em] mb-2 block">STRENGTH</span>
              <h3 className="font-display-xl text-headline-md uppercase group-hover:text-primary transition-colors">GYM LAB</h3>
            </div>
          </Link>

          {/* Sports Domain */}
          <Link to="/shop?category=Sports" className="md:col-span-4 group relative overflow-hidden bg-surface-container">
            <img loading="lazy" className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 opacity-40 group-hover:opacity-100" alt="Sports category" src="https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=800" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 z-10">
              <span className="font-label-caps text-xs text-primary tracking-[0.3em] mb-2 block">COMPETITION</span>
              <h3 className="font-display-xl text-headline-md uppercase group-hover:text-primary transition-colors">SPORTS</h3>
            </div>
          </Link>

          {/* All Access */}
          <Link to="/shop" className="md:col-span-8 group relative overflow-hidden bg-surface-container-high border border-primary/20">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12">
              <span className="font-label-caps text-xs text-primary tracking-[1em] mb-4 uppercase">System wide access</span>
              <h3 className="font-display-xl text-display-md uppercase mb-6 tracking-tighter">BROWSE ALL PRODUCTS</h3>
              <div className="w-20 h-20 rounded-full border border-primary flex items-center justify-center group-hover:scale-110 group-hover:bg-primary group-hover:text-on-primary transition-all duration-500">
                <span className="material-symbols-outlined text-4xl">arrow_outward</span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Featured Scrolling Section */}
      <section className="py-24 bg-surface-container-lowest overflow-hidden">
        <div className="px-margin-mobile md:px-margin-desktop w-full max-w-container-max mx-auto mb-16 flex justify-between items-end">
          <div className="space-y-2">
            <span className="font-label-caps text-xs text-primary tracking-widest uppercase">Trending now</span>
            <h2 className="font-display-xl text-headline-lg uppercase tracking-tighter">FEATURED PIECES</h2>
          </div>
          <div className="flex gap-4">
            <button onClick={() => scroll('left')} className="w-14 h-14 flex items-center justify-center border border-outline-variant hover:border-primary transition-colors hover:text-primary">
              <span className="material-symbols-outlined">west</span>
            </button>
            <button onClick={() => scroll('right')} className="w-14 h-14 flex items-center justify-center border border-outline-variant hover:border-primary transition-colors hover:text-primary">
              <span className="material-symbols-outlined">east</span>
            </button>
          </div>
        </div>
        
        <div ref={scrollRef} className="flex overflow-x-auto gap-8 px-margin-mobile md:px-margin-desktop no-scrollbar pb-12 scroll-smooth">
          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="min-w-[350px] aspect-[4/5] bg-surface-container animate-pulse rounded-sm"></div>
            ))
          ) : featuredProducts.map(product => (
            <div key={product._id} className="min-w-[350px] md:min-w-[400px]">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* Mission / Technical Specs Section */}
      <section className="py-32 bg-black text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 translate-x-1/2"></div>
        <div className="px-margin-mobile md:px-margin-desktop w-full max-w-container-max mx-auto grid md:grid-cols-2 gap-20 items-center">
          <div className="space-y-10 relative z-10">
            <span className="font-label-caps text-primary tracking-[0.4em] uppercase text-xs">TECHNICAL SPECIFICATIONS</span>
            <h2 className="font-display-xl text-display-sm uppercase leading-none tracking-tighter">ENGINEERED FOR THE ELITE</h2>
            <div className="space-y-8">
              <div className="flex gap-6">
                <span className="font-display-xl text-primary opacity-20 text-4xl">01</span>
                <div>
                  <h4 className="font-label-caps text-sm mb-2 tracking-widest uppercase">Hydro-Shield Fabric</h4>
                  <p className="font-body-md text-on-surface-variant opacity-60">Advanced moisture-wicking polymers keep you dry under extreme physical strain.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <span className="font-display-xl text-primary opacity-20 text-4xl">02</span>
                <div>
                  <h4 className="font-label-caps text-sm mb-2 tracking-widest uppercase">Kinetic Seams</h4>
                  <p className="font-body-md text-on-surface-variant opacity-60">Reinforced stitching patterns designed to move with your body's natural mechanics.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <span className="font-display-xl text-primary opacity-20 text-4xl">03</span>
                <div>
                  <h4 className="font-label-caps text-sm mb-2 tracking-widest uppercase">Aura-Reflect Print</h4>
                  <p className="font-body-md text-on-surface-variant opacity-60">Low-light reflective graphics for high-visibility during night missions.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square bg-surface-container rounded-full overflow-hidden border border-primary/20 p-4">
              <img className="w-full h-full object-cover rounded-full grayscale brightness-75 hover:grayscale-0 transition-all duration-700" alt="Technical gear" src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800" />
            </div>
            <div className="absolute -bottom-10 -left-10 bg-primary text-on-primary p-10 animate-float">
              <span className="font-display-xl text-6xl">100%</span>
              <p className="font-label-caps text-xs tracking-widest">PERFORMANCE RATIO</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-32 bg-surface-container-lowest relative overflow-hidden">
        <div className="px-margin-mobile md:px-margin-desktop w-full max-w-container-max mx-auto text-center relative z-10">
          <div className="inline-block p-4 border border-primary/20 mb-8">
            <span className="font-label-caps text-label-caps text-primary tracking-[0.5em] block uppercase text-xs">JOIN THE ASCENSION</span>
          </div>
          <h2 className="font-display-xl text-display-sm uppercase mb-10 max-w-4xl mx-auto tracking-tighter leading-none">THE FUTURE IS NOW. ACCESS THE ARCHIVES.</h2>
          <form className="flex flex-col md:flex-row gap-0 max-w-3xl mx-auto border border-outline-variant/30 p-2 bg-surface-container-low focus-within:border-primary transition-colors">
            <input className="flex-grow bg-transparent px-8 py-5 font-button-text text-on-surface focus:outline-none uppercase placeholder:text-on-surface-variant/30" placeholder="ENTER SYSTEM EMAIL" type="email" />
            <button className="bg-primary text-on-primary font-button-text text-button-text px-12 py-5 uppercase hover:bg-inverse-primary transition-all active:scale-95 whitespace-nowrap">
              SUBSCRIBE
            </button>
          </form>
          <p className="mt-8 font-label-caps text-[10px] text-on-surface-variant/40 tracking-[0.2em] uppercase">Secured by Zenith encryption protocols.</p>
        </div>
      </section>
    </main>
  );
}
