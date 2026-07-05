import localFont from "next/font/local";

export const tajawal = localFont({
  src: [
    {
      path: "../public/Tajawal/Tajawal-ExtraLight.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../public/Tajawal/Tajawal-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/Tajawal/Tajawal-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/Tajawal/Tajawal-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/Tajawal/Tajawal-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/Tajawal/Tajawal-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../public/Tajawal/Tajawal-Black.ttf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-family-tajawal",
  display: "swap",
});
