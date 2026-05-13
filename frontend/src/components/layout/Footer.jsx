import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full py-section-gap bg-surface-container-lowest border-t border-outline-variant/10">
      <div className="flex flex-col md:flex-row justify-between items-start px-margin-mobile md:px-margin-desktop w-full max-w-container-max mx-auto">
        <div className="mb-12 md:mb-0">
          <h2 className="font-headline-lg text-headline-lg text-on-surface uppercase mb-6">ZENITH ARCADE</h2>
          <p className="font-body-md text-on-surface-variant max-w-xs">Engineered for ascension. Merging technical performance with the cinematic spirit of anime culture.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-24">
          <div className="flex flex-col gap-4">
            <span className="font-label-caps text-on-surface uppercase mb-2">NAVIGATE</span>
            <Link className="font-body-md text-on-surface-variant hover:text-primary transition-all" to="/shop">SHOP ALL</Link>
            <Link className="font-body-md text-on-surface-variant hover:text-primary transition-all" to="/shop?category=Anime">ANIME ARCHIVE</Link>
            <Link className="font-body-md text-on-surface-variant hover:text-primary transition-all" to="/shop?category=Gym">GYM LAB</Link>
            <Link className="font-body-md text-on-surface-variant hover:text-primary transition-all" to="/shop?category=Sports">SPORTS SERIES</Link>
          </div>
          <div className="flex flex-col gap-4">
            <span className="font-label-caps text-on-surface uppercase mb-2">OPERATIONS</span>
            <Link className="font-body-md text-on-surface-variant hover:text-primary transition-all" to="/dashboard">MY PORTAL</Link>
            <Link className="font-body-md text-on-surface-variant hover:text-primary transition-all" to="/cart">CART MANIFEST</Link>
            <Link className="font-body-md text-on-surface-variant hover:text-primary transition-all" to="/dashboard?tab=orders">ORDER HISTORY</Link>
          </div>
          <div className="flex flex-col gap-4">
            <span className="font-label-caps text-on-surface uppercase mb-2">LEGAL</span>
            <Link className="font-body-md text-on-surface-variant hover:text-primary transition-all" to="/privacy">PRIVACY PROTOCOL</Link>
            <Link className="font-body-md text-on-surface-variant hover:text-primary transition-all" to="/terms">TERMS OF SERVICE</Link>
          </div>
        </div>
      </div>
      <div className="px-margin-mobile md:px-margin-desktop w-full max-w-container-max mx-auto mt-24 flex flex-col md:flex-row justify-between items-center opacity-80">
        <p className="font-body-md text-body-md text-on-surface-variant">© 2024 ZENITH ARCADE. ENGINEERED FOR ASCENSION.</p>
        <div className="flex gap-6 mt-6 md:mt-0">
          <a className="text-on-surface-variant hover:text-primary transition-colors" href="#"><span className="material-symbols-outlined">public</span></a>
          <a className="text-on-surface-variant hover:text-primary transition-colors" href="#"><span className="material-symbols-outlined">share</span></a>
          <a className="text-on-surface-variant hover:text-primary transition-colors" href="#"><span className="material-symbols-outlined">bolt</span></a>
        </div>
      </div>
    </footer>
  );
}
