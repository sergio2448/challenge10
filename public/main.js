// Hardcode data
const products = [
  {
    id: 1,
    title: "Espada",
    price: 200,
    thumbnail:
      "https://icons.iconarchive.com/icons/chanut/role-playing/64/Sword-icon.png",
  },
  {
    id: 2,
    title: "Casco",
    price: 150,
    thumbnail:
      "https://icons.iconarchive.com/icons/chanut/role-playing/64/Helmet.jpg-icon.png",
  },
  {
    id: 3,
    title: "Armadura",
    price: 350,
    thumbnail:
      "https://icons.iconarchive.com/icons/chanut/role-playing/64/Armor-icon.png",
  },
];
// Utility functions
const renderMessage = (socketId, data) => {
  const div = document.createElement("div");
  let className;
  let html;
  if (data.id) {
    className =
      socketId === data.id
        ? "my-messages-container"
        : "other-messages-container";
    if (className === "my-messages-container") {
      html = `<div class="my-messages">
        <span><b>Yo</b> ${data.time}</span><br />
        <span>${data.text}</span>
      </div>`;
    } else {
      html = `<div class="other-messages">
        <span><b>${data.username}</b> ${data.time}</span><br />
        <span>${data.text}</span>
      </div>`;
    }
  } else {
    className = "bot-messages";
    html = `<b>LSpeak say: </b><i>${data.text}</i>`;
  }
  div.classList.add(className);
  div.innerHTML = html;
  document.getElementById("messages").appendChild(div);
};
const renderMessages = (data) => {
  const html = data
    .map((elem) => {
      let fragment = `<div class="other-messages-container">
      <div class="other-messages">
        <span><b>${elem.username}</b> ${elem.time}</span><br />
        <span>${elem.text}</span>
      </div>
    </div>`;
      return fragment;
    })
    .join("\n");
  document.getElementById("messages").innerHTML = html;
};

fetch("http://localhost:8080/products.hbs")
  .then((data) => data.text())
  .then((serverTemplate) => {
    const template = Handlebars.compile(serverTemplate);
    const html = template({ products });
    document.getElementById("products").innerHTML = html;
  });

const renderProducts = async (allProducts) => {
  console.log("allProducts", allProducts);
  const getProductsTemplate = await fetch("http://localhost:8080/products.hbs");
  const data = getProductsTemplate.text();
  const template = Handlebars.compile(data);
  const html = template({ products: allProducts });
  document.getElementById("products").innerHTML = html;

  /* fetch("http://localhost:8080/products.hbs")
    .then((data) => data.text())
    .then((serverTemplate) => {
      const template = Handlebars.compile(serverTemplate);
      const html = template({ products });
      console.log("html", html);
    }); */
};

// Selecting elements from DOM
const chatForm = document.getElementById("chat-form");
const textInput = document.getElementById("text-input");
const productForm = document.getElementById("product-form");

// Socket server connection.
const socket = io();

// Join chat
const { username } = Qs.parse(window.location.search, {
  ignoreQueryPrefix: true,
});

// Emiting "join chat" event
socket.emit("join-chat", { username });

// Form events listener
chatForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const msg = textInput.value;
  socket.emit("new-message", msg);
  textInput.value = "";
});

// Listening "chat-message" event
socket.on("chat-message", (data) => {
  renderMessage(socket.id, data);
});

// Listening "messages" event
socket.on("messages", (data) => {
  renderMessages(data);
});

// Listening "requestProducts" event
socket.on("all-products", async (prod) => {
  console.log("prod", prod);
  const getProductsTemplate = await fetch("http://localhost:8080/products.hbs");
  console.log(getProductsTemplate);
  const data = getProductsTemplate.text();
  const template = Handlebars.compile(data);
  const html = template({ products: prod });
  document.getElementById("products").innerHTML = html;
});
