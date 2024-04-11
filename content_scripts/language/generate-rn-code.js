// noinspection JSUnresolvedVariable, JSUnresolvedFunction

function showRNCode(drawerElement, annotationInfo) {
    dropDownScrollArea(drawerElement, 'margin_for_rn', 220)
    const { code, style } = _generateRNCode(annotationInfo)
    updateCode(createCodeElement(drawerElement, 'rn_code', 60, 40, 'RN 元素'), code)
    updateCode(createCodeElement(drawerElement, 'rn_style', 160, 60, 'RN 样式'), style)
}

function _generateRNCode(annotationInfo) {
    try {
        if (annotationInfo['切图']) {
            return _generateImageComponent(annotationInfo)
        } else if (annotationInfo['文本']) {
            return _generateTextComponent(annotationInfo['文本'])
        } else if (annotationInfo['缺省'] && annotationInfo['缺省']['内容']) {
            return _generateTextComponent(annotationInfo['缺省'])
        } else {
            return _generateContainerComponent(annotationInfo)
        }
    } catch (e) {
        console.log("生成代码失败：" + e)
        return { code: '-', style: '-' }
    }
}

////////////////////Image Component////////////////////
function _generateImageComponent(annotationInfo) {
    const sliceName = annotationInfo['切图']['名称']
    const sizeInfo = annotationInfo['样式信息']['大小']
    return {
        code: `<Image source={require('./${sliceName}')} style={styles.image}/>`,
        style: `image: {
                    width: ${toNum(sizeInfo[0])},
                    height: ${toNum(sizeInfo[1])},
                    resizeMode: 'cover',
              }`
    }
}

////////////////////Text Component////////////////////
function _getRNFontWeight(fontWeightStr) {
    fontWeightStr = fontWeightStr.toLowerCase()
    if (fontWeightStr.indexOf('light') !== -1) {
        return `'300'`
    } else if (fontWeightStr.indexOf('medium') !== -1) {
        return `'500'`
    } else if (fontWeightStr.indexOf('bold') !== -1) {
        return `'bold'`
    } else {
        return `'normal'`
    }
}

function _generateTextComponent(textAnnotation) {
    const content = textAnnotation['内容']
    const fontSize = toNum(textAnnotation['字号'])
    const textColor = _getRNColor(textAnnotation['色板'][0])
    const fontWeight = _getRNFontWeight(textAnnotation['字重'])
    return {
        code: `<Text style={styles.text}>${content}</Text>`,
        style: `text: {
                    color: ${textColor},
                    fontSize: ${fontSize},
                    fontWeight: ${fontWeight},
                }`
    }
}

////////////////////Div Component////////////////////
function _getRNBorderStyle(annotationInfo) {
    const borderStyle = getBorderStyle(annotationInfo)
    if (!borderStyle) return null
    const width = toNum(borderStyle.borderWidth)
    const color = _getRNColor(borderStyle.borderColor)
    return `borderWidth: ${width}, 
            borderColor: ${color},`
}

function _getRNBorderRadius(annotationInfo) {
    const radiusSizeList = getBorderRadius(annotationInfo)
    if (!radiusSizeList) return null
    if (radiusSizeList.length === 1) {
        return `borderRadius: ${radiusSizeList[0]},`
    }
    const radiusList = []
    const radiusItem = (prefix, value) => {
        if (value === 0) return null
        return `${prefix}: ${value}`
    }
    radiusList.push(radiusItem('borderTopLeftRadius', radiusSizeList[0]))
    radiusList.push(radiusItem('borderTopRightRadius', radiusSizeList[1]))
    radiusList.push(radiusItem('borderBottomLeftRadius', radiusSizeList[3]))
    radiusList.push(radiusItem('borderBottomRightRadius', radiusSizeList[2]))
    return radiusList.filter(line => line !== null).join('\n')
}

function _generateContainerComponent(annotationInfo) {
    const styleList = []
    let code = '<View style={styles.container}></View>'
    //处理背景
    const colorList = getBackgroundColor(annotationInfo)
    if (colorList) {
        if (colorList.length === 1) {
            styleList.push(`backgroundColor: ${_getRNColor(colorList[0])},`)
        } else {
            const colorListStr = colorList.map(_getRNColor).join(', ')
            code = `<LinearGradient style={styles.container} colors={[${colorListStr}]} />`
        }
    }
    styleList.push(_getRNBorderStyle(annotationInfo))
    styleList.push(_getRNBorderRadius(annotationInfo))
    return {
        code,
        style: `container: {
                    ${styleList.filter(line => line !== null).join('\n')}
                },`
    }
}

////////////////////Common////////////////////
function _getRNColor(colorConfig) {
    if (!colorConfig) return `'white'`
    const colorMode = colorConfig['模式']
    const colorValue = colorConfig['色值']
    //支持: HEX/AHEX/HEXA/RGBA
    if (colorMode === 'HEX') {
        const colorData = colorValue.split(' ')
        const rgb = colorData[0].substring(1)
        const alpha = Math.ceil(toNum(colorData[1]) / 100 * 255).toString(16).toUpperCase()
        return `'#${rgb}${alpha}'`
    } else if (colorMode === 'AHEX') {
        const alpha = colorValue.substring(1, 3)
        const rgb = colorValue.substring(3)
        return `'#${rgb}${alpha}'`
    } else if (colorMode === 'HEXA' || colorMode === 'RGBA') {
        return `'${colorValue}'`
    } else {
        return `'black'`
    }
}
