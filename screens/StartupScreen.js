import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, AsyncStorage } from "react-native";
import { useDispatch } from 'react-redux';

import Colors from '../constants/Colors';
import * as authActions from '../store/actions/auth';

const StartupScreen = props => {
	const dispatch = useDispatch();

	useEffect(() => {
		const attemptSignin = async () => {
			const userData = await AsyncStorage.getItem('userData');
			if (!userData) {
				props.navigation.navigate('Auth');
				return;
			}
			const transformedData = JSON.parse(userData);
			const { token, userId, expirationDate } = transformedData;
			const exp = new Date(expirationDate);

			if (exp <= new Date() || !token || !userId) {
				props.navigation.navigate('Auth');
				return;
			};

			const expirationTime = exp.getTime() - new Date().getTime();

			props.navigation.navigate('Shop');
			dispatch(authActions.authenticate(userId, token, expirationTime));
		};

		attemptSignin();

	}, [dispatch]);

	return (
		<View style={styles.screen}>
			<ActivityIndicator />
		</View>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	}
});

export default StartupScreen;