async function getAddons() {
    let addons = (await chrome.storage.sync.get('addons')).addons;
    if (!addons) {
        addons = [];
        chrome.storage.sync.set({ addons });
    }
    for (let base of addons) { 
        if (!base.endsWith('/')) {
            base += '/';
        }
        const baseURL = new URL(base);
        function getPath(path) {
            return new URL(path, baseURL).href;
        }
        let error;
        let response;
        try {
            const path = getPath('microplus.json');
            response = await fetch(path);
            if (!response.ok) {
                error = `${path}: HTTP error ${response.status}`;
            }
        } catch (err) {
            error = err;
        }
        let addon = null;
        if (!error) try {
            addon = await response.json();
            if (typeof addon !== 'object') {
                error = `${path}: invalid JSON type: ${typeof addon}`;
            }
        } catch(err) {
            error = err;
        }
        if (error) {
            console.error(error);
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