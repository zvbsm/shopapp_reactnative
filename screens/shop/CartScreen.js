import React from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import Colors from '../../constants/Colors';
import CartItem from '../../components/shop/CartItem';
import * as cartActions from '../../store/actions/cart';
import * as ordersActions from '../../store/actions/order';

const CartScreen = props => {
	const cartTotalPrice = useSelector(state => state.cart.totalPrice);

	const cartItems = useSelector(state => {
		const transformedCartItems = [];
		for (const key in state.cart.items) {
			var thisItem = state.cart.items[key];
			transformedCartItems.push({
				productId: key,
				productTitle: thisItem.productTitle,
				productPrice: thisItem.price,
				quantity: thisItem.quantity,
				totalPrice: thisItem.totalPrice
			});
		}
		return transformedCartItems.sort(
			(a, b) => a.productId > b.productId ? 1 : -1
		);
	});

	const dispatch = useDispatch();

	return (
		<View style={styles.screen}>
			<View style={styles.summary}>
				<Text style={styles.summaryText}>
					Total: <Text style={styles.price}>${cartTotalPrice >= 0 ? cartTotalPrice.toFixed(2) : 0}</Text>
				</Text>
				<Button 
					color={Colors.accent} 
					title="Order Now" 
					disabled={cartItems.length <= 0} 
					onPress={() => {
						dispatch(ordersActions.addOrder(cartItems, cartTotalPrice));
					}} />
			</View>
			{/* FlatList requires a keyExtractor because the product does not have "id" or "key"
				so must be manually specified to refer to "productId" */}
			<FlatList
				data={cartItems}
				keyExtractor={item => item.productId}
				renderItem={itemData => 
					<CartItem 
						quantity={itemData.item.quantity} 
						title={itemData.item.productTitle}
						totalPrice={itemData.item.totalPrice}
						onRemove={() => {
							dispatch(cartActions.removeFromCart(itemData.item.productId))
						}}
					/>
				} 
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	screen: {
		margin: 20
	},
	summary: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 20,
		padding: 10,
		shadowColor: 'black',
		shadowOpacity: 0.26,
		shadowOffset: { width: 0, height: 2},
		shadowRadius: 8,
		elevation: 5,
		borderRadius: 10,
		backgroundColor: 'white'
	},
	summaryText: {
		fontFamily: 'open-sans-bold',
		fontSize: 18
	},
	price: {
		color: Colors.primary
	}
});

export default CartScreen;