document.addEventListener('DOMContentLoaded', restoreOptions);
saveButton().addEventListener('click', saveOptions);

function saveOptions() {
    const url = getUrlInput().value;

    chrome.storage.sync.set({ url: url }, () => {
        statusElement().textContent = 'Options saved.';
        setTimeout(() => {
            statusElement().textContent = '';
        }, 750);
    });
}

function restoreOptions() {
    chrome.storage.sync.get('url', items => {
        getUrlInput().value = items.url;
    });
}

function getUrlInput() {
    return document.getElementById('url');
}

function saveButton() {
    return document.getElementById('save');
}

function statusElement() {
    return document.getElementById('status');
}