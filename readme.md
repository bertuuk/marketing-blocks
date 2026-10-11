# Marketing Blocks by Bertuuk

Custom Gutenberg blocks for marketing, focused on email integration with GetResponse.

## 🚀 Features

- **GetResponse Form Block:**  
  Embed GetResponse forms directly in your WordPress pages or posts with full block editor integration.

## 🛠 Installation

1. Download `bertuuk-marketing-blocks.zip` from the [latest release](https://github.com/bertuuk/marketing-blocks/releases/latest).
2. In WordPress, go to **Plugins → Add New → Upload Plugin** and upload the zip.
3. Activate the plugin from your WordPress dashboard.
4. Add the **GetResponse Form** block in any post or page.

## ⚙️ Requirements

- WordPress 6.0+
- PHP 7.4+

## 📸 Screenshots

| Block in Editor | Form Displayed |
|-----------------|----------------|
| ![GetResponse block editor](./screenshot-1.png) | ![Form on page](./screenshot-2.png) |

## ❓ FAQ

### Does this plugin require a GetResponse account?

Yes. You need an active GetResponse account to use the form block.

## 🚢 Releasing a new version

Every version is published as a GitHub Release with a ready-to-install zip
(already compiled, no `src/` or `node_modules/`):

```
https://github.com/bertuuk/marketing-blocks/releases/download/vX.Y.Z/bertuuk-marketing-blocks.zip
```

The zip is built by `.github/workflows/release.yml` when a `vX.Y.Z` tag is pushed.

1. Update the version in **three places** (they must match or the release fails):
   - `bertuuk-marketing-blocks.php` → `Version: X.Y.Z`
   - `readme.txt` → `Stable tag: X.Y.Z` (and add a changelog entry)
   - `package.json` → `"version": "X.Y.Z"` (then run `npm install` so `package-lock.json` follows)
2. Commit the changes.
3. Tag and push:
   - **With git flow:** `git flow release start X.Y.Z` → bump versions → commit →
     `git flow release finish X.Y.Z` → `git push origin main develop --tags`
     (set `git config gitflow.prefix.versiontag v` once per clone so the tag is `vX.Y.Z`).
   - **Without git flow:** `git tag vX.Y.Z` → `git push origin main --tags`
4. Check the **Actions** tab on GitHub. When the run is green, the zip is under **Releases**.

The tagged commit must already contain `.github/workflows/release.yml`.

### Local development

`build/` is not in git. After cloning, run `npm install` and `npm run build`
(or `npm start` to watch) before using the plugin with wp-env.

## 📝 Changelog

See `readme.txt` or the [Releases](https://github.com/bertuuk/marketing-blocks/releases) page.

## 📄 License

This plugin is licensed under the GPL v2.0 or later.

## ✨ Author

Created by [Berta Nicolau](https://github.com/bertuuk).