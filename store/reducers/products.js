import PRODUCTS from "../../data/dummyData";

const initialState = {
	availableProducts: PRODUCTS,
	userProducts: PRODUCTS.filter(p => p.ownerId === 'u1')
};

export default (state = initialState, action) => {
	return state;
};