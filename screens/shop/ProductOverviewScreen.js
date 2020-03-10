import React, { useCallback, useState, useEffect } from "react";
import {
  Text,
  FlatList,
  Button,
  ActivityIndicator,
  StyleSheet,
  View
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import ProductItem from "../../components/shop/ProductItem";
import * as cartActions from "../../store/actions/cart";
import * as productsActions from "../../store/actions/product";
import HeaderButton from "../../components/UI/HeaderButton";
import COLORS from "../../constants/Colors";

const ProductOverviewScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");
  const products = useSelector(state => state.products.availableProducts);
  const dispatch = useDispatch();

  const loadProducts = useCallback(async () => {
    setError(null); // reseting this so whenever 'try again' clicked spinner shown then error displayed
    // setIsLoading(true);
    setIsRefreshing(true);
    try {
      await dispatch(productsActions.fetchProducts());
    } catch (err) {
      setError(err.message);
    }
    // setIsLoading(false);
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    const willFocusSub = props.navigation.addListener(
      "willFocus",
      loadProducts
    );
    return () => {
      willFocusSub.remove();
    };
  }, [loadProducts]);

  useEffect(() => {
    setIsLoading(true);
    loadProducts().then(() => setIsLoading(false));
  }, [dispatch, loadProducts]);

  const selectItemHandler = (id, title) => {
    props.navigation.navigate("ProductDetail", {
      productId: id,
      productTitle: title
    });
  };

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>An error occurred !</Text>
        <Button
          title="Try again"
          color={COLORS.primary}
          onPress={loadProducts}
        />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!isLoading && products.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No products found. Maybe start adding some!</Text>
      </View>
    );
  }

  return (
    <FlatList
      onRefresh={loadProducts}
      refreshing={isRefreshing} // this is must for 'pull to refresh' feature
      data={products}
      //for older versions of Flatlist
      // keyExtractor={item => item.id}
      renderItem={itemData => (
        <ProductItem
          image={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}
          // onViewDetail={() => {
          //   props.navigation.navigate({
          //     routeName: "ProductDetail",
          //     params: {
          //       productId: itemData.item.id,
          //       productTitle: itemData.item.title
          //     }
          //   });
          // }}
          onSelect={() =>
            selectItemHandler(itemData.item.id, itemData.item.title)
          }
          // onAddToCart={() => {
          //   dispatch(cartActions.addToCart(itemData.item));
          // }}
        >
          {/* changes w.r.t. sec-8 video-20 w.r.t. ProductItem.js file*/}

          <Button
            color={COLORS.primary}
            title="View Details"
            // onPress={props.onViewDetail}
            onPress={() =>
              selectItemHandler(itemData.item.id, itemData.item.title)
            }
          />
          <Button
            color={COLORS.primary}
            title="To Cart"
            // onPress={props.onAddToCart}
            onPress={() => {
              dispatch(cartActions.addToCart(itemData.item));
            }}
          />
        </ProductItem>
      )}
    />
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

// ProductOverviewScreen.navigationOptions = {
//   headerTitle: "All Products",
//   headerRight: () => (
//     <HeaderButtons HeaderButtonComponent={HeaderButton}>
//       <Item
//         title="Cart"
//         iconName={Platform.OS === "android" ? "md-cart" : "ios-cart"}
//         onPress={() => {}}
//       />
//     </HeaderButtons>
//   )
// };

ProductOverviewScreen.navigationOptions = navData => {
  return {
    headerTitle: "All Products",
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
    ),
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Cart"
          iconName={Platform.OS === "android" ? "md-cart" : "ios-cart"}
          onPress={() => {
            navData.navigation.navigate("Cart");
          }}
        />
      </HeaderButtons>
    )
  };
};

export default ProductOverviewScreen;
