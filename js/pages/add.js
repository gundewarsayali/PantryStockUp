import { apiAddItem } from "../api/apiAddItem.js";
function AddForm() {
  return `
       <h2>Add New Warehouse Item</h2>
       <hr/>

       <form id="add-item-form">
           <p>Item Name</p>
           <input type="text" id="item-name" placeholder="Enter item name" />
           
           <p>Category</p>
           <select id="item-category">
               <option value="" disabled selected>Select Category</option>
               <option value="Grains">Grains</option>
               <option value="Baverages">Baverages</option>
               <option value="Oils">Oils</option>
               <option value="Snacks">Snacks</option>
               <option value="Legumes">Legumes</option>
               <option value="Other">Other</option>              
           </select>

           <p>Quantity</p>
           <input type="number" placeholder="0" id="stock-quantity" />

           <p>Unit</p>
           <select id="item-unit">
               <option value="" disabled selected>Select Unit</option>
               <option value="kg">kg</option>
               <option value="ltr">ltr</option>
               <option value="packs">packs</option>             
           </select>
            
           <input type="datetime-local" id="item-expiration-date" />

           <button type="submit">Add Item</button>
       </form>

       <div id="result"></div>
    `;
}

async function handleSubmit(event) {
  event.preventDefault(); //stay on that page, don't reload

  const payload = {
    name: document.getElementById("item-name").value,
    category: document.getElementById("item-category").value,
    quantity: document.getElementById("stock-quantity").value,
    unit: document.getElementById("item-unit").value,
    expiration: document.getElementById("item-expiration-date").value,
    action: "View",
  };

  const result = document.getElementById("result");
  const form = document.getElementById("add-item-form");

  const { error, data } = await apiAddItem(payload);

  if (!error) {
    result.innerText = "Item added successfully.";
    result.style.color = "green";
    form.reset();
  } else {
    result.innerText = "Error adding item data.";
    result.style.color = "red";
  }
}

export default function render() {
  document.getElementById("app").innerHTML = AddForm();

  const form = document.getElementById("add-item-form");

  form.addEventListener("submit", handleSubmit);
}
