import React, { useState, useEffect, useCallback } from "react";
import {
  FlatList,
  Text,
  Platform,
  StyleSheet,
  View,
  ActivityIndicator
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import HeaderButton from "../../components/UI/HeaderButton";
import COLORS from "../../constants/Colors";
import OrderItem from "./../../components/shop/OrderItem";
import * as ordersActions from "../../store/actions/orders";

const OrdersScreen = props => {
  const [Loading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const orders = useSelector(state => state.orders.orders);
  // console.log(orders[0].readableDate());

  const dispatch = useDispatch();
  const loadOrders = useCallback(() => {
    setError(null);
    setIsLoading(true);
    dispatch(ordersActions.fetchOrders())
      .then(() => {
        setIsLoading(false);
      })
      .catch(err => {
        console.log("error ");
        setError(err.message);
      });
  }, [dispatch, setError, setIsLoading]);

  useEffect(() => {
    loadOrders();
  }, [dispatch, loadOrders]);

  if (error) {
    return (
      <View style={styles.centered}>
        <Text> An Error Ocurred! </Text>
      </View>
    );
  }
  if (Loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <FlatList
      data={orders}
      renderItem={itemData => (
        <OrderItem
          amount={itemData.item.totalAmount}
          date={itemData.item.readableDate}
          items={itemData.item.items}
        />
      )}
    />
  );
};

OrdersScreen.navigationOptions = navData => {
  return {
    headerTitle: "Your Orders",
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"}
          onPress={() => {
            // toggle side drawer on the screen
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    )
  };
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

export default OrdersScreen;
