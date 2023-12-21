import fs from "fs";

export class ProductManager {
    constructor(path) {
        this.path = path;
        if (fs.existsSync(path)) {
        try {
            const products = fs.readFileSync(path, "utf-8");
            this.products = JSON.parse(products);
        } catch (error) {
            this.products = [];
        }
        } else {
        this.products = [];
        }
    }

    async saveFile() {
        try {
        await fs.promises.writeFile(
            this.path,
            JSON.stringify(this.products, null, "\t")
        );
        return true;
        } catch (error) {
        console.log(error);
        return false;
        }
    }

    showProducts() {
        return this.products;
    }

    async addProduct(product) {
        let maxId = 0;
        for (const prod of this.products) {
        if (prod.id > maxId) {
            maxId = prod.id;
        }
        }
        product.id = maxId + 1;

        const products = this.products.find((prod) => prod.code === product.code);

        if (products) {
        return console.log("[ERROR] Team code already exist");
        }

        this.products.push(product);

        const rta = await this.saveFile();

        if (rta) {
        console.log("Product created");
        } else {
        console.log("Error creating product");
        }
    }

    async updateProduct(id, productData) {
        const productIndex = this.products.findIndex(
        (product) => product.id === id
        );

        if (productIndex === -1) {
        console.log("The product does not exist");
        return;
        }

        this.products[productIndex] = {
        ...this.products[productIndex],
        ...productData,
        };

        const success = await this.saveFile();

        if (success) {
        console.log("Updated product");
        } else {
        console.log("Error updating product");
        }
    }

    async deleteProduct(id) {
        const productIndex = this.products.findIndex((prod) => prod.id === id);

        if (productIndex === -1) {
        console.log("The product does not exist");
        return;
        }

        this.products.splice(productIndex, 1);

        const success = await this.saveFile();

        if (success) {
        console.log("Product removed");
        } else {
        console.log("Error deleting product");
        }
    }

    broadcastProducts() {
        socketServer.emit("realTimeProducts_list", this.showProducts());
    }
    }

    export class Products {
    constructor(title, description, price, category, thumbnail, stock, code) {
        (this.title = title),
        (this.description = description),
        (this.price = price),
        (this.category = category),
        (this.status = true),
        (this.thumbnail = thumbnail),
        (this.stock = stock),
        (this.code = code);
    }
}

export default { ProductManager, Products };
