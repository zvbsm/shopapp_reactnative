import React, { useEffect, useCallback, useReducer } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, Platform, Alert } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useSelector, useDispatch } from 'react-redux';

import HeaderButton from '../../components/UI/HeaderButton';
import * as productsActions from '../../store/actions/products';

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
	const submitHandler = useCallback(() => {
		// if (!formState.inputValidities.title) {
		if (!formState.formIsValid) {
			Alert.alert('Uh-oh!', 'One or more fields is missing or invalid.', [
				{ text: 'Okay' }
			]);
			return;
		}

		if (editedProduct) {
			dispatch(productsActions.updateProduct(
				productId, 
				formState.inputValues.title, 
				formState.inputValues.description, 
				formState.inputValues.imageUrl
			));
		} else {
			// add + to convert string into integer
			dispatch(productsActions.createProduct(
				formState.inputValues.title, 
				formState.inputValues.description, 
				formState.inputValues.imageUrl, 
				+formState.inputValues.price
			));
		}
		// return to previous screen when finished updating/creating product
		props.navigation.goBack();
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
	const textChangeHandler = (input, text) => {
		let isValid = false;

		// trim to exclude whitespace from being valid
		if (text.trim().length > 0) {
			isValid = true;
		}

		// additional params after type are optional to pass any additional data desired
		dispatchFormState({ 
			type: FORM_UPDATE, 
			value: text, 
			isValid: isValid, 
			// input to specify which input triggered this validation
			input: input 
		});
	};

	return (
		<ScrollView>
			<View style={styles.form}>
				<View style={styles.inputContainerView}>
					<Text style={styles.title}>Title</Text>
					{/* when text changes, get that new text and set title with it */}
					<TextInput 
						style={styles.input} 
						value={formState.inputValues.title} 
						// the input id should match the id specified in the useReducer method
						onChangeText={textChangeHandler.bind(this, 'title')}
						keyboardType='default'
						autoCapitalize='sentences'
						autoCorrect
						returnKeyType='next'
						onEndEditing={() => console.log('onEndEditing')} 
						onSubmitEditing={() => console.log('onSubmitEditing')} />
					{/* autoCorrect={false} to manually disable 
						onSubmitEditing is triggered when the return/next key is pressed*/}
						{!formState.inputValidities.title && <Text>Please enter a valid title</Text>}
				</View>
				<View style={styles.inputContainerView}>
					<Text style={styles.title}>Image URL</Text>
					<TextInput 
						style={styles.input} 
						value={formState.inputValues.imageUrl}
						onChangeText={textChangeHandler.bind(this, 'imageUrl')} />
				</View>
				{/* if in edit mode, dont price display element */}
				{editedProduct ? null : 
					<View style={styles.inputContainerView}>
						<Text style={styles.title}>Price</Text>
						<TextInput 
							style={styles.input}
							value={formState.inputValues.price}
							onChangeText={textChangeHandler.bind(this, 'price')}
							keyboardType='decimal-pad' />
					</View>
				}
				<View style={styles.inputContainerView}>
					<Text style={styles.title}>Description</Text>
					<TextInput 
						style={styles.input}
						value={formState.inputValues.description}
						onChangeText={textChangeHandler.bind(this, 'description')} />
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