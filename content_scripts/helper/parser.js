function parseAnnotation(drawerElement) {
    try {
        const annoItemList = drawerElement.querySelectorAll('.annotation_item')
        if (!annoItemList || annoItemList.length === 0) return null;
        const annotationInfo = {}
        for (const item of annoItemList) {
            if (item.classList.contains('slice_item')) {
                const result = {}
                result['名称'] = getElementTextValue(item, '.copy_text')
                annotationInfo['切图'] = result
            } else {
                const title = getElementTextValue(item, '.subtitle')
                if (title === '代码') continue
                const itemMap = _parseAnnotationMap(item)
                if (!itemMap) continue
                annotationInfo[title ?? '缺省'] = itemMap
            }
        }
        console.log(JSON.stringify(annotationInfo, null, 2))
        return annotationInfo
    } catch (e) {
        console.log("解析文档失败：" + e)
        return null
    }
}

function _parseAnnotationMap(item) {
    const liList = item.querySelectorAll('li')
    if (!liList || liList.length === 0) return null
    const result = {}
    for (const li of liList) {
        const itemTitle = getElementTextValue(li, '.item_title')
        if (itemTitle) result[itemTitle] = _parseItemValue(li)
    }
    const colorList = _parseColorList(item)
    if (colorList) result['色板'] = colorList
    return result
}

function _parseColorList(element) {
    const colorRootElList = element.querySelectorAll('.color_list')
    if (!colorRootElList || colorRootElList.length === 0) return null
    const colorList = []
    for (const rootEl of colorRootElList) {
        const colorText = rootEl.querySelector('.color_item')
        const colorMode = rootEl.querySelector('.color_style')
        if (colorText && colorMode) {
            colorList.push({ '色值': filterContent(colorText.textContent), '模式': colorMode.textContent })
        }
    }
    return colorList
}

function _parseItemValue(element) {
    const childNum = element.childElementCount
    if (childNum === 2) {
        const valueElement = element.lastElementChild
        const itemTwoList = valueElement.querySelectorAll('.item_two')
        if (!itemTwoList || itemTwoList.length === 0) {
            return filterContent(valueElement.textContent)
        }
        const result = {}
        for (const item of itemTwoList) {
            const keyTitle = item.lastElementChild.textContent.trim()
            result[keyTitle] = item.firstElementChild.textContent.trim()
        }
        return result
    } else {
        const result = []
        const childrenList = element.children
        for (let i = 1; i < childNum; i++) {
            result.push(childrenList.item(i).textContent.trim())
        }
        return result
    }
}
