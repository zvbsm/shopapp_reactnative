import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { NavigationActions } from 'react-navigation';

import ShopNavigator from './ShopNavigator';

const NavigationContainer = props => {
	// useRef establishes a connection between the navRef constant and the component
	// props.navigation.navigate is only accessible within the components rendered
	// by ShopNavigator. To get access to it from here, a 'ref' needs to be provided
	// this will allow to directly access an element rendered with jsx
	const navigationRef = useRef();
	// !! forces true/false value
	// used when not concerned about the actual value, just checking that it exists
	const isAuth = useSelector(state => !!state.auth.token);

	useEffect(() => {
		if (!isAuth) {
			// the ShopNavigator component provides the dispatch method wich allows
			// for triggering the navigation actions (e.g. navigate to home page)
			navigationRef.current.dispatch(
				NavigationActions.navigate({
					routeName: 'Auth'
				})
			);
		}
	}, [isAuth]);
	return <ShopNavigator ref={navigationRef}/>;
};

export default NavigationContainer;