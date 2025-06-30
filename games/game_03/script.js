
let balance = 100000000000;
const shop = document.getElementById('shop');
const balanceDisplay = document.getElementById('balance');
const log = document.getElementById('purchase-log');

let items = [];

fetch('items.json')
  .then(res => res.json())
  .then(data => {
    items = data;
    renderShop(items);
  });

function renderShop(items) {
  items.forEach(item => {
    const div = document.createElement('div');
    div.classList.add('item');
    div.innerHTML = `
      <h3>${item.name}</h3>
      <p class="price">$${item.price.toLocaleString()}</p>
      <p>${item.tier} Tier</p>
    `;
    div.addEventListener('click', () => buyItem(item));
    shop.appendChild(div);
  });
}

function buyItem(item) {
  if (balance >= item.price) {
    balance -= item.price;
    balanceDisplay.textContent = `$${balance.toLocaleString()}`;
    const li = document.createElement('li');
    li.textContent = item.message;
    log.prepend(li);
  } else {
    alert("You can't afford that!");
  }
}
