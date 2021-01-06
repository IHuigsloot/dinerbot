import React from 'react';
import { ScrollView, View } from 'react-native';
import { useCartContext } from '../utils/cartContext';
import { useTheme, Card, List, Title, Button, Divider } from 'react-native-paper';
import { CartList } from '../components/list';
import Header from '../components/header';

export default function Cart({ navigation, route }) {
  const { colors } = useTheme();
  const { deleteItem, cart, total } = useCartContext();

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
              <Title style={{marginTop: 20, marginBottom: 10}}>Totaal: €{total}</Title>
              <Button mode="contained" color={colors.accent} onPress={() => { }}>Bestellen</Button>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </View>
  )
}