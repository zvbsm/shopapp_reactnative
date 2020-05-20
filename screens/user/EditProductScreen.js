import React, { useState, useEffect, useCallback, useReducer } from 'react';
import { View, ScrollView, StyleSheet, Platform, Alert, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useSelector, useDispatch } from 'react-redux';

import HeaderButton from '../../components/UI/HeaderButton';
import * as productsActions from '../../store/actions/products';
import Input from '../../components/UI/Input';
import Colors from '../../constants/Colors';

const FORM_UPDATE = 'FORM_UPDATE';
// reducer's are generally method's that take in data and output some form of data
// a react reducer takes a state and action
const formReducer = (state, action) => {
	if (action.type === FORM_UPDATE) {
		const updatedValues = {
			// first copy the initial snapshot values
			...state.inputValues,
			// then replace the value for the input that dispatched this event
			[action.input]: action.value
		};
		const updatedValidities = {
			...state.inputValidities,
			// isValid gets forwared via dispatchFormState in textChangeHandler
			[action.input]: action.isValid
		}

		let updatedFormIsValid = true;
		for (const key in updatedValidities) {
			// always true until it reaches an input that is false
			// then updatedFormIsValid always returns false in this check regardless
			// of the remaining inputs being checked
			updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
		}

		// return the new state and updated values
		return {
			formIsValid: updatedFormIsValid,
			inputValidities: updatedValidities, 
			inputValues: updatedValues
		};
	}
	return state;
};

const EditProductScreen = props => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState();

	// determine if editing existing product by attempting to get the product of productId
	const productId = props.navigation.getParam('productId');
	const editedProduct = useSelector(state =>
		state.products.userProducts.find(prod => prod.id === productId)
	);

	const dispatch = useDispatch();

	// array destructering syntax
	// state - snapshot of the form
	// dispatch - function to dispatch actions
	const [formState, dispatchFormState] = useReducer(formReducer, {
		// set the initial values for the form validation to review
		// formReducer then contains the specific actions to be when the dispatch event occurs
		// the input values declared here are then used for specifying the value on the input
		// components in the view
		inputValues: {
			// the keys here should match the input id used in textChangeHandler for validating
			title: editedProduct ? editedProduct.title : '',
			imageUrl: editedProduct ? editedProduct.imageUrl : '',
			description: editedProduct ? editedProduct.description : '',
			price: ''
		}, 
		// the current value of the input validation can be used in submitHandler
		// to check on the current status of its validity
		inputValidities: {
			title: editedProduct ? true : false,
			imageUrl: editedProduct ? true : false,
			description : editedProduct ? true : false,
			price: editedProduct ? true : false,
		}, 
		formIsValid: editedProduct ? true : false 
	}
	// , init
	);

	useEffect(() => {
		if (error) {
			Alert.alert('An error occurred.', error, [{ text: 'Okay' }]);
		}
	}, [error]);

	// --- useState replaced with useReducer ---
	// if editing, prepopulate the fields with the existing product,
	// otherwise start blank form
	// const [title, setTitle] = useState(editedProduct ? editedProduct.title : '');
	// const [titleIsValid, setTitleIsValid] = useState(false);
	// const [imageUrl, setImageUrl] = useState(editedProduct ? editedProduct.imageUrl : '');
	// // price should not be editable
	// const [price, setPrice] = useState('');
	// const [description, setDescription] = useState(editedProduct ? editedProduct.description : '');

	// useCallback ensures this action does not trigger an infinite loop
	const submitHandler = useCallback(async () => {
		// if (!formState.inputValidities.title) {
		if (!formState.formIsValid) {
			Alert.alert('Uh-oh!', 'One or more fields is missing or invalid.', [
				{ text: 'Okay' }
			]);
			return;
		}

		setError(null);
		setIsLoading(true);
		try {
			if (editedProduct) {
				await dispatch(productsActions.updateProduct(
					productId,
					formState.inputValues.title,
					formState.inputValues.description,
					formState.inputValues.imageUrl
				));
			} else {
				// add + to convert string into integer
				await dispatch(productsActions.createProduct(
					formState.inputValues.title,
					formState.inputValues.description,
					formState.inputValues.imageUrl,
					+formState.inputValues.price
				));
			}
			// return to previous screen when finished updating/creating product
			props.navigation.goBack();
		} catch (e) {
			setError(e.message);
		}
		
		setIsLoading(false);

		// providing the empty array ensures this method is not re-created
		// however, when this is not re-created, the values passed to the params are also never updated
		// e.g. formState would always be false when the form is submitted because
		// it will never be updated here
	}, [dispatch, productId, formState]);

	useEffect(() => {
		props.navigation.setParams({ submit: submitHandler });
		// return () => {
		// 	cleanup
		// }
	}, [submitHandler]);

	// input to specify which input triggered the validation
	// text of what was entered by the user
	// useCallback to avoid having this function re-built unecessarily
	const inputChangeHandler = useCallback((inputId, inputValue, inputValidity) => {
		// additional params after type are optional to pass any additional data desired
		dispatchFormState({ 
			type: FORM_UPDATE, 
			value: inputValue, 
			isValid: inputValidity, 
			// input to specify which input triggered this validation
			input: inputId
		});
	}, [dispatchFormState]);

	if (isLoading) {
		return (
			<View style={styles.centered}>
				<ActivityIndicator size='large' color={Colors.primary} />
			</View>
		)
	};

	return (
		// flex:1 is necessary for the component to have an effect on the view
		<KeyboardAvoidingView 
			style={{flex: 1}} 
			behavior="padding" 
			keyboardVerticalOffset={100}>
			<ScrollView>
				<View style={styles.form}>
					<Input
						id="title"
						label="Title"
						errorText="Please enter a valid title"
						keyboardType="default"
						autoCapitalize="sentences"
						autoCorrect
						returnKeyType="next"
						onInputChange={inputChangeHandler}
						initialValue={editedProduct ? editedProduct.title : ''}
						// if editedProduct exists, returns true, otherwise false
						initialValid={!!editedProduct}
						required />
					<Input
						id="imageUrl"
						label="Image URL"
						errorText="Please enter a valid Image URL"
						keyboardType="default"
						returnKeyType="next"
						onInputChange={inputChangeHandler}
						initialValue={editedProduct ? editedProduct.imageUrl : ''}
						initialValid={!!editedProduct}
						required />
					{/* if in edit mode, dont price display element */}
					{editedProduct ? null :
						<Input
							id="price"
							label="Price"
							errorText="Please enter a valid price"
							keyboardType="decimal-pad"
							returnKeyType="next"
							onInputChange={inputChangeHandler}
							required
							min={0.01} />
					}
					<Input
						id="description"
						label="Description"
						errorText="Please enter a valid description"
						keyboardType="default"
						autoCapitalize="sentences"
						autoCorrect
						multiline
						// numberOfLines only works on android
						numberOfLines={3}
						onInputChange={inputChangeHandler}
						initialValue={editedProduct ? editedProduct.description : ''}
						initialValid={!!editedProduct}
						required
						minLength={5} />
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
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
						onPress={submit} />
				</HeaderButtons>
			);
		}
	}
};

const styles = StyleSheet.create({
	form: {
		margin: 20
	},
	centered: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	}
});

export default EditProductScreen;