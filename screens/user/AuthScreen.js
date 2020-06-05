import React, { useState, useReducer, useCallback, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Button, KeyboardAvoidingView, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch } from 'react-redux';

import Input from '../../components/UI/Input';
import Card from '../../components/UI/Card';
import Colors from '../../constants/Colors';
import * as authActions from '../../store/actions/auth';

const FORM_UPDATE = 'FORM_UPDATE';

const formReducer = (state, action) => {
	if (action.type === FORM_UPDATE) {
		const updatedValues = {
			...state.inputValues,
			[action.input]: action.value
		};
		const updatedValidities = {
			...state.inputValidities,
			[action.input]: action.isValid
		}
		let updatedFormIsValid = true;
		for (const key in updatedValidities) {
			updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
		}
		return {
			formIsValid: updatedFormIsValid,
			inputValidities: updatedValidities,
			inputValues: updatedValues
		};
	}
	return state;
};

const AuthScreen = props => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState();
	const [isSignup, setIsSignup] = useState(false);
	const dispatch = useDispatch();

	const [formState, dispatchFormState] = useReducer(formReducer, {
		inputValues: {
			email: '',
			password: ''
		},
		inputValidities: {
			email: false,
			password: false
		},
		formIsValid: false
	});

	useEffect(() => {
		if (error) {
			Alert.alert("An error has occured.", error, [{ text: 'Okay' }]);
		}
	}, [error])

	const authHandler = async () => {
		let action = isSignup ? authActions.signup : authActions.signin;
		setIsLoading(true);
		setError(null);
		try {
			await dispatch(
				action(
					formState.inputValues.email, 
					formState.inputValues.password
				)
			);
			props.navigation.navigate('Shop');
		} catch (error) {
			setError(error.message);
			setIsLoading(false);
		}
	};

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

	return (
		<KeyboardAvoidingView 
			behavior="padding" 
			keyboardVerticalOffset={50}
			style={styles.screen} >
			<LinearGradient colors={[ '#FFF', '#143033' ]} style={styles.gradient}>
				<Card style={styles.authContainer}>
					<ScrollView>
						<Input 
							id="email" 
							label="E-Mail" 
							keyboardType="email-address" 
							autoCapitalize="none"
							errorText="Please enter a valid email address."
							onInputChange={inputChangeHandler}
							initialValue=''
							email 
							required />
						<Input
							id="password"
							label="Password"
							keyboardType="default"
							secureTextEntry
							autoCapitalize="none"
							errorText="Please enter a valid password."
							onInputChange={inputChangeHandler}
							initialValue=''
							minLength={8}
							required />
						<View style={styles.buttonContainer}>
							{ isLoading ? 
								<ActivityIndicator size='small' color={Colors.primary} /> : 
								<Button
									title={isSignup ? "Sign Up" : "Login"}
									color={Colors.primary}
									onPress={authHandler} /> }
						</View>
						<View style={styles.buttonContainer}>
							<Button 
							title={isSignup ? "Back to Sign In" : "Switch to Sign Up"}
							color={Colors.accent} 
							onPress={() => {
								setIsSignup(previousState => !previousState);
							}} />
						</View>
					</ScrollView>
				</Card>
			</LinearGradient>
		</KeyboardAvoidingView>
	);
};

AuthScreen.navigationOptions = {
	headerTitle: 'Please authenticate'
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
	},
	authContainer: {
		width: '80%',
		maxWidth: 400,
		maxHeight: 400,
		padding: 20
	},
	gradient: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	buttonContainer: {
		marginTop: 10
	}
});

export default AuthScreen;