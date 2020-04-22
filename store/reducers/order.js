import { ADD_ORDER } from "../actions/order";

import Order from '../../models/order';

const initialState = {
	orders: []
};

export default (state = initialState, action) => {
	switch(action.type) {
		case ADD_ORDER:
			const newOrder = new Order(
				new Date().toString(),
				action.orderData.items,
				action.orderData.totalPrice,
				new Date()
			);
			return {
				...state,
				// concat to create new array from old without changing the old
				orders: state.orders.concat(newOrder)
			}
	}
	return state;
};