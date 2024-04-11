function showFlutterCode(drawerElement, annotationInfo) {
    dropDownScrollArea(drawerElement, 'margin_for_flutter', 160)
    const codeElement = createCodeElement(drawerElement, 'flutter_code', 60, 90, 'Flutter 代码')
    updateCode(codeElement, _generateFlutterCode(annotationInfo))
}

function _generateFlutterCode(annotationInfo) {
    try {
        if (annotationInfo['切图']) {
            return _generateImageWidget(annotationInfo)
        } else if (annotationInfo['文本']) {
            return _generateTextWidget(annotationInfo['文本'])
        } else if (annotationInfo['缺省'] && annotationInfo['缺省']['内容']) {
            return _generateTextWidget(annotationInfo['缺省'])
        } else {
            return _generateContainerWidget(annotationInfo)
        }
    } catch (e) {
        console.log("生成代码失败：" + e)
        return '-'
    }
}

////////////////////Image Widget////////////////////

function _generateImageWidget(annotationInfo) {
    const sliceName = annotationInfo['切图']['名称']
    const sizeInfo = annotationInfo['样式信息']['大小']
    return `Image.asset(
              '${sliceName}',
              width: ${toNum(sizeInfo[0])},
              height: ${toNum(sizeInfo[1])},
              fit: BoxFit.cover,
            )`
}

////////////////////Text Widget////////////////////

function _getFlutterFontWeight(fontWeightStr) {
    fontWeightStr = fontWeightStr.toLowerCase()
    if (fontWeightStr.indexOf('light') !== -1) {
        return 'FontWeight.w300'
    } else if (fontWeightStr.indexOf('medium') !== -1) {
        return 'FontWeight.w500'
    } else if (fontWeightStr.indexOf('bold') !== -1) {
        return 'FontWeight.bold'
    } else {
        return 'FontWeight.normal'
    }
}

function _generateTextWidget(textAnnotation) {
    //必有项
    const content = textAnnotation['内容']
    const fontSize = toNum(textAnnotation['字号'])
    const textColor = _getFlutterColor(textAnnotation['色板'][0])
    //可有项
    const styleList = []
    if (textAnnotation['行高']) {
        const lineHeight = toNum(textAnnotation['行高'])
        styleList.push(`height: ${(lineHeight / fontSize).toFixed(1)},`)
    }
    if (textAnnotation['字重']) {
        const fontWeight = _getFlutterFontWeight(textAnnotation['字重'])
        styleList.push(`fontWeight: ${fontWeight},`)
    }
    return `Text(
             '${content}',
             style: TextStyle(
                color: ${textColor},
                fontSize: ${fontSize},
                ${styleList.filter(line => line != null).join('\n')}     
             ),
            )`
}

////////////////////Container Widget////////////////////
function _getFlutterBorderRadius(annotationInfo) {
    const radiusSizeList = getBorderRadius(annotationInfo)
    if (!radiusSizeList) return null
    if (radiusSizeList.length === 1) {
        return `borderRadius: BorderRadius.circular(${radiusSizeList[0]}),`
    }
    const radiusList = []
    const radiusItem = (prefix, value) => {
        if (value === 0) return null
        return `${prefix}: Radius.circular(${value}),`
    }
    radiusList.push(radiusItem('topLeft', radiusSizeList[0]))
    radiusList.push(radiusItem('topRight', radiusSizeList[1]))
    radiusList.push(radiusItem('bottomLeft', radiusSizeList[3]))
    radiusList.push(radiusItem('bottomRight', radiusSizeList[2]))
    return `borderRadius: BorderRadius.only(
              ${radiusList.filter(line => line !== null).join('\n')}
            ),`
}

function _getFlutterBackgroundColor(annotationInfo) {
    const colorList = getBackgroundColor(annotationInfo)
    if (!colorList) return null
    if (colorList.length === 1) {
        return `color: ${_getFlutterColor(colorList[0])},`
    } else {
        const colorListStr = colorList.map(_getFlutterColor).join(', ')
        return `gradient: LinearGradient(
                    colors: [${colorListStr}],
                ),`
    }
}

function _getFlutterBoxShadow(boxShadowAnnotation) {
    if (!boxShadowAnnotation) return null
    const color = _getFlutterColor(boxShadowAnnotation['色板'][0])
    const offset = boxShadowAnnotation['Offset']
    const offsetX = toNum(offset['X'])
    const offsetY = toNum(offset['Y'])
    const effect = boxShadowAnnotation['Effect']
    const blurRadius = toNum(effect['blur'])
    const spreadRadius = toNum(effect['spread'])
    return `boxShadow: [
              BoxShadow(
                color: ${color},
                offset: Offset(${offsetX}, ${offsetY}),
                blurRadius: ${blurRadius},
                spreadRadius: ${spreadRadius},
              )
            ],`
}

function _getFlutterBorderStyle(annotationInfo) {
    const borderStyle = getBorderStyle(annotationInfo)
    if (!borderStyle) return null
    const width = toNum(borderStyle.borderWidth)
    const color = _getFlutterColor(borderStyle.borderColor)
    return `border: Border.all(width: ${width}, color: ${color}),`
}

function _getFlutterDecoration(annotationInfo) {
    const decorationList = []
    decorationList.push(_getFlutterBorderRadius(annotationInfo))
    decorationList.push(_getFlutterBackgroundColor(annotationInfo))
    decorationList.push(_getFlutterBorderStyle(annotationInfo))
    decorationList.push(_getFlutterBoxShadow(annotationInfo['外阴影']))
    const decorationStr = decorationList.filter(line => line !== null).join('\n')
    if (decorationStr === '') return ''
    return `decoration: BoxDecoration(
               ${decorationStr}
            ),
            `
}

function _generateContainerWidget(annotationInfo) {
    const sizeInfo = annotationInfo['样式信息']['大小']
    const decoration = _getFlutterDecoration(annotationInfo)
    return `Container(
              width: ${toNum(sizeInfo[0])},
              height: ${toNum(sizeInfo[1])},
              ${decoration})`
}

////////////////////Common////////////////////
function _getFlutterColor(colorConfig) {
    if (!colorConfig) return 'Colors.black'
    const colorMode = colorConfig['模式']
    const colorValue = colorConfig['色值']
    //支持: HEX/AHEX/HEXA/RGBA
    if (colorMode === 'HEX') {
        const colorData = colorValue.split(' ')
        const rgb = colorData[0].substring(1)
        const alpha = Math.ceil(toNum(colorData[1]) / 100 * 255).toString(16).toUpperCase()
        return `Color(0x${alpha}${rgb})`
    } else if (colorMode === 'AHEX') {
        return `Color(0x${colorValue.substring(1)})`
    } else if (colorMode === 'HEXA') {
        const alpha = colorValue.substring(7)
        const rgb = colorValue.substring(1, 7)
        return `Color(0x${alpha}${rgb})`
    } else if (colorMode === 'RGBA') {
        const valueArray = colorValue.substring(5, colorValue.length - 1).split(',').map(Number)
        return `Color.fromARGB(${valueArray[3]}, ${valueArray[0]}, ${valueArray[1]}, ${valueArray[2]})`
    } else {
        return 'Colors.black'
    }
}
