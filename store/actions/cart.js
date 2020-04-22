export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';

export const addToCart = product => {
	return { type: ADD_TO_CART, product: product };
};

export const removeFromCart = productId => {
	// when deleting the item from cart, the id of that item is the only
	// thing needed to locate it in the list of items from state
	// e.g. state.items[action.productId]
	return { type: REMOVE_FROM_CART, productId: productId };
}