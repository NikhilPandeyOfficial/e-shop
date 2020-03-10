import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Button,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform
} from "react-native";
// import COLORS from "../../constants/Colors";

import Card from "./../UI/Card";

const ProductItem = props => {
  let TouchableCmp = TouchableOpacity;

  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }

  return (
    <Card style={styles.product}>
      <TouchableCmp
        onPress={/*props.onViewDetail*/ props.onSelect}
        useForeground
      >
        <View>
          <Image style={styles.image} source={{ uri: props.image }} />
          <View style={styles.details}>
            <Text style={styles.title}>{props.title}</Text>
            <Text style={styles.price}>${props.price.toFixed(2)}</Text>
          </View>
          <View style={styles.actions}>
            {/* sec-8 video-20 reorganisation of this component
             in order to make it more general
            <Button
              color={COLORS.primary}
              title="View Details"
              onPress={props.onViewDetail}
            />
            <Button
              color={COLORS.primary}
              title="To Cart"
              onPress={props.onAddToCart}
            />*/}

            {props.children}
          </View>
        </View>
      </TouchableCmp>
    </Card>
  );
};

const styles = StyleSheet.create({
  product: {
    // shadowColor: "black",
    // shadowOpacity: 0.26,
    // shadowOffset: { width: 0, height: 2 },
    // shadowRadius: 8,
    // elevation: 5,
    // borderRadius: 10,
    // backgroundColor: "white",
    height: 300,
    margin: 20,
    overflow: "hidden"
  },
  image: {
    width: "100%",
    height: "60%"
  },
  details: {
    alignItems: "center",
    height: "17%",
    padding: 10
  },
  title: {
    fontFamily: "open-sans-bold",
    fontSize: 18,
    marginVertical: 2
  },
  price: {
    fontFamily: "open-sans",
    fontSize: 14,
    color: "#888"
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: "23%",
    paddingHorizontal: 20
  }
});

export default ProductItem;
