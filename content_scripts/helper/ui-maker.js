function dropDownScrollArea(rootEl, className, marginTop) {
    const scrollArea = rootEl.querySelector('.lanhu_scrollbar')
    if (!scrollArea || scrollArea.classList.contains(className)) return
    scrollArea.classList.add(className)
    scrollArea.style.marginTop = `${marginTop}px`
    scrollArea.style.setProperty('height', `calc(90vh - 107px - ${marginTop}px)`, 'important')
}

function createCodeElement(rootEl, className, top, height, title) {
    let codeElement = rootEl.querySelector(`.${className}`)
    if (codeElement) return codeElement

    const containerElement = document.createElement('div')
    containerElement.style.position = 'absolute'
    containerElement.style.width = '100%'
    containerElement.style.top = `${top}px`

    const titleElement = document.createElement('div')
    titleElement.textContent = title
    titleElement.style.marginLeft = '24px'
    titleElement.style.color = '#2f2e3f'
    titleElement.style.fontSize = '14px'
    titleElement.style.lineHeight = '40px'
    titleElement.style.fontWeight = '500'
    containerElement.appendChild(titleElement)

    codeElement = document.createElement('pre')
    codeElement.classList.add(className)
    codeElement.style.width = 'calc(100% - 48px)'
    codeElement.style.height = `${height}px`
    codeElement.style.margin = '12px 24px 0 24px'
    codeElement.style.background = '#f7f9fc'
    codeElement.style.borderRadius = '4px'
    codeElement.style.padding = '8px'
    codeElement.style.overflowY = 'scroll'
    containerElement.appendChild(codeElement)

    rootEl.insertBefore(containerElement, rootEl.firstChild)
    const copyTipElement = rootEl.querySelector('.copy_success')
    const clipboard = new ClipboardJS(codeElement)
    clipboard.on('success', (e) => {
        e.clearSelection();
        setHeightLight(codeElement)
        copyTipElement.style.top = `${top + 10}px`
        copyTipElement.style.left = '120px'
        copyTipElement.style.display = 'block'
        setTimeout(() => copyTipElement.style.display = 'none', 1500)
    });
    return codeElement
}

function updateCode(codeElement, code) {
    codeElement.textContent = code
    codeElement.setAttribute('data-clipboard-text', code)
}

function getBorderStyle(annotationInfo) {
    let borderConfig = null;
    if ('中心边框' in annotationInfo) {
        borderConfig = annotationInfo['中心边框']
    } else if ('内边框' in annotationInfo) {
        borderConfig = annotationInfo['内边框']
    } else if ('外边框' in annotationInfo) {
        borderConfig = annotationInfo['外边框']
    }
    if (!borderConfig) return null
    return { borderWidth: borderConfig['粗细'], borderColor: borderConfig['色板'][0] }
}

function getBorderRadius(annotationInfo) {
    const borderRadiusInfo = annotationInfo['样式信息']['圆角']
    if (!borderRadiusInfo) return null
    const radiusSizeList = borderRadiusInfo.split(' ').map(toNum)
    const hasRadius = radiusSizeList.some(num => num !== 0)
    if (!hasRadius) return null
    if ((radiusSizeList.length === 1) || isAllEqual(radiusSizeList)) {
        return [radiusSizeList[0]]
    }
    return radiusSizeList
}

function getBackgroundColor(annotationInfo) {
    let colorList = null
    if (annotationInfo['颜色']) {
        colorList = annotationInfo['颜色']['色板']
    } else if (annotationInfo['缺省']) {
        colorList = annotationInfo['缺省']['色板']
    }
    if (!colorList || colorList.length <= 0) {
        return null
    }
    return colorList
}
