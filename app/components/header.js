import React from 'react';
import { StatusBar } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';

import PopoverMenu from './popoverMenu';
import { useCartContext } from '../utils/cartContext';

export default function Header({ title, home, navigation, clear }) {
	const { colors } = useTheme();
	const { clearCart } = useCartContext();

	const goBack = () => {
		clearCart();
		navigation.goBack();
	}

	return (
		<Appbar.Header dark="true" statusBarHeight={0} style={{ backgroundColor: colors.primary }}>
			<StatusBar barStyle="light-content" backgroundColor={colors.primary} />
			{home == null ?
				clear ?
					<Appbar.BackAction onPress={() => goBack()} /> :
					<Appbar.BackAction onPress={() => navigation.goBack()} /> : 
				null
			}
			<Appbar.Content title={title} />
			<PopoverMenu />
		</Appbar.Header>
	);
}