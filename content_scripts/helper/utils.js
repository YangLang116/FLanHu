////////////////////COMMON////////////////////
function isAllEqual(array) {
    if (array.length > 0) {
        return !array.some(value => value !== array[0]);
    } else {
        return true;
    }
}

////////////////////Regex////////////////////
function toNum(content) {
    const num = Number(content.match(/\d+(.\d+)?/g))
    if (Number.isInteger(num)) {
        return num
    } else {
        return num.toFixed(1)
    }
}

function filterContent(content) {
    return content.replaceAll(/[\n\r\t\v]/g, '').trim().replaceAll(/\s+/g, ' ')
}

////////////////////Element////////////////////
function getElementTextValue(element, selector) {
    const titleElement = element.querySelector(selector)
    if (!titleElement) return null
    return titleElement.firstChild.textContent.trim()
}

function setHeightLight(element) {
    const range = document.createRange();
    range.selectNodeContents(element);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range)
}

function observeSubTreeChanged(element, callback) {
    const observer = new MutationObserver(callback)
    observer.observe(element, { childList: true, subtree: true })
    return observer
}
