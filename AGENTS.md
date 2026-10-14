# Portfolio publishing workflow

- Keep requested changes local until the user explicitly authorizes publishing that batch.
- Do not push to GitHub `main`, trigger a Netlify build, or deploy to production without that authorization. Netlify automatically publishes pushes to `main`, and the user has a limited deployment allowance.
- Earlier publishing requests do not authorize publishing later edits.
- Local previews, lint/build checks, and local commits are allowed as part of the requested work.
- Use current local `main`, preserve unrelated work, do not edit `dist` directly, and do not add dependencies for routine changes.
