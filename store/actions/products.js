export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE PRODUCT';

export const deleteProduct = productId => {
	return {
		type: DELETE_PRODUCT, productId: productId
	}
};

export const createProduct = (title, description, imageUrl, price) => {
	return { 
		type: CREATE_PRODUCT, 
		productData: {
			// shortcut method for applying values vs { title: title }
			title,
			description,
			imageUrl,
			price 
		}
	}
};

// price not included because it should not be editable
export const updateProduct = (productId, title, description, imageUrl) => {
	return {
		type: UPDATE_PRODUCT,
		productId,
		productData: {
			title,
			description,
			imageUrl
		}
	}
};