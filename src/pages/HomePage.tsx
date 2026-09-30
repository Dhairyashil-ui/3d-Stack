import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Map, FileText, FileSpreadsheet, Activity,
  CheckCircle, ArrowRight, ShieldCheck, Bell,
  ChevronRight, Zap, Globe, MapPin, AlertCircle,
  Clock, Star
} from "lucide-react";
import { mockStore } from "../data/mockStore";

function useIsMobile() {
  const [mobile, setMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return mobile;
}

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / 40;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(timer); }
      else setVal(Math.floor(start));
    }, 30);
    return () => clearInterval(timer);
  }, [target]);
  return <>{val}{suffix}</>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AuthUser = any;

const MobileHomePage: React.FC<{ authUser: AuthUser }> = ({ authUser }) => {
  const [activeTab, setActiveTab] = useState<"overview" | "modules" | "activity">("overview");

  const modules = [
    {
      to: "/portal/survey-units",
      icon: FileSpreadsheet,
      label: "Survey Pipeline",
      sub: "1. AOI → 2. GIS → 3. Units",
      color: "#3b82f6",
      bg: "linear-gradient(135deg,#1d4ed8 0%,#3b82f6 100%)",
      badge: "Active",
      badgeColor: "#22d3ee",
    },
    {
      to: "/portal/case-entry",
      icon: FileText,
      label: "Case Entry",
      sub: "Gazette orders & disputes",
      color: "#a855f7",
      bg: "linear-gradient(135deg,#7e22ce 0%,#a855f7 100%)",
      badge: "Records",
      badgeColor: "#f0abfc",
    },
    {
      to: "/portal/survey-activities/manage-publication",
      icon: Activity,
      label: "Manage Publication",
      sub: "OTP & Aadhaar e-Sign",
      color: "#f43f5e",
      bg: "linear-gradient(135deg,#be123c 0%,#f43f5e 100%)",
      badge: "1 Pending",
      badgeColor: "#fda4af",
    },
  ];

  const stats = [
    { label: "ULBs", value: 3, suffix: "", icon: Globe, color: "#38bdf8" },
    { label: "Survey Units", value: 7, suffix: "", icon: Map, color: "#34d399" },
    { label: "Plots Done", value: 678, suffix: "", icon: CheckCircle, color: "#a78bfa" },
    { label: "Publications", value: 1, suffix: " pending", icon: AlertCircle, color: "#fb923c" },
  ];

  const activity = [
    { time: "2h ago", event: "Survey Unit #SU-2024-078 ground-truthed", icon: CheckCircle, color: "#34d399" },
    { time: "5h ago", event: "AOI boundary updated for Ward 12", icon: Map, color: "#38bdf8" },
    { time: "1d ago", event: "Publication OTP sent for Pune East", icon: Bell, color: "#fb923c" },
    { time: "2d ago", event: "Case #CASE-042 gazette order uploaded", icon: FileText, color: "#c084fc" },
    { time: "3d ago", event: "RoR cadastre exported — 152 cities", icon: Star, color: "#facc15" },
  ];

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#0b1120", minHeight: "100vh", color: "#f8fafc", overflowX: "hidden" }}>

      {/* ── HERO BANNER ── */}
      <div style={{ background: "linear-gradient(145deg,#0f2b5c 0%,#1b539c 55%,#0e7490 100%)", padding: "28px 20px 36px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -40, left: -40, width: 150, height: 150, borderRadius: "50%", background: "rgba(56,189,248,0.08)", pointerEvents: "none" }} />

        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(56,189,248,0.15)", border: "1px solid rgba(56,189,248,0.35)", borderRadius: 20, padding: "4px 12px", fontSize: 11, fontWeight: 700, color: "#7dd3fc", letterSpacing: "0.6px", marginBottom: 14 }}>
          <Zap size={11} />
          NAKSHA PORTAL — UAT
        </div>

        <h1 style={{ fontSize: 26, fontWeight: 900, lineHeight: 1.2, marginBottom: 6, color: "#f8fafc" }}>
          Welcome back,<br />
          <span style={{ background: "linear-gradient(90deg,#7dd3fc,#a5f3fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {authUser.name || "Admin"}
          </span>
        </h1>

        <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 22, lineHeight: 1.6 }}>
          <MapPin size={11} style={{ verticalAlign: "middle", marginRight: 4, color: "#ea580c" }} />
          <strong style={{ color: "#fcd34d" }}>{authUser.state || "Maharashtra"}</strong>
          <span style={{ margin: "0 6px", color: "#475569" }}>·</span>
          <strong style={{ color: "#93c5fd" }}>{authUser.district || "Pune"}</strong> District
        </p>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[{ label: "DoLR Certified", color: "#22d3ee" }, { label: "MPSEDC", color: "#a78bfa" }, { label: "152 Cities Live", color: "#34d399" }].map(c => (
            <span key={c.label} style={{ background: "rgba(255,255,255,0.07)", border: `1px solid ${c.color}44`, borderRadius: 20, padding: "4px 12px", fontSize: 11, fontWeight: 600, color: c.color }}>{c.label}</span>
          ))}
        </div>
      </div>

      {/* ── TAB BAR ── */}
      <div style={{ display: "flex", background: "#0b1120", borderBottom: "1px solid #1e2d45", position: "sticky", top: 0, zIndex: 50 }}>
        {(["overview", "modules", "activity"] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ flex: 1, padding: "14px 0", fontSize: 12, fontWeight: activeTab === tab ? 700 : 500, color: activeTab === tab ? "#38bdf8" : "#64748b", background: "none", border: "none", cursor: "pointer", borderBottom: activeTab === tab ? "2px solid #38bdf8" : "2px solid transparent", textTransform: "capitalize", transition: "all 0.2s", letterSpacing: "0.3px" }}>
            {tab}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ── */}
      {activeTab === "overview" && (
        <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#475569", letterSpacing: "1px", marginBottom: 12 }}>DISTRICT SUMMARY</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {stats.map(s => (
                <div key={s.label} style={{ background: "linear-gradient(145deg,#131f35,#182338)", border: "1px solid #1e2d45", borderRadius: 16, padding: "18px 16px" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `${s.color}18`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                    <s.icon size={18} color={s.color} />
                  </div>
                  <div style={{ fontSize: 26, fontWeight: 900, color: s.color, lineHeight: 1 }}>
                    <AnimatedCounter target={s.value} suffix={s.suffix} />
                  </div>
                  <div style={{ fontSize: 11, color: "#64748b", marginTop: 4, fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: "linear-gradient(145deg,#131f35,#182338)", border: "1px solid #1e2d45", borderRadius: 16, padding: "18px 16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#f8fafc" }}>Ground Truthing Progress</span>
              <span style={{ fontSize: 13, color: "#34d399", fontWeight: 700 }}>99.3%</span>
            </div>
            <div style={{ height: 8, background: "#1e2d45", borderRadius: 8, overflow: "hidden" }}>
              <div style={{ width: "99.3%", height: "100%", background: "linear-gradient(90deg,#3b82f6,#34d399)", borderRadius: 8 }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
              <span style={{ fontSize: 11, color: "#475569" }}>678 completed</span>
              <span style={{ fontSize: 11, color: "#475569" }}>683 total</span>
            </div>
          </div>

          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#475569", letterSpacing: "1px", marginBottom: 12 }}>QUICK ACTIONS</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { label: "View Survey Units", to: "/portal/survey-units", icon: FileSpreadsheet, color: "#3b82f6" },
                { label: "Open Case Module", to: "/portal/case-entry", icon: FileText, color: "#a855f7" },
                { label: "Manage Publication", to: "/portal/survey-activities/manage-publication", icon: Activity, color: "#f43f5e" },
              ].map(q => (
                <Link key={q.to} to={q.to} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "linear-gradient(145deg,#131f35,#182338)", border: "1px solid #1e2d45", borderRadius: 14, padding: "14px 16px", textDecoration: "none", color: "#f8fafc" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: `${q.color}20`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <q.icon size={18} color={q.color} />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{q.label}</span>
                  </div>
                  <ChevronRight size={16} color="#475569" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── MODULES TAB ── */}
      {activeTab === "modules" && (
        <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: 16 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#475569", letterSpacing: "1px" }}>DISTRICT ADMIN MODULES</p>
          {modules.map(m => (
            <Link key={m.to} to={m.to} style={{ textDecoration: "none" }}>
              <div style={{ borderRadius: 20, overflow: "hidden", boxShadow: `0 8px 32px ${m.color}22`, border: `1px solid ${m.color}30` }}>
                <div style={{ background: m.bg, padding: "24px 20px 20px", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                      <m.icon size={24} color="#fff" />
                    </div>
                    <h3 style={{ fontSize: 19, fontWeight: 800, color: "#fff", marginBottom: 4 }}>{m.label}</h3>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", margin: 0 }}>{m.sub}</p>
                  </div>
                  <span style={{ background: "rgba(255,255,255,0.15)", border: `1px solid ${m.badgeColor}44`, borderRadius: 20, padding: "4px 12px", fontSize: 11, fontWeight: 700, color: m.badgeColor, whiteSpace: "nowrap" }}>{m.badge}</span>
                </div>
                <div style={{ background: "#0f1929", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, color: "#94a3b8", fontWeight: 600 }}>Open Module</span>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: `${m.color}22`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <ArrowRight size={15} color={m.color} />
                  </div>
                </div>
              </div>
            </Link>
          ))}

          <div style={{ background: "linear-gradient(135deg,#0c1829,#13243d)", border: "1px solid #1e3a5f", borderRadius: 16, padding: "18px 16px", display: "flex", gap: 14, alignItems: "flex-start" }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "#38bdf820", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <ShieldCheck size={20} color="#38bdf8" />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#f8fafc", marginBottom: 4 }}>DoLR / MPSEDC Validated</div>
              <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>All survey operations are validated by the Department of Land Resources and MPSEDC as per NAKSHA protocol.</div>
            </div>
          </div>
        </div>
      )}

      {/* ── ACTIVITY TAB ── */}
      {activeTab === "activity" && (
        <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: 16 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#475569", letterSpacing: "1px" }}>RECENT ACTIVITY</p>

          <div style={{ background: "linear-gradient(145deg,#131f35,#182338)", border: "1px solid #1e2d45", borderRadius: 16, overflow: "hidden" }}>
            {activity.map((a, i) => (
              <div key={i} style={{ display: "flex", gap: 14, padding: "16px 18px", borderBottom: i < activity.length - 1 ? "1px solid #1e2d45" : "none", alignItems: "flex-start" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${a.color}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <a.icon size={16} color={a.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, color: "#e2e8f0", margin: "0 0 4px 0", lineHeight: 1.5 }}>{a.event}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <Clock size={10} color="#475569" />
                    <span style={{ fontSize: 11, color: "#475569" }}>{a.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#475569", letterSpacing: "1px", marginBottom: 12 }}>PERFORMANCE METRICS</p>
            {[
              { label: "Survey Completion Rate", pct: 99, color: "#34d399" },
              { label: "GIS Layer Upload", pct: 84, color: "#38bdf8" },
              { label: "Publication Readiness", pct: 72, color: "#fb923c" },
            ].map(k => (
              <div key={k.label} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: "#94a3b8" }}>{k.label}</span>
                  <span style={{ fontSize: 12, color: k.color, fontWeight: 700 }}>{k.pct}%</span>
                </div>
                <div style={{ height: 6, background: "#1e2d45", borderRadius: 6, overflow: "hidden" }}>
                  <div style={{ width: `${k.pct}%`, height: "100%", background: k.color, borderRadius: 6 }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: "linear-gradient(135deg,#451a03,#7c2d12)", border: "1px solid #9a3412", borderRadius: 16, padding: "16px 18px", display: "flex", gap: 12, alignItems: "center" }}>
            <Bell size={20} color="#fb923c" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#fed7aa", marginBottom: 2 }}>1 Publication Pending</div>
              <div style={{ fontSize: 11, color: "#fca5a5" }}>Requires e-Sign for Pune East Ward 12</div>
            </div>
            <Link to="/portal/survey-activities/manage-publication" style={{ background: "#fb923c", borderRadius: 8, padding: "6px 12px", fontSize: 11, fontWeight: 700, color: "#431407", textDecoration: "none" }}>
              Act Now
            </Link>
          </div>
        </div>
      )}

      <div style={{ height: 32 }} />
    </div>
  );
};

/* ══ DESKTOP (original design preserved) ══ */
const DesktopHomePage: React.FC<{ authUser: AuthUser }> = ({ authUser }) => (
  <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
    <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "36px 32px", boxShadow: "0 4px 16px rgba(0,0,0,0.04)", textAlign: "center", position: "relative", overflow: "hidden", background: "radial-gradient(circle at center, #ffffff 0%, #f8fafc 100%)" }}>
      <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#1b539c", margin: "0 0 6px 0", letterSpacing: "-0.5px" }}>Welcome to the NAKSHA Portal</h1>
      <div style={{ fontSize: "15px", color: "#64748b", fontWeight: 600, marginBottom: "24px" }}>
        State: <span style={{ color: "#ea580c", fontWeight: 700 }}>{authUser.state || "Maharashtra"}</span>
        <span style={{ margin: "0 8px", color: "#cbd5e1" }}>|</span>
        Assigned District: <span style={{ color: "#1b539c", fontWeight: 700 }}>{authUser.district || "Pune"}</span>
      </div>
      <div style={{ position: "relative", height: "240px", maxWidth: "780px", margin: "0 auto 28px auto", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "110px", background: "linear-gradient(180deg, rgba(27,83,156,0.08) 0%, rgba(27,83,156,0.22) 100%)", clipPath: "polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)", borderBottom: "3px solid #1b539c", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ color: "#1b539c", fontSize: "11px", fontWeight: 600, opacity: 0.6, letterSpacing: "2px" }}>NATIONAL GEOSPATIAL 3D GRID • UTM ZONE 44N</div>
        </div>
        <div style={{ position: "absolute", bottom: "40px", display: "flex", alignItems: "flex-end", gap: "12px", opacity: 0.95 }}>
          <img src="/assets/extracted/3d_parcel.png" alt="NAKSHA 3D Parcel" style={{ height: "170px", objectFit: "contain", filter: "drop-shadow(0 10px 15px rgba(0,0,0,0.15))" }} onError={(e) => { e.currentTarget.src = "/assets/3d plan.png"; }} />
        </div>
        <div style={{ position: "absolute", left: "8%", bottom: "25px", backgroundColor: "#ffffff", borderRadius: "12px", padding: "12px 16px", boxShadow: "0 8px 20px rgba(0,0,0,0.08)", border: "1px solid #bfdbfe", display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ backgroundColor: "#eff6ff", padding: "8px", borderRadius: "8px", color: "#1b539c" }}><ShieldCheck size={24} /></div>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: "11px", color: "#64748b" }}>Survey Validation</div>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#1b539c" }}>DoLR / MPSEDC</div>
          </div>
        </div>
        <div style={{ position: "absolute", right: "8%", bottom: "25px", backgroundColor: "#ffffff", borderRadius: "12px", padding: "12px 16px", boxShadow: "0 8px 20px rgba(0,0,0,0.08)", border: "1px solid #bbf7d0", display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ backgroundColor: "#f0fdf4", padding: "8px", borderRadius: "8px", color: "#16a34a" }}><CheckCircle size={24} /></div>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: "11px", color: "#64748b" }}>RoR Cadastre</div>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#16a34a" }}>152 Cities Live</div>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "16px", borderTop: "1px solid #f1f5f9", paddingTop: "24px" }}>
        {[
          { label: "Assigned ULBs", value: "3", color: "#1b539c" },
          { label: "Active Survey Units", value: "7 Units", color: "#0284c7" },
          { label: "Plots Ground Truthed", value: "678 / 683", color: "#16a34a" },
          { label: "Pending Publications", value: "1 Publication", color: "#d97706" },
        ].map(s => (
          <div key={s.label} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "10px 20px", minWidth: "160px" }}>
            <div style={{ fontSize: "12px", color: "#64748b" }}>{s.label}</div>
            <div style={{ fontSize: "20px", fontWeight: 800, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>
    </div>
    <div>
      <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#1e293b", marginBottom: "14px" }}>District Admin Modules &amp; Quick Navigation</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
        {[
          { to: "/portal/survey-units", icon: FileSpreadsheet, iconBg: "#eff6ff", iconColor: "#1b539c", badge: "1. AOI ➔ 2. GIS ➔ 3. Units", badgeBg: "#dbeafe", badgeColor: "#1d4ed8", title: "Survey Unit Details & Spatial Pipeline", desc: "Unified 3-stage workflow: Manage AOI → Upload GIS Layers → Survey Unit Details (ward & surveyor allocations).", cta: "Open Survey Pipeline", ctaColor: "#1b539c", border: "2px solid #bfdbfe", shadow: "0 2px 8px rgba(27,83,156,0.08)" },
          { to: "/portal/case-entry", icon: FileText, iconBg: "#faf5ff", iconColor: "#9333ea", badge: "Gazette Orders", badgeBg: "#f3e8ff", badgeColor: "#9333ea", title: "Case Entry / Manage", desc: "Track survey-related legal cases, upload settlement orders, dispute proceedings, and court records.", cta: "Open Case Module", ctaColor: "#9333ea", border: "1px solid #e2e8f0", shadow: "0 1px 3px rgba(0,0,0,0.05)" },
          { to: "/portal/survey-activities/manage-publication", icon: Activity, iconBg: "#fef2f2", iconColor: "#e11d48", badge: "OTP & e-Sign", badgeBg: "#ffe4e6", badgeColor: "#e11d48", title: "Manage Publication", desc: "Final RoR publication workflow with parcel map inspection, OTP verification, and official Aadhaar e-Sign.", cta: "Open Publication", ctaColor: "#e11d48", border: "1px solid #e2e8f0", shadow: "0 1px 3px rgba(0,0,0,0.05)" },
        ].map(card => (
          <Link key={card.to} to={card.to}
            style={{ backgroundColor: "#ffffff", borderRadius: "10px", border: card.border, padding: "22px", textDecoration: "none", boxShadow: card.shadow, transition: "transform 0.15s, box-shadow 0.15s", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.08)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = card.shadow; }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                <div style={{ backgroundColor: card.iconBg, color: card.iconColor, padding: "10px", borderRadius: "8px" }}><card.icon size={24} /></div>
                <span style={{ fontSize: "11px", fontWeight: 700, color: card.badgeColor, background: card.badgeBg, padding: "3px 10px", borderRadius: "12px" }}>{card.badge}</span>
              </div>
              <h4 style={{ margin: "0 0 6px 0", fontSize: "17px", color: "#1e293b", fontWeight: 800 }}>{card.title}</h4>
              <p style={{ margin: 0, fontSize: "13px", color: "#64748b", lineHeight: "1.45" }}>{card.desc}</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: card.ctaColor, fontSize: "13px", fontWeight: 700, marginTop: "16px" }}>
              <span>{card.cta}</span><ArrowRight size={14} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  </div>
);

/* ══ MAIN EXPORT ══ */
export const HomePage: React.FC = () => {
  const authUser = mockStore.getAuthUser();
  const isMobile = useIsMobile();
  return isMobile ? <MobileHomePage authUser={authUser} /> : <DesktopHomePage authUser={authUser} />;
};
