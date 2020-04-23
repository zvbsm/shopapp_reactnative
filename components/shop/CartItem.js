import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CartItem = props => {
	return (
		<View style={styles.cartItem}>
			<View style={styles.itemData}>
				<Text style={styles.quantity}>{props.quantity} </Text> 
				<Text style={styles.boldText}>{props.productTitle}</Text>
			</View>
			<View style={styles.itemData}>
				<Text style={styles.boldText}>${props.totalPrice.toFixed(2)}</Text>
				{/* if deletable, display this component */}
				{props.deletable && <TouchableOpacity onPress={props.onRemove} style={styles.deleteButton}>
					<Ionicons 
						name={Platform.OS === 'android' ? 'md-trash' : 'ios-trash'}
						size={23}
						color="red" />
				</TouchableOpacity>}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	cartItem: {
		padding: 10,
		backgroundColor: 'white',
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginHorizontal: 20
	},
	itemData: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	quantity: {
		fontFamily: 'open-sans',
		color: '#888',
		fontSize: 16
	},
	boldText: {
		fontFamily: 'open-sans-bold',
		fontSize: 16
	},
	deleteButton: {
		marginLeft: 20
	}
});

export default CartItem;