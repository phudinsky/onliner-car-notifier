const CACHE_KEY_FOR_LAST_DATE = 'popup_last_date';

document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.sync.get('url', items => {
        const url = items.url;

        if (url) {
            const params = (url.indexOf("#") === false) ? null : url.split('#')[1];

            fetch("http://ab.onliner.by/search", {
                method: 'POST',
                headers: {
                    "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                },
                body: params
            })
                .then(r => r.json())
                .then(processResponse)
                .catch(console.log.bind(console));
        }
    });
});

function processResponse(response) {
    const ads = response.result.advertisements;

    const lastDate = window.localStorage.getItem(CACHE_KEY_FOR_LAST_DATE);

    for (let id in ads) {
        let ad = ads[id];

        let creationDate = Date.parse(ad.creationDate.date + ' ' + ad.creationDate.timezone);

        if (lastDate && creationDate <= lastDate) {
            continue;
        }

        buildAdRow(ad);
        window.localStorage.setItem(CACHE_KEY_FOR_LAST_DATE, creationDate);
    }
}


function buildAdRow(adInfo) {
    const car = adInfo.car;

    const row = document.createElement('div');
    row.className = "row";
    row.innerHTML = `
        <p>
            Car: 
            <span>
                ${car.model.manufacturerName} 
                ${car.model.name}
                ${car.modification}
            </span>
        </p>
        <p>
            Odometer: <span>${car.odometerState}</span>
        </p>
        <p>
            Created: <span>${adInfo.creationDate.date}</span>
        </p>
        <hr>
    `;

    getContainerElement().insertBefore(row, getContainerElement().firstChild);
}

function getContainerElement(result) {
    return document.querySelector("#result");
}