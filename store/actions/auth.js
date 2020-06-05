import Globals from '../../constants/Globals';
export const SIGNUP = 'SIGNUP';
export const SIGNIN = 'SIGNIN';

// import globals.js

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

		dispatch({ 
			type: SIGNUP,
			token: responseData.idToken,
			userId: responseData.localId
		});
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
			let message = "Something went wrong";
			if (errorId === "EMAIL_NOT_FOUND") {
				message = "Email not found";
			} else if (error === "INVALID_PASSWORD") {
				message = "Password is invalid";
			}
			throw new Error(message);
		}

		const responseData = await response.json();
		console.log(responseData);

		dispatch({
			type: SIGNIN,
			token: responseData.idToken,
			userId: responseData.localId
		});
	};
};