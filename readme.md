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

## 🚢 Releases and updates

Each version is a GitHub Release with a ready-to-install zip, built by a GitHub
Action when a `vX.Y.Z` tag is pushed. Sites install it from:

```
https://github.com/bertuuk/marketing-blocks/releases/latest/download/bertuuk-marketing-blocks.zip
```

and then update themselves from the WordPress dashboard (or automatically, with
auto-updates on), like any plugin from wordpress.org.

**To publish a version:** bump `Version` (plugin header), `Stable tag`
(`readme.txt`) and `version` (`package.json`) to the same number, merge into
`main`, tag `vX.Y.Z` and push the tag.

How it all works, the rules the sites depend on and what to check when
something fails: **[RELEASING.md](RELEASING.md)**.

### Local development

`build/` is not in git. After cloning, run `npm install` and `npm run build`
(or `npm start` to watch) before using the plugin with wp-env.

## 📝 Changelog

See `readme.txt` or the [Releases](https://github.com/bertuuk/marketing-blocks/releases) page.

## 📄 License

This plugin is licensed under the GPL v2.0 or later.

## ✨ Author

Created by [Berta Nicolau](https://github.com/bertuuk).