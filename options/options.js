document.addEventListener('DOMContentLoaded', restoreOptions);
saveButton().addEventListener('click', saveOptions);

function saveOptions() {
    const url = getUrlInput().value;
    const interval = parseInt(fetchIntervalInput().value) || 1;

    chrome.storage.sync.set({
        url: url,
        fetchInterval: interval,
    }, () => {
        statusElement().textContent = 'Options saved.';
        setTimeout(() => {
            statusElement().textContent = '';
        }, 750);
    });
}

function restoreOptions() {
    chrome.storage.sync.get({
        url: '',
        fetchInterval: 1,
    }, items => {
        getUrlInput().value = items.url;
        fetchIntervalInput().value = items.fetchInterval;
    });
}

function getUrlInput() {
    return document.getElementById('url');
}

function fetchIntervalInput() {
    return document.getElementById('fetchInterval');
}

function saveButton() {
    return document.getElementById('save');
}

function statusElement() {
    return document.getElementById('status');
}