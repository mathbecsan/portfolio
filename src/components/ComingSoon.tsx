/* Shared "Coming Soon" placeholder for any section that has no published work yet. */

export const COMING_SOON_IMG = "/placeholders/coming-soon-a24e04ff.webp";

export default function ComingSoon({
  message = "New work is on its way. Check back soon.",
  compact = false,
}: {
  message?: string;
  compact?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        padding: compact ? "clamp(24px,4vw,40px) 16px" : "clamp(32px,6vw,72px) 16px",
      }}
    >
      <img
        src={COMING_SOON_IMG}
        alt="Coming soon"
        width={1190}
        height={1322}
        loading="eager"
        decoding="async"
        style={{
          width: compact ? "min(100%, 320px)" : "min(100%, 440px)",
          height: "auto",
          display: "block",
          borderRadius: 12,
          boxShadow: "0 18px 48px rgba(31,41,55,0.14)",
        }}
      />
      <p
        style={{
          fontFamily: "Georgia, serif",
          fontSize: "clamp(14px,1.3vw,17px)",
          color: "rgba(31,41,55,0.7)",
          margin: "clamp(20px,3vw,28px) 0 0",
          maxWidth: 420,
          lineHeight: 1.6,
        }}
      >
        {message}
      </p>
    </div>
  );
}
