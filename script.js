/* HERTS VAPES LIVE MENU
   Edit these two contact links when you have the final number/profile.
*/
const CONTACT = {
  whatsappNumber: "447000000000", // replace with your WhatsApp number, e.g. 447123456789
  whatsappText: "Hi, I'd like to place an order from Herts Vapes.",
  snapchatUrl: "https://www.snapchat.com/add/CHAZZA_MANHOOD" // replace with final Snapchat link/username
};

const MENU = {
  specials: {
    title: "Special Deals",
    intro: "Best value bundles.",
    type: "deals",
    items: [
      { name: "Vaporesso XROS Pro 2 + 4 Elux Nic Salts", sub: "Pod kit bundle", price: "£30" },
      { name: "2 XROS Pods + 6 Elux Nic Salts", sub: "Pods and liquids bundle", price: "£20" },
      { name: "2 Hayati Pro Ultra 25K", sub: "25K disposable bundle", price: "£25" },
      { name: "3 Elux Legend 3500", sub: "3.5K disposable bundle", price: "£10" },
      { name: "2 Lost Mary BM6000 + 1 Hayati Pro Ultra 25K", sub: "Mixed disposable bundle", price: "£30" }
    ]
  },
  disposables: {
    title: "Disposable Vapes",
    intro: "Available disposable devices.",
    products: [
      { name: "Lost Mary BM6000", price: "£10", flavours: ["Raspberry Peach", "Cherry Ice", "Blue Razz", "Triple Mango"] },
      { name: "Hayati Pro Ultra 25K", price: "£15", flavours: ["Blueberry H'Bubba / Watermelon H'Bubba", "Mr Blue", "Strawberry Cranberry Cherry"] },
      { name: "Elux Legend 3500", price: "£5", flavours: ["Strawberry Raspberry Cherry Ice"] }
    ]
  },
  podkits: {
    title: "Pod Kits",
    intro: "Starter pod systems.",
    products: [
      { name: "Vaporesso XROS Pro 2", price: "£20", flavours: ["Black device", "Other colours on request"] }
    ]
  },
  nicsalts: {
    title: "Nic Salts",
    intro: "Elux Legend 20mg salts.",
    products: [
      { name: "Elux Legend Nic Salt", price: "£5", flavours: ["Blueberry Cherry Cranberry", "Triple Mango", "Other flavours subject to stock"] }
    ]
  },
  pods: {
    title: "Replacement Pods",
    intro: "Replacement pods for pod kits.",
    products: [
      { name: "Vaporesso XROS Replacement Pods", price: "£5 each / 4 for £15", flavours: ["Compatible XROS pods", "Resistance options subject to stock"] }
    ]
  },
  pouches: {
    title: "Nicotine Pouches",
    intro: "Discreet nicotine pouches.",
    products: [
      { name: "Pablo Exclusive Orange", price: "£5 / 10 for £30", flavours: ["Orange"] },
      { name: "VELO", price: "£5 / 10 for £30", flavours: ["Minty Lemon"] }
    ]
  }
};

const content = document.getElementById("categoryContent");
const activeTitle = document.getElementById("activeTitle");

function whatsappLink(itemName = "") {
  const text = itemName
    ? `Hi, I'd like to order ${itemName} from Herts Vapes.`
    : CONTACT.whatsappText;
  return `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

function setupContacts() {
  document.querySelectorAll('[data-contact="whatsapp"]').forEach(el => {
    el.href = whatsappLink();
  });
  document.querySelectorAll('[data-contact="snapchat"]').forEach(el => {
    el.href = CONTACT.snapchatUrl;
  });
}

function renderCategory(key) {
  const data = MENU[key];
  if (!data) return;
  activeTitle.textContent = data.title;
  content.innerHTML = "";

  if (data.type === "deals") {
    data.items.forEach(item => {
      const card = document.createElement("article");
      card.className = "deal-card";
      card.innerHTML = `
        <div class="deal-row">
          <div class="deal-main">
            <div class="item-title">${item.name}</div>
            <div class="item-sub">${item.sub}</div>
          </div>
          <div class="price-pill">${item.price}</div>
        </div>
        <div class="order-strip">
          <a class="order-btn" href="${whatsappLink(item.name)}">WhatsApp</a>
          <a class="order-btn" href="${CONTACT.snapchatUrl}">Snapchat</a>
        </div>`;
      content.appendChild(card);
    });
  } else {
    data.products.forEach(product => {
      const card = document.createElement("article");
      card.className = "product-card";
      const flavours = product.flavours.map(f => `<li><span>${f}</span><span class="stock">Ask stock</span></li>`).join("");
      card.innerHTML = `
        <button class="product-toggle" type="button" aria-expanded="false">
          <div class="product-main">
            <div class="item-title">${product.name}</div>
            <div class="item-sub">Tap to view flavours</div>
          </div>
          <div class="price-pill">${product.price}</div>
          <div class="chev">›</div>
        </button>
        <div class="product-details">
          <ul class="flavour-list">${flavours}</ul>
          <div class="order-strip">
            <a class="order-btn" href="${whatsappLink(product.name)}">WhatsApp</a>
            <a class="order-btn" href="${CONTACT.snapchatUrl}">Snapchat</a>
          </div>
        </div>`;
      content.appendChild(card);
    });
  }

  document.querySelectorAll('.product-toggle').forEach(button => {
    button.addEventListener('click', () => {
      const card = button.closest('.product-card');
      const open = card.classList.toggle('open');
      button.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  document.getElementById("products").scrollIntoView({ behavior: "smooth", block: "start" });
}

function init() {
  setupContacts();
  document.querySelectorAll('[data-open]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const key = el.getAttribute('data-open');
      renderCategory(key);
    });
  });
}

document.addEventListener('DOMContentLoaded', init);
