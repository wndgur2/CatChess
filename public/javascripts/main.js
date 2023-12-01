let mouse=10;
let cats = [];

window.onload = function() {
    init();
    refreshShop();
}

function init(){
    let mouseEl = document.getElementById("mouse");
    mouseEl.innerHTML = mouse;
}

function updateMouse(){
    let mouseEl = document.getElementById("mouse");
    mouseEl.innerHTML = mouse;
}

function refreshShop(){
    let newCats = [];
    for(let i = 0; i < 5; i++){
        newCats.push(getRandomCat());
    }
    let shoppingList = document.getElementById("shoppingList");
    shoppingList.innerHTML = "";
    newCats.forEach(function(cat){
        let newUnit = document.createElement("button");
        newUnit.classList.add("saleUnit");
        newUnit.innerHTML = `<span>${cat}</span>`;
        shoppingList.appendChild(newUnit);
    });
    mouse -= 2;
    updateMouse();
}

function getRandomCat(){
    return Math.floor(Math.random() * 20);
}