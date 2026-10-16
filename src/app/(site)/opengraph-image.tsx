import { ImageResponse } from "next/og";

export const alt = "2.0 — Elevate your vision";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Brand burst mark (white) with the lime up-arrow, drawn as a div composition
// so it renders reliably in Satori.
function BurstMark() {
  const bars = [0, 45, 90, 135];
  return (
    <div
      style={{
        position: "relative",
        width: 240,
        height: 240,
        display: "flex",
      }}
    >
      {bars.map((deg) => (
        <div
          key={deg}
          style={{
            position: "absolute",
            left: 103,
            top: 20,
            width: 34,
            height: 200,
            borderRadius: 4,
            background: "#ffffff",
            transform: `rotate(${deg}deg)`,
          }}
        />
      ))}
      {/* lime up-arrow */}
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 92,
          width: 0,
          height: 0,
          borderLeft: "60px solid transparent",
          borderRight: "60px solid transparent",
          borderBottom: "70px solid #c6ff34",
        }}
      />
    </div>
  );
}

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#000000",
          color: "#ffffff",
          padding: "72px",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* lime corner accent */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: 10,
            background: "#c6ff34",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flex: 1,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: 99,
                background: "#c6ff34",
              }}
            />
            <div
              style={{
                fontSize: 30,
                fontWeight: 700,
                letterSpacing: 10,
                color: "#a3a3ad",
              }}
            >
              2.0
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 110, fontWeight: 800, lineHeight: 1 }}>
              Elevate your
            </div>
            <div
              style={{
                fontSize: 110,
                fontWeight: 800,
                lineHeight: 1,
                color: "#c6ff34",
              }}
            >
              vision.
            </div>
          </div>

          <div style={{ fontSize: 27, color: "#a3a3ad" }}>
            B2B growth · Leads · Content · SEO · Media · Sourcing
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            paddingLeft: 40,
          }}
        >
          <BurstMark />
        </div>
      </div>
    ),
    { ...size },
  );
}
