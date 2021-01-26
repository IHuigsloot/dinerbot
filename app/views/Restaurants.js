import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Card, Text, Title, ActivityIndicator, useTheme } from 'react-native-paper'
import axios from 'axios';

import Header from '../components/header';
import { RestaurantCard } from '../components/card';
import { environment } from '../environment/environment';

export default function Restaurants({ navigation }) {
  const {colors} = useTheme();
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    axios.get(`${environment.api_url}/restaurants`).then(res => {
      setData(res.data);
      setLoading(false);
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
        {!loading ? (
          <View style={{ marginVertical: 12 }}>
            {restaurants}
          </View>
        ) : (
          <Card style={{marginTop: 12, marginHorizontal: 6}} >
            <Card.Content>
              <ActivityIndicator animating={true} color={colors.accent} />
            </Card.Content>
          </Card>
        )}
      </ScrollView>
    </View>
  )
}
