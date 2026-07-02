# Rolland Nagy — Portfolio

Static site (plain HTML/CSS/JS, no build step). Content is pulled from the CV; design is
inspired by the provided reference (dark navy/teal background, orange accent, rounded bold type).

## Local preview

Any static file server works, e.g.:

```bash
npx serve .
```

## Deploy to a DigitalOcean droplet

### Option A — Docker (recommended, matches your existing stack)

```bash
# on the droplet, with the repo cloned
docker build -t portfolio .
docker run -d --name portfolio -p 80:80 --restart unless-stopped portfolio
```

To update after changes: `git pull`, then `docker build -t portfolio . && docker rm -f portfolio` and re-run the `docker run` command above.

### Option B — plain Nginx (no Docker)

```bash
sudo apt update && sudo apt install -y nginx
sudo cp -r ./* /var/www/portfolio
sudo cp nginx.conf /etc/nginx/sites-available/portfolio
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default   # avoid conflicting default_server
sudo nginx -t && sudo systemctl reload nginx
```

### HTTPS

Once a domain points at the droplet's IP, use certbot for a free TLS cert:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

## Editing content

- All copy lives in [`index.html`](index.html) — hero, about, experience cards, contact.
- Colors/spacing/fonts are CSS variables at the top of [`css/style.css`](css/style.css).
- The "RN" portrait placeholder (`.portrait-initials` in `index.html`) can be swapped for a real
  photo: replace the `<span class="portrait-initials">RN</span>` with an `<img>` tag inside
  `.portrait-frame`.
