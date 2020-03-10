import React from "react";
import {
  View,
  Text,
  Image,
  Button,
  StyleSheet,
  ScrollView
} from "react-native";
import { useSelector, useDispatch } from "react-redux";

import * as cartActions from "../../store/actions/cart";
import COLORS from "../../constants/Colors";

const ProductDetailScreen = props => {
  const productId = props.navigation.getParam("productId");
  const selectedProduct = useSelector(state =>
    state.products.availableProducts.find(prod => prod.id === productId)
  );

  const dispatch = useDispatch();

  return (
    <ScrollView>
      <Image style={styles.image} source={{ uri: selectedProduct.imageUrl }} />
      <View style={styles.actions}>
        <Button
          color={COLORS.primary}
          title="Add to Cart"
          onPress={() => {
            dispatch(cartActions.addToCart(selectedProduct));
          }}
        />
      </View>
      <Text style={styles.price}>${selectedProduct.price.toFixed(2)}</Text>
      <Text style={styles.description}>{selectedProduct.description}</Text>
    </ScrollView>
  );
};

ProductDetailScreen.navigationOptions = navData => {
  return {
    headerTitle: navData.navigation.getParam("productTitle")
  };
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 300
  },
  price: {
    fontSize: 20,
    color: "#888",
    textAlign: "center",
    marginVertical: 20,
    fontFamily: "open-sans-bold"
  },
  actions: {
    marginVertical: 10,
    alignItems: "center"
  },
  description: {
    fontFamily: "open-sans",
    fontSize: 14,
    textAlign: "center",
    marginHorizontal: 20
  }
});

export default ProductDetailScreen;
