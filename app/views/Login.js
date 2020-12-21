import React, { useState } from 'react';
import { View, StatusBar, Image, StyleSheet } from 'react-native';
import { Button, TextInput, Text, useTheme } from 'react-native-paper';

import { useAuthContext } from '../utils/authContext';

export default function Login() {
	const { colors } = useTheme();
	const { signIn } = useAuthContext();

	const [email, setEmail] = useState('');

	return (
		<View style={styles.container}>
			<StatusBar barStyle="light-content" backgroundColor={colors.primary} />
			<Image style={styles.image} source={require('../img/logo.png')} />
			<Text style={styles.title}>Diner Bot</Text>
			<TextInput
				mode="outlined"
				label="Email"
				style={styles.textInput}
				value={email}
				onChangeText={text => setEmail(text)} />
			<Button
				style={styles.button}
				mode="contained"
				color={colors.accent}
				onPress={() => signIn({ email })}>
				Inloggen
			</Button>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: 'center'
	},

	image: {
		width: 150,
		height: 150
	},

	title: {
		fontSize: 34,
		marginTop: 10,
		fontWeight: "bold"
	},

	textInput: {
		width: 300,
		marginTop: 50
	},

	button: {
		width: 120,
		borderRadius: 10,
		marginTop: 30
	}
})