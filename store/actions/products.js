import Product from "../../models/product";

export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE PRODUCT';
export const SET_PRODUCTS = 'SET_PRODUCTS';

// refer to ProductsOverviewScreen for fetchProducts use
export const fetchProducts = () => {
	// async and await - more modern way of handling promises 
	// instead of then and catch
	return async dispatch => {
		// must be wrapped in try catch block to handle await actions
		try {
			// logic for redux thunk
			// thunk will run the dispatch method, so it must be caught here
			// then a dispatch action must be returned
			// fetch to specify the endpoint to hit. this will handle all types of requests
			// .json is specific to firebase
			const response = await fetch('https://shopappreactnative.firebaseio.com/products.json');
				// fetch defaults to GET, so not necessary to specify it
				// method: 'GET',

			if (!response.ok) {
				throw new Error('Something went wrong.');
			}

			const responseData = await response.json();
			console.log(responseData);

			const loadedProducts = [];
			for (const key in responseData) {
				loadedProducts.push(new Product(
					key,
					'u1',
					responseData[key].title,
					responseData[key].imageUrl,
					responseData[key].description,
					responseData[key].price
				));
			}

			dispatch({ type: SET_PRODUCTS, products: loadedProducts });
		} catch (e) {
			throw e;
		}
	}
};

export const deleteProduct = productId => {
	return async dispatch => {
		await fetch(`https://shopappreactnative.firebaseio.com/products/${productId}.json`, {
			method: 'DELETE'
		});

		dispatch({
				type: DELETE_PRODUCT, productId: productId
		});
	}
};

export const createProduct = (title, description, imageUrl, price) => {
	return async dispatch => {
		const response = await fetch('https://shopappreactnative.firebaseio.com/products.json', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			// firebase will auto generate the id as "name"
			body: JSON.stringify({
				id: responseData.name,
				title,
				description,
				imageUrl,
				price
			})
		});

		const responseData = await response.json();
		console.log(responseData);

		// dispatch will only trigger when the above "await" code is finished
		dispatch({
			type: CREATE_PRODUCT,
			productData: {
				// shortcut method for applying values vs { title: title }
				title,
				description,
				imageUrl,
				price
			}
		});
	}; 
};

// price not included because it should not be editable
export const updateProduct = (productId, title, description, imageUrl) => {
	return async dispatch => {

		await fetch(`https://shopappreactnative.firebaseio.com/products/${productId}.json`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			// firebase will auto generate the id as "name"
			body: JSON.stringify({
				title,
				description,
				imageUrl
			})
		});

		dispatch({
			type: UPDATE_PRODUCT,
			productId,
			productData: {
				title,
				description,
				imageUrl
			}
		});
	};
};