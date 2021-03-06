import React, { useEffect, useState } from 'react';
import { Text, View, FlatList, Platform, ActivityIndicator, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import HeaderButton from '../../components/UI/HeaderButton';
import OrderItem from '../../components/shop/OrderItem';
import * as ordersActions from '../../store/actions/order';
import Colors from '../../constants/Colors';

const OrdersScreen = props => {
	const [isLoading, setIsLoading] = useState(false);
	const orders = useSelector(state => state.orders.orders);
	const dispatch = useDispatch();

	useEffect(() => {
		setIsLoading(true);
		dispatch(ordersActions.fetchOrders()).then(() => {
			setIsLoading(false);
		});
	}, [dispatch]);

	if (isLoading) {
		return (
			<View style={styles.centered}>
				<ActivityIndicator size="large" color={Colors.primary} />
			</View>
		)
	};

	if (orders.length <= 0) {
		return (
			<View style={styles.centered}>
				<Text>No orders Found.</Text>
			</View>
		);
	}

	return (
		<FlatList 
			data={orders} 
			keyExtractor={item => item.id} 
			renderItem={itemData => 
				<OrderItem 
					amount={itemData.item.totalPrice} 
					date={itemData.item.readableDate}
					items={itemData.item.items} />
			} 
		/>
	);
};

OrdersScreen.navigationOptions = navigationData => {
	return {
		headerTitle: 'Your Orders',
		headerLeft: () => {
			return (
				<HeaderButtons HeaderButtonComponent={HeaderButton}>
					<Item
						title="Menu"
						iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
						onPress={() => {
							navigationData.navigation.toggleDrawer();
						}}
					/>
				</HeaderButtons>
			);
		}
	}
};

const styles = StyleSheet.create({
	centered: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	}
});

export default OrdersScreen;