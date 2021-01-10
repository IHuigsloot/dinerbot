import React from 'react';
import { Title, List, IconButton, Divider } from 'react-native-paper';
import { StyleSheet } from 'react-native';

export function CartList({ title, quantity, onPress }) {
  return (
    <>
      <Divider />
      <List.Item
        title={title}
        titleNumberOfLines={4}
        right={() => <IconButton style={styles.button} color="white" icon="minus" onPress={onPress} />}
        left={() => <Title style={styles.counter}>{quantity}</Title>}
      />
    </>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "red",
    marginVertical: 'auto'
  },

  counter: {
    marginVertical: 'auto',
    marginRight: 5,
    minWidth: 25
  }
})