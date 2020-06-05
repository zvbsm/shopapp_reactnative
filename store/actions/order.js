import Order from "../../models/order";

export const ADD_ORDER = 'ADD_ORDER';
export const SET_ORDERS = 'SET_ORDERS';

export const fetchOrders = () => {
	return async (dispatch, getState) => {
		const userId = getState().auth.userId;
		try {
			const response = await fetch(`https://shopappreactnative.firebaseio.com/orders/${userId}.json`);
			if (!response.ok) {
				throw new Error('Something went wrong.');
			}
			const responseData = await response.json();
			console.log('FETCH ORDERS RESPONSE');
			console.log(responseData);
			const loadedOrders = [];
			for (const key in responseData) {
				loadedOrders.push(
					new Order(
						key, 
						responseData[key].cartItems, 
						responseData[key].totalPrice, 
						new Date(responseData.date)
					)
				);
			}
			dispatch({ 
				type: SET_ORDERS, 
				orders: loadedOrders 
			});
		} catch (e) {
			throw e;
		}
	}
};

export const addOrder = (cartItems, totalPrice) => {
	return async (dispatch, getState) => {
		const userId = getState().auth.userId;
		const token = getState().auth.token;
		const date = new Date();
		const response = await fetch(`https://shopappreactnative.firebaseio.com/orders/${userId}.json?auth=${token}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			// firebase will auto generate the id as "name"
			body: JSON.stringify({
				cartItems,
				totalPrice,
				date: date.toISOString()
			})
		});

		if (!response.ok) {
			throw new Error('Something went wrong!');
		}

		const responseData = await response.json();

		dispatch({
			type: ADD_ORDER, 
			orderData: { 
				id: responseData.name, 
				items: cartItems, 
				totalPrice: totalPrice, 
				date: date 
			}
		});
	}
};