import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  ActivityIndicator
} from "react-native";
import { useSelector, useDispatch } from "react-redux";

import COLORS from "../../constants/Colors";
import CartItem from "../../components/shop/CartItem";
import * as cartActions from "../../store/actions/cart";
import * as ordersActions from "../../store/actions/orders";

const CartScreen = () => {
  const [Loading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const cartTotalAmount = useSelector(state => state.cart.totalAmount);
  const cartItems = useSelector(state => {
    const transformedCartItems = [];
    // console.log(state.cart.items);
    for (const key in state.cart.items) {
      transformedCartItems.push({
        productId: key,
        productTitle: state.cart.items[key].productTitle,
        productPrice: state.cart.items[key].productPrice,
        quantity: state.cart.items[key].quantity,
        sum: state.cart.items[key].sum
      });
    }
    return transformedCartItems;
  });
  const dispatch = useDispatch();

  const sendOrderHandler = async () => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(ordersActions.addOrder(cartItems, cartTotalAmount));
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.summary}>
        <Text style={styles.summaryText}>
          Total:{" "}
          <Text style={styles.amount}>
            {Math.round(cartTotalAmount.toFixed(2) * 100) / 100}
          </Text>
        </Text>
        {Loading ? (
          <ActivityIndicator size="small" color={COLORS.primary} />
        ) : (
          <Button
            color={COLORS.accent}
            title="Order Now"
            disabled={cartItems.length === 0}
            // onPress={() => {
            //   dispatch(ordersActions.addOrder(cartItems, cartTotalAmount));
            // }}
            onPress={sendOrderHandler}
          />
        )}
      </View>
      <FlatList
        data={cartItems}
        keyExtractor={item => item.productId}
        renderItem={itemData => (
          <CartItem
            quantity={itemData.item.quantity}
            title={itemData.item.productTitle}
            amount={itemData.item.sum}
            deletable
            onRemove={() => {
              dispatch(cartActions.removeFromCart(itemData.item.productId));
            }}
          />
        )}
      />
    </View>
  );
};

CartScreen.navigationOptions = {
  headerTitle: "Cart"
};

const styles = StyleSheet.create({
  screen: {
    margin: 20
  },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    padding: 10,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: "white"
  },
  summaryText: {
    fontFamily: "open-sans-bold",
    fontSize: 18
  },
  amount: {
    color: COLORS.primary
  }
});

export default CartScreen;
