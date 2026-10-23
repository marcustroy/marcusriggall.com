import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

export const runtime = "nodejs";
export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default async function Icon() {
  // Load the headshot image
  const headshotPath = join(process.cwd(), "public/avatars/headshot.jpg");
  const headshotData = await readFile(headshotPath);
  const headshotBase64 = `data:image/jpeg;base64,${headshotData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FAFAFA",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "180px",
            height: "180px",
            borderRadius: "50%",
            overflow: "hidden",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={headshotBase64}
            alt="Idam Adam"
            width={180}
            height={180}
            style={{
              objectFit: "cover",
            }}
          />
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
