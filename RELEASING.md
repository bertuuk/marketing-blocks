# Releases and updates

How a new version of Marketing Blocks gets from this repository to the
WordPress sites, and what to do when something doesn't arrive.

## The big picture

```
 push tag vX.Y.Z
        │
        ▼
 GitHub Action (.github/workflows/release.yml)
   checks versions → builds → zips → checks the zip
        │
        ▼
 GitHub Release vX.Y.Z  (marked "Latest")
   └─ bertuuk-marketing-blocks.zip
        │
        ├──► New sites: the deploy installs
        │    …/releases/latest/download/bertuuk-marketing-blocks.zip
        │
        └──► Existing sites: the plugin's own updater
             (includes/class-updater.php) sees the new version,
             WordPress shows the update notice and, with auto-updates
             on, installs it by itself.
```

Nothing is ever compiled on a server. The zip attached to the Release is the
only place where the compiled plugin lives (`build/` is not in git).

## 1. The release workflow

`.github/workflows/release.yml` runs on GitHub's machines every time a tag that
looks like `vX.Y.Z` is pushed. Other pushes (branches, commits) don't trigger
it. It does, in order:

1. **Check versions.** The tag (without the `v`) must match:
   - `Version:` in `bertuuk-marketing-blocks.php`
   - `Stable tag:` in `readme.txt`
   - `"version"` in `package.json`

   If any of them differs, the run stops here and nothing is published.
2. **Build:** `npm ci` and `npm run build`, the same as locally.
3. **Zip:** `wp-scripts plugin-zip`. What goes in is the `files` list in
   `package.json`; everything sits inside a `bertuuk-marketing-blocks/` folder.
4. **Check the zip:** every file inside `bertuuk-marketing-blocks/`, main PHP
   file and `build/` present, no `src/`, `node_modules/` or `.map` files.
5. **Publish:** creates the GitHub Release for the tag, marked as **Latest**,
   with `bertuuk-marketing-blocks.zip` attached and notes generated from the
   commits.

The result is visible in the **Actions** tab (green = published, red = open
the run to see which step failed and why).

## 2. Releasing a new version

1. Make sure `develop` has everything that should go in.
2. Bump the version in the three places above and add a `readme.txt`
   changelog entry. Run `npm install` so `package-lock.json` picks up the new
   version.
3. Commit, merge into `main` and tag `main`:

   ```
   git switch main
   git merge --no-ff develop -m "Release X.Y.Z"
   git tag -a vX.Y.Z -m "Release X.Y.Z"
   git switch develop
   git merge main
   git push origin main develop --tags
   ```

   With git flow (`git flow release start` / `finish`) the result is the same.
   This repo has `gitflow.prefix.versiontag = v` so the tag gets its `v`.
   On macOS, `git flow release finish -m "…"` fails with "getopt does not
   support spaces"; leave out `-m` and type the tag message in the editor,
   or tag by hand as above.
4. Watch the run in **Actions**. When it's green, the zip is under
   **Releases** and the sites will pick it up within 12 hours.

The tagged commit must contain the workflow file; tags on older commits don't
publish anything.

## 3. How the sites update

The updater (`includes/class-updater.php`, class `Bertuuk_GitHub_Updater`)
uses WordPress' own update system, no third-party libraries:

- The plugin header `Update URI: https://github.com/bertuuk/marketing-blocks`
  tells WordPress not to ask wordpress.org about this plugin and to ask the
  `update_plugins_github.com` filter instead.
- That filter calls
  `https://api.github.com/repos/bertuuk/marketing-blocks/releases/latest`
  (no token, the repo is public) and hands WordPress the version and the
  `bertuuk-marketing-blocks.zip` asset URL. WordPress compares versions and
  shows the notice when there's a newer one.
- "View details" shows the Release notes (`plugins_api` filter).
- The answer is cached for 12 hours (1 hour if GitHub failed). **Dashboard →
  Updates → Check again** skips the cache.
- If anything is off (GitHub down, rate limit, no asset, pre-release, odd tag),
  the updater returns nothing: no notice is better than a broken one.

The same file goes, unchanged, into every Bertuuk plugin; only the line that
loads it in the main plugin file changes:

```php
require_once plugin_dir_path( __FILE__ ) . 'includes/class-updater.php';
new Bertuuk_GitHub_Updater( __FILE__, 'bertuuk/marketing-blocks' );
```

If the class changes, copy it to every plugin: when two plugins ship different
copies, the first one WordPress loads wins.

## 4. Rules that must not break

The sites depend on these. Changing any of them means changing the deploys too.

- The asset is always named exactly `bertuuk-marketing-blocks.zip`, and its
  root folder is `bertuuk-marketing-blocks/`. Otherwise WordPress installs it
  as a second plugin instead of updating this one.
- Every release is **Latest**. No pre-releases or drafts: the updater and
  `releases/latest/download/…` ignore them.
- Tags are `vX.Y.Z`.
- The form markup and class names the Tulip theme styles (see the theme's
  `marketing-blocks.css`) stay the same.

## 5. When something doesn't work

**The Action is red**

- *Check that every version matches the tag*: one of the three versions wasn't
  bumped. Fix it, commit, delete the tag (`git tag -d vX.Y.Z` and
  `git push origin :refs/tags/vX.Y.Z`) and tag again.
- *Install dependencies*: `package.json` and `package-lock.json` disagree.
  Run `npm install` locally and commit the lockfile.
- *Publish release*: a Release for that tag already exists. Delete it on
  GitHub (keep the tag) and re-run the job from the Actions tab.

**A site doesn't show the update**

- It's been less than 12 hours: use **Check again** on Dashboard → Updates.
- The site runs 2.3.0 or older: those versions don't have the updater yet.
  Update it once by hand (or redeploy); from 2.4.0 on it updates itself.
- The latest Release is a pre-release or has no `bertuuk-marketing-blocks.zip`.
- The server can't reach `api.github.com` (firewall, or GitHub's limit of 60
  anonymous API calls per hour per IP on a busy shared server).

**The notice shows but auto-updates don't happen**

- Auto-updates aren't enabled for the plugin (Plugins screen, last column).
- WordPress sits inside a git checkout (a `.git` folder in the WordPress
  folder or any folder above it): WordPress then silently turns automatic
  updates off.
- WP-Cron doesn't run: with `DISABLE_WP_CRON` in `wp-config.php` there has
  to be a real server cron calling `wp-cron.php`.
- `AUTOMATIC_UPDATER_DISABLED` is `true`, or a filter on
  `auto_update_plugin` returns `false`.
