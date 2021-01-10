import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Avatar, IconButton, Button, useTheme } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export function RestaurantCard({ title, subtitle, image, navigation, id }) {
  return (
    <Card style={styles.card} onPress={() => { navigation.navigate('Producten', { title, id, image }) }}>
      <Card.Title
        title={title}
        titleStyle={styles.title}
        titleNumberOfLines={2}
        subtitle={subtitle}
        subtitleStyle={styles.subtitleRestaurant}
        subtitleNumberOfLines={2}
        left={() => <Avatar.Image style={styles.avatar} source={{ uri: image }} size={50} />}
        right={() => <MaterialCommunityIcons name="chevron-right" style={styles.button} color={"black"} size={30} />}
      />
    </Card>
  );
}

export function ProductCard({title, subtitle, price, quantity, onPress}) {
  const {colors} = useTheme();
  
  return (
    <Card style={styles.card}>
      <Card.Title
        title={title}
        titleNumberOfLines={2}
        subtitle={"€" + price.toFixed(2) + "\n" + subtitle}
        subtitleStyle={styles.subtitleProduct}
        subtitleNumberOfLines={5}
        right={() => 
          quantity ? ( 
            <Button style={styles.quantityButton} mode="contained" icon="plus" color={colors.accent} onPress={onPress} >{quantity}</Button>
          ) : (
            <IconButton style={[{backgroundColor: colors.accent}, styles.button]} color="white" icon="plus" onPress={onPress} />
          )
        }
      />
    </Card>
  )
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 6,
    marginBottom: 6,
  },

  quantityButton: {
    borderRadius: 50,
    marginRight: 16,
  },  

  button: {
    marginRight: 16,
  },

  title: {
    marginLeft: 8
  },

  subtitleProduct: {
    marginBottom: 8
  },

  subtitleRestaurant: {
    marginBottom: 8,
    marginLeft: 8
  },
})