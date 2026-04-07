import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "ITL Solutions - IT Company in Tajikistan";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #2563eb 100%)",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background decorative circles */}
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 350,
            height: 350,
            borderRadius: "50%",
            background: "rgba(96, 165, 250, 0.12)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -100,
            left: -60,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "rgba(59, 130, 246, 0.1)",
          }}
        />

        {/* Hexagon logo */}
        <svg
          width="100"
          height="90"
          viewBox="0 0 60 52"
          style={{ marginBottom: 24 }}
        >
          <polygon
            points="30,2 58,16 58,40 30,52 2,40 2,16"
            fill="rgba(255,255,255,0.15)"
            stroke="rgba(96,165,250,0.6)"
            strokeWidth="1.5"
          />
          <text
            x="30"
            y="33"
            fontFamily="sans-serif"
            fontSize="16"
            fontWeight="800"
            fill="white"
            textAnchor="middle"
          >
            ITL
          </text>
        </svg>

        {/* Company name */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: "white",
            letterSpacing: 4,
            marginBottom: 8,
          }}
        >
          ITL Solutions
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 24,
            color: "rgba(255,255,255,0.7)",
            letterSpacing: 2,
            marginBottom: 32,
          }}
        >
          Transforming Business through Technology
        </div>

        {/* Services bar */}
        <div
          style={{
            display: "flex",
            gap: 24,
            fontSize: 14,
            color: "rgba(255,255,255,0.5)",
            textTransform: "uppercase",
            letterSpacing: 3,
          }}
        >
          <span>Web</span>
          <span>•</span>
          <span>Mobile</span>
          <span>•</span>
          <span>Cloud</span>
          <span>•</span>
          <span>Security</span>
          <span>•</span>
          <span>Consulting</span>
        </div>

        {/* Bottom info */}
        <div
          style={{
            position: "absolute",
            bottom: 30,
            display: "flex",
            gap: 32,
            fontSize: 16,
            color: "rgba(255,255,255,0.4)",
          }}
        >
          <span>itlsolutions.net</span>
          <span>•</span>
          <span>Dushanbe, Tajikistan</span>
          <span>•</span>
          <span>+992 557 777 509</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
