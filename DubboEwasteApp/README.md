# DubboEwasteApp static prototype

This directory on **`main` is an older dependency-free prototype** of the operations UI.

It is **not the current production app**.

## Current production app

Use [../EwasteApp/](../EwasteApp/) for current development.

Production: https://dubbo-ewaste-app.vercel.app/

## GitHub Pages warning

The published `gh-pages` branch has evolved separately and currently contains a gateway plus a Supabase-backed GitHub Pages admin console.

That means:

- `main/DubboEwasteApp/` = old static prototype source;
- `gh-pages/DubboEwasteApp/` = current published Pages gateway/admin assets;
- `main/EwasteApp/` = production Next.js/Supabase application source.

Do not assume the files in this directory are identical to what is live on GitHub Pages.

## Prototype behaviour

This `main` version:

- uses a demonstration password;
- stores demo data in browser `localStorage`;
- is not suitable for real customer/device data;
- exists for historical/prototype reference.

## Privacy

Never enter real names, addresses, IMEIs, serial numbers, ownership documents or customer information into this old prototype.

The production application uses Supabase authentication, RLS and private database storage.
