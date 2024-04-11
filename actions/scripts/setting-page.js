window.onload = async function () {
    const languageMap = getLanguageMap()
    const selectLanguage = await getSelectLanguage()

    const fieldSetEl = document.querySelector('fieldset')
    for (let key in languageMap) {
        // <input name="language" value="flutter" id="flutter" type="radio"/>
        const inputEl = document.createElement('input')
        inputEl.name = 'language'
        inputEl.value = key
        inputEl.id = key
        inputEl.type = 'radio'
        inputEl.checked = (key === selectLanguage)
        inputEl.addEventListener('change', function (el) {
            if (!el.target.checked) return
            const language = el.target.value
            saveLanguage(language)
            updateActionStyle()
        })
        // <label for="flutter">Flutter</label>
        const label = document.createElement('label')
        label.for = key
        label.style.userSelect = 'none'
        label.textContent = languageMap[key].name

        const itemEl = document.createElement('div')
        itemEl.className = 'item'
        itemEl.appendChild(inputEl)
        itemEl.append(label)

        fieldSetEl.appendChild(itemEl)
    }
}

