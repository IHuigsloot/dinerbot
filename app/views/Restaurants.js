import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Card, Text, Title } from 'react-native-paper'
import axios from 'axios';

import Header from '../components/header';
import { RestaurantCard } from '../components/card';
import { environment } from '../environment/environment';

export default function Restaurants({ navigation }) {
  const [data, setData] = useState([]);
  const [error, setError] = useState('');

  React.useEffect(() => {
    axios.get(`${environment.api_url}/restaurants`).then(res => {
      setData(res.data);
    }).catch(err => {
      // Temp error handling
      setError(err);
    })
  }, [])

  const restaurants = data.map(restaurant => {
    return (
      <RestaurantCard
        navigation={navigation}
        key={restaurant._id}
        id={restaurant._id}
        title={restaurant.name}
        subtitle={restaurant.tags.join(', ')}
        image={`${environment.api_url}/restaurants/${restaurant._id}/logo`}
      />
    )
  })

  return (
    <View>
      <Header title="Restaurants" home navigation={navigation} />
      <ScrollView>
        {error ? (
          // Temp error handling
          <Card>
            <Card.Content>
              <Title>Error</Title>
              <Text>Something went wrong.</Text>
            </Card.Content>
          </Card>
        ) : (
            <View style={{ marginVertical: 12 }}>
              {restaurants}
            </View>
          )}
      </ScrollView>
    </View>
  )
}
