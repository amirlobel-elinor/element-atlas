# Element Atlas 2.3

A periodic-table memorization app: choose a quiz, choose your elements, and start.

## Upload package

`Element-Atlas-GitHub.zip` contains the complete app and this guide at one level. There is no nested `element-atlas` folder and no build step.

Your computer may create a folder when extracting the ZIP. Open that folder: `index.html`, `styles.css`, `app.js`, and the other files should all be directly inside it.

## Replace your existing GitHub files

1. Extract the ZIP.
2. Open your GitHub repository's **Code** tab and select the branch used by GitHub Pages, usually `main`.
3. Open your site's publishing folder: usually the repository root, or `docs` if that is your configured source.
4. Choose **Add file → Upload files**. Select all extracted files together. Upload the files themselves, not the ZIP or its enclosing folder.
5. Enter `Update Element Atlas` as the commit message and commit to your publishing branch. If using a new branch, merge its pull request to publish.

Matching filenames in the same location replace the old versions when committed. You do not need to delete them first. Keep your existing `CNAME` and unrelated repository files. Uploading files does not remove old folders automatically.

## Check publishing

For an existing working site, keep its current Pages settings.

For a new site, open **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, select `main` (or your publishing branch), choose **/(root)**, and save. If you deliberately keep the site in `docs`, choose **/docs** instead.

The configured publishing folder must contain `index.html` directly. Check the **Actions** tab for deployment completion, then open your site. Close old app tabs and reopen while online if the previous version remains visible; refresh once more if necessary.

No npm install, build command, API key, or backend is required.

## Included files

- `index.html`, `styles.css`, `app.js`: interface and game controls.
- `core.js`, `data.js`: questions, scoring, and element data.
- `logo.svg` and PNG icons: Ea logo and app icons.
- `manifest.webmanifest`, `sw.js`: installation and offline support.
- `SOURCES.md`: chemistry references.

Development tests and preview-building tools are omitted from this upload package; the complete running app is included. The separate `Element-Atlas-Preview.html` download is for previewing locally and does not need to be uploaded.

## Study modes and progress

All 14 illustrated quiz tiles remain grouped under Map & memory, Chemistry, and Connections. Explore and Progress remain available. The visual design now matches the genBio and genChem app family: rounded illustrated tiles, raised buttons, bold headings, and the genChem violet, cyan, and amber palette. The Ea logo, short labels, and choose → configure → play flow are retained. Desktop navigation uses a compact sidebar; smaller screens keep Play, Explore, and Progress at the top.

Progress is saved in your browser. Use **Progress → Backup & reset → Export** before changing devices or clearing browser data. Updating files at the same site address preserves existing version-2 progress.

## GitHub documentation

- [Uploading repository files](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository)
- [Configuring GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

## Verification

Question generation, quiz setup, navigation, scoring, replay, progress persistence, self-contained preview, and flat package contents have been checked in Node. A browser engine could not be installed in this environment, so rendered layout, installation, and offline operation still need a browser check.

After uploading, check one quiz, Explore, Progress, light/dark themes, and a phone-size window. Visit online before testing offline.
