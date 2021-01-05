import React from 'react';
import { Title, List, IconButton } from 'react-native-paper';
import { StyleSheet } from 'react-native';

export function CartList({title, count, onPress}) {
  return (
    <List.Item 
      title={title}
      titleNumberOfLines={4}
      right={() => <IconButton style={styles.button} color="white" icon="minus" onPress={onPress} />}
      left={() => <Title style={styles.counter}>{count}</Title>} 
    />
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