import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  Button,
  Alert,
  StyleSheet
} from "react-native";
import { useSelector } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useDispatch } from "react-redux";

import COLORS from "../../constants/Colors";
import ProductItem from "../../components/shop/ProductItem";
import HeaderButton from "../../components/UI/HeaderButton";
import * as productsActions from "../../store/actions/product";

const UserProductsScreen = props => {
  const [Loading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const userProducts = useSelector(state => state.products.userProducts);
  const dispatch = useDispatch();

  const editProductHandler = id => {
    props.navigation.navigate("EditProduct", { productId: id });
    console.log(id);
  };

  const deleteServerHandler = async id => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(productsActions.deleteProduct(id));
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  };

  const deleteHandler = id => {
    Alert.alert("Are you sure?", "Do you really want to delete this item?", [
      { text: "No", style: "default" },
      {
        text: "Yes",
        style: "destructive",
        onPress: deleteServerHandler.bind(this, id)
      }
    ]);
  };

  useEffect(() => {
    if (error) {
      Alert.alert("An error occurred !", error, [{ text: "Okay" }]);
    }
  }, [error]);

  if (Loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={COLORS.primary} size="large" />
      </View>
    );
  }

  console.log(userProducts);

  if (userProducts.length === 0) {
    return (
      <View style={styles.centered}>
        <Text> No Product Found, maybe start adding some !!!</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={userProducts}
      keyExtractor={item => item.id}
      renderItem={itemData => (
        <ProductItem
          image={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}
          //   onViewDetail={() => {}}
          onSelect={() => {
            editProductHandler(itemData.item.id);
          }}
          onAddToCart={() => {}}
        >
          <Button
            color={COLORS.primary}
            title="Edit"
            onPress={() => {
              editProductHandler(itemData.item.id);
            }}
          />
          <Button
            color={COLORS.primary}
            title="Delete"
            // onPress={() => {
            //   dispatch(productsActions.deleteProduct(itemData.item.id));
            // }}

            /* using unnamed fn instead of direct pointing bcoz
             * we need to pass the item's id */
            // ========*** Ist way ***======
            // onPress={() => {
            //   deleteHandler(itemData.item.id)
            // }}

            //========*** IInd way ***========
            onPress={deleteHandler.bind(this, itemData.item.id)}
          />
        </ProductItem>
      )}
    />
  );
};

UserProductsScreen.navigationOptions = navData => {
  return {
    headerTitle: "Your Products",
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"}
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Add"
          iconName={Platform.OS === "android" ? "md-create" : "ios-create"}
          onPress={() => {
            navData.navigation.navigate("EditProduct");
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

export default UserProductsScreen;
