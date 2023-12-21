import { cartModel } from "../../Models/cart.model.js";

class CartDao {
    async getAllCart() {
        return await cartModel.find();
    }

    async getCartById(cartId) {
        return await cartModel.findById(cartId);
    }

    async addProductToCart(cartId, productId, quantity) {
        const cart = await cartModel.findById(cartId);

        if (!cart) {
            throw new Error("Cart not found");
        }
        const existingProduct = cart.products.find(
        (product) => product.productId === productId
        );

        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.products.push({
            productId,
            quantity,
        });
        }
        return await cart.save();
    }

    async updateProductQuantity(cartId, productId, quantity) {
        const cart = await cartModel.findById(cartId);

        if (!cart) {
            throw new Error("Cart not found");
        }

        const existingProduct = cart.products.find(
        (product) => product.productId === productId
        );

        if (existingProduct) {
            existingProduct.quantity = quantity;
            return await cart.save();
        } else {
            throw new Error("Product not found in cart");
        }
    }

    async deleteProductFromCart(cartId, productId) {
        const cart = await cartModel.findById(cartId);
        if (!cart) {
            throw new Error("Cart not found");
        }

        cart.products = cart.products.filter(
        (product) => product.productId !== productId
        );
        return await cart.save();
    }

    async clearCart(cartId) {
        const cart = await cartModel.findById(cartId);

        if (!cart) {
            throw new Error("Cart not found");
        }
        cart.products = [];
        return await cart.save();
    }
}

export default new CartDao();
