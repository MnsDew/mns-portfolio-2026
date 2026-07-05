export interface ContactLink {
  id: string;
  labelKey: string;
  href: string;
  icon: "github" | "linkedin" | "email";
}

export const contactLinks: ContactLink[] = [
  {
    id: "github",
    labelKey: "github",
    href: "https://github.com/MnsDew",
    icon: "github",
  },
  {
    id: "linkedin",
    labelKey: "linkedin",
    href: "https://www.linkedin.com/in/mg-mns-coding/",
    icon: "linkedin",
  },
  {
    id: "email",
    labelKey: "email",
    href: "mailto:englishmansh70@gmail.com",
    icon: "email",
  },
];

export const siteConfig = {
  name: "MNS70",
  fullName: "Mansoor Gabali",
  handle: "MNS70",
  url: "https://mns70.com",
  email: "englishmansh70@gmail.com",
};
