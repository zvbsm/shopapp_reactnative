import { ADD_ORDER, SET_ORDERS } from "../actions/order";
import Order from '../../models/order';

const initialState = {
	orders: []
};

export default (state = initialState, action) => {
	switch(action.type) {
		case SET_ORDERS:
			return {
				orders: action.orders
			};
		case ADD_ORDER:
			const newOrder = new Order(
				action.orderData.id,
				action.orderData.items,
				action.orderData.totalPrice,
				action.orderData.date
			);
			return {
				...state,
				// concat to create new array from old without changing the old
				orders: state.orders.concat(newOrder)
			};
	};
	return state;
};