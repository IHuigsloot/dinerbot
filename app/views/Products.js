import React from 'react';
import { View } from 'react-native';
import { useTheme } from 'react-native-paper';

import Header from '../components/header';

export default function Products({ navigation }) {
	const { colors } = useTheme();

  return (
    <View>
      <Header title="Producten" navigation={navigation} />
    </View>
  )
}