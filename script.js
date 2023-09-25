import products from "./catalog.js";

// Array to store cart items
const cart = [];

// Function to add a product to the cart
// Function to update the total
function updateTotal() {
    const totalElement = document.getElementById("total");
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    totalElement.textContent = `$${total}`;
}

function addToCart(productName, price) {
    const item = { name: productName, price: price };
    cart.push(item);

    // Save the cart to localStorage
    saveCartToLocalStorage();

    // Update the cart display
    const cartList = document.getElementById("cart");
    const cartItem = document.createElement("li");
    cartItem.textContent = `${productName} - $${price}`;
    cartList.appendChild(cartItem);

    // Update the total
    updateTotal();
}

// Function to save the cart to localStorage
function saveCartToLocalStorage() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Function to load the cart from localStorage
function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
        cart.push(...JSON.parse(savedCart));
        updateTotal();
    }
}

// Function to handle the checkout button
function checkout() {
    alert("Thank you for your purchase!\n\nYou will now be redirected to WhatsApp to complete the purchase.");

    // Function to handle the checkout button
    if (cart.length === 0) {
        alert("Your cart is empty. Add products before checking out.");
        return;
    }

    // Create a summary of the products in the cart
    const cartSummary = cart.map(item => `${item.name} - $${item.price}`).join('\n');
    
    // Create a WhatsApp message with the cart summary
    const message = `Hello, I would like to purchase the following products:\n\n${cartSummary}\nTotal: $${cart.reduce((sum, item) => sum + item.price, 0)}`;

    // Encode the message for the WhatsApp link
    const encodedMessage = encodeURIComponent(message);

    // Define the WhatsApp URL with your desired phone number and the encoded message
    const whatsappURL = `https://api.whatsapp.com/send?phone=12345678&text=${encodedMessage}`;

    // Redirect the user to WhatsApp
    window.location.href = whatsappURL;

    cart.length = 0; // Clear the cart

    // Clear the cart display
    const cartList = document.getElementById("cart");
    while (cartList.firstChild) {
        cartList.removeChild(cartList.firstChild);
    }

    // Update the total
    updateTotal();

    // Clear localStorage
    localStorage.removeItem("cart");
}

// Function to display products by category
function showProducts(category) {
    const productList = document.getElementById("product-list");
    productList.innerHTML = ""; // Clear the product list
    
    const filteredProducts = category === 'all' ? products : products.filter(product => product.category === category);
    
    if (filteredProducts.length === 0) {
        productList.innerHTML = "<p>No products found in this category.</p>";
    } else {
        filteredProducts.forEach(product => {
            const productItem = document.createElement("div");
            productItem.className = "product";
            productItem.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="product_lower_section">
            <h2>${product.name}</h2>
            <p class="product_description">${product.description}.</p>
            <p>$${product.price}</p>
            <button onclick="addToCart('${product.name}', ${product.price})">Agregar al carrito</button>
            </div>
            `;
            productList.appendChild(productItem);
        });
    }
}



// Function to search for products
function searchProducts() {
    const searchInput = document.getElementById("search-input").value.toLowerCase();
    const productList = document.getElementById("product-list");
    productList.innerHTML = ""; // Clear the product list
    
    const searchResults = products.filter(product => product.name.toLowerCase().includes(searchInput));
    
    if (searchResults.length === 0) {
        productList.innerHTML = "<p>No products found.</p>";
    } else {
        searchResults.forEach(product => {
            const productItem = document.createElement("div");
            productItem.className = "product";
            productItem.innerHTML = `
            <img src="product.jpg" alt="${product.name}">
            <h2>${product.name}</h2>
            <p>Description of ${product.name}.</p>
            <p>Price: $${product.price}</p>
            <button onclick="addToCart('${product.name}', ${product.price})">Add to Cart</button>
            `;
            productList.appendChild(productItem);
        });
    }
}

// Initialize by showing all products and categories
showProducts('all');

// Load the cart from localStorage when the page loads
loadCartFromLocalStorage()