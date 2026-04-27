# Carolina Clean Out and Repair — Website

Static site. Pure HTML, CSS, and JS. No build step.

## Local preview
Double click `index.html` or run a quick local server:
```
npx serve .
```

## Deploy to Netlify
1. Go to https://app.netlify.com → Add new site → Deploy manually
2. Drag and drop the entire `site` folder into the upload zone
3. Netlify gives you a temporary URL. Site is live.
4. Add custom domain: Site settings → Domain management → Add domain
5. Connect Gmail for form notifications: Forms → Settings → Form notifications → Add notification → Email → enter `carolinacleanoutandrepair@gmail.com`

## Forms
The contact form uses Netlify Forms. Submissions show up under the Forms tab in the Netlify dashboard. Spam protection is built in via the hidden honeypot field.

## File structure
```
site/
  index.html
  styles.css
  main.js
  README.md
  assets/
    logo.jpg
    projects/
      dock-before.jpg, dock-after.jpg
      deck-before.jpg, deck-after.jpg
      junk-before.jpg, junk-after.jpg
```

## Updating photos
Drop new images into `assets/projects/` and update the `src` paths in `index.html`. Recommended max side 1500px, quality ~72 to keep files small.

## Updating copy
All text lives in `index.html`. Search for the section you want and edit in place.
