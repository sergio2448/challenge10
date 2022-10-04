const express = require("express");
const apiRoutes = require("./routers/app.routers");
const loggerMiddleware = require("./middlewares/logger");
const Container = require("./models/Container.js");
const productApi = new Container("./data/data1.json");
const { Server: HttpServer } = require("http");
const { Server: SocketServer } = require("socket.io");
const { formatMessage } = require("./utils/utils");

const PORT = process.env.PORT || 8080;
const app = express();
const httpServer = new HttpServer(app);
const io = new SocketServer(httpServer);

const messages = [];
const users = [];
const allProducts = async () => {
  const getProducts = await productApi.getAll();
  const products =
    getProducts.length > -1 && getProducts.length < 4
      ? false
      : JSON.parse(getProducts);
  console.log("[PRODUCTS]", products);
  return products;
};

const prod = [
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

// Middlewares
app.use(loggerMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

// Routes
app.use("/api", apiRoutes);

app.post("/save", async (req, res) => {
  await productApi.save(req.body);
  res.redirect("/");
});

// Routes
app.get("/chat", (req, res) => {
  console.log(users);
  res.sendFile(__dirname + "/public/chat.html");
});

app.get("/formUser", (req, res) => {
  res.sendFile(__dirname + "/public/formUser.html");
});

app.post("/login", (req, res) => {
  const { username } = req.body;
  if (users.find((user) => user.username === user)) {
    return res.send("Username already taken");
  }
  res.redirect(`/chat?username=${username}`);
});

// Listen
httpServer.listen(PORT, () => {
  console.log("Server is up and running on port ", PORT);
});

const botName = "LSpeak Bot";

// Socket Events
io.on("connection", (socket) => {
  console.log("New client connection!");

  // Getting all messages
  socket.emit("messages", [...messages]);

  // Getting all products
  socket.emit("all-products", prod);

  // Welcome to chat
  socket.on("join-chat", (data) => {
    const newUser = {
      id: socket.id,
      username: data.username,
    };
    users.push(newUser);

    // Welcome current user
    socket.emit(
      "chat-message",
      formatMessage(null, botName, `Welcome to Store App!`)
    );

    // Broadcast connection
    socket.broadcast.emit(
      "chat-message",
      formatMessage(null, botName, `${data.username} has joined the chat`)
    );
  });

  // New message
  socket.on("new-message", (data) => {
    const author = users.find((user) => user.id === socket.id);
    const newMessage = formatMessage(socket.id, author.username, data);
    messages.push(newMessage);
    io.emit("chat-message", newMessage);
  });
});
