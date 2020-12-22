import React from 'react';
import { StatusBar } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';

import PopoverMenu from './popoverMenu';

export default function Header({ title, home, navigation }) {
	const { colors } = useTheme();

	return (
		<Appbar.Header dark="true" statusBarHeight={0} style={{ backgroundColor: colors.primary }}>
			<StatusBar barStyle="light-content" backgroundColor={colors.primary} />
			{home == null ? (
				<Appbar.BackAction onPress={() => navigation.goBack()} />
				) : (
					null
				)
			}
			<Appbar.Content title={title} />
			<PopoverMenu />
		</Appbar.Header>
	);
}