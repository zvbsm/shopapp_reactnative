import React from 'react';
// createSwitchNavigator prevents use of the back button. good for
// a screen like AuthScreen where the user should be limited to this
// screen until authorized to proceed elsewhere.
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import AuthScreen from '../screens/user/AuthScreen';
import ProductsOverviewScreen from '../screens/shop/ProductsOverviewScreen';
import ProductDetailsScreen from '../screens/shop/ProductDetailsScreen';
import CartScreen from '../screens/shop/CartScreen';
import OrdersScreen from '../screens/shop/OrdersScreen';
import UserProductsScreen from '../screens/user/UserProductScreen';
import EditProductScreen from '../screens/user/EditProductScreen';
import Colors from '../constants/Colors';

const defaultNavigationOptions = {
	headerStyle: {
		backgroundColor: Platform.OS === 'android' ? Colors.primary : ''
	},
	headerTitleStyle: {
		fontFamily: 'open-sans-bold'
	},
	headerBackTitleStyle: {
		fontFamily: 'open-sans'
	},
	headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary
}

const ProductsNavigator = createStackNavigator({
	ProductsOverview: ProductsOverviewScreen,
	ProductDetail: ProductDetailsScreen,
	Cart: CartScreen
}, {
	// navigationOptions is only used when the navigator is within another navigator
	// so the styling affects how this option is displayed in the parent navigator
	navigationOptions: {
		// return a component to be used
		// requires importing React
		drawerIcon: drawerConfig => (
			<Ionicons
				name={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
				size={23}
				color={drawerConfig.tintColor}
			/>
		)
	},
	defaultNavigationOptions: defaultNavigationOptions
});

const OrdersNavigator = createStackNavigator({
	Orders: OrdersScreen
}, {
	navigationOptions: {
		drawerIcon: drawerConfig => (
			<Ionicons 
				name={Platform.OS === 'android' ? 'md-list' : 'ios-list'} 
				size={23}
				color={drawerConfig.tintColor}
			/>
		)
	},
	defaultNavigationOptions: defaultNavigationOptions
});

const AdminNavigator = createStackNavigator({
	UserProducts: UserProductsScreen,
	EditProduct: EditProductScreen
}, {
	navigationOptions: {
		drawerIcon: drawerConfig => (
			<Ionicons
				name={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
				size={23}
				color={drawerConfig.tintColor}
			/>
		)
	},
	defaultNavigationOptions: defaultNavigationOptions
});

const ShopNavigator = createDrawerNavigator({
	Products: ProductsNavigator,
	Orders: OrdersNavigator,
	Admin: AdminNavigator
}, {
	contentOptions: {
		activeTintColor: Colors.primary
	}
});

const AuthNavigator = createStackNavigator({
	Auth: AuthScreen
}, {
	defaultNavigationOptions: defaultNavigationOptions
});

const MainNavigator = createSwitchNavigator({
	Auth: AuthNavigator,
	Shop: ShopNavigator
});

export default createAppContainer(MainNavigator);