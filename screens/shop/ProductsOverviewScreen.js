import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, Button, Platform, ActivityIndicator, View, Text, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import ProductItem from '../../components/shop/ProductItem';
import * as cartActions from '../../store/actions/cart';
import * as productsActions from '../../store/actions/products';
import HeaderButton from '../../components/UI/HeaderButton';
import Colors from '../../constants/Colors';

const ProductsOverviewScreen = props => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState();
	const products = useSelector(state => state.products.availableProducts);
	const dispatch = useDispatch();

	const loadProducts = useCallback( async () => {
		// useState calls next to each other get auto-batched
		// so it does not trigger multiple re-render cycles
		setError(null);
		// removed setIsLoading to use in pull to refresh method
		// setIsLoading(true);
		try {
			// await - dispatch will hold until promise is resolved  and then continue next line
			await dispatch(productsActions.fetchProducts());
		} catch (e) {
			setError(e.message);
		}
		// setIsLoading(false);
	}, [dispatch, setIsLoading, setError]);

	useEffect(() => {
		const willFocusSub = props.navigation.addListener('willFocus', loadProducts);

		// cleanup
		return () => {
			willFocusSub.remove();
		}
	}, [loadProducts]);

	useEffect(() => {
		loadProducts();
	}, [dispatch, loadProducts]);

	const selectItemHandler = (id, title) => {
		props.navigation.navigate('ProductDetail', {
			productId: id,
			productTitle: title
		});
	}

	if (error) {
		return (
			<View style={styles.centered}>
				<Text>Something went wrong.</Text>
				<Button title="Try again" onPress={loadProducts} color={Colors.primary} />
			</View>
		)
	}

	if (isLoading) {
		return (
			<View style={styles.centered}>
				<ActivityIndicator size="large" color={Colors.primary} />
			</View>
		);
	}

	if (!isLoading && products.length === 0) {
		return (
			<View style={styles.centered}>
				<Text>No products found.</Text>
			</View>
		);
	}

	return (
		// onRefresh - points to a method to be ran when the pull to refresh action occurs
		// refreshing - points to a useState variable that indicates if currently loading or not
		<FlatList
			// onRefresh={loadProducts}
			// refreshing={isLoading}
			data={products}
			keyExtractor={item => item.id}
			renderItem={itemData => 
				<ProductItem 
					image={itemData.item.imageUrl} 
					title={itemData.item.title} 
					price={itemData.item.price} 
					onSelect={() => {
						selectItemHandler(itemData.item.id, itemData.item.title);
					}}>
					<Button 
						color={Colors.primary} 
						title="View Details" 
						onPress={() => {
							selectItemHandler(itemData.item.id, itemData.item.title);
						}} />
					<Button 
						color={Colors.primary} 
						title="Add To Cart" 
						onPress={() => {
							dispatch(cartActions.addToCart(itemData.item));
						}} />
				</ProductItem>
			}
		/>
	);
};

ProductsOverviewScreen.navigationOptions = navigationData => {
	return {
		headerTitle: 'All Products',
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
		},
		headerRight: () => {
			return (
				<HeaderButtons HeaderButtonComponent={HeaderButton}>
					<Item 
						title='Cart' 
						iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'} 
						onPress={() => {
							navigationData.navigation.navigate('Cart')
						}} />
				</HeaderButtons>
			);
		}
	}
};

const styles = StyleSheet.create({
	centered: {
		flex: 1, 
		justifyContent: "center", 
		alignItems: "center"
	}
});

export default ProductsOverviewScreen;