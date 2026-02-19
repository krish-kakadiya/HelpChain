import React, { useState, useEffect, useRef } from 'react';
import './BadgeCollection.css';

// ─── Badge config — update images & points to match your backend ──────────────
import fiftyImg          from '../../assets/badges/fifty.png';
import hundredImg        from '../../assets/badges/hundred.png';
import bugSpecialistImg  from '../../assets/badges/bug-specialist.png';
import logicArchitectImg from '../../assets/badges/logicArchitect.png';
import cyberSecurityImg  from '../../assets/badges/cyberSecurity.png';
import mentorImg         from '../../assets/badges/mentor.png';

const BADGES = [
  { id: 'fifty',         name: '50 Solutions',    description: 'Solved 50 problems',          image: fiftyImg,          requiredPoints: 50,  category: 'Milestone', color: '#f59e0b', glow: 'rgba(245,158,11,0.45)',  gradient: 'linear-gradient(135deg,#b45309,#f59e0b,#fde68a)', particles: ['#f59e0b','#fde68a','#fbbf24','#fff'] },
  { id: 'hundred',       name: '100 Solutions',   description: 'Century of solutions',         image: hundredImg,        requiredPoints: 100, category: 'Milestone', color: '#8b5cf6', glow: 'rgba(139,92,246,0.45)',  gradient: 'linear-gradient(135deg,#6d28d9,#8b5cf6,#c4b5fd)', particles: ['#8b5cf6','#c4b5fd','#a78bfa','#fff'] },
  { id: 'bugSpecialist', name: 'Bug Specialist',  description: 'Fixed 20 critical bugs',       image: bugSpecialistImg,  requiredPoints: 200, category: 'Debug',     color: '#22c55e', glow: 'rgba(34,197,94,0.45)',   gradient: 'linear-gradient(135deg,#15803d,#22c55e,#86efac)', particles: ['#22c55e','#86efac','#4ade80','#fff'] },
  { id: 'logicArchitect',name: 'Logic Architect', description: 'Master of algorithms',         image: logicArchitectImg, requiredPoints: 400, category: 'Advanced',  color: '#ec4899', glow: 'rgba(236,72,153,0.45)',  gradient: 'linear-gradient(135deg,#be185d,#ec4899,#f9a8d4)', particles: ['#ec4899','#f9a8d4','#f472b6','#fff'] },
  { id: 'cyberSecurity', name: 'Security Analyst',description: 'Guardian of digital spaces',   image: cyberSecurityImg,  requiredPoints: 500, category: 'Security',  color: '#06b6d4', glow: 'rgba(6,182,212,0.45)',   gradient: 'linear-gradient(135deg,#0e7490,#06b6d4,#67e8f9)', particles: ['#06b6d4','#67e8f9','#22d3ee','#fff'] },
  { id: 'mentor',        name: 'Mentor',           description: 'Guided 25+ developers',        image: mentorImg,         requiredPoints: 600, category: 'Community', color: '#f97316', glow: 'rgba(249,115,22,0.45)',  gradient: 'linear-gradient(135deg,#c2410c,#f97316,#fed7aa)', particles: ['#f97316','#fed7aa','#fb923c','#fff'] },
];

function getNearest(pts, collected) {
  const left = BADGES.filter(b => !collected.includes(b.id));
  if (!left.length) return BADGES[BADGES.length - 1];
  return left.find(b => pts >= b.requiredPoints) || left[0];
}

// ─── Particle burst canvas ────────────────────────────────────────────────────
function Particles({ active, origin, colors }) {
  const ref = useRef(null);
  const pts = useRef([]);
  const raf = useRef(null);

  useEffect(() => {
    if (!active || !origin) return;
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    pts.current = Array.from({ length: 160 }, () => {
      const a = Math.random() * Math.PI * 2, s = 2 + Math.random() * 9;
      return { x: origin.x, y: origin.y, vx: Math.cos(a)*s, vy: Math.sin(a)*s - 6, color: colors[Math.floor(Math.random()*colors.length)], size: 4+Math.random()*7, life: 1, decay: .011+Math.random()*.009, rot: Math.random()*360, rs: (Math.random()-.5)*12, rect: Math.random()>.45 };
    });
    const tick = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      pts.current = pts.current.filter(p => p.life > 0);
      pts.current.forEach(p => {
        p.x+=p.vx; p.y+=p.vy; p.vy+=.2; p.life-=p.decay; p.rot+=p.rs;
        ctx.save(); ctx.globalAlpha=Math.max(0,p.life); ctx.translate(p.x,p.y); ctx.rotate(p.rot*Math.PI/180); ctx.fillStyle=p.color;
        if (p.rect) ctx.fillRect(-p.size/2,-p.size/4,p.size,p.size/3);
        else { ctx.beginPath(); ctx.arc(0,0,p.size/2,0,Math.PI*2); ctx.fill(); }
        ctx.restore();
      });
      if (pts.current.length) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf.current); pts.current = []; };
  }, [active, origin]);

  if (!active) return null;
  return <canvas ref={ref} style={{ position:'fixed', inset:0, width:'100vw', height:'100vh', pointerEvents:'none', zIndex:10005 }} />;
}

// ─── Full-screen celebration modal ───────────────────────────────────────────
function CelebrationModal({ badge, next, userPoints, onClose, onClaim }) {
  const [phase, setPhase] = useState('idle');
  const [showPts, setShowPts] = useState(false);
  const [origin, setOrigin] = useState(null);
  const imgRef = useRef(null);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('pop'), 150);
    const t2 = setTimeout(() => {
      setPhase('celebrate');
      if (imgRef.current) {
        const r = imgRef.current.getBoundingClientRect();
        setOrigin({ x: r.left + r.width/2, y: r.top + r.height/2 });
        setShowPts(true);
      }
    }, 900);
    const t3 = setTimeout(() => setShowPts(false), 4000);
    return () => [t1,t2,t3].forEach(clearTimeout);
  }, []);

  const nextPct = next ? Math.min(Math.round(userPoints/next.requiredPoints*100), 99) : 100;

  return (
    <>
      <Particles active={showPts} origin={origin} colors={badge.particles} />

      <div className="cel-bg" onClick={onClose}
        style={{ '--c': badge.color, '--g': badge.glow, '--grad': badge.gradient }}>

        {/* Ambient orbs */}
        <div className="cel-orb cel-orb-1" style={{ background: badge.glow }} />
        <div className="cel-orb cel-orb-2" style={{ background: badge.glow }} />

        <div className="cel-card" onClick={e => e.stopPropagation()}>
          <div className="cel-strip" style={{ background: badge.gradient }} />
          <button className="cel-x" onClick={onClose}>✕</button>

          <div className="cel-eye" style={{ color: badge.color }}>🏆 Achievement Unlocked</div>

          {/* Badge stage */}
          <div className="cel-stage">
            <div className="cel-stage-glow" style={{ background: `radial-gradient(ellipse, ${badge.glow} 0%, transparent 70%)` }} />

            {/* Rotating halo rings */}
            <div className="cel-halo cel-halo-1" style={{ borderColor: badge.color + '33' }} />
            <div className="cel-halo cel-halo-2" style={{ borderColor: badge.color + '20' }} />

            {/* Burst rings on celebrate phase */}
            {phase === 'celebrate' && <>
              <div className="cel-burst cel-b1" style={{ borderColor: badge.color }} />
              <div className="cel-burst cel-b2" style={{ borderColor: badge.color }} />
              <div className="cel-burst cel-b3" style={{ borderColor: badge.color }} />
            </>}

            <div ref={imgRef}
              className={`cel-img-wrap${phase==='pop'?' cel-pop':''}${phase==='celebrate'?' cel-float':''}`}>
              <img className="cel-img" src={badge.image} alt={badge.name}
                style={{ filter: `drop-shadow(0 0 28px ${badge.glow}) drop-shadow(0 8px 32px ${badge.glow})` }} />
            </div>
          </div>

          {/* Text */}
          <div className={`cel-body${phase!=='idle'?' cel-body-in':''}`}>
            <div className="cel-cat" style={{ color: badge.color }}>{badge.category}</div>
            <div className="cel-name" style={{ background: badge.gradient, WebkitBackgroundClip:'text', backgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              {badge.name}
            </div>
            <div className="cel-desc">{badge.description}</div>

            {next && (
              <div className="cel-next">
                <div className="cel-next-top"><span>Next up</span><span style={{ color: next.color }}>{nextPct}%</span></div>
                <div className="cel-next-row">
                  <img className="cel-next-img" src={next.image} alt={next.name} />
                  <div style={{ flex:1 }}>
                    <div className="cel-next-name">{next.name}</div>
                    <div className="cel-bar-track"><div className="cel-bar-fill" style={{ '--pw':`${nextPct}%`, background: next.gradient }} /></div>
                    <div className="cel-next-pts">{userPoints} / {next.requiredPoints} pts</div>
                  </div>
                </div>
              </div>
            )}

            <button className="cel-claim" style={{ background: badge.gradient }} onClick={onClaim}>
              <span className="cel-shine" />
              Claim Badge 🎉
            </button>
            <button className="cel-skip" onClick={onClose}>Maybe later</button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Badge tile in panel grid ─────────────────────────────────────────────────
function BadgeTile({ badge, earned, canCollect, userPoints, onCollect }) {
  const [tilt, setTilt] = useState({ x:0, y:0 });
  const [hov, setHov] = useState(false);
  const ref = useRef(null);
  const locked = !earned && !canCollect;
  const pct = Math.min(Math.round(userPoints/badge.requiredPoints*100), 100);

  const onMove = e => {
    const r = ref.current.getBoundingClientRect();
    setTilt({ x: ((e.clientY - r.top  - r.height/2) / (r.height/2)) * -10,
               y: ((e.clientX - r.left - r.width/2)  / (r.width/2))  *  10 });
  };

  return (
    <div ref={ref}
      className={`bt${earned?' bt-earned':canCollect?' bt-ready':' bt-locked'}`}
      style={{
        '--bc': badge.color, '--bg': badge.glow, '--bgr': badge.gradient,
        transform: hov ? `perspective(600px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-4px) scale(1.03)` : 'perspective(600px) rotateX(0) rotateY(0) scale(1)',
        transition: hov ? 'transform .07s ease' : 'transform .4s cubic-bezier(.34,1.2,.64,1)',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseMove={onMove}
      onMouseLeave={() => { setHov(false); setTilt({x:0,y:0}); }}
    >
      <div className="bt-sheen" style={{ opacity: hov ? 1 : 0 }} />
      {!locked && <div className="bt-strip" style={{ background: badge.gradient }} />}

      <div className="bt-img-wrap">
        {!locked && <div className="bt-glow" />}
        <img className="bt-img" src={badge.image} alt={badge.name}
          style={{ filter: locked ? 'grayscale(.85) brightness(.7)' : `drop-shadow(0 4px 14px ${badge.glow})`,
                   animation: canCollect ? 'bt-bob 2.5s ease-in-out infinite' : 'none' }} />
        {locked  && <div className="bt-lock">🔒</div>}
        {earned  && <div className="bt-check" style={{ background: badge.color }}>✓</div>}
      </div>

      <div className="bt-cat" style={{ color: badge.color }}>{badge.category}</div>
      <div className={`bt-name${locked?' bt-name-dim':''}`}>{badge.name}</div>

      {earned     && <div className="bt-chip bt-chip-earned">✓ Collected</div>}
      {canCollect && <div className="bt-chip bt-chip-ready" style={{ background: badge.gradient }}>🔓 Ready!</div>}
      {locked && (
        <div className="bt-prog-wrap">
          <div className="bt-prog-track">
            <div className="bt-prog-fill" style={{ '--pw':`${pct}%`, background: badge.gradient }} />
          </div>
          <div className="bt-prog-row">
            <span style={{ color: badge.color }}>{pct}%</span>
            <span>{badge.requiredPoints - userPoints} pts left</span>
          </div>
        </div>
      )}

      {canCollect && (
        <button className="bt-btn" style={{ background: badge.gradient }}
          onClick={e => { e.stopPropagation(); onCollect(badge.id); }}>
          Collect Badge ✨
        </button>
      )}
    </div>
  );
}

// ─── Slide-in panel ───────────────────────────────────────────────────────────
function BadgePanel({ userPoints, collectedIds, onClose, onCollect }) {
  const [celebrating, setCelebrating] = useState(null);
  const [localCollected, setLocalCollected] = useState(collectedIds);

  const confirm = id => {
    setLocalCollected(p => [...p, id]);
    onCollect(id);
    setCelebrating(null);
  };

  const celebBadge = BADGES.find(b => b.id === celebrating);
  const celebNext  = celebBadge ? BADGES.find(b => b.requiredPoints > celebBadge.requiredPoints && !localCollected.includes(b.id)) : null;
  const earned = localCollected.length;
  const pct    = Math.round(earned / BADGES.length * 100);
  const dash   = earned / BADGES.length * 125.6;

  return (
    <>
      <div className="bp-back" onClick={onClose} />
      <div className="bp-panel">

        <div className="bp-head">
          <div>
            <div className="bp-title">Badge Collection</div>
            <div className="bp-sub">{earned} of {BADGES.length} earned</div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div className="bp-ring-wrap">
              <svg viewBox="0 0 48 48" fill="none" width="46" height="46" style={{ transform:'rotate(-90deg)' }}>
                <circle cx="24" cy="24" r="20" stroke="#eeeef8" strokeWidth="4" />
                <circle cx="24" cy="24" r="20" stroke="#6366f1" strokeWidth="4" strokeLinecap="round"
                  strokeDasharray={`${dash} 125.6`} style={{ transition:'stroke-dasharray .9s ease' }} />
              </svg>
              <span className="bp-ring-pct">{pct}%</span>
            </div>
            <button className="bp-close" onClick={onClose}>✕</button>
          </div>
        </div>

        <div className="bp-pts">
          <span>Your Points</span>
          <span style={{ color:'#6366f1', fontFamily:'monospace' }}>{userPoints} pts</span>
        </div>

        <div className="bp-grid">
          {BADGES.map(badge => {
            const e = localCollected.includes(badge.id);
            const c = !e && userPoints >= badge.requiredPoints;
            return <BadgeTile key={badge.id} badge={badge} earned={e} canCollect={c} userPoints={userPoints} onCollect={setCelebrating} />;
          })}
        </div>
      </div>

      {celebrating && celebBadge && (
        <CelebrationModal badge={celebBadge} next={celebNext} userPoints={userPoints}
          onClose={() => setCelebrating(null)} onClaim={() => confirm(celebrating)} />
      )}
    </>
  );
}

// ─── Stats card (your 3rd card slot) ─────────────────────────────────────────
// Props:
//   userPoints   {number}    — from your API
//   collectedIds {string[]}  — from your API  e.g. ['fifty', 'hundred']
//   onCollect    {fn(id)}    — save to your backend

const BadgeCollection = ({ userPoints = 0, collectedIds = [], onCollect }) => {
  const [open, setOpen] = useState(false);
  const nearest  = getNearest(userPoints, collectedIds);
  const ready    = userPoints >= nearest.requiredPoints && !collectedIds.includes(nearest.id);
  const pct      = Math.min(Math.round(userPoints / nearest.requiredPoints * 100), 100);

  return (
    <>
      <div className={`bcc${ready?' bcc-ready':''}`}
        style={{ '--bc': nearest.color, '--bg': nearest.glow, '--bgr': nearest.gradient }}
        onClick={() => setOpen(true)}>

        <div className="bcc-stripe" />

        <div className="bcc-left">
          <svg className="bcc-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
          </svg>
          <div>
            <div className="bcc-label">Nearest Badge</div>
            <div className="bcc-val">{userPoints}<span className="bcc-sep">/</span>{nearest.requiredPoints}</div>
            <div className="bcc-sub">{nearest.name}</div>
            {!ready && (
              <div className="bcc-prog">
                <div className="bcc-prog-track">
                  <div className="bcc-prog-fill" style={{ '--pw':`${pct}%` }} />
                </div>
                <span className="bcc-prog-txt">{nearest.requiredPoints - userPoints} pts left</span>
              </div>
            )}
          </div>
        </div>

        <div className="bcc-right">
          <div className={`bcc-badge${ready?' bcc-badge-ready':' bcc-badge-locked'}`}>
            <div className="bcc-badge-glow" />
            <img className="bcc-img" src={nearest.image} alt={nearest.name} />
            {!ready && <div className="bcc-lock">🔒</div>}
          </div>
          <div className="bcc-count">
            <span className="bcc-count-n">{collectedIds.length}</span>
            <span className="bcc-count-l">earned</span>
          </div>
          {ready && <div className="bcc-pill" style={{ background: nearest.gradient }}>Collect!</div>}
        </div>

        <div className="bcc-hint">View all →</div>
      </div>

      {open && (
        <BadgePanel userPoints={userPoints} collectedIds={collectedIds}
          onClose={() => setOpen(false)} onCollect={id => { onCollect?.(id); }} />
      )}
    </>
  );
};

export default BadgeCollection;