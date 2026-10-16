# Cloudinary setup (free tier)

Centher uploads images (post media, room covers, avatars, profile covers)
directly from the browser to **Cloudinary's free tier** — 25GB storage +
25GB bandwidth/month, no credit card. The code ships ready; this page is
the one manual step: creating the account and the upload preset.

## 1. Create a free account

1. Go to <https://cloudinary.com> and sign up (free plan).
2. After login, open the **Dashboard** — note your **Cloud Name** (top of
   the dashboard, e.g. `dxy123abc`).

## 2. Create an unsigned upload preset

1. Go to **Settings** (gear icon) → **Upload** tab.
2. Scroll to **Upload presets** → click **Add upload preset**.
3. Set:
   - **Preset name:** `centher_uploads` (use exactly this, or update the env var below)
   - **Signing Mode:** **Unsigned** (this is what lets the browser upload without a server signature)
   - **Folder:** `centher`
   - **Allowed formats:** leave empty (allow all), OR explicitly list:
     `jpg,jpeg,png,gif,webp,avif,bmp,mp4,webm,ogg,mov,mkv,mp3,wav,m4a,aac,flac,pdf,txt,csv,md,json,zip,doc,docx,xls,xlsx,ppt,pptx`
   - **Max file size:** `50 MB` (chat video uploads need up to 50MB; images are capped at 10MB client-side)
4. Click **Save**.

> **Critical for chat:** The preset MUST allow video/audio formats. The old
> Phase 11 default (`jpg,png,webp,gif` only, 10MB max) breaks voice messages
> and video uploads — Cloudinary rejects them with "Image file format webm
> not allowed". If chat media uploads fail, check this preset first.

> Why unsigned? Signed uploads need a server-side signature endpoint. The
> unsigned preset keeps uploads working with zero backend code, and the
> preset-level format/size limits keep abuse in check.

## 3. Add the env vars

| Variable                               | Value                           | Where                                               |
| -------------------------------------- | ------------------------------- | --------------------------------------------------- |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`    | your Cloud Name from step 1     | Vercel → Project → Settings → Environment Variables |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | `centher_uploads` (from step 2) | same                                                |

For local dev, put them in `.env.local` (never commit this file):

```bash
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dxy123abc
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=centher_uploads
```

## 4. Redeploy

After saving the env vars in Vercel, **redeploy** (or wait for the next
push) — `NEXT_PUBLIC_*` vars are baked in at build time.

## Behavior without the env vars

The app stays fully working: posting, room creation, and settings all
work, but media uploads show an honest "not configured" message and fall
back to text-only / placeholder images. Nothing fakes a successful upload.

## Limits & costs

- Free tier: 25GB storage + 25GB bandwidth/month, ~25k transformations.
- If usage grows, Cloudinary's paid plans start at $89/mo — or the upload
  layer (`lib/media/cloudinary.ts`) can be swapped for S3/R2 later; the
  call sites only depend on `uploadImage(file, folder): Promise<string>`.
