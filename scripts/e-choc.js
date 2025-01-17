import { products } from "./data_e-choc.js";

let choosedProducts = [];
let totalSum = 0;

//Cette fonction affiche ou cache la description du produit au clic sur l'icône de son menu
function listenMenus() {
  const productsArray = Array.from(document.querySelectorAll(".product"));
  productsArray.forEach((product) => {
    const index = productsArray.indexOf(product) + 1;
    const menuProduct = document.querySelector(`.id${index} .fa-bars`);
    menuProduct.addEventListener("click", () => {
      const descriptionMenu = document.querySelector(
        `.id${index} .description`
      );
      const valueClassDescription = document
        .querySelector(`.id${index} .description`)
        .getAttribute("class");
      if (valueClassDescription === "description hide") {
        descriptionMenu.classList.remove("hide");
      } else {
        descriptionMenu.classList.add("hide");
      }
    });
  });
}

//Cette fonction ajoute au panier les produits choisis par l'utilisateur
function addChoosedProducts(choosedProducts) {
  const box = document.querySelector(".choosed-products");
  box.innerHTML = `<tr><th>Nom</th>
            <th>Prix (poids)</th>
            <th>Quantité</th>
          </tr>`;
  for (let i = 0; i < choosedProducts.length; i++) {
    const productHtml = `<tr><td>${choosedProducts[i].title}</td><td>${choosedProducts[i].price}</td><td><select id="${choosedProducts[i].id}"><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select></td></tr>`;
    document.querySelector(".choosed-products tbody").innerHTML += productHtml;
  }
}

//Cette fonction met à jour la montant total du panier
function checkTotal(choosedProduct, products, valueClassLabel) {
  const totalHtml = document.querySelector(".products-list p");
  const priceChoosedProduct = products[choosedProduct.id - 1].price;
  if (valueClassLabel === "no-active") {
    totalSum += priceChoosedProduct;
  } else {
    totalSum -= priceChoosedProduct;
  }
  totalSum = Number(totalSum.toFixed(2));
  totalHtml.innerHTML = `Total : ${totalSum} €`;
}

//Cette fonction change le style du bouton de panier en observant si au moins un produit est choisi ou pas
function checkCartStyle(choosedProducts) {
  const cartIcone = document.querySelector(".cart .fa-cart-shopping");
  const cartIconeFilled = document.querySelector(".cart .fa-reply-all");
  if (choosedProducts.length) {
    cartIcone.classList.add("filled");
    cartIconeFilled.classList.remove("hide");
  } else {
    cartIcone.classList.remove("filled");
    cartIconeFilled.classList.add("hide");
  }
}

//Cette fonction réagit au cochage de chaque produit
function listenCheck(choosedProducts) {
  const productsArray = Array.from(document.querySelectorAll(".product"));
  productsArray.forEach((product) => {
    const index = productsArray.indexOf(product) + 1;
    const checkProduct = document.querySelector(`.id${index} input`);
    checkProduct.addEventListener("click", () => {
      const label = document.querySelector(`.id${index} label`);
      const valueClassLabel = label.getAttribute("class");
      const choosedProduct = {
        id: index,
        title: document.querySelector(`.id${index} .title-product`).textContent,
        price: document.querySelector(`.id${index} .price-product`).textContent,
        quantity: "1",
      };
      if (valueClassLabel === "no-active") {
        label.setAttribute("class", "active");
        choosedProducts.push(choosedProduct);
      } else {
        label.setAttribute("class", "no-active");
        choosedProducts = choosedProducts.filter(
          (choosed) => choosed.id !== index
        );
      }
      addChoosedProducts(choosedProducts);
      checkTotal(choosedProduct, products, valueClassLabel);
      checkCartStyle(choosedProducts);
    });
  });
}

//Cette fonction réagit aux clics sur les produits
function listenProducts() {
  listenMenus();
  listenCheck(choosedProducts);
}

//Cette fonction ajoute les produits à la liste
function addProduct(index, products) {
  const containerProducts = document.querySelector(".container-products");
  const htmlProduct = `<article class="product id${products[index].id}">
          <div class="description hide">${products[index].description}</div>
          <img src="${products[index].img}" alt="image du produit" />
          <div class="info-product">
            <p class="price-product">${products[index].price}€ 
            (${products[index].quantity}g)</p>
            <i class="fa-solid fa-bars"></i>
            <label for="choose${index + 1}" class="no-active">
            <input type="checkbox" id="choose${index + 1}" />
            </label>
            <p class="title-product">${products[index].title}</p>
          </div>
        </article>`;
  containerProducts.innerHTML += htmlProduct;
}

//Cette fonction déclenche les fonctions en lien avec les produits
function initProducts(products) {
  for (let i = 0; i < products.length; i++) {
    addProduct(i, products);
  }
  listenProducts();
}

//Cette fonction permet le mouvement de la liste des produits
function moveSlider(direction) {
  const slider = document.querySelector(".container-products");
  const sliderLeftValue = slider.style.left;
  const sliderLeftValueNumber = parseInt(sliderLeftValue);
  switch (direction) {
    case "left":
      if (sliderLeftValueNumber !== 20) {
        slider.style.left = `${sliderLeftValueNumber + 40}%`;
      }
      break;
    case "right":
      const totalWidth = window.innerWidth;
      const sliderPosition = slider.getBoundingClientRect();
      const percentageSliderPosition =
        (sliderPosition.right / totalWidth) * 100;
      if (percentageSliderPosition > 60) {
        slider.style.left = `${sliderLeftValueNumber - 40}%`;
      }
  }
}

//Cette fonction bouge la liste des produits au clic sur une flèche
function listenArrows() {
  const arrows = document.querySelectorAll(".arrow");
  arrows.forEach((arrow) => {
    arrow.addEventListener("click", () => {
      const valueClass = arrow.className;
      if (valueClass === "arrow fa-solid fa-circle-arrow-left") {
        const direction = "left";
        moveSlider(direction);
      } else {
        const direction = "right";
        moveSlider(direction);
      }
    });
  });
}

//Cette fonction ferme le panier au clic à l'extérieur de celui-ci
function listenCloseList(productsListBox) {
  productsListBox.addEventListener("click", (event) => {
    //Cette condition vise à s'assurer que le panier se ferme uniquement quand l'utilisateur clique sur la div products-list-box elle-même, et pas au clic sur une balise enfant.
    if (event.target.classList.contains("products-list-box")) {
      productsListBox.classList.add("hide-display");
      productsListBox.classList.remove("display");
      document.querySelector(".error").innerHTML = "";
    }
  });
}

//Cette fonction modifie la somme totale en fonction des changements de quantité des produits
function listenQuantity(totalSum, products) {
  const allSelect = document.querySelectorAll(".choosed-products select");
  allSelect.forEach((select) => {
    let selectedQuantityBefore = select.value;
    select.addEventListener("change", (event) => {
      const selectedQuantity = event.target.value;
      const selectId = Number(select.id);
      const choosedProductPrice = products[selectId - 1].price;
      totalSum -= choosedProductPrice * selectedQuantityBefore;
      totalSum += choosedProductPrice * selectedQuantity;
      totalSum = totalSum.toFixed(2);
      document.querySelector(".total").innerHTML = `Total : ${totalSum} €`;
      selectedQuantityBefore = selectedQuantity;
    });
  });
}

//Cette fonction affiche un message d'erreur au clic sur le bouton pour commander le panier
function listenSubmit() {
  document
    .querySelector(".products-list button")
    .addEventListener("click", () => {
      document.querySelector(
        ".products-list .error"
      ).innerHTML = `Oups, il semblerait que notre service de paiement n'est pas opérationnel, veuillez réessayer ultérieurement, contactez nous pour plus d'informations.`;
    });
}

//Cette fonction permet de réagir au clic sur le bouton du panier
function listenCart() {
  const productsListBox = document.querySelector(".products-list-box");
  const cart = document.querySelector(".cart");
  cart.addEventListener("click", () => {
    productsListBox.classList.remove("hide-display");
    productsListBox.classList.add("display");
    listenCloseList(productsListBox);
    listenQuantity(totalSum, products);
    listenSubmit();
  });
}

//cette fonction déclenche le javascript de toute la page
function init() {
  initProducts(products);
  listenArrows();
  listenCart();
}

init();
