export const ADD_ORDER = 'ADD_ORDER';

export const addOrder = (cartItems, totalPrice) => {
	return { 
		type: ADD_ORDER, 
		orderData: { items: cartItems, totalPrice: totalPrice }
	};
};