import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useTheme, Button } from 'react-native-paper';
import axios from 'axios';

import Header from '../components/header';
import { ProductCard } from '../components/card';
import { environment } from '../environment/environment';

import { useCartContext } from '../utils/cartContext';

export default function Products({ navigation, route }) {
  const { colors } = useTheme();
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const { addItem, total, cart } = useCartContext();

  React.useEffect(() => {
    axios.get(`${environment.api_url}/restaurants/${route.params.id}/products`).then(res => {
      setData(res.data);
    }).catch(err => {
      // Temp error handling
      setError(err);
    })
  }, [])

  const products = data.map((product) => {
    const res = cart.find(item => item._id === product._id)
    if (res) {
      return (
        <ProductCard
          key={product._id}
          quantity={res.quantity}
          title={product.name}
          subtitle={product.description}
          price={product.price}
          onPress={() => addItem(product)}
        />
      )
    } else {
      return (
        <ProductCard
          key={product._id}
          title={product.name}
          subtitle={product.description}
          price={product.price}
          onPress={() => addItem(product)}
        />
      )
    }
  })

  return (
    <>
      <Header title={route.params.title} navigation={navigation} />
      <ScrollView>
        <View style={styles.container}>
          {products}
        </View>
      </ScrollView>
      <View>
        {cart.length === 0 ? (
          <Button disabled='true' style={styles.button} icon="cart" mode="contained" color={colors.accent} >
            Winkelwagen
          </Button>
        ) : (
            <Button style={styles.button} icon="cart" mode="contained" color={colors.accent} onPress={() => navigation.navigate('Winkelwagen', { title: route.params.title, id: route.params.id })} >
              Winkelwagen €{total}
            </Button>
          )}
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    marginBottom: 58
  },

  button: {
    borderRadius: 10,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    position: "absolute",
    bottom: 0,
    width: "100%"
  }
})