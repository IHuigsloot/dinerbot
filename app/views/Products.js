import React from 'react';
import { View } from 'react-native';

import Header from '../components/header';

export default function Login({ navigation }) {
	const { colors } = useTheme();

  return (
    <View>
      <Header title="Producten" navigation={navigation} />
    </View>
  )
}