# Tier Ranking App

A React tier-list shell built with Vite, Tailwind CSS, and React Router.

## Development

```sh
npm install
npm run dev
```

Run `npm run build` to create a production build and `npm run lint` to check the source.

## Routes

- `/` — landing page
- `/lists` — sample lists
- `/lists/demo` — sample list editor
- `/s/demo` — read-only shared list
- Any other path — not-found page

The editor uses local in-memory state seeded with sample data. Items can be dragged
between the pool and tiers and reordered within a container; refreshing resets the
board. The shared-list route remains read-only. Other buttons and the pool input are
visual placeholders, and no data is persisted.
