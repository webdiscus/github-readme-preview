# github-readme-preview

This is markdown file preview in GitHub makeup on localhost.\
Supports for the dark and light themes of browser.

![preview](https://github.com/webdiscus/github-readme-preview/blob/master/docs/assets/images/preview.png?raw=true "preview")

## Required

- Node.js 16
- Npm

## Install

```
git clone https://github.com/webdiscus/github-readme-preview.git
cd github-readme-preview
npm install
```

## Setup

Create/copy a markdown file, e.g. `README.md`, in the `github-readme-preview/` directory
or in any subdirectory.


## Start preview in commandline

Run from the `github-readme-preview/` directory:

```
npm run preview --file=path/to/markdown_file
```

The commandline argument `--file` is optional. Default file is `README.md`.
The file extension `.md` can be omitted.

Now you can open this file in a code editor, change the file and save it.
The browser will show the changes.

## Stop preview

Press `CTRL` + `C`

## Usage examples

Preview the `./README.md` file:
```
npm run preview
```

Preview the `./CHANGELOG.md` file:
```
npm run preview --file=CHANGELOG
```

Preview the `./docs/myMarkdownFile.md` file:
```
npm run preview --file=docs/myMarkdownFile
```

Preview a file with absolute path, like `/absolute/path/to/README.md`:
```
npm run preview --file=/absolute/path/to/README
```

## Switch dark / light themes

Open the browser settings and change browser theme to `dark` or `light`.

For example, in Firefox, open the address `about:preferences`.\
On the settings site go to `General > Language and Appearence > Web site appearence`.\
Then select theme: `Light` or `Dark`.

## Syntax highlighting example

_HTML_
```html
<!-- Comment -->
<div class="container">
  <p>Paragraph</p>
</div>
```

_JavaScript_
```js
const arr = [1, 2, 'banana'];
```

## ⚠️ Limitation

Relative image path is not supported, use URL, e.g.:
```
![image](https://github.com/path/to/docs/image.png?raw=true "image")
```