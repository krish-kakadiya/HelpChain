import React, { useState, useEffect, useRef } from "react";
import "./HelpChainLanding.css";
import logo from "../../assets/logo/logo.png";

/* ── Icons ───────────────────────────────────────────────── */
const IcoArrow = ({ cls }) => (
  <svg className={cls} width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);
const IcoStar = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const IcoBadge = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="6" />
    <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
  </svg>
);
const IcoUsers = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const IcoShield = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

/* ── Data ────────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: <IcoStar />,
    title: "Ask & Answer, Earn Points",
    desc: "Post questions, write answers, earn reputation points automatically. Every helpful contribution is rewarded transparently.",
    accent: "#3f51b5",
    bg: "#eef0fb",
  },
  {
    icon: <IcoBadge />,
    title: "Milestone Badges",
    desc: "Unlock Bronze, Silver, and Gold badges as you hit contribution milestones — a visible record of your expertise.",
    accent: "#7c4dff",
    bg: "#f3eeff",
  },
  {
    icon: <IcoUsers />,
    title: "Community Leaderboard",
    desc: "Transparent rankings surface top problem-solvers and inspire quality contributions from every member.",
    accent: "#0288d1",
    bg: "#e6f4fd",
  },
  {
    icon: <IcoShield />,
    title: "Trusted & Scalable",
    desc: "Every point and badge is logged with full audit history. Built on a structured schema with zero ambiguity.",
    accent: "#00897b",
    bg: "#e0f5f2",
  },
];

// const STATS = [
//   { value: "10K+",  label: "Questions Solved" },
//   { value: "2.4M",  label: "Points Awarded"   },
//   { value: "48K",   label: "Badges Earned"    },
//   { value: "99.9%", label: "Uptime"           },
// ];

/* ── Feature Card ────────────────────────────────────────── */
function FeatureCard({ icon, title, desc, accent, bg, index, visible }) {
  return (
    <div
      className={`hclp-card ${visible ? "hclp-card--visible" : ""}`}
      style={{ "--card-accent": accent, "--card-bg": bg, "--card-delay": `${index * 0.1}s` }}
    >
      <div className="hclp-card__icon-wrap">
        <div className="hclp-card__icon">{icon}</div>
      </div>
      <h3 className="hclp-card__title">{title}</h3>
      <p className="hclp-card__desc">{desc}</p>
      <div className="hclp-card__line" />
    </div>
  );
}

/* ── Main Component ──────────────────────────────────────── */
export default function HelpChainLanding({ onGetStarted }) {
  const [cardsVisible, setCardsVisible] = useState(false);
  const featRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setCardsVisible(true); },
      { threshold: 0.15 }
    );
    if (featRef.current) observer.observe(featRef.current);
    return () => observer.disconnect();
  }, []);

  const go = (e) => {
    e.preventDefault();
    if (onGetStarted) onGetStarted();
  };

  return (
    <div className="hclp-root">
      <div className="hclp-bg" aria-hidden="true"><div className="hclp-bg__dots" /></div>

      {/* Navbar */}
      <nav className="hclp-nav">
        <a href="/" className="hclp-nav__brand">
          <img src={logo} alt="" className="hclp-nav__logo-img" />
          <span className="hclp-nav__wordmark">HelpChain</span>
        </a>
        <ul className="hclp-nav__links">
          <li><a href="#features">Features</a></li>
          <li><a href="#how">How it works</a></li>
          <li>
            <button className="hclp-nav__signin" onClick={go}>Sign in</button>
          </li>
        </ul>
      </nav>

      {/* Hero */}
      <section className="hclp-hero">
        <span className="hclp-hero__pill">Q&amp;A · Reputation · Rewards</span>
        <h1 className="hclp-hero__h1">
          The community where<br />
          <em>helping pays off.</em>
        </h1>
        <p className="hclp-hero__sub">
          Ask questions, share knowledge, and earn points and badges —
          HelpChain makes every good answer count.
        </p>
        <button className="hclp-cta-btn" onClick={go}>
          Start solving problems
          <IcoArrow cls="hclp-cta-btn__arrow" />
        </button>
      </section>

      {/* Stats */}
      {/* <div className="hclp-stats">
        {STATS.map((s) => (
          <div className="hclp-stats__cell" key={s.label}>
            <strong className="hclp-stats__val">{s.value}</strong>
            <span className="hclp-stats__lbl">{s.label}</span>
          </div>
        ))}
      </div> */}

      {/* Features */}
      <section className="hclp-features" id="features" ref={featRef}>
        <p className="hclp-sec__eye">Why HelpChain</p>
        <h2 className="hclp-sec__h2">Built for contributors,<br />powered by rewards</h2>
        <div className="hclp-grid">
          {FEATURES.map((f, i) => (
            <FeatureCard key={f.title} {...f} index={i} visible={cardsVisible} />
          ))}
        </div>
      </section>

      {/* CTA band */}
      <div className="hclp-band" id="how">
        <div className="hclp-band__dots" aria-hidden="true" />
        <p className="hclp-band__over">Ready?</p>
        <h2 className="hclp-band__h2">Join. Ask. Answer.<br />Get rewarded.</h2>
        <button className="hclp-band__btn" onClick={go}>
          Start solving problems <IcoArrow cls="hclp-band__arrow" />
        </button>
      </div>

      {/* Footer */}
      <footer className="hclp-footer">
        <div className="hclp-footer__brand">
          <img src={logo} alt="" className="hclp-footer__logo" />
          <span className="hclp-footer__name">HelpChain</span>
        </div>
        <span className="hclp-footer__copy">© 2026 HelpChain. All rights reserved.</span>
        <ul className="hclp-footer__links">
          <li><a href="#">Privacy</a></li>
          <li><a href="#">Terms</a></li>
        </ul>
      </footer>
    </div>
  );
}