import { Router } from "express";
import productsDao from "../daos/dbManager/products.dao.js";

const router = Router();

router.get("/", (req, res) => {
  res.render("index", {
    title: "Bienvenidos",
  });
});

router.get("/listProducts", async (req, res) => {
  try {
    const products = await productsDao.getAllProduct();
    res.render("listProducts", {
      products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/realtimeproducts", async (req, res) => {
  try {
    const realTimeViewProducts = await productsDao.getAllProduct();

    res.render("realTimeProducts", {
      title: "Lista de Productos en Tiempo Real",
      realTimeViewProducts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

const users = [];
router.get("/form", (req, res) => {
  res.render("form", {
    title: "Formulario de ejemplo",
  });
});

router.post("/user", (req, res) => {
  const { name, age } = req.body;

  users.push({
    name,
    age,
  });

  res.json({
    message: "User created",
    user: { name, age },
  });
});

router.post("/realtimeproducts", (req, res) => {
  const { title, description, price, category, thumbnail, stock, code } =
    req.body;

  const newProducts = {
    title: title,
    description: description,
    price: price,
    category: category,
    thumbnail: thumbnail,
    stock: stock,
    code: code,
  };

  try {
    productsDao.createProduct(newProducts);
    socketServer.emit("realTimeProducts_list", productsDao.getAllProduct);
    res.status(201).json({
      message: "Product created",
      newProducts,
    });
  } catch (e) {
    res.status(500).json({
      message: "Error creating new product",
      error: e.message,
    });
  }
});

router.post("/deleteProduct/:id", (req, res) => {
  const { id } = req.params;

  try {
    productsDao.deleteProduct(id);
    productsDao.broadcastProducts();
    res.status(200).json({
      message: "Producto eliminado",
    });
  } catch (e) {
    res.status(500).json({
      message: "Error deleting product",
      error: e.message,
    });
  }
});

router.get("/chat", (req, res) => {
  res.render("chatAplication", {
  });
});

export default router;
