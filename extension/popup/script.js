const addonList = document.getElementById('addon-list');

async function loadAddon(index, base) {
    function getPath(path) {
        if (!base.endsWith('/')) {
            base += '/';
        }
        if (path.startsWith('/')) {
            path = path.slice(1);
        }
        return base + path;
    }
    let error;
    let response;
    try {
        const path = getPath('/microplus.json');
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
    const addonElement = document.createElement('div');
    addonElement.classList.add('addon');
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '&times;';
    deleteButton.title = 'Delete addon';
    deleteButton.classList.add('delete-button');
    deleteButton.onclick = () => {
        addons.splice(index, 1);
        chrome.storage.sync.set({ addons });
        location.reload();
    };
    addonElement.appendChild(deleteButton);
    if (error) {
        addonElement.title = error;
        addonElement.classList.add('error');
        addonElement.appendChild(new Text(base));
        addonList.appendChild(addonElement);
        return;
    }
    if (addon.description) {
        addonElement.title = addon.description;
    }
    const icon = document.createElement('img');
    icon.classList.add('addon-icon');
    icon.width = 32;
    icon.height = 32;
    if (addon.icon) {
        icon.src = getPath(addon.icon);
    } else {
        icon.src = '/icon.png';
    }
    addonElement.appendChild(icon);
    const url = document.createElement('a');
    url.innerText = base;
    url.href = base;
    url.target = '_blank';
    if (addon.name) {
        url.classList.add('addon-url');
        addonElement.appendChild(new Text(addon.name + ' ('));
        addonElement.appendChild(url);
        addonElement.appendChild(new Text(')'));
    } else {
        addonElement.appendChild(url);
    }
    addonList.appendChild(addonElement);
}

let addons = (await chrome.storage.sync.get('addons')).addons;
if (!addons) {
    addons = [];
    chrome.storage.sync.set({ addons });
}
for (let [index, base] of addons.entries()) {
    loadAddon(index, base);
}

const addonAdd = document.getElementById('addon-add');
addonAdd.addEventListener('submit', async event => {
    event.preventDefault();
    const data = new FormData(addonAdd);
    const base = data.get('url').replace(/\/$/, '');
    try {
        new URL(base);
    } catch(error) {
        return;
    }
    if (addons.includes(base)) {
        return;
    }
    addonAdd.reset();
    loadAddon(addons.length, base);
    addons.push(base);
    chrome.storage.sync.set({ addons });
})