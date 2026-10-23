import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt =
  "States — Reach any prototype state in one click";
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
            Reach any prototype state in one click.
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
            A prompt that reads your React prototype and wires up a control
            panel. Works with Claude Code, Cursor, Codex, Figma Make, or any
            other coding agent.
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
            idamadam.com/states
          </div>
        </div>

        {/* Right column — demo mock */}
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
              boxShadow: "0 4px 24px rgba(0, 0, 0, 0.08)",
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
              <div
                style={{
                  display: "flex",
                  gap: "6px",
                }}
              >
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: "#ddd",
                  }}
                />
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: "#ddd",
                  }}
                />
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: "#ddd",
                  }}
                />
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
                localhost:5174
              </div>
            </div>

            {/* App content area */}
            <div
              style={{
                display: "flex",
                flex: 1,
              }}
            >
              {/* Chat sidebar */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "180px",
                  borderRight: "1px solid #eee",
                  backgroundColor: "#fafafa",
                  padding: "12px",
                }}
              >
                {/* Chat header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "13px",
                    fontFamily: "Inter",
                    fontWeight: 600,
                    color: "#333",
                    marginBottom: "12px",
                  }}
                >
                  VibeUI
                </div>

                {/* Chat messages */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    flex: 1,
                  }}
                >
                  {/* User message */}
                  <div
                    style={{
                      display: "flex",
                      backgroundColor: "#e8e8e8",
                      borderRadius: "8px",
                      padding: "6px 8px",
                      fontSize: "9px",
                      fontFamily: "Inter",
                      color: "#444",
                      lineHeight: 1.3,
                    }}
                  >
                    Build me a pricing page
                  </div>
                  {/* AI message */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      backgroundColor: "#ffffff",
                      borderRadius: "8px",
                      padding: "6px 8px",
                      fontSize: "9px",
                      fontFamily: "Inter",
                      color: "#555",
                      lineHeight: 1.3,
                      border: "1px solid #eee",
                    }}
                  >
                    Here&apos;s a pricing page with three tiers.
                  </div>
                  {/* User message 2 */}
                  <div
                    style={{
                      display: "flex",
                      backgroundColor: "#e8e8e8",
                      borderRadius: "8px",
                      padding: "6px 8px",
                      fontSize: "9px",
                      fontFamily: "Inter",
                      color: "#444",
                      lineHeight: 1.3,
                    }}
                  >
                    Add a popular badge
                  </div>
                  {/* AI message 2 */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      backgroundColor: "#ffffff",
                      borderRadius: "8px",
                      padding: "6px 8px",
                      fontSize: "9px",
                      fontFamily: "Inter",
                      color: "#555",
                      lineHeight: 1.3,
                      border: "1px solid #eee",
                    }}
                  >
                    Added a &quot;Popular&quot; badge to Pro.
                  </div>
                </div>

                {/* Chat input */}
                <div
                  style={{
                    display: "flex",
                    height: "24px",
                    borderRadius: "6px",
                    border: "1px solid #ddd",
                    backgroundColor: "#fff",
                    alignItems: "center",
                    paddingLeft: "8px",
                    fontSize: "9px",
                    fontFamily: "Inter",
                    color: "#bbb",
                    marginTop: "8px",
                  }}
                >
                  Start a conversation...
                </div>
              </div>

              {/* Preview area */}
              <div
                style={{
                  display: "flex",
                  flex: 1,
                  position: "relative",
                  backgroundColor: "#fff",
                  padding: "16px",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* States panel overlay */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    position: "absolute",
                    top: "10px",
                    left: "10px",
                    width: "120px",
                    borderRadius: "8px",
                    border: "1px solid #e0e0e0",
                    backgroundColor: "#fff",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                    padding: "8px",
                    zIndex: 10,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      fontSize: "10px",
                      fontFamily: "Inter",
                      fontWeight: 600,
                      color: "#333",
                      marginBottom: "6px",
                    }}
                  >
                    States
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "3px",
                    }}
                  >
                    {/* Preset buttons */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "52px",
                        height: "22px",
                        borderRadius: "4px",
                        border: "2px solid #222",
                        backgroundColor: "#f0f0f0",
                        fontSize: "8px",
                        fontFamily: "Inter",
                        fontWeight: 600,
                        color: "#222",
                      }}
                    >
                      Latest
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "52px",
                        height: "22px",
                        borderRadius: "4px",
                        border: "1px solid #ddd",
                        backgroundColor: "#fff",
                        fontSize: "8px",
                        fontFamily: "Inter",
                        color: "#666",
                      }}
                    >
                      Previous
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "52px",
                        height: "22px",
                        borderRadius: "4px",
                        border: "1px solid #ddd",
                        backgroundColor: "#fff",
                        fontSize: "8px",
                        fontFamily: "Inter",
                        color: "#666",
                      }}
                    >
                      Generating
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "52px",
                        height: "22px",
                        borderRadius: "4px",
                        border: "1px solid #ddd",
                        backgroundColor: "#fff",
                        fontSize: "8px",
                        fontFamily: "Inter",
                        color: "#666",
                      }}
                    >
                      Error
                    </div>
                  </div>
                </div>

                {/* Pricing cards */}
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "flex-end",
                  }}
                >
                  {/* Basic card */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: "110px",
                      borderRadius: "8px",
                      border: "1px solid #e5e5e5",
                      padding: "12px",
                      backgroundColor: "#fff",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "11px",
                        fontFamily: "Inter",
                        fontWeight: 600,
                        color: "#333",
                      }}
                    >
                      Basic
                    </div>
                    <div
                      style={{
                        fontSize: "20px",
                        fontFamily: "Inter",
                        fontWeight: 600,
                        color: "#111",
                        marginTop: "4px",
                      }}
                    >
                      $9
                    </div>
                    <div
                      style={{
                        fontSize: "8px",
                        fontFamily: "Inter",
                        color: "#999",
                      }}
                    >
                      /month
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                        marginTop: "10px",
                      }}
                    >
                      <div
                        style={{
                          height: "4px",
                          borderRadius: "2px",
                          backgroundColor: "#eee",
                          width: "80%",
                        }}
                      />
                      <div
                        style={{
                          height: "4px",
                          borderRadius: "2px",
                          backgroundColor: "#eee",
                          width: "65%",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "24px",
                        borderRadius: "6px",
                        backgroundColor: "#f5f5f5",
                        fontSize: "9px",
                        fontFamily: "Inter",
                        fontWeight: 600,
                        color: "#555",
                        marginTop: "12px",
                      }}
                    >
                      Get started
                    </div>
                  </div>

                  {/* Pro card (highlighted) */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: "110px",
                      borderRadius: "8px",
                      border: "2px solid #111",
                      padding: "12px",
                      backgroundColor: "#fff",
                      position: "relative",
                    }}
                  >
                    {/* Popular badge */}
                    <div
                      style={{
                        display: "flex",
                        position: "absolute",
                        top: "-10px",
                        right: "10px",
                        backgroundColor: "#111",
                        color: "#fff",
                        fontSize: "7px",
                        fontFamily: "Inter",
                        fontWeight: 600,
                        padding: "2px 8px",
                        borderRadius: "10px",
                      }}
                    >
                      Popular
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        fontFamily: "Inter",
                        fontWeight: 600,
                        color: "#333",
                      }}
                    >
                      Pro
                    </div>
                    <div
                      style={{
                        fontSize: "20px",
                        fontFamily: "Inter",
                        fontWeight: 600,
                        color: "#111",
                        marginTop: "4px",
                      }}
                    >
                      $29
                    </div>
                    <div
                      style={{
                        fontSize: "8px",
                        fontFamily: "Inter",
                        color: "#999",
                      }}
                    >
                      /month
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                        marginTop: "10px",
                      }}
                    >
                      <div
                        style={{
                          height: "4px",
                          borderRadius: "2px",
                          backgroundColor: "#eee",
                          width: "90%",
                        }}
                      />
                      <div
                        style={{
                          height: "4px",
                          borderRadius: "2px",
                          backgroundColor: "#eee",
                          width: "70%",
                        }}
                      />
                      <div
                        style={{
                          height: "4px",
                          borderRadius: "2px",
                          backgroundColor: "#eee",
                          width: "55%",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "24px",
                        borderRadius: "6px",
                        backgroundColor: "#111",
                        fontSize: "9px",
                        fontFamily: "Inter",
                        fontWeight: 600,
                        color: "#fff",
                        marginTop: "12px",
                      }}
                    >
                      Get started
                    </div>
                  </div>

                  {/* Team card */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: "110px",
                      borderRadius: "8px",
                      border: "1px solid #e5e5e5",
                      padding: "12px",
                      backgroundColor: "#fff",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "11px",
                        fontFamily: "Inter",
                        fontWeight: 600,
                        color: "#333",
                      }}
                    >
                      Team
                    </div>
                    <div
                      style={{
                        fontSize: "20px",
                        fontFamily: "Inter",
                        fontWeight: 600,
                        color: "#111",
                        marginTop: "4px",
                      }}
                    >
                      $79
                    </div>
                    <div
                      style={{
                        fontSize: "8px",
                        fontFamily: "Inter",
                        color: "#999",
                      }}
                    >
                      /month
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                        marginTop: "10px",
                      }}
                    >
                      <div
                        style={{
                          height: "4px",
                          borderRadius: "2px",
                          backgroundColor: "#eee",
                          width: "85%",
                        }}
                      />
                      <div
                        style={{
                          height: "4px",
                          borderRadius: "2px",
                          backgroundColor: "#eee",
                          width: "60%",
                        }}
                      />
                      <div
                        style={{
                          height: "4px",
                          borderRadius: "2px",
                          backgroundColor: "#eee",
                          width: "75%",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "24px",
                        borderRadius: "6px",
                        backgroundColor: "#f5f5f5",
                        fontSize: "9px",
                        fontFamily: "Inter",
                        fontWeight: 600,
                        color: "#555",
                        marginTop: "12px",
                      }}
                    >
                      Get started
                    </div>
                  </div>
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
          style: "normal",
          weight: 400,
        },
        {
          name: "Inter",
          data: interSemiBold,
          style: "normal",
          weight: 600,
        },
        {
          name: "Instrument Serif",
          data: instrumentSerif,
          style: "normal",
          weight: 400,
        },
      ],
    }
  );
}
