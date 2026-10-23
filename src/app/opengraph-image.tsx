import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

export const runtime = "nodejs";
export const alt = "Idam Adam - Lead Product Designer";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  // Load the headshot image
  const headshotPath = join(process.cwd(), "public/avatars/headshot.jpg");
  const headshotData = await readFile(headshotPath);
  const headshotBase64 = `data:image/jpeg;base64,${headshotData.toString("base64")}`;

  // Load fonts
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
          padding: "72px 80px",
          alignItems: "center",
        }}
      >
        {/* Left column — identity */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: "420px",
            paddingRight: "64px",
            flexShrink: 0,
          }}
        >
          {/* Headshot */}
          <div
            style={{
              display: "flex",
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              overflow: "hidden",
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
              marginBottom: "32px",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={headshotBase64}
              alt="Idam Adam"
              width={120}
              height={120}
              style={{
                objectFit: "cover",
              }}
            />
          </div>

          {/* Name */}
          <div
            style={{
              fontSize: "52px",
              fontFamily: "Instrument Serif",
              color: "#1a1a1a",
              lineHeight: 1.1,
              letterSpacing: "-0.01em",
            }}
          >
            Idam Adam
          </div>

          {/* Role */}
          <div
            style={{
              fontSize: "24px",
              fontFamily: "Inter",
              fontWeight: 400,
              color: "#666666",
              marginTop: "12px",
            }}
          >
            Lead Product Designer
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            display: "flex",
            width: "1px",
            height: "320px",
            backgroundColor: "rgba(107, 114, 128, 0.2)",
            flexShrink: 0,
          }}
        />

        {/* Right column — tagline */}
        <div
          style={{
            display: "flex",
            flex: 1,
            paddingLeft: "64px",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: "36px",
              fontFamily: "Instrument Serif",
              color: "#1a1a1a",
              lineHeight: 1.4,
              letterSpacing: "-0.01em",
            }}
          >
            I design intelligent and thoughtful software that makes complex,
            high-stakes problems feel simple.
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
