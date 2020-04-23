import { ADD_TO_CART, REMOVE_FROM_CART } from '../actions/cart';
import { ADD_ORDER } from '../actions/order';
import { DELETE_PRODUCT } from '../actions/products';

import CartItem from '../../models/cart-item';

const initialState = {
	items: {},
	totalPrice: 0
};

export default (state = initialState, action) => {
	switch (action.type) {
		case ADD_TO_CART:
			const addedProduct = action.product;
			const productPrice = addedProduct.price;
			const productTitle = addedProduct.title;

			let cartUpdate;

			// if the cart already contains this item, add to existing quantity
			// else add new cart item with initial quantity
			if (state.items[addedProduct.id]) {
				cartUpdate = new CartItem(
					state.items[addedProduct.id].quantity + 1,
					productPrice,
					productTitle,
					state.items[addedProduct.id].totalPrice + productPrice
				);


					// i was converting title to productTitle for cart items


			} else {
				cartUpdate = new CartItem(1, productPrice, productTitle, productPrice);
			}

			return {
				// copying state is unnecessary when the initialState is not being modified
				// meaning items & totalPrice are the only fields being modified and new
				// fields are not being added. however, no harm in copying state anyway, as
				// it ensures if things change in the future that the data is not lost
				...state,
				// take existing data in state.items and merge with newly added cart item
				// [addedProduct.id] to access dynamic property
				items: { ...state.items, [addedProduct.id]: cartUpdate },
				totalPrice: state.totalPrice + productPrice
			}
		case REMOVE_FROM_CART:
			const cartItem = state.items[action.productId];
			const currentQuantity = cartItem.quantity;
			let updatedCartItems;

			if (currentQuantity > 1) {
				// subtract 1
				const updatedCartItem = new CartItem(
					currentQuantity - 1, 
					cartItem.productPrice, 
					cartItem.productTitle, 
					cartItem.totalPrice - cartItem.productPrice
				);
				updatedCartItems = { ...state.items, [action.productId]: updatedCartItem };
			} else {
				// remove the item entirely
				updatedCartItems = { ...state.items };
				delete updatedCartItems[action.productId];
			}
			return {
				...state,
				items: updatedCartItems,
				totalPrice: state.totalPrice - cartItem.productPrice
			}
		case ADD_ORDER:
			return initialState;
		case DELETE_PRODUCT:
			if (!state.items[action.productId]) {
				return state;
			}
			const updatedItems = {...state.items};
			const itemTotal = state.items[action.productId].totalPrice;
			delete updatedItems[action.productId];
			return {
				...state,
				items: updatedItems,
				totalPrice: state.totalPrice - itemTotal
			}
		default:
			return state;
	}
};