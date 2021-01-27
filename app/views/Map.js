import React from 'react';
import { View } from 'react-native';

import Header from '../components/header';
import DeliveryMap from '../components/DeliveryMap';

export default function Map() {
  return (
    <View>
      <Header title="Map" home />
      <DeliveryMap destinations />
    </View>
  )
}
