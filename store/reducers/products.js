import PRODUCTS from "../../data/dummyData";
import { DELETE_PRODUCT, CREATE_PRODUCT, UPDATE_PRODUCT, SET_PRODUCTS } from "../actions/products";
import Product from "../../models/product";

const initialState = {
	availableProducts: PRODUCTS,
	userProducts: PRODUCTS.filter(p => p.ownerId === 'u1')
};

export default (state = initialState, action) => {
	switch(action.type) {
		case SET_PRODUCTS:
			return {
				availableProducts: action.products,
				userProducts: action.products.filter(product => product.ownerId === 'u1')
			};
		case CREATE_PRODUCT:
			const newProduct = new Product(
				action.productData.id,
				'u1',
				action.productData.title,
				action.productData.imageUrl,
				action.productData.description,
				action.productData.price
			);
			return {
				...state,
				availableProducts: state.availableProducts.concat(newProduct),
				userProducts: state.availableProducts.concat(newProduct)
			}
		case UPDATE_PRODUCT:
			const productIndex = state.userProducts.findIndex(
				product => product.id === action.productId
			);
			const updatedProduct = new Product(
				action.productId, 
				state.userProducts[productIndex].ownerId,
				action.productData.title,
				action.productData.imageUrl,
				action.productData.description,
				state.userProducts[productIndex].price
			);
			// copy the original array and modify the copied version
			const updatedUserProducts = [...state.userProducts];
			// replace the existing product of matching index to the new product data
			updatedUserProducts[productIndex] = updatedProduct;
			// productIndex only applies to userProducts array
			// get index of product in availableProducts
			const availableProductIndex = state.availableProducts.findIndex(
				product => product.id === action.productId
			);
			const updatedAvailableProducts = [...state.availableProducts];
			updatedAvailableProducts[availableProductIndex] = updatedProduct;
			return {
				...state,
				availableProducts: updatedAvailableProducts,
				userProducts: updatedUserProducts
			}
		case DELETE_PRODUCT:
			return {
				...state,
				userProducts: state.userProducts.filter(
					product => product.id !== action.productId
				),
				availableProducts: state.availableProducts.filter(
					product => product.id !== action.productId
				)
			}
	}
	return state;
};