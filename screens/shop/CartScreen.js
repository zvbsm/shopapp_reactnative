import React from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import Colors from '../../constants/Colors';
import CartItem from '../../components/shop/CartItem';
import Card from '../../components/UI/Card';
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
		return transformedCartItems.sort( (a, b) => 
			a.productId > b.productId ? 1 : -1
		);
	});

	const dispatch = useDispatch();

	return (
		<View style={styles.screen}>
			<Card style={styles.summary}>
				<Text style={styles.summaryText}>
					Total:{' '}<Text style={styles.price}>${Math.round(
						cartTotalPrice.toFixed(2) * 100) / 100}</Text>
				</Text>
				<Button 
					color={Colors.accent} 
					title="Order Now" 
					disabled={cartItems.length <= 0} 
					onPress={() => {
						dispatch(ordersActions.addOrder(cartItems, cartTotalPrice));
					}} />
			</Card>
			{/* FlatList requires a keyExtractor because the product does not have "id" or "key"
				so must be manually specified to refer to "productId" */}
			<FlatList
				data={cartItems}
				keyExtractor={item => item.productId}
				renderItem={itemData => 
					<CartItem 
						quantity={itemData.item.quantity} 
						productTitle={itemData.item.productTitle}
						totalPrice={itemData.item.totalPrice}
						deletable
						onRemove={() => {
							dispatch(cartActions.removeFromCart(itemData.item.productId))
						}}
					/>
				} 
			/>
		</View>
	);
};

CartScreen.navigationOptions = {
	headerTitle: 'Your Cart'
}

const styles = StyleSheet.create({
	screen: {
		margin: 20
	},
	summary: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 20,
		padding: 10
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