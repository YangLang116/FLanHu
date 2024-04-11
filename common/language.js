// noinspection JSUnresolvedVariable,JSUnresolvedFunction

////////////////////CACHE////////////////////
function getLanguageMap() {
    return {
        flutter: { name: 'Flutter(F)', shortName: 'F' },
        rn: { name: 'React Native(R)', shortName: 'R' },
        none: { name: 'None(N)', shortName: 'N' }
    }
}

async function getSelectLanguage() {
    const cacheEntry = await chrome.storage.local.get('language')
    return cacheEntry.language ?? 'flutter'
}

function saveLanguage(language) {
    chrome.storage.local.set({ language })
}

function addLanguageChangedListener(callback) {
    chrome.storage.onChanged.addListener((changes) => {
        callback(changes.language.newValue)
    });
}

////////////////////ACTION////////////////////

function updateActionStyle() {
    getSelectLanguage().then((selectLanguage) => {
        const badgeText = getLanguageMap()[selectLanguage].shortName
        chrome.action.setBadgeText({ text: badgeText });
    })
}
