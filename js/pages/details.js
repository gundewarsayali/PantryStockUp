import { apiGetItemDetails } from "../api/apiGetItemDetails.js";
import { apiDeleteItem } from "../api/apiDeleteItem.js";
import { apiUpdateItem } from "../api/apiUpdateItem.js";

function getHash() {
  const hash = window.location.hash.replace("#", "");
  return Number(hash);
}

function ErrorBanner(error) {
  return `<hgroup>
                <h2>Error Occured</h2>
                <p>${error.message}</p>
              </hgroup>`;
}

const lowStockThreshold = 5;

function lowStockAnalysis(quantity) {
  if (quantity == 0) {
    return "out-of-stock";
  }
  if (quantity < lowStockThreshold) {
    return "low-stock";
  }
}

function ItemDetails(item) {
  return `<article>
                <header><h2>${item.name}</h2></header>
                <p>Category: ${item.category}</p> 
                <p>Quantity: <span class=${lowStockAnalysis(
                  item.quantity
                )}  id="quantity-value">${item.quantity} ${item.unit}</span></p>
                <p>Expiration: ${item.expiration}</p>             
                
                <footer>
                <button id="restock-item">Restock</button>
                   <button id="remove-item" class="secondary outline">Remove</button>
                </footer>
      </article>`;
}

function ItemDeleteSuccess() {
  return `<hgroup>
                <h2>Item Deleted</h2>
                <p>The item has been successfully deleted.</p>
                <a href="/">Back to Home</a>
      </hgroup>`;
}

async function deleteItem() {
  const id = getHash();
  const { error } = await apiDeleteItem(id);
  if (error) {
    document.getElementById("app").innerHTML = ErrorBanner(error);
    return;
  }

  document.getElementById("app").innerHTML = ItemDeleteSuccess();
}

async function restockItem() {
  const app = document.getElementById("app");
  const id = getHash();
  const { error, data } = await apiGetItemDetails(id);
  if (error) {
    app.innerHTML = ErrorBanner(error);
    return;
  }

  const newQuantity = data.quantity + 1;
  const { error: updateError, data: updateItem } = await apiUpdateItem(id, {
    quantity: newQuantity,
  });

  if (updateError) {
    app.innerHTML = ErrorBanner(updateError);
    return;
  }

  const quantityElement = document.getElementById("quantity-value");
  quantityElement.innerText = `${updateItem.quantity}`;

  if (quantityElement.textContent !== 0 && quantityElement.textContent < 5) {
    quantityElement.style.color = "yellow";
  }
  if (quantityElement.textContent > 4) {
    quantityElement.style.color = "black";
  }
}

function attachButtonHandlers() {
  const removeBtnElement = document.getElementById("remove-item");
  const restockBtnElement = document.getElementById("restock-item");

  removeBtnElement.addEventListener("click", deleteItem);
  restockBtnElement.addEventListener("click", restockItem);
}

export default async function render() {
  const id = getHash();
  const { error, data } = await apiGetItemDetails(id);

  if (error) {
    document.getElementById("app").innerHTML = ErrorBanner(error);
    return;
  }

  document.getElementById("app").innerHTML = ItemDetails(data);

  attachButtonHandlers();
}
