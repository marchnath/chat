This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# chat

# chat

## Speech-to-Text (Microphone) notes

This app uses the Web Speech Recognition API when available. Behavior varies by browser, especially on mobile.

- Desktop (Chrome/Edge/Safari): Continuous + interim results are used for live text. We merge partial/final segments and remove duplicates.
- iOS Safari: The browser may aggressively repeat words/phrases and ignore `continuous` mode. For better accuracy on iOS we:
  - Disable `continuous` and `interimResults` for short, stable utterances.
  - Auto-restart listening after each utterance while recording is active.
  - De-duplicate repeated words and repeated short phrases (bigrams–6-grams) when merging.

Tips

- Ensure your learning language matches what you speak; we set `recognition.lang` accordingly.
- Reduce background noise (macOS: System Settings → Sound → Input).
- If duplication persists on mobile, try shorter pauses and sentences; iOS often re-emits overlapping chunks.

Troubleshooting

- If your browser does not support speech recognition, the mic button will be disabled. Use desktop Chrome/Edge or Safari.
- Grant microphone permission when prompted.
