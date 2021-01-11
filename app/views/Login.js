import React, { useState } from 'react';
import { View, StatusBar, Image, StyleSheet } from 'react-native';
import { Button, TextInput, Text, useTheme, HelperText } from 'react-native-paper';

import { useAuthContext } from '../utils/authContext';

export default function Login() {
	const { colors } = useTheme();
	const { signIn } = useAuthContext();

	const [email, setEmail] = useState('');
	const [error, setError] = useState('');

	const handleInput = (value) => {
		setEmail(value);

		const regex = /^\S+@\S+\.\S+$/
		!regex.test(value) ? setError('Voer een geldig email adres in.') : setError('');
	}

	return (
		<View style={styles.container}>
			<StatusBar barStyle="light-content" backgroundColor={colors.primary} />
			<Image style={styles.image} source={require('../img/logo.png')} />
			<Text style={styles.title}>Diner Bot</Text>
			<View style={{justifyContent: 'flex-start'}}>
				<TextInput
					mode="outlined"
					label="Email"
					style={styles.textInput}
					value={email}
					onChangeText={text => handleInput(text)} 
					error={error} />
				<HelperText 
					type='error'
					visible={error}
				>
					{error}
				</HelperText>
			</View>
			{ email && !error ? (
				<Button style={styles.button} mode="contained" color={colors.accent} onPress={() => signIn({ email })}>
					Inloggen
				</Button>
			) : (
				<Button disabled={true} style={styles.button} mode="contained" >
					Inloggen
				</Button>
			)}
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