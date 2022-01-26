
const apiURL = "data-vegan.json"
// Changed the datasource to a local veganised version json file for my portfolio to normalise plant-based alternatives.
// const apiURL = "https://api.npoint.io/5f458ccb947908d10993" 

const formatter = new Intl.NumberFormat('en-EU', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2
})

async function getData() {
    try {
        const response = await fetch(apiURL, { method: 'GET' })
        const parsed = await response.json()
        addNavLinks(parsed)
        addMenuSections(parsed)
    } catch (error) {
        console.log("Connection Error", error)
    }
}

getData()

function addNavLinks(data) {
    let navitems = document.getElementById("navitems")
    for (let i = 0; i < data.MenuSections.length; i++) {
        let el = document.createElement("li")
        el.innerHTML = `<a href="#${data.MenuSections[i].Name}">${data.MenuSections[i].Name}</a>`
        navitems.appendChild(el)
    }
}

function addMenuSections(data) {
    let menu = document.getElementById("menu")
    for (let i = 0; i < data.MenuSections.length; i++) {

        let section = document.createElement("div")
        section.classList.add("menu--section")
        section.id = data.MenuSections[i].Name
        menu.appendChild(section)

        let heading = document.createElement("h2")
        heading.innerText = data.MenuSections[i].Name
        section.appendChild(heading)

        for (let y = 0; y < data.MenuSections[i].MenuItems.length; y++) {

            let menuItem = document.createElement("div")
            menuItem.dataset.itemName = data.MenuSections[i].MenuItems[y].Name
            menuItem.dataset.itemPrice = data.MenuSections[i].MenuItems[y].Price
            menuItem.classList.add("menu-item")
            menuItem.addEventListener('click', (event) => {
                showModal(event)
            })
            section.appendChild(menuItem)

            let itemName = document.createElement("p")
            itemName.innerHTML = data.MenuSections[i].MenuItems[y].Name
            menuItem.appendChild(itemName)

            let itemPrice = document.createElement("p")
            itemPrice.innerHTML = formatter.format(data.MenuSections[i].MenuItems[y].Price)
            menuItem.appendChild(itemPrice)

            if (data.MenuSections[i].MenuItems[y].SoldOut) {
                menuItem.classList.add("soldout")
            }

        }
    }
}

const modal = document.getElementById('modal')
const closeButton = document.getElementById('btn-close')
const addToOrderButton = document.getElementById('btn-addtoorder')
let quantity = document.getElementById('quantity')
const quantityMinus = document.getElementById('btn-quanity-minus')
const quantityPlus = document.getElementById('btn-quanity-plus')
const burger = document.getElementById('burger')
const mobileNav = document.getElementById('navitems')

//onclick - Hide the modal user clicks close button
closeButton.addEventListener('click', () => {
    modal.classList.toggle('show')
    quantity.value = 1 // This is just for aesthics for now, the onsubmit button would have a reset function
})

//onclick - Hide the modal user clicks outside of the modal content
modal.addEventListener('click', (event) => {
    if (event.target.id === "modal") {
        modal.classList.toggle('show')
    }
})

//onclick - Hide the modal user clicks close button
addToOrderButton.addEventListener('click', (event) => {
    event.preventDefault()
    modal.classList.toggle('show')
    quantity.value = 1 // This is just for aesthics for now, the onsubmit button would have a reset function
})

//onclick - Reduce the value of the order quantity
quantityMinus.addEventListener('click', (event) => {
    event.preventDefault()
    if (quantity.value == 1) {
        return
    }

    else {
        quantity.value -= 1
    }
})

//onclick - Increase the value of the order quantity
quantityPlus.addEventListener('click', (event) => {
    event.preventDefault()
    let value = parseInt(quantity.value)
    value++
    quantity.value = value
})

//onclick - Prevents the value of the input number to be less than 1
quantity.addEventListener('change', (event) => {
    if (quantity.value < 1) {
        quantity.value = 1
    }
})


function showModal(event) {
    modal.classList.toggle('show')
    let getItemName = event.target.getAttribute("data-item-name");
    let getItemPrice = event.target.getAttribute("data-item-price");
    let modaltitle = document.getElementById("addcart-item-name")
    let modalprice = document.getElementById("addcart-item-price")
    modaltitle.innerText = getItemName
    modalprice.innerText = formatter.format(getItemPrice)
}

//onclick - toglle the mobile nav menu
burger.addEventListener('click', () => {
    mobileNav.classList.toggle('mobile-nav-visible')
    burger.classList.toggle('close-symbol')
})