# MicroPlus
**By 2wiceUponATime**

MicroPlus is an unofficial system for extending [microStudio](https://microstudio.dev/)'s capabilities (See suggestion: [User-written addons](https://microstudio.dev/community/suggestions/user-written-addons/1649/)).

## Installation

To install this extension on Chrome and Chromium-based browsers:
 * Clone the repository - `git clone https://github.com/2wiceUponATime/microplus`
 * Open your browser's extensions page (usually chrome://extensions)
 * Turn on developer mode and select "load unpacked"
 * Select the "extension" folder in the cloned repository

## Example Addon

To test the example addon, run server.py in the cloned repository. Then, open the extension popup and add the URL http://localhost:8000/example. Currently, all it does is log "Hello from an addon!" to the console.

## Creating Addons

Each addon consists of a URL that is added as a JavaScript module on every microStudio page. See [microplus.schema.json](https://github.com/2wiceUponATime/microplus/blob/main/microplus.schema.json) for the microplus.json schema, which each addon must have. The entry point will be loaded as a modular script in the document head.