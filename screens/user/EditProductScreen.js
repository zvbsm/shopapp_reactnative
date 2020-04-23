import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, Platform, Alert } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useSelector, useDispatch } from 'react-redux';

import HeaderButton from '../../components/UI/HeaderButton';
import * as productsActions from '../../store/actions/products';

const EditProductScreen = props => {
	// determine if editing existing product by attempting to get the product of productId
	const productId = props.navigation.getParam('productId');
	const editedProduct = useSelector(state =>
		state.products.userProducts.find(prod => prod.id === productId)
	);

	const dispatch = useDispatch();

	// if editing, prepopulate the fields with the existing product,
	// otherwise start blank form
	const [title, setTitle] = useState(editedProduct ? editedProduct.title : '');
	const [imageUrl, setImageUrl] = useState(editedProduct ? editedProduct.imageUrl : '');
	// price should not be editable
	const [price, setPrice] = useState('');
	const [description, setDescription] = useState(editedProduct ? editedProduct.description : '');

	const deleteHandler = () => {
		Alert.alert('Are you sure?', 'Do you really want to delete this item?', [
			{ text: 'No', style: 'default' },
			{ text: 'Yes', style: 'destructive', onPress: () => {
					// delete
				} 
			},
		]);
	};

	// useCallback ensures this action does not trigger an infinite loop
	const submitHandler = useCallback(() => {
		if (editedProduct) {
			dispatch(productsActions.updateProduct(productId, title, description, imageUrl));
		} else {
			// add + to convert string into integer
			dispatch(productsActions.createProduct(title, description, imageUrl, +price));
		}
		// return to previous screen when finished updating/creating product
		props.navigation.goBack();
		// providing the empty array ensures this method is not re-created
		// however, when this is not re-created, the values passed to the params are also never updated
		// so they must be added to the array so it knows to re-evaluate those values
	}, [dispatch, productId, title, description, imageUrl, price]);

	useEffect(() => {
		props.navigation.setParams({ submit: submitHandler });
		// return () => {
		// 	cleanup
		// }
	}, [submitHandler])

	return (
		<ScrollView>
			<View style={styles.form}>
				<View style={styles.inputContainerView}>
					<Text style={styles.title}>Title</Text>
					{/* when text changes, get that new text and set title with it */}
					<TextInput 
						style={styles.input} 
						value={title} 
						onChangeText={text => setTitle(text)} />
				</View>
				<View style={styles.inputContainerView}>
					<Text style={styles.title}>Image URL</Text>
					<TextInput 
						style={styles.input} 
						value={imageUrl}
						onChangeText={text => setImageUrl(text)} />
				</View>
				{/* if in edit mode, dont price display element */}
				{editedProduct ? null : 
					<View style={styles.inputContainerView}>
						<Text style={styles.title}>Price</Text>
						<TextInput 
							style={styles.input}
							value={price}
							onChangeText={text => setPrice(text)} />
					</View>
				}
				<View style={styles.inputContainerView}>
					<Text style={styles.title}>Description</Text>
					<TextInput 
						style={styles.input}
						value={description}
						onChangeText={text => setDescription(text)} />
				</View>
			</View>
		</ScrollView>
	);
};

EditProductScreen.navigationOptions = navigationData => {
	const submit = navigationData.navigation.getParam('submit');

	return {
		headerTitle: navigationData.navigation.getParam('productId') ? 'Edit Product' : 'Add Product',
		headerRight: () => {
			return (
				<HeaderButtons HeaderButtonComponent={HeaderButton}>
					<Item
						title="Save"
						iconName={Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'}
						onPress={submit}
					/>
				</HeaderButtons>
			);
		}
	}
};

const styles = StyleSheet.create({
	form: {
		margin: 20
	},
	inputContainerView: {
		width: '100%'
	},
	title: {
		fontFamily: 'open-sans-bold',
		marginVertical: 8
	},
	input: {
		paddingHorizontal: 2,
		paddingVertical: 5,
		borderBottomColor: '#CCC',
		borderBottomWidth: 1
	}
});

export default EditProductScreen;