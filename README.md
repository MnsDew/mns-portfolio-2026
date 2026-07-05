# MNS70 Portfolio

Personal portfolio of **Mansoor Gabali (MNS70)** — Software Engineer & Full-Stack Developer.

**Live:** [mns70.com](https://mns70.com)

## About

Single-page portfolio with i18n (`/en`, `/ar`, `/tr`), project showcase, skills, interactive globe, and a rate-limited contact form.

## Tech stack

- Next.js 16 · React 19 · TypeScript · Tailwind CSS v4
- next-intl · motion · lottie-react · EmailJS
- Deployed with [OpenNext Cloudflare](https://opennext.js.org/cloudflare)

## Getting started

```bash
git clone https://github.com/MnsDew/My-portfolio.git
cd My-portfolio
npm install
cp .env.example .env
npm run dev
```

Open [http://localhost:3000/en](http://localhost:3000/en)

## Environment variables

Copy `.env.example` to `.env` and fill in:

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | `https://mns70.com` |
| `EMAILJS_*` | Contact form (server-side) |
| `UPSTASH_REDIS_*` | Rate limiting (recommended in production) |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Local development |
| `npm run build` | Production build |
| `npm run preview` | Preview on Cloudflare Workers locally |
| `npm run deploy` | Build and deploy to Cloudflare |

## Deploy (Cloudflare)

```bash
npx wrangler login
npm run deploy
```

Add `mns70.com` under **Workers & Pages → Domains**. Set env vars in the Cloudflare dashboard, then redeploy.

## License

This project is licensed under the **Apache License 2.0**. See [LICENSE](LICENSE).

You may use or modify this code, but please **credit Mansoor Gabali (MNS70)** as the original author.
