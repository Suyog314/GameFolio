
// game_02/script.js
let balance = 1000000000000; // $1 trillion

function formatMoney(num) {
  return "$" + num.toLocaleString();
}

function updateBalanceDisplay() {
  document.getElementById("balance").textContent = formatMoney(balance);
}

function buyItem(price, card, qtySpan) {
  if (balance >= price) {
    balance -= price;
    updateBalanceDisplay();

    // Update quantity bought
    let bought = parseInt(qtySpan.textContent);
    qtySpan.textContent = bought + 1;

    if (balance <= 0) {
      alert("🎉 You did it! You spent it all!");
    }
  } else {
    alert("😢 Not enough money!");
  }
}

function createCard(item) {
  const card = document.createElement("div");
  card.className = "card";

  const title = document.createElement("h3");
  title.textContent = `${item.emoji} ${item.name}`;

  const price = document.createElement("p");
  price.textContent = `Price: ${formatMoney(item.price)}`;

  const qty = document.createElement("p");
  qty.innerHTML = `Bought: <span>0</span>`;

  const buyBtn = document.createElement("button");
  buyBtn.textContent = "Buy";
  buyBtn.onclick = () => buyItem(item.price, card, qty.querySelector("span"));

  card.append(title, price, qty, buyBtn);

  return card;
}

function renderStore() {
  const store = document.getElementById("store");
  items.forEach(item => {
    const card = createCard(item);
    store.appendChild(card);
  });
}

window.onload = () => {
  updateBalanceDisplay();
  renderStore();
};
