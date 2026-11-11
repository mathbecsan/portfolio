"use client";

// News & Updates feed — shared by /experience and /news. Add or edit items in NEWS_ITEMS.

export const NEWS_ITEMS = [
  {
    date: "JUN 2026",
    tag: "Award",
    tagColor: "#E63329",
    dotColor: "#E63329",
    text: `<strong>CS377U — Best Generative Research Award & Best Project in Class (Triple Tie)</strong> · Speak.io<br/>
Led UX research and front-end development for Speak.io, an AI-powered conversational language learning app built in React Native, TypeScript & Expo. Recognized for strongest generative research process and as one of the top projects by a panel of industry judges.`,
  },
  {
    date: "MAY 2026",
    tag: "Program",
    tagColor: "#FBBF24",
    dotColor: "#FBBF24",
    text: `Led a Stanford Peru admissions webinar for prospective international undergrad and grad students — <strong>500+ registrations</strong>, 99% post-event satisfaction rating.<br/><br/>
Accepted to three CodePath courses: <strong>WEB102, AI Dev 101, and Cybersecurity</strong>.<br/><br/>
Selected for the <strong>Hack the Hood AI Summer Program</strong> & <strong>Breakthrough Tech</strong>.`,
  },
  {
    date: "APR 2026",
    tag: "Role",
    tagColor: "#3B82F6",
    dotColor: "#3B82F6",
    text: `Joined Stanford University Department of Psychology as <strong>Quality Assurance Specialist</strong>.<br/><br/>
Completed <strong>CodePath WEB101</strong>.`,
  },
  {
    date: "MAR 2026",
    tag: "Accepted",
    tagColor: "#3B82F6",
    dotColor: "#3B82F6",
    text: `Deferred acceptance to <strong>ITS 2026 Global Policy Fellowship</strong>.<br/><br/>
Accepted to and completed the <strong>ASPIRE AI Integrated Leadership Program</strong>.`,
  },
  {
    date: "FEB 2026",
    tag: "Fellowship",
    tagColor: "#1F2937",
    dotColor: "#1F2937",
    text: `Accepted to the <strong>MWire Labs Fellowship</strong> and <strong>TechForward Fellowship</strong>.<br/>
Building an MVP for minoritized and low-resource language communities in rural India and Africa.`,
  },
];
export default function NewsTimeline() {
  return (
    <>
        <style>{`
          .news-tag {
            display: inline-block;
            font-family: monospace; font-size: 10px; font-weight: 700;
            letter-spacing: 0.12em; text-transform: uppercase;
            padding: 3px 10px; border: 1.5px solid currentColor; border-radius: 2px;
            margin-bottom: 8px;
          }
          .news-entry { opacity: 0.92; transition: opacity 0.2s; }
          .news-entry:hover { opacity: 1; }
        `}</style>
  
        <div style={{ position: "relative", width: "100%", background: "#F5F1E8", overflow: "hidden", padding: "clamp(48px,6vw,80px) clamp(32px,6vw,80px)" }}>
  
          {/* Top-right Bauhaus corner */}
          <div style={{ position: "absolute", top: 0, right: 0, width: "clamp(180px,28vw,340px)", pointerEvents: "none" }}>
            <img loading="lazy" decoding="async" src="/experience-screen7/bauhaus-corner-1.svg" alt="" style={{ width: "100%", height: "auto", display: "block" }} />
          </div>
  
          {/* Bottom-right dots */}
          <div style={{ position: "absolute", bottom: 32, right: 40, display: "flex", gap: 8, pointerEvents: "none" }}>
            {["#E63329","#1F2937","#1F2937"].map((c,i) => (
              <div key={i} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />
            ))}
          </div>
  
          {/* Spiral graphic */}
          <div style={{ position: "absolute", top: "18%", right: "4%", width: "clamp(200px,32vw,420px)", opacity: 0.18, pointerEvents: "none" }}>
            <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
              {Array.from({length: 22}, (_,i) => (
                <ellipse key={i} cx="200" cy="220" rx={20+i*17} ry={15+i*15} stroke="#1F2937" strokeWidth="0.8" />
              ))}
            </svg>
          </div>
  
          {/* Divider line */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "clamp(24px,3vw,40px)", marginTop: "clamp(8px,2vw,24px)" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#1F2937", flexShrink: 0 }} />
            <div style={{ flex: 1, maxWidth: 500, height: 1, background: "#1F2937", opacity: 0.25 }} />
          </div>
  
          {/* Timeline content */}
          <div style={{ maxWidth: 560, position: "relative", zIndex: 1 }}>
  
            {/* Year header */}
            <p style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 13, color: "#E63329", letterSpacing: "0.1em", margin: "0 0 20px" }}>2026</p>
  
            {/* Vertical line */}
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: 100, top: 0, bottom: 0, width: 1, background: "rgba(31,41,55,0.12)" }} />
  
              {NEWS_ITEMS.map((item, i) => (
                <div key={i} className="news-entry" style={{ display: "flex", gap: 0, marginBottom: "clamp(20px,3vw,32px)", alignItems: "flex-start" }}>
                  {/* Date */}
                  <div style={{ width: 90, flexShrink: 0, paddingTop: 2 }}>
                    <span style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: "#E63329", letterSpacing: "0.06em" }}>{item.date}</span>
                  </div>
                  {/* Dot */}
                  <div style={{ width: 20, flexShrink: 0, display: "flex", justifyContent: "center", paddingTop: 5 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: item.dotColor, flexShrink: 0 }} />
                  </div>
                  {/* Content */}
                  <div style={{ flex: 1, paddingLeft: 16 }}>
                    <span className="news-tag" style={{ color: item.tagColor, borderColor: item.tagColor }}>{item.tag}</span>
                    <p style={{ fontFamily: "Georgia, serif", fontSize: "clamp(13px,1.1vw,15px)", color: "rgba(31,41,55,0.8)", margin: 0, lineHeight: 1.65 }}
                      dangerouslySetInnerHTML={{ __html: item.text }} />
                  </div>
                </div>
              ))}
  
            </div>
          </div>
        </div>
  
    </>
  );
}
