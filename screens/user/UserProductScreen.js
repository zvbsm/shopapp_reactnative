import React from 'react';
import { FlatList, Button, Platform, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import ProductItem from '../../components/shop/ProductItem';
import HeaderButton from '../../components/UI/HeaderButton';
import Colors from '../../constants/Colors';
import * as productsActions from '../../store/actions/products';

const UserProductsScreen = props => {
	const userProducts = useSelector(state => state.products.userProducts);
	const dispatch = useDispatch();

	const editProductHandler = (productId) => {
		props.navigation.navigate('EditProduct', {
			productId: productId
		});
	};

	const deleteHandler = (productId) => {
		Alert.alert('Are you sure?', 'Do you really want to delete this item?', [
			{ text: 'No', style: 'default' },
			{ text: 'Yes', style: 'destructive', onPress: () => {
					dispatch(productsActions.deleteProduct(productId));
				}
			},
		]);
	};

	return (
		<FlatList 
			data={userProducts} 
			keyExtractor={item => item.id} 
			renderItem={itemData => 
				<ProductItem
					image={itemData.item.imageUrl}
					title={itemData.item.title}
					price={itemData.item.price}
					onSelect={() => {
						editProductHandler(itemData.item.id);
					}}>
					<Button
						color={Colors.primary}
						title="Edit"
						onPress={() => {
							editProductHandler(itemData.item.id);
						}} />
					<Button
						color={Colors.primary}
						title="Delete"
						// deleteHandler() is not possible here because it would immediately run the method
						// whereas bind preconfigures the method with the specified params
						onPress={deleteHandler.bind(this, itemData.item.id)} />
				</ProductItem> 
			}
		/>
	);
};

UserProductsScreen.navigationOptions = navigationData => {
	return {
		headerTitle: 'Your Products',
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
						title="Menu"
						iconName={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
						onPress={() => {
							// create new product, so dont pass a productId
							navigationData.navigation.navigate('EditProduct');
						}}
					/>
				</HeaderButtons>
			);
		}
	}
}

export default UserProductsScreen;