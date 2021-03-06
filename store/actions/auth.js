import Globals from '../../constants/Globals';
import { AsyncStorage } from 'react-native';

export const AUTHENTICATE = 'AUTHENTICATE';
export const DEAUTHENTICATE = 'DEAUTHENTICATE';

let signoutTimer;

export const authenticate = (userId, token, expirationTime) => {
	return dispatch => {
		dispatch(setSignoutTimer(expirationTime));
		dispatch({ 
			type: AUTHENTICATE, 
			userId, 
			token 
		});
	};
}

export const signup = (email, password) => {
	return async dispatch => {
		const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${Globals.fbk}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email: email,
				password: password,
				returnSecureToken: true
			})
		});

		if (!response.ok) {
			const errorData = await response.json();
			const errorId = errorData.error.message;
			let message = "Something went wrong";
			if (errorId === "EMAIL_EXISTS") {
				message = "This email already exists.";
			}
			throw new Error(message);
		}

		const responseData = await response.json();
		console.log(responseData);

		dispatch(
			authenticate(
				responseData.localId,
				responseData.idToken,
				parseInt(responseData.expiresIn) * 1000
			)
		);
		// futureDate is a timestamp of now + the expiration time
		const futureDate = new Date().getTime() + parseInt(responseData.expiresIn) * 1000;
		// convert futureDate back into a javascript date object
		const expirationDate = new Date(futureDate);
		saveDataToStorage(responseData.idToken, responseData.localId, expirationDate);
	};
};

export const signin = (email, password) => {
	return async dispatch => {
		const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${Globals.fbk}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email: email,
				password: password,
				returnSecureToken: true
			})
		});

		if (!response.ok) {
			const errorData = await response.json();
			const errorId = errorData.error.message;

			console.log("IN SIGNIN METHOD");
			console.log(errorData);

			let message = "Something went wrong";
			if (errorId === "EMAIL_NOT_FOUND") {
				message = "Email not found";
			} else if (errorId === "INVALID_PASSWORD") {
				message = "Password is invalid";
			}
			throw new Error(message);
		}

		const responseData = await response.json();
		dispatch(
			authenticate(
				responseData.localId,
				responseData.idToken,
				parseInt(responseData.expiresIn) * 1000
			)
		);
		const futureDate = new Date().getTime() + parseInt(responseData.expiresIn) * 1000;
		const expirationDate = new Date(futureDate);
		saveDataToStorage(responseData.idToken, responseData.localId, expirationDate);
	};
};

export const signout = () => {
	clearSignoutTimer();
	AsyncStorage.removeItem('userData');
	return { type: DEAUTHENTICATE };
};

// call setSignoutTimer when auth session begins
const setSignoutTimer = expirationTime => {
	return dispatch => {
		signoutTimer = setTimeout(() => {
			dispatch(signout());
		}, expirationTime);
	}
};

// timer is only needed when the user is signed in,
// clear time if the user is signed out
const clearSignoutTimer = () => {
	clearTimeout(signoutTimer);
};

// persisting data with AsyncStorage
// the name of this constant can be anything
// the parameters should be the data you want to persist
const saveDataToStorage = (token, userId, expirationDate) => {
	// the item must be in the form of a string, however
	// json.stringify can be used to store an object as a string
	AsyncStorage.setItem('userData', JSON.stringify({
		token,
		userId,
		expirationDate: expirationDate.toISOString()
	}));
}