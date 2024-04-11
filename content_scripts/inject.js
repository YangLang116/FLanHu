//代码生成器
const codeGenerator = { flutter: showFlutterCode, rn: showRNCode }

async function listenAnnotationArea(drawerElement) {
    const scrollBar = drawerElement.querySelector('.annotation_container_b > .lanhu_scrollbar')
    if (!scrollBar) return
    this.drawerObserver.disconnect()
    if (!this.language) {
        this.language = await getSelectLanguage()
        console.log(`初始化语言：${this.language}`)
    }
    observeSubTreeChanged(scrollBar, () => {
        if (this.drawerTimer) return
        this.drawerTimer = setTimeout(() => {
            const annotationInfo = parseAnnotation(drawerElement)
            if (annotationInfo) {
                const showCodeFun = codeGenerator[this.language]
                if (showCodeFun) showCodeFun(drawerElement, annotationInfo)
            }
            this.drawerTimer = 0
        }, 500)
    })
}

function listenRightDrawer() {
    const drawerElement = document.querySelector('#detail_container > .info')
    if (!drawerElement) return
    this.drawerObserver = observeSubTreeChanged(drawerElement, async () => {
        await listenAnnotationArea(drawerElement)
    })
}

const titleElement = document.querySelector('head > title')
observeSubTreeChanged(titleElement, () => {
    const title = titleElement.textContent
    if (!title.startsWith('标注-')) return;
    const pageHash = window.location.hash
    if (pageHash.startsWith('#/item/project/detailDetach')) {
        console.log(`选择设计稿：${title}`)
        listenRightDrawer()
    }
})
addLanguageChangedListener((language) => {
    this.language = language
    console.log(`切换语言：${this.language}`)
    this.window.location.reload()
})
