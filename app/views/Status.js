import React from "react";
import axios from "axios";
import { useTheme, Card, Text, List, Title, ActivityIndicator } from "react-native-paper";
import { View, ScrollView, StyleSheet } from "react-native";
const io = require("socket.io-client");

import { environment } from "../environment/environment";

import Header from "../components/header";
import DeliveryMap from "../components/DeliveryMap";

export default function Status({ navigation, route }) {
  const { colors } = useTheme();

  const [total, setTotal] = React.useState(0);
  const [order, setOrder] = React.useState(null);
  const [robot, setRobot] = React.useState(null);

  let socket;

  React.useEffect(() => {
    if (!socket) {
      socket = io(environment.api_url);

      socket.on("connect", () => {
        console.log("connected");
      });

      // Error handlings
      socket.on("error", (error) => {
        console.log(error);
      });

      socket.on("connect_error", (error) => console.log(error));

      socket.on("update", (data) => {
        setOrder(data.order);
        setRobot(data.robot);
      });
    }

    // fallback if socket fails
    fetchStatus();

    return () => {
      console.log("close connection");
      socket.disconnect();
    };
  }, []);

  const fetchStatus = () => {
    axios
      .get(`${environment.api_url}/orders/${route.params.id}`)
      .then((res) => {
        setOrder(res.data);
      });
  };

  React.useEffect(() => {
    if (order) {
      setTotal(
        order.products
          .reduce((prev, product) => prev + product.quantity * product.price, 0)
          .toFixed(2)
      );
    }
  }, [order]);

  const productItems = order?.products.map((product) => {
    return (
      <List.Item
        key={product._id}
        title={product.name}
        left={() => <Title style={styles.counter}>{product.quantity}</Title>}
        right={() => (
          <Title>€{(product.quantity * product.price).toFixed(2)}</Title>
        )}
      />
    );
  });

  return (
    <View>
      <Header title="Status" navigation={navigation} />
      <ScrollView>
        <View style={{ marginTop: 12, marginBottom: 68 }}>
          {order ? (
            <>
              <Card style={{ marginHorizontal: 6 }}>
                <Card.Content>
                  <List.Section>
                    <List.Item
                      title="Bestelling"
                      titleStyle={[styles.title, { color: colors.accent }]}
                    />
                    <List.Item title={"Status: " + order.status} />
                    <List.Item title={"Restaurant: " + order.restaurant.name} />
                    <List.Item
                      title={
                        "Bereidingstijd: " + order.preperationTime + " seconden"
                      }
                    />
                    {order.temperatureHistory.length > 0 ? (
                      <List.Item
                        title={
                          "Order temperatuur: " +
                          order.temperatureHistory[
                            order.temperatureHistory.length - 1
                          ].temperature
                        }
                      />
                    ) : null}
                  </List.Section>
                  <List.Section
                    title="Gegevens gebruiker"
                    titleStyle={[styles.title, { color: colors.accent }]}
                  >
                    <List.Item title={"Naam: " + order.name} />
                    <List.Item title={"Email: " + order.user} />
                  </List.Section>
                  <List.Section
                    title="Producten"
                    titleStyle={[styles.title, { color: colors.accent }]}
                  >
                    {productItems}
                    <List.Item
                      title={<Title>Totaal</Title>}
                      right={() => <Title>€{total}</Title>}
                    />
                  </List.Section>
                </Card.Content>
              </Card>
              <DeliveryMap
                location={robot?.location}
                path={
                  order?.path[1]
                    ? order?.path[1].pathToRestaurant.path
                    : order?.path[0].pathToRestaurant.path
                }
              />
            </>
          ) : (
            <>
              <Card style={{marginHorizontal: 6}} >
                <Card.Content>
                    <ActivityIndicator size='large' animating={true} color={colors.accent} />
                </Card.Content>
              </Card>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },

  counter: {
    marginVertical: "auto",
    marginRight: 5,
    marginLeft: 10,
    minWidth: 25,
  },
});
