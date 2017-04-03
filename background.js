const CACHE_KEY_FOR_LAST_DATE = 'notifier_last_date';

chrome.storage.sync.get({
    url: '',
    fetchInterval: 1,
}, settings => {
    if (settings.url) {
        chrome.alarms.create("checkCars", {
            when: Date.now() + 3000,
            periodInMinutes: settings.fetchInterval
        });

        chrome.alarms.onAlarm.addListener(alarm => {
            if (alarm.name !== "checkCars") {
                return;
            }
            fetchAds(settings.url).then(processAds);
        });

        chrome.notifications.onClicked.addListener(notificationId => {
            chrome.tabs.create({url: buildCarPageUrl(notificationId)});
        });
    }
});

function processAds(ads) {
    console.log('process', ads);

    const lastDate = window.localStorage.getItem(CACHE_KEY_FOR_LAST_DATE);
    for (let id in ads) {
        let ad = ads[id];

        let creationDate = getCreationDate(ad);

        if (lastDate && creationDate <= lastDate) {
            continue;
        }

        createNotificationForAd(ad);
        window.localStorage.setItem(CACHE_KEY_FOR_LAST_DATE, creationDate);
    }
}

function createNotificationForAd(ad) {
    const car = ad.car;
    const creationDate = new Date(ad.creationDate.date);

    const title = `New car: ${ad.title}, ${car.year}, ${car.odometerState}`;
    const description = `
        engine: ${car.engineCapacity},
        transmission: ${car.transmission === 1 ? 'automatic' : 'manual'},
        created: ${creationDate.toLocaleString()}
    `;

    console.log(title, description);

    chrome.notifications.create(ad.id.toString(), {
        type: 'basic',
        iconUrl: ad.photos[0].images['100x100'],
        title: title,
        message: description
    });
}

function fetchAds(url) {
    const params = (url.indexOf("#") === false) ? null : url.split('#')[1];

    return fetch("http://ab.onliner.by/search", {
        method: 'POST',
        headers: {
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        body: params
    })
        .then(r => r.json())
        .then(r => r.result.advertisements)
        .catch(console.log.bind(console))
        ;
}

function buildCarPageUrl(carId) {
    return `http://ab.onliner.by/car/${carId}`;
}

function getCreationDate(ad) {
    return Date.parse(ad.creationDate.date + ' ' + ad.creationDate.timezone);
}
