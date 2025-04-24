
const cartProducts = document.getElementById("products");
const cartEl = document.getElementById("cart");
const cartItemsEl = document.getElementById("cart-items");
const confirmItemsEl = document.getElementById("confirm-items");
const totalEl = document.getElementById("total-price");
const totalConfirmEl = document.getElementById("confirm-total-price");
const totalItemsInCartEl = document.getElementById("total-items-in-cart");
const carbonNeutralEl = document.querySelector(".carbon-neutral");
const confirmButton = document.getElementById("confirm");
const clearCartButton = document.getElementById("clear-cart");
const modal = document.getElementById("modal");
const closeModal = document.querySelector(".close-button");

/* variables */
// products data
let productsArray = [];
//let cart = []; instead of setting an empty array load the saved array in Local Storage
let cart = JSON.parse(localStorage.getItem("CART")) || []; // if local storage is empty set an empty array

/* functions */
// get products
const getProducts = async () => {
  const response = await fetch("./data.json");
  const data = await response.json();
  // adding an id to the product objects in the array by Destructuring the data array
  productsArray = data.map((element, index) => ({
    ...element,
    id: index
  }));
  //console.log(productsArray);


};

// display products
const displayProducts = () => {
  let productsHTML = "";
  productsArray.forEach((product, index) => {
    productsHTML += `
        <div class="product-card" id="product_${product.id}">
          <picture>
            <source media="(min-width:1024px)" srcset="${product.image.desktop}">
            <source media="(min-width:768px)" srcset="${product.image.tablet}">
            <img src="${product.image.mobile}" alt="${product.name}">
          </picture>
          <div class='buttons'>
            <button data-product-id="${product.id}" class="btn-to-cart">Add to cart</button>
            <div class='add'>
                <button class="remove-from-cart" onclick="changeNumerOfUnits('minus', ${product.id})"><span class="sr-only">min</span></button>
                <span class="num">num</span>
                <button class="add-to-cart" onclick="changeNumerOfUnits('plus', ${product.id})"><span class="sr-only">plus</span></button>
            </div>
          </div>
          <div class="info">
            <span class='category'>${product.category}</span>
            <h2>${product.name}</h2>
            <span class='price'>$${product.price.toFixed(2)}</span>
          </div>
        </div>
    `;
  });

  cartProducts.innerHTML = productsHTML;
};

// add to cart 
function addToCart(AddToCartButton) {
  const productId = parseInt(AddToCartButton.dataset.productId);
  //console.log('productId'+productId);
  //console.log(productsArray);
  
  //check if product already exist in array cart
  if(cart.some((item)=> item.id === productId)) {

      alert("Product already in the cart");
      //changeNumerOfUnits("plus", id);
  } else {
      const item = productsArray.find((product) => product.id === productId); 
      //console.log(item);
      cart.push({
          ...item,    // Destructuring the item object to add a new property (numberOfUnits) 
          numberOfUnits : 1
      });
      document.getElementById(`product_${productId}`).classList.add("selected");
      document.querySelector(`#product_${productId} .num`).innerText = 1;
  }
  console.log(cart);
  updateCart();
};
// update cart
function updateCart() {
  renderCartItems();
  renderTotalPrice();

  // save cart to Local Storage
  localStorage.setItem("CART", JSON.stringify(cart));
}

function showConfirmationBox() {
  renderConfirmItems();
  renderTotalPrice(true);
  modal.showModal();
}

// render cart items
function renderCartItems() {
  cartItemsEl.innerHTML = ""; // first clear de cartItemsEl
  if (cart.length === 0) {
    // console.log("Array is empty!");
    cartItemsEl.innerHTML = `<img src="./assets/images/illustration-empty-cart.svg" alt="">`;
  } else {
    cart.forEach((item) => {
      let subtotal = parseFloat(item.numberOfUnits * item.price).toFixed(2);
      document.getElementById(`product_${item.id}`).classList.add("selected"); // set a selected class for products that are already in the cart
      document.querySelector(`#product_${item.id} .num`).innerText = item.numberOfUnits; // if product exist in cart set number of items to display
      cartItemsEl.innerHTML += `
          <div class="cart-item">
            <div class="item-info">
                <h4>${item.name}</h4>
                <div class="unit">
                  <span class="number">${item.numberOfUnits}x</span>
                  <span class="price">@<small>$</small>${item.price.toFixed(2)}</span>
                  <span class="subtotal"><small>$</small>${subtotal}</span>
                </div>
            </div>
            <button class="item-remove" onclick="removeItemFromCart(${item.id})">
              <img src="./assets/images/icon-remove-item.svg" alt="remove item">
              <span class="sr-only">remove item</span>
            </button>
          </div>        
      `
    });
  }

};
// render confirm items
function renderConfirmItems() {
  confirmItemsEl.innerHTML = ""; // first clear de cartItemsEl
  if (cart.length === 0) {
    // console.log("Array is empty!");
    cartItemsEl.innerHTML = `<img src="./assets/images/illustration-empty-cart.svg" alt="">`;
  } else {
    cart.forEach((item) => {
      let subtotal = parseFloat(item.numberOfUnits * item.price).toFixed(2);
      confirmItemsEl.innerHTML += `
          <div class="confirm-item">
            <img class="thumb" src="${item.image.thumbnail}" alt="${item.name}">
            <div class="item-info">
                <h4>${item.name}</h4>
                <div class="unit">
                  <span class="number">${item.numberOfUnits}x</span>
                  <span class="price">@<small>$</small>${item.price.toFixed(2)}</span>                  
                </div>
            </div>
            <span class="subtotal"><small>$</small>${subtotal}</span>
          </div>        
      `
    });
  }

};

// remove item from cart
function removeItemFromCart(id) {
  cart = cart.filter((item) => item.id !== id); //filter out the chosen id from the cart array 
  document.getElementById(`product_${id}`).classList.remove("selected");
  updateCart();
}


// change changeNumerOfUnits of an item
function changeNumerOfUnits(action, id) {
  // make an updated array cart - with the map function - the map function has a callback function that is executed for every element in the array and is returned making a change to the array of objects
  cart = cart.map((item) => {
      let numberOfUnits = item.numberOfUnits;
      console.log("numberOfUnits"+numberOfUnits);
      if(item.id === id) { // check for the same id
          if(action === "minus" && numberOfUnits > 1) {
              numberOfUnits--;
          } else if(action === "plus") {
              numberOfUnits++;
              
          }
          document.querySelector(`#product_${id} .num`).innerText = numberOfUnits;
      }
      return {
          ...item,
          //numberOfUnits: numberOfUnits, // because the property name is the same as the variable name you can write it shorter
          numberOfUnits,
      };
  });
  updateCart();
}

// calculate and render subtotal
function renderTotalPrice(confirm = false) {
  let totalPrice = 0, totalItems = 0;
  if (cart.length === 0) {
    totalEl.innerHTML = `Your added items will appear here.`;
    document.querySelector(".carbon-neutral").classList.add("hide");
    document.querySelector(".confirm-order").classList.add("hide");
  } else {
    cart.forEach((item) => {
      totalPrice += item.price * item.numberOfUnits;
      totalItems += item.numberOfUnits;
    });
    // totalEl.innerHTML = `Order Total (${totalItems} items): $ ${totalPrice.toFixed(2)}`;
    if (confirm) {
      totalConfirmEl.innerHTML = `<span>Order Total</span><span class="total">$${totalPrice.toFixed(2)}</span>`;
    } else {
      totalEl.innerHTML = `<span>Order Total</span><span class="total">$${totalPrice.toFixed(2)}</span>`;
      document.querySelector(".carbon-neutral").classList.remove("hide");
      document.querySelector(".confirm-order").classList.remove("hide");
    }

    
  }
  totalItemsInCartEl.innerText = `${totalItems}`; // put it out of the loop so it will be 0 (no items) or a number of items if cart has items.

}

function clearCart() {
  cart = [];
  updateCart();
  // remove selected class and change the number to default text
  document.querySelectorAll('.product-card').forEach((product) => {
    if(product.classList.contains("selected")) product.classList.remove("selected"); 
    product.querySelector(".num").innerText = "num";
  });
  
  
}
// add event listeners to elements
const addEvents = () => {

  // all add to cart buttons
  const allAddToCartButtons = document.querySelectorAll(".btn-to-cart");
  // add an event for each increment button
  allAddToCartButtons.forEach((AddToCartButton) => {
    AddToCartButton.addEventListener("click", () => {
      console.log(AddToCartButton);
      addToCart(AddToCartButton);
    });
  });  

  confirmButton.addEventListener("click", function() {
    showConfirmationBox();
  });

  clearCartButton.addEventListener("click", function() {
    clearCart();
  });
  closeModal.addEventListener("click", () => {
    modal.close();
  });

};


// after fetching data
getProducts().then(() => {
  displayProducts();
  updateCart();
  addEvents();
});



