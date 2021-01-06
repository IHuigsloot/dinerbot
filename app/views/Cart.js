import React from 'react';
import { ScrollView, View } from 'react-native';
import { useTheme, Card, List, Title, Button, Divider, TextInput } from 'react-native-paper';
import axios from 'axios';

import { useCartContext } from '../utils/cartContext';
import { CartList } from '../components/list';
import Header from '../components/header';
import { environment } from '../environment/environment';

export default function Cart({ navigation, route }) {
  const { colors } = useTheme();
  const { deleteItem, cart, total } = useCartContext();
  const [email, setEmail] = React.useState('');
  const [name, setName] = React.useState('');
  const [destination, setDestination] = React.useState();

  const cartItems = cart.map(product => {
    return (
      <CartList
        key={product._id}
        title={product.name}
        count={product.count}
        onPress={() => deleteItem(product)}
      />
    )
  })

  const makeOrder = data => {
    axios.post(`${environment.api_url}/orders`, {
      restaurant: route.params.id,
      products: data.cart.map(item => item._id)
    })
  }

  return (
    <View>
      <Header title={route.params.title} navigation={navigation}></Header>
      <ScrollView>
        <View style={{ marginVertical: 12 }}>
          <Card style={{ marginHorizontal: 6 }}>
            <Card.Title title="Winkelwagen" />
            <Card.Content>
              <List.Section>
                {cartItems}
              </List.Section>
              <Divider />
              <Title style={{marginTop: 10, marginBottom: 10}}>Totaal: €{total}</Title>
              <Divider />
              <Title style={{marginTop: 50, marginBottom: 10}}>Persoonlijke gegevens</Title>
              <TextInput
                mode="outlined"
                label="Naam"
                style={{width: '100%', marginBottom: 20}}
                value={name}
                onChangeText={text => setName(text)} />
              <TextInput
                mode="outlined"
                label="Email"
                style={{width: '100%', marginBottom: 20}}
                value={email}
                onChangeText={text => setEmail(text)} />
              <TextInput
                mode="outlined"
                label="Bestemming"
                style={{width: '100%', marginBottom: 20}}
                value={destination}
                onChangeText={text => setDestination(text)} />
              { cart.length === 0 ? (
                <Button disabled="true" style={{marginTop: 20}} mode="contained" color={colors.accent}>Bestellen</Button>
              ) : (
                <Button style={{marginTop: 20}} mode="contained" color={colors.accent} onPress={() => makeOrder({cart: cart, destination: destination})}>Bestellen</Button>
              )}
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </View>
  )
}