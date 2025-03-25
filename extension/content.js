async function getAddons() {
    let addons = (await chrome.storage.sync.get('addons')).addons;
    if (!addons) {
        addons = [];
        chrome.storage.sync.set({ addons });
    }
    for (let base of addons) {
        function getPath(path) {
            if (!base.endsWith('/')) {
                base += '/';
            }
            if (path.startsWith('/')) {
                path = path.slice(1);
            }
            return base + path;
        }
        const response = await fetch(getPath('/addon.json'));
        if (!response.ok) {
            console.error('Failed to fetch addon: ' + base);
            continue;
        }
        const addon = await response.json();
        if (typeof addon !== 'object') {
            console.error('Failed to parse addon: ' + base);
            continue;
        }
        const script = document.createElement('script');
        script.src = getPath(addon.entry);
        script.type = 'module';
        document.head.appendChild(script);
        console.log('Loaded addon: ' + base);
    }
}

getAddons();