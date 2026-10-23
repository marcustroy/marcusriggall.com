import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt =
  "Design Notebook — Explore every direction for your UI";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  const interRegular = await fetch(
    new URL(
      "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
    )
  ).then((res) => res.arrayBuffer());

  const interSemiBold = await fetch(
    new URL(
      "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hjp-Ek-_EeA.woff"
    )
  ).then((res) => res.arrayBuffer());

  const instrumentSerif = await fetch(
    new URL(
      "https://cdn.jsdelivr.net/fontsource/fonts/instrument-serif@latest/latin-400-normal.woff"
    )
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          backgroundColor: "#FAFAFA",
          padding: "56px 60px",
        }}
      >
        {/* Left column — text */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: "480px",
            paddingRight: "48px",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              fontSize: "46px",
              fontFamily: "Instrument Serif",
              color: "#1a1a1a",
              lineHeight: 1.15,
              letterSpacing: "-0.01em",
            }}
          >
            Explore every direction for your UI.
          </div>
          <div
            style={{
              fontSize: "18px",
              fontFamily: "Inter",
              fontWeight: 400,
              color: "#666666",
              lineHeight: 1.5,
              marginTop: "20px",
            }}
          >
            A skill that scaffolds a design iteration notebook. Diverge into
            variations, converge on the best, and keep a decision trail.
          </div>

          <div
            style={{
              display: "flex",
              fontSize: "16px",
              fontFamily: "Inter",
              fontWeight: 400,
              color: "#999999",
              marginTop: "32px",
            }}
          >
            idamadam.com/notebook
          </div>
        </div>

        {/* Right column — notebook mock */}
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
          }}
        >
          {/* Browser frame */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              borderRadius: "12px",
              border: "1px solid #e0e0e0",
              overflow: "hidden",
              backgroundColor: "#ffffff",
              boxShadow: "0 1px 3px rgba(30, 30, 40, 0.06), 0 4px 24px rgba(30, 30, 40, 0.08)",
            }}
          >
            {/* Chrome bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                height: "36px",
                backgroundColor: "#f5f5f5",
                borderBottom: "1px solid #e0e0e0",
                padding: "0 14px",
                gap: "8px",
              }}
            >
              <div style={{ display: "flex", gap: "6px" }}>
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#ddd" }} />
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#ddd" }} />
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#ddd" }} />
              </div>
              <div
                style={{
                  display: "flex",
                  flex: 1,
                  height: "22px",
                  borderRadius: "4px",
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e5e5",
                  alignItems: "center",
                  paddingLeft: "8px",
                  fontSize: "11px",
                  fontFamily: "Inter",
                  color: "#999",
                }}
              >
                localhost:5173
              </div>
            </div>

            {/* Notebook chrome bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                height: "32px",
                borderBottom: "1px solid #eee",
                padding: "0 12px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div style={{ fontSize: "9px", fontFamily: "Inter", fontWeight: 600, color: "#999", textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>
                  Design Notebook
                </div>
                <div style={{ fontSize: "9px", fontFamily: "Inter", color: "#ccc" }}>·</div>
                <div style={{ fontSize: "9px", fontFamily: "Inter", fontWeight: 500, color: "#555" }}>
                  Research Agent
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "9px", fontFamily: "Inter", color: "#999" }}>
                3 of 5
              </div>
            </div>

            {/* Filmstrip */}
            <div
              style={{
                display: "flex",
                gap: "8px",
                padding: "10px 12px",
                borderBottom: "1px solid #eee",
                backgroundColor: "#fafafa",
              }}
            >
              {/* Iteration 01 */}
              <div style={{ display: "flex", flexDirection: "column", width: "90px", borderRadius: "6px", border: "1px solid #e5e5e5", padding: "6px", backgroundColor: "#fff" }}>
                <div style={{ display: "flex", fontSize: "8px", fontFamily: "Inter", fontWeight: 600, color: "#bbb" }}>01</div>
                <div style={{ display: "flex", fontSize: "8px", fontFamily: "Inter", fontWeight: 500, color: "#555", marginTop: "2px" }}>Plain text</div>
                <div style={{ display: "flex", gap: "2px", marginTop: "4px" }}>
                  <div style={{ display: "flex", fontSize: "7px", fontFamily: "Inter", color: "#059669", backgroundColor: "#ecfdf5", borderRadius: "3px", padding: "1px 4px" }}>+ chat UI</div>
                </div>
              </div>

              {/* Iteration 02 — group (diverge) */}
              <div style={{ display: "flex", flexDirection: "column", width: "120px", borderRadius: "6px", border: "1px solid #e5e5e5", padding: "6px", backgroundColor: "#fff" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <div style={{ fontSize: "8px", fontFamily: "Inter", fontWeight: 600, color: "#bbb" }}>04</div>
                  <div style={{ fontSize: "7px", fontFamily: "Inter", fontWeight: 500, color: "#d97706", backgroundColor: "#fffbeb", borderRadius: "3px", padding: "1px 4px" }}>3 directions</div>
                </div>
                <div style={{ display: "flex", gap: "3px", marginTop: "6px" }}>
                  <div style={{ flex: 1, height: "24px", borderRadius: "3px", backgroundColor: "#f5f5f5" }} />
                  <div style={{ flex: 1, height: "24px", borderRadius: "3px", backgroundColor: "#fef3c7", border: "1px solid #fcd34d" }} />
                  <div style={{ flex: 1, height: "24px", borderRadius: "3px", backgroundColor: "#f5f5f5" }} />
                </div>
              </div>

              {/* Iteration 05 — active */}
              <div style={{ display: "flex", flexDirection: "column", width: "90px", borderRadius: "6px", border: "2px solid #222", padding: "6px", backgroundColor: "#fff" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <div style={{ fontSize: "8px", fontFamily: "Inter", fontWeight: 600, color: "#bbb" }}>05</div>
                  <div style={{ fontSize: "7px", fontFamily: "Inter", fontWeight: 500, color: "#d97706", backgroundColor: "#fffbeb", borderRadius: "3px", padding: "1px 4px" }}>latest</div>
                </div>
                <div style={{ display: "flex", fontSize: "8px", fontFamily: "Inter", fontWeight: 500, color: "#555", marginTop: "2px" }}>Accordion</div>
                <div style={{ display: "flex", gap: "2px", marginTop: "4px" }}>
                  <div style={{ display: "flex", fontSize: "7px", fontFamily: "Inter", color: "#059669", backgroundColor: "#ecfdf5", borderRadius: "3px", padding: "1px 4px" }}>+ expandable</div>
                </div>
              </div>
            </div>

            {/* Content area — accordion mock */}
            <div
              style={{
                display: "flex",
                flex: 1,
                flexDirection: "column",
                padding: "16px",
                gap: "8px",
              }}
            >
              {/* Preset bar */}
              <div style={{ display: "flex", gap: "4px", marginBottom: "4px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "3px 10px", borderRadius: "4px", backgroundColor: "#222", fontSize: "8px", fontFamily: "Inter", fontWeight: 600, color: "#fff" }}>Default</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "3px 10px", borderRadius: "4px", border: "1px solid #e5e5e5", fontSize: "8px", fontFamily: "Inter", color: "#999" }}>All expanded</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "3px 10px", borderRadius: "4px", border: "1px solid #e5e5e5", fontSize: "8px", fontFamily: "Inter", color: "#999" }}>Empty</div>
              </div>

              {/* Accordion sections */}
              <div style={{ display: "flex", flexDirection: "column", borderRadius: "6px", border: "1px solid #e5e5e5", padding: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ height: "6px", width: "55%", borderRadius: "3px", backgroundColor: "#ede9fe" }} />
                  <div style={{ fontSize: "8px", fontFamily: "Inter", color: "#999" }}>v</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "3px", marginTop: "6px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                    <div style={{ height: "4px", flex: 1, borderRadius: "2px", backgroundColor: "#f5f5f5" }} />
                    <div style={{ fontSize: "6px", fontFamily: "Inter", color: "#3b82f6" }}>[1]</div>
                  </div>
                  <div style={{ height: "4px", width: "75%", borderRadius: "2px", backgroundColor: "#f5f5f5" }} />
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", borderRadius: "6px", border: "1px solid #e5e5e5", padding: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ height: "6px", width: "45%", borderRadius: "3px", backgroundColor: "#ede9fe" }} />
                  <div style={{ fontSize: "8px", fontFamily: "Inter", color: "#999" }}>&gt;</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Inter",
          data: interRegular,
          style: "normal" as const,
          weight: 400,
        },
        {
          name: "Inter",
          data: interSemiBold,
          style: "normal" as const,
          weight: 600,
        },
        {
          name: "Instrument Serif",
          data: instrumentSerif,
          style: "normal" as const,
          weight: 400,
        },
      ],
    }
  );
}
