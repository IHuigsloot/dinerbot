import React from 'react';
import { View } from 'react-native';
import { Button, useTheme } from 'react-native-paper'

import Header from '../components/header';

export default function Login({navigation}) {
	const { colors } = useTheme();

	return (
    <View>
      <Header title="Restaurants" home navigation={navigation} />
			{/* Temporary button */}
      <Button mode="contained" style={{marginTop: 12, marginHorizontal: 6}} color={colors.accent} onPress={() => navigation.navigate('Producten')} >
				Producten
			</Button>
    </View>
  )
}