import React from 'react';
import axios from 'axios';
import { Button, IconButton, useTheme, Card, Text, List, Title } from 'react-native-paper';
import { View, ScrollView, StyleSheet } from 'react-native';
import Header from '../components/header';
import { environment } from '../environment/environment';


export default function Status({ navigation, route }) {
  const { colors } = useTheme();
  const [status, setStatus] = React.useState('');
  const [products, setProducts] = React.useState([]);
  const [temperature, setTemperature] = React.useState([
    { temperature: 25.3 }
  ]);
  const [restaurant, setRestaurant] = React.useState('');
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [preperationTime, setPreperationTime] = React.useState(20);
  const [total, setTotal] = React.useState(0);

  React.useEffect(() => {
    fetchStatus();
  }, [])

  React.useEffect(() => {
    setTotal(products.reduce((prev, product) => prev + (product.quantity * product.price), 0).toFixed(2));
  }, [products])

  const fetchStatus = () => {
    axios.get(`${environment.api_url}/orders/${route.params.id}`).then(res => {
      console.log(res.data);
      setStatus(res.data.status);
      setProducts(res.data.products);
      setRestaurant(res.data.restaurant.name);
      setName(res.data.name);
      setEmail(res.data.user);

      setTemperature(res.data.temperatureHistory);
      setPreperationTime(res.data.preperationTime);
    })
  }

  const productItems = products.map(product => {
    return (
      <List.Item
        key={product._id}
        title={product.name}
        left={() => <Title style={styles.counter}>{product.quantity}</Title>}
        right={() => <Title>€{(product.quantity * product.price).toFixed(2)}</Title>}
      />
    )
  })

  return (
    <View>
      <Header title="Status" navigation={navigation} />
      <ScrollView>
        <View style={{ marginHorizontal: 6, marginTop: 12, marginBottom: 68 }}>
          <Card>
            <Card.Content>
              <List.Section >
                <List.Item 
                  title="Bestelling" 
                  titleStyle={[styles.title, {color: colors.accent}]}
                  right={() => <IconButton icon="restart" color="white" style={{backgroundColor: colors.accent}} onPress={() => fetchStatus()} />} />
                <List.Item title={'Status: ' + status} />
                <List.Item title={'Restaurant: ' + restaurant} />
                <List.Item title={'Bereidingstijd: ' + preperationTime + ' seconden'} />
                {temperature.length > 0 ? 
                  <List.Item title={'Order temperatuur: ' + temperature[temperature.length - 1].temperature} />
                 : (
                  null
                )}
              </List.Section>
              <List.Section title="Gegevens gebruiker" titleStyle={[styles.title, {color: colors.accent}]} >
                <List.Item title={'Naam: ' + name} />
                <List.Item title={'Email: ' + email} />
              </List.Section>
              <List.Section title="Producten" titleStyle={[styles.title, {color: colors.accent}]} >
                {productItems}
                <List.Item 
                  title={<Title>Totaal</Title>} 
                  right={() => <Title>€{total}</Title>}  
                />
              </List.Section>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold"
  },

  counter: {
    marginVertical: 'auto',
    marginRight: 5,
    marginLeft: 10,
    minWidth: 25
  }
})