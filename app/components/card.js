import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Avatar } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export function RestaurantCard({ title, subtitle, image, navigation, id }) {
  return (
    <Card style={styles.card} onPress={() => { navigation.navigate('Producten', { title, id, image }) }}>
      <Card.Title
        title={title}
        titleStyle={styles.title}
        titleNumberOfLines={2}
        subtitle={subtitle}
        subtitleStyle={styles.subtitle}
        subtitleNumberOfLines={2}
        left={() => <Avatar.Image style={styles.avatar} source={{ uri: image }} size={50} />}
        right={() => <MaterialCommunityIcons name="chevron-right" style={{ marginRight: 16 }} color={"black"} size={30} />}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 6,
    marginBottom: 6,
  },

  button: {
    backgroundColor: "#009688",
    marginRight: 16,
  },

  title: {
    marginLeft: 8
  },

  subtitle: {
    marginBottom: 8,
    marginLeft: 8
  }
})