// noinspection JSUnresolvedVariable,JSUnresolvedFunction

importScripts('../common/language.js');

chrome.runtime.onInstalled.addListener(() => {
    updateActionStyle()
});

chrome.runtime.onStartup.addListener(() => {
    updateActionStyle()
});
