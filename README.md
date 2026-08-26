# Blinko Pomodoro

A compact focus timer for [Blinko](https://blinko.space). It supports focus and break sessions, named countdown presets, resizing, minimizing, and an optional completion chime.

The App requests no network, note, notification, background-job, or database permissions. Its local interval exists only while the visible timer is running.

## Development

Install Node.js 20 or newer, then run:

```bash
npm install
npm run validate
npm run typecheck
npm test
npm run dev
```

`npm run dev` pairs the App with Blinko's developer page and renders it in the real host. For a standalone browser preview, use `npm run preview`.

Build and package a release with:

```bash
npm run build
npm run pack
```

## Project map

- `blinko.app.json` declares the toolbar contribution and permission-free custom view.
- `ui/timer.html` contains the signed, self-contained timer UI.
- `src/index.ts` contains the minimal App lifecycle entry.
- `locales/` contains marketplace and toolbar copy.
- `tests/` validates the manifest and packaged timer document through the public CLI.

## License

MIT
