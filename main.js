const url = 'https://it-academy-js-api-zmicerboksha.vercel.app/api/course/books'
const tbody = document.querySelector('tbody')
const pages = document.querySelector('ul.pagination.pagination-lg')
const numberOfPages = document.querySelector('#pagesSelect')
const inputSearch = document.querySelector('input.form-control.rounded.input-search')
const buttonSearch = document.querySelector('button.btn.btn-outline-primary.search')
let orderBy = document.querySelector('#orderBy')
let upOrDown = document.querySelector('#upOrDown')
let page
let numberOfVisibleBooks
let sortingBy
let order = ['asc', 'desc']
let direction
let searchWord
function createTable(size = 20) {
    document.querySelectorAll('.page-item').forEach(el => el.remove())
    document.querySelectorAll('.newRow').forEach(el => el.remove())
    function setSearchParams(prmName, val) {
        let newUrl = new URL(window.location)  // == window.location.href
        newUrl.searchParams.set(prmName, val)
        history.pushState(null, null, newUrl)
    }
    let addToUrl = ''
    let params = new URLSearchParams(document.location.search)
    let getSize = params.get("size")
    let getPage = params.get("page")
    let getSearchWord = params.get("search")
    let newOrder = params.get("orderBy")
    if (numberOfVisibleBooks) {
        setSearchParams('size', numberOfVisibleBooks)
        addToUrl += `size=${numberOfVisibleBooks}`
    } else if (getSize) {
        addToUrl += `size=${getSize}`
        numberOfPages.value = getSize
    } else if (size) {
        setSearchParams('size', size)
    }
    if (page) {
        setSearchParams('page', page)
        addToUrl += `&page=${page}`
    } else if (getPage) {
        addToUrl += `&page=${getPage}`
    } else {
        setSearchParams('page', 0)
    }
    if (searchWord === '') {
        let changedUrl = new URL(window.location)  // == window.location.href
        changedUrl.searchParams.delete('search')
        history.pushState(null, null, changedUrl)
    } else {
        if (searchWord) {
            setSearchParams('search', searchWord)
            addToUrl += `&search=${searchWord}`
        } else if (getSearchWord) {
            addToUrl += `&search=${getSearchWord}`
            inputSearch.value = getSearchWord
        }
    }
    if (sortingBy) {
        let sortInfo = `${sortingBy},${order[0]}`
        setSearchParams('orderBy', sortInfo.replace('%2C', ','))
        addToUrl += `&orderBy=${sortingBy},${order[0]}`
    } else if (newOrder) {
        addToUrl += `&orderBy=${newOrder}`
    }
    console.log(searchWord)
    console.log(`${url}?${addToUrl}`)
    fetch(`${url}?${addToUrl}`)
        .then(res => res.json())
        .then(res => {
            console.log(res)
            res.content.forEach(book => {
                let newRow = document.createElement('tr')
                newRow.classList.add('newRow')
                function createField(field) {
                    let cell = document.createElement('td')
                    if (field) {
                        cell.textContent = book[field]
                    } else { cell.textContent = '-' }
                    newRow.append(cell)
                }
                createField('id')
                createField('title')
                createField('author')
                createField('year')
                createField('price')
                createField()
                tbody.append(newRow)
            })
            for (let i = 1; i < (res.totalPages + 1); i++) {
                let newPage = document.createElement('li')
                newPage.classList.add('page-item')
                let newPageLink = document.createElement('a')
                newPageLink.href = '#'
                newPageLink.classList.add('page-link')
                newPageLink.textContent = i
                newPageLink.addEventListener('click', function () {
                    page = i - 1
                    createTable(numberOfVisibleBooks)
                })
                newPage.append(newPageLink)
                pages.append(newPage)
            }
        })
}
//очень важный пример!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! почитать про колбэки!
// const firstFunction = createTable(numberOfPages.value)
// const secondFunction = () => createTable(numberOfPages.value)
// numberOfPages.addEventListener('change', firstFunction)
// numberOfPages.addEventListener('change', secondFunction)

createTable()
numberOfPages.addEventListener('change', () => {
    page = 0
    numberOfVisibleBooks = numberOfPages.value
    createTable(numberOfVisibleBooks)
})
document.querySelectorAll('th.sortable').forEach(field => {
    field.addEventListener('click', e => {
        sortingBy = e.target.dataset.field
        order.reverse()
        createTable(numberOfVisibleBooks)
    })
})
buttonSearch.addEventListener('click', (e) => {
    e.preventDefault()
    searchWord = inputSearch.value
    createTable(numberOfVisibleBooks)
})


