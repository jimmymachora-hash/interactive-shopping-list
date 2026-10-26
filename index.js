
const itemForm = document.getElementById("item-form");
const itemNameInput = document.getElementById("item-name");
const itemPriceInput = document.getElementById("item-price");
const shoppingList = document.getElementById("shopping-list");
const itemCount = document.getElementById("item-count");
const totalCost = document.getElementById("total-cost");
const emptyMessage = document.getElementById("empty-message");
const markPurchasedButton = document.getElementById("mark-purchased");
const clearListButton = document.getElementById("clear-list");

let shoppingItems = JSON.parse(localStorage.getItem("shoppingItems")) || [];

function saveItems() {
  localStorage.setItem("shoppingItems", JSON.stringify(shoppingItems));
}

function updateSummary() {
  itemCount.textContent = shoppingItems.length;

  const total = shoppingItems.reduce((sum, item) => {
    return sum + item.price;
  }, 0);

  totalCost.textContent = `KSh ${total.toFixed(2)}`;
  emptyMessage.hidden = shoppingItems.length > 0;
}

function renderItems() {
  shoppingList.innerHTML = "";

  shoppingItems.forEach((item) => {
    const li = document.createElement("li");
    li.className = "shopping-item";

    if (item.purchased) {
      li.classList.add("purchased");
    }

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = item.purchased;
    checkbox.setAttribute("aria-label", `Mark ${item.name} as purchased`);

    checkbox.addEventListener("change", () => {
      item.purchased = checkbox.checked;
      saveItems();
      renderItems();
    });

    const details = document.createElement("div");
    details.className = "item-details";

    const name = document.createElement("span");
    name.className = "item-name";
    name.textContent = item.name;

    const price = document.createElement("p");
    price.className = "item-price";
    price.textContent = `KSh ${item.price.toFixed(2)}`;

    details.append(name, price);

    const actions = document.createElement("div");
    actions.className = "item-actions";

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "edit-button";
    editButton.textContent = "Edit";

    editButton.addEventListener("click", () => {
      const newName = prompt("Enter the item name:", item.name);

      if (newName === null || !newName.trim()) {
        return;
      }

      const newPrice = prompt("Enter the price in KSh:", item.price);

      if (newPrice === null || newPrice.trim() === "") {
        return;
      }

      const parsedPrice = Number(newPrice);

      if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
        alert("Please enter a valid price of zero or more.");
        return;
      }

      item.name = newName.trim();
      item.price = parsedPrice;

      saveItems();
      renderItems();
    });

    const purchaseButton = document.createElement("button");
    purchaseButton.type = "button";
    purchaseButton.className = "purchase-button";
    purchaseButton.textContent = item.purchased ? "Unmark" : "Purchased";

    purchaseButton.addEventListener("click", () => {
      item.purchased = !item.purchased;
      saveItems();
      renderItems();
    });

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.textContent = "Remove";

    deleteButton.addEventListener("click", () => {
      shoppingItems = shoppingItems.filter((currentItem) => {
        return currentItem.id !== item.id;
      });

      saveItems();
      renderItems();
    });

    actions.append(editButton, purchaseButton, deleteButton);
    li.append(checkbox, details, actions);
    shoppingList.appendChild(li);
  });

  updateSummary();
}

itemForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = itemNameInput.value.trim();
  const price = Number(itemPriceInput.value);

  if (!name) {
    alert("Please enter an item name.");
    return;
  }

  if (itemPriceInput.value.trim() === "" ||
      !Number.isFinite(price) || price < 0) {
    alert("Please enter a valid price of zero or more.");
    return;
  }

  shoppingItems.push({
    id: `${Date.now()}-${Math.random()}`,
    name,
    price,
    purchased: false
  });

  saveItems();
  renderItems();

  itemForm.reset();
  itemNameInput.focus();
});

markPurchasedButton.addEventListener("click", () => {
  shoppingItems.forEach((item) => {
    item.purchased = true;
  });

  saveItems();
  renderItems();
});

clearListButton.addEventListener("click", () => {
  if (shoppingItems.length === 0) {
    return;
  }

  if (confirm("Are you sure you want to clear your shopping list?")) {
    shoppingItems = [];
    saveItems();
    renderItems();
  }
});

renderItems();
