import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { frontendLogger } from '../logger';

const PRODUCTS_SHOWCASE = [
  { name: 'SmartFeeder One', price: '$129.99', desc: 'AI-powered feeding that learns your cat\'s schedule', img: '/products/feeder.png', tag: 'Best Seller' },
  { name: 'AutoClean Litter Dome', price: '$199.99', desc: 'Self-cleaning with health pattern detection', img: '/products/litter-box.png', tag: 'Most Popular' },
  { name: 'PawTrack Smart Collar', price: '$79.99', desc: 'GPS + AI mood detection via tail & purr analysis', img: '/products/smart-collar.png', tag: 'New' },
  { name: 'SleepNest ThermoPod', price: '$149.99', desc: 'Smart bed with REM cycle temperature control', img: '/products/sleep-nest.png', tag: 'Premium' },
  { name: 'CatFlix Entertainment Portal', price: '$89.99', desc: 'On-demand laser shows & bird-watching streams', img: '/products/catflix.png', tag: 'Fan Favorite' },
  { name: 'DoorDash Pet Portal', price: '$159.99', desc: 'Facial recognition smart door with time-based access', img: '/products/door-dash.png', tag: 'Smart Home' },
];

const STATS = [
  { value: '13+', label: 'Smart Products' },
  { value: '3', label: 'Premium Suppliers' },
  { value: '99.9%', label: 'Uptime SLA' },
  { value: '50K+', label: 'Cats Protected' },
];

const TESTIMONIALS = [
  { name: 'Dr. Amara Osei', role: 'Feline Veterinarian', quote: 'Finally, a supply platform that speaks our language. Clinical-grade specs, real data sheets, and ordering that doesn\'t make me want to pull my hair out.', avatar: '🩺' },
  { name: 'Tom Wheeler', role: 'Corporate Facilities Manager', quote: 'PO workflows, multi-location delivery, net-30 terms — Catapult gets enterprise procurement. Our cats across 12 offices have never been happier.', avatar: '🏢' },
  { name: 'Darnell Washington', role: 'Cat Content Creator (500K followers)', quote: 'Every product I\'ve ordered has been content gold. My audience DMs me asking where I got my SmartFeeder before the unboxing video even ends.', avatar: '🎬' },
  { name: 'Brenda Kowalski', role: 'Cat Rescue Founder', quote: 'Managing supplies for 40+ rescue cats used to be chaos. Catapult\'s bulk ordering and transparent pricing means every donation dollar goes further.', avatar: '❤️' },
];

const BRAND_NAMES = [
  { name: 'CATAPULT Supply', tagline: 'Launch Your Supply Chain Forward', votes: 0, recommended: true },
  { name: 'McAfee Sells Cats', tagline: 'Total Feline Protection', votes: 0, recommended: false },
  { name: 'NineLives Supply', tagline: 'Built to Last. Again and Again.', votes: 0, recommended: false },
  { name: 'CLAWMARK', tagline: 'Leave Your Mark on the Supply Chain', votes: 0, recommended: false },
  { name: 'PROWL', tagline: 'Intelligent Supply. Predatory Precision.', votes: 0, recommended: false },
  { name: 'PawShield', tagline: 'Enterprise-Grade Feline Protection', votes: 0, recommended: false },
];

const SEGMENTS = [
  { icon: '🩺', title: 'Veterinary Professionals', desc: 'Clinical-grade supplies with complete ingredient data, professional accounts, and AAHA-compliant ordering.' },
  { icon: '🐱', title: 'Multi-Cat Operations', desc: 'Rescues, catteries, and boarding facilities — bulk ordering, multi-animal management, budget tracking.' },
  { icon: '🏢', title: 'Enterprise & Institutional', desc: 'PO numbers, invoicing, approval workflows, multi-branch logistics, and SLA-backed delivery.' },
  { icon: '👑', title: 'Premium Cat Owners', desc: 'Show-grade, artisanal, and luxury smart products with detailed specifications and provenance.' },
  { icon: '📱', title: 'Content Creators', desc: 'Photogenic products, affiliate programs, early access to new launches, and trend discovery.' },
  { icon: '🌱', title: 'Eco-Conscious Buyers', desc: 'Full sustainability data, carbon footprint tracking, zero-waste options, and certified sourcing.' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [brandVotes, setBrandVotes] = useState(BRAND_NAMES.map(b => ({ ...b })));
  const [votedFor, setVotedFor] = useState<string | null>(null);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    frontendLogger.componentMount('LandingPage');
    return () => frontendLogger.componentUnmount('LandingPage');
  }, []);

  const handleWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail('');
    }
  };

  const handleVote = (name: string) => {
    if (votedFor) return;
    setVotedFor(name);
    setBrandVotes(prev => prev.map(b => b.name === name ? { ...b, votes: b.votes + 1 } : b));
  };

  const features = [
    { title: 'AI-Powered Product Discovery', desc: 'Semantic search, smart recommendations, and personalized catalogs that learn from every interaction. Find the right product in seconds, not minutes.', icon: '🔍' },
    { title: 'Enterprise Procurement Engine', desc: 'PO workflows, approval chains, net-30/60/90 terms, multi-branch shipping, and full audit trails. Built for how businesses actually buy.', icon: '📋' },
    { title: 'Real-Time Health Telemetry', desc: 'Every smart product streams live data — feeding patterns, activity levels, sleep quality. Your dashboard becomes a feline health command center.', icon: '📊' },
    { title: 'Multi-Branch Logistics', desc: 'Manage inventory, orders, and deliveries across unlimited locations. Central HQ visibility with branch-level autonomy.', icon: '🚚' },
  ];

  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen font-['Inter'] overflow-x-hidden">

      {/* ==================== HERO SECTION ==================== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated background grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(#76B852 1px, transparent 1px), linear-gradient(90deg, #76B852 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />

        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#76B852] rounded-full opacity-[0.07] blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#00E676] rounded-full opacity-[0.05] blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#76B852]/10 border border-[#76B852]/30 rounded-full px-5 py-2 mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 bg-[#00E676] rounded-full animate-pulse" />
            <span className="text-[#76B852] text-sm font-semibold tracking-wide uppercase">Now in Private Beta</span>
          </div>

          {/* Main headline */}
          <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-2 leading-[0.9]">
            <span className="text-[#00E676]">CAT</span>APULT
          </h1>
          <p className="text-2xl md:text-3xl font-light text-gray-400 mb-4 tracking-wide">SUPPLY</p>
          <div className="w-24 h-1 bg-gradient-to-r from-[#76B852] to-[#00E676] mx-auto mb-8 rounded-full" />
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-4 font-light leading-relaxed">
            The future of feline care, <span className="text-[#00E676] font-semibold">engineered for professionals</span> who refuse to compromise.
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-12">
            AI-powered smart cat technology. Enterprise-grade procurement. Clinical-level transparency. One platform.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button
              onClick={() => navigate('/products')}
              className="group relative bg-[#76B852] hover:bg-[#00E676] text-black font-bold px-10 py-4 rounded-lg text-lg transition-all duration-300 hover:shadow-[0_0_40px_rgba(0,230,118,0.4)] cursor-pointer"
            >
              Explore Products
              <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </button>
            <button
              onClick={() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })}
              className="border border-[#76B852]/50 hover:border-[#00E676] text-[#76B852] hover:text-[#00E676] font-semibold px-10 py-4 rounded-lg text-lg transition-all duration-300 backdrop-blur-sm cursor-pointer"
            >
              Join Waitlist
            </button>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {STATS.map((stat, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6 backdrop-blur-sm hover:border-[#76B852]/30 transition-all duration-300">
                <div className="text-3xl md:text-4xl font-black text-[#00E676] mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500 uppercase tracking-wider font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-5 h-8 border border-gray-700 rounded-full flex justify-center pt-1.5">
            <div className="w-1 h-2 bg-[#76B852] rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ==================== BRAND A/B TEST ==================== */}
      <section className="py-24 px-6 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#76B852] text-sm font-bold uppercase tracking-[0.2em] mb-4">Brand A/B Test</p>
            <h2 className="text-4xl md:text-5xl font-black mb-6">Help Us Choose Our Name</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">We're testing brand names. Vote for the one that makes you think: <em>"I'd buy from them."</em></p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {brandVotes.map((brand) => (
              <button
                key={brand.name}
                onClick={() => handleVote(brand.name)}
                disabled={!!votedFor}
                className={`relative text-left p-6 rounded-xl border transition-all duration-300 cursor-pointer ${
                  votedFor === brand.name
                    ? 'border-[#00E676] bg-[#00E676]/10 shadow-[0_0_30px_rgba(0,230,118,0.2)]'
                    : votedFor
                    ? 'border-white/[0.06] bg-white/[0.02] opacity-50'
                    : 'border-white/[0.08] bg-white/[0.03] hover:border-[#76B852]/50 hover:bg-[#76B852]/5'
                }`}
              >
                {brand.recommended && (
                  <span className="absolute -top-3 right-4 bg-[#00E676] text-black text-xs font-bold px-3 py-1 rounded-full">
                    RECOMMENDED
                  </span>
                )}
                <h3 className="text-xl font-black mb-2">{brand.name}</h3>
                <p className="text-gray-500 text-sm italic">"{brand.tagline}"</p>
                {votedFor && (
                  <div className="mt-3 flex items-center gap-2">
                    <div className={`h-1 rounded-full transition-all duration-500 ${
                      votedFor === brand.name ? 'bg-[#00E676] w-full' : 'bg-gray-700 w-0'
                    }`} />
                    {votedFor === brand.name && <span className="text-[#00E676] text-xs font-bold">YOUR PICK</span>}
                  </div>
                )}
              </button>
            ))}
          </div>

          {votedFor && (
            <p className="text-center text-gray-500 mt-8 text-sm">
              Thanks for voting! Your feedback shapes the brand. 🎉
            </p>
          )}
        </div>
      </section>

      {/* ==================== FEATURES ==================== */}
      <section className="py-24 px-6 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#76B852] text-sm font-bold uppercase tracking-[0.2em] mb-4">Platform Capabilities</p>
            <h2 className="text-4xl md:text-5xl font-black mb-6">Built Different. Built for Cats.</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">Every feature engineered by people who understand that cat care isn't a hobby — it's a profession.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                onMouseEnter={() => setActiveFeature(i)}
                className={`group p-8 rounded-2xl border transition-all duration-500 cursor-default ${
                  activeFeature === i
                    ? 'border-[#76B852]/50 bg-gradient-to-br from-[#76B852]/10 to-transparent shadow-[0_0_40px_rgba(118,184,82,0.1)]'
                    : 'border-white/[0.06] bg-white/[0.02] hover:border-[#76B852]/30'
                }`}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-[#00E676] transition-colors">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== PRODUCTS SHOWCASE ==================== */}
      <section className="py-24 px-6 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#76B852] text-sm font-bold uppercase tracking-[0.2em] mb-4">Product Catalog</p>
            <h2 className="text-4xl md:text-5xl font-black mb-6">Smart Products. Smarter Cats.</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">Every product is AI-powered, vet-approved, and designed to make your cats' lives measurably better.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRODUCTS_SHOWCASE.map((product, i) => (
              <div key={i} className="group relative bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-[#76B852]/40 transition-all duration-500 hover:shadow-[0_0_30px_rgba(118,184,82,0.1)]">
                {/* Product image area */}
                <div className="relative h-48 bg-gradient-to-br from-[#76B852]/10 to-[#0A0A0A] flex items-center justify-center overflow-hidden">
                  <div className="text-6xl opacity-30 group-hover:opacity-50 group-hover:scale-110 transition-all duration-500">🐱</div>
                  <span className="absolute top-3 right-3 bg-[#00E676] text-black text-xs font-bold px-3 py-1 rounded-full">{product.tag}</span>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold group-hover:text-[#00E676] transition-colors">{product.name}</h3>
                    <span className="text-[#00E676] font-black text-lg">{product.price}</span>
                  </div>
                  <p className="text-gray-500 text-sm mb-4">{product.desc}</p>
                  <button
                    onClick={() => navigate('/products')}
                    className="w-full bg-white/[0.05] hover:bg-[#76B852] border border-white/[0.1] hover:border-[#76B852] text-white font-semibold py-2.5 rounded-lg transition-all duration-300 text-sm cursor-pointer"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => navigate('/products')}
              className="group text-[#76B852] hover:text-[#00E676] font-semibold text-lg transition-colors cursor-pointer"
            >
              View Full Catalog <span className="inline-block group-hover:translate-x-2 transition-transform">→</span>
            </button>
          </div>
        </div>
      </section>

      {/* ==================== TARGET SEGMENTS ==================== */}
      <section className="py-24 px-6 border-t border-white/[0.06] bg-gradient-to-b from-transparent via-[#76B852]/[0.03] to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#76B852] text-sm font-bold uppercase tracking-[0.2em] mb-4">Who We Serve</p>
            <h2 className="text-4xl md:text-5xl font-black mb-6">Built for Every Kind of Cat Professional</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">From solo vet clinics to 50-cat rescues to corporate facilities — one platform, every workflow.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SEGMENTS.map((seg, i) => (
              <div key={i} className="group bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 hover:border-[#76B852]/40 transition-all duration-500 hover:translate-y-[-4px]">
                <div className="text-4xl mb-4">{seg.icon}</div>
                <h3 className="text-lg font-bold mb-3 group-hover:text-[#00E676] transition-colors">{seg.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{seg.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== TESTIMONIALS ==================== */}
      <section className="py-24 px-6 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#76B852] text-sm font-bold uppercase tracking-[0.2em] mb-4">What Professionals Say</p>
            <h2 className="text-4xl md:text-5xl font-black mb-6">Trusted by the Best in the Business</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TESTIMONIALS.map((test, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 hover:border-[#76B852]/20 transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-[#76B852]/20 rounded-full flex items-center justify-center text-2xl">{test.avatar}</div>
                  <div>
                    <div className="font-bold">{test.name}</div>
                    <div className="text-[#76B852] text-sm">{test.role}</div>
                  </div>
                </div>
                <p className="text-gray-300 leading-relaxed italic">"{test.quote}"</p>
                <div className="flex gap-1 mt-4">
                  {[...Array(5)].map((_, j) => (
                    <span key={j} className="text-[#00E676]">★</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== COMPARISON TABLE ==================== */}
      <section className="py-24 px-6 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#76B852] text-sm font-bold uppercase tracking-[0.2em] mb-4">Competitive Edge</p>
            <h2 className="text-4xl md:text-5xl font-black mb-6">Why Catapult Wins</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/[0.1]">
                  <th className="py-4 px-4 text-gray-400 font-medium text-sm uppercase tracking-wider">Capability</th>
                  <th className="py-4 px-4 text-center">
                    <span className="text-[#00E676] font-black text-lg">CATAPULT</span>
                  </th>
                  <th className="py-4 px-4 text-center text-gray-500 font-medium">Amazon Business</th>
                  <th className="py-4 px-4 text-center text-gray-500 font-medium">Chewy</th>
                  <th className="py-4 px-4 text-center text-gray-500 font-medium">PetSmart Pro</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['AI-Powered Smart Products', true, false, false, false],
                  ['Real-Time Health Telemetry', true, false, false, false],
                  ['B2B Procurement Workflows', true, true, false, false],
                  ['Vet-Grade Specifications', true, false, false, false],
                  ['Multi-Branch Management', true, false, false, false],
                  ['Professional Discounts', true, false, true, true],
                  ['Sustainability Data', true, false, false, false],
                ].map(([feature, ...vals], i) => (
                  <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-4 text-gray-300 font-medium">{feature as string}</td>
                    {(vals as boolean[]).map((val, j) => (
                      <td key={j} className="py-4 px-4 text-center text-xl">
                        {val ? <span className="text-[#00E676]">✓</span> : <span className="text-gray-700">✗</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ==================== PRICING TIERS ==================== */}
      <section className="py-24 px-6 border-t border-white/[0.06] bg-gradient-to-b from-transparent via-[#76B852]/[0.03] to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#76B852] text-sm font-bold uppercase tracking-[0.2em] mb-4">Pricing</p>
            <h2 className="text-4xl md:text-5xl font-black mb-6">Plans That Scale With You</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">From solo cat owner to 50-location enterprise. Start free, scale infinitely.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Starter */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 hover:border-white/[0.15] transition-all duration-300">
              <h3 className="text-lg font-bold mb-1">Starter</h3>
              <p className="text-gray-500 text-sm mb-6">For individual cat owners</p>
              <div className="mb-6">
                <span className="text-4xl font-black">Free</span>
                <span className="text-gray-500 ml-2">to browse</span>
              </div>
              <ul className="space-y-3 mb-8 text-gray-400 text-sm">
                <li className="flex items-center gap-2"><span className="text-[#76B852]">✓</span> Full catalog access</li>
                <li className="flex items-center gap-2"><span className="text-[#76B852]">✓</span> Standard shipping</li>
                <li className="flex items-center gap-2"><span className="text-[#76B852]">✓</span> Email support</li>
                <li className="flex items-center gap-2"><span className="text-[#76B852]">✓</span> Product reviews</li>
              </ul>
              <button onClick={() => navigate('/products')} className="w-full border border-white/[0.15] hover:border-[#76B852] text-white font-semibold py-3 rounded-lg transition-all duration-300 cursor-pointer">
                Get Started
              </button>
            </div>

            {/* Professional — Featured */}
            <div className="relative bg-gradient-to-b from-[#76B852]/10 to-[#0A0A0A] border-2 border-[#76B852] rounded-2xl p-8 shadow-[0_0_50px_rgba(118,184,82,0.15)] scale-[1.02]">
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#00E676] text-black text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider">Most Popular</span>
              <h3 className="text-lg font-bold mb-1 text-[#00E676]">Professional</h3>
              <p className="text-gray-400 text-sm mb-6">For vet clinics, groomers & sitters</p>
              <div className="mb-6">
                <span className="text-4xl font-black">15%</span>
                <span className="text-gray-400 ml-2">off all orders</span>
              </div>
              <ul className="space-y-3 mb-8 text-gray-300 text-sm">
                <li className="flex items-center gap-2"><span className="text-[#00E676]">✓</span> Everything in Starter</li>
                <li className="flex items-center gap-2"><span className="text-[#00E676]">✓</span> 15% professional discount</li>
                <li className="flex items-center gap-2"><span className="text-[#00E676]">✓</span> Priority shipping</li>
                <li className="flex items-center gap-2"><span className="text-[#00E676]">✓</span> Dedicated support</li>
                <li className="flex items-center gap-2"><span className="text-[#00E676]">✓</span> Net-30 payment terms</li>
                <li className="flex items-center gap-2"><span className="text-[#00E676]">✓</span> Full data sheets</li>
              </ul>
              <button onClick={() => navigate('/products')} className="w-full bg-[#76B852] hover:bg-[#00E676] text-black font-bold py-3 rounded-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,230,118,0.3)] cursor-pointer">
                Go Professional
              </button>
            </div>

            {/* Enterprise */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 hover:border-white/[0.15] transition-all duration-300">
              <h3 className="text-lg font-bold mb-1">Enterprise</h3>
              <p className="text-gray-500 text-sm mb-6">For multi-branch operations</p>
              <div className="mb-6">
                <span className="text-4xl font-black">Custom</span>
              </div>
              <ul className="space-y-3 mb-8 text-gray-400 text-sm">
                <li className="flex items-center gap-2"><span className="text-[#76B852]">✓</span> Everything in Professional</li>
                <li className="flex items-center gap-2"><span className="text-[#76B852]">✓</span> Custom volume pricing</li>
                <li className="flex items-center gap-2"><span className="text-[#76B852]">✓</span> PO & invoice workflows</li>
                <li className="flex items-center gap-2"><span className="text-[#76B852]">✓</span> API access</li>
                <li className="flex items-center gap-2"><span className="text-[#76B852]">✓</span> SLA-backed delivery</li>
                <li className="flex items-center gap-2"><span className="text-[#76B852]">✓</span> Dedicated account manager</li>
              </ul>
              <button className="w-full border border-white/[0.15] hover:border-[#76B852] text-white font-semibold py-3 rounded-lg transition-all duration-300 cursor-pointer">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== WAITLIST / CTA ==================== */}
      <section id="waitlist" className="py-24 px-6 border-t border-white/[0.06]">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-gradient-to-br from-[#76B852]/10 via-transparent to-[#00E676]/5 border border-[#76B852]/30 rounded-3xl p-12 md:p-16 backdrop-blur-sm">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Ready to <span className="text-[#00E676]">Catapult</span> Forward?
            </h2>
            <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
              Join the waitlist for early access. Be among the first professionals to experience the future of feline supply.
            </p>

            {submitted ? (
              <div className="bg-[#00E676]/10 border border-[#00E676]/30 rounded-xl p-8">
                <div className="text-4xl mb-3">🎉</div>
                <h3 className="text-xl font-bold text-[#00E676] mb-2">You're on the list!</h3>
                <p className="text-gray-400">We'll reach out soon with your exclusive early access invite.</p>
              </div>
            ) : (
              <form onSubmit={handleWaitlist} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your work email"
                  required
                  className="flex-1 bg-white/[0.05] border border-white/[0.1] rounded-lg px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#76B852] focus:shadow-[0_0_20px_rgba(118,184,82,0.2)] transition-all duration-300"
                />
                <button
                  type="submit"
                  className="bg-[#76B852] hover:bg-[#00E676] text-black font-bold px-8 py-4 rounded-lg text-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,230,118,0.3)] whitespace-nowrap cursor-pointer"
                >
                  Join Waitlist
                </button>
              </form>
            )}

            <p className="text-gray-600 text-sm mt-6">No spam. No cat memes (okay, maybe one). Unsubscribe anytime.</p>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="py-16 px-6 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <h3 className="text-2xl font-black mb-2">
                <span className="text-[#00E676]">CAT</span>APULT
              </h3>
              <p className="text-gray-500 text-sm">Smart Cat Tech.<br/>Enterprise Grade.<br/>Ruthlessly Reliable.</p>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Product</h4>
              <ul className="space-y-2 text-gray-500 text-sm">
                <li><button onClick={() => navigate('/products')} className="hover:text-[#76B852] transition-colors cursor-pointer">Catalog</button></li>
                <li><button className="hover:text-[#76B852] transition-colors cursor-pointer">Pricing</button></li>
                <li><button className="hover:text-[#76B852] transition-colors cursor-pointer">API Docs</button></li>
                <li><button className="hover:text-[#76B852] transition-colors cursor-pointer">Integrations</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Company</h4>
              <ul className="space-y-2 text-gray-500 text-sm">
                <li><button onClick={() => navigate('/about')} className="hover:text-[#76B852] transition-colors cursor-pointer">About</button></li>
                <li><button className="hover:text-[#76B852] transition-colors cursor-pointer">Careers</button></li>
                <li><button className="hover:text-[#76B852] transition-colors cursor-pointer">Press Kit</button></li>
                <li><button className="hover:text-[#76B852] transition-colors cursor-pointer">Contact</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-500 text-sm">
                <li><button className="hover:text-[#76B852] transition-colors cursor-pointer">Blog</button></li>
                <li><button className="hover:text-[#76B852] transition-colors cursor-pointer">Case Studies</button></li>
                <li><button className="hover:text-[#76B852] transition-colors cursor-pointer">Webinars</button></li>
                <li><button className="hover:text-[#76B852] transition-colors cursor-pointer">Help Center</button></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/[0.06] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">© 2026 CATAPULT Supply. All rights reserved.</p>
            <div className="flex gap-6 text-gray-600 text-sm">
              <button className="hover:text-[#76B852] transition-colors cursor-pointer">Privacy</button>
              <button className="hover:text-[#76B852] transition-colors cursor-pointer">Terms</button>
              <button className="hover:text-[#76B852] transition-colors cursor-pointer">Cookies</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
