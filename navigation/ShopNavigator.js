import React from "react";
import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createDrawerNavigator, DrawerItems } from "react-navigation-drawer";
import { Platform, Button, SafeAreaView, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";

import ProductOverviewScreen from "./../screens/shop/ProductOverviewScreen";
import COLORS from "../constants/Colors";
import ProductDetailScreen from "./../screens/shop/ProductDetailScreen";
import CartScreen from "../screens/shop/CartScreen";
import OrdersScreen from "./../screens/shop/OrdersScreen";
import UserProductsScreen from "./../screens/user/UserProductsScreen";
import EditProductScreen from "./../screens/user/EditProductScreen";
import AuthScreen from "./../screens/user/AuthScreen";
import StartupScreen from "./../screens/StartupScreen";
import * as authActions from "../store/actions/auth";

const defaultNavOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === "android" ? COLORS.primary : ""
  },
  headerTitleStyle: {
    fontFamily: "open-sans-bold"
  },
  headerBackTitleStyle: {
    fontFamily: "open-sans"
  },
  headerTintColor: Platform.OS === "android" ? "white" : COLORS.primary
};

const ProductsNavigator = createStackNavigator(
  {
    ProductsOverview: ProductOverviewScreen,
    ProductDetail: ProductDetailScreen,
    Cart: CartScreen
  },
  {
    navigationOptions: {
      drawerIcon: drawConfig => (
        <Ionicons
          name={Platform.OS === "android" ? "md-cart" : "ios-cart"}
          size={23}
          color={drawConfig.tintColor}
        />
      )
    },
    defaultNavigationOptions: defaultNavOptions
  }
);

const OrdersNavigator = createStackNavigator(
  {
    Orders: OrdersScreen
  },
  {
    // this will not be applied to the screeen of this navigator
    // instead it configured if it is the screen of the other navigator
    navigationOptions: {
      drawerIcon: drawConfig => (
        <Ionicons
          name={Platform.OS === "android" ? "md-list" : "ios-list"}
          size={23}
          color={drawConfig.tintColor}
        />
      )
    },
    defaultNavigationOptions: defaultNavOptions
  }
);

const AdminNavigator = createStackNavigator(
  {
    UserProducts: UserProductsScreen,
    EditProduct: EditProductScreen
  },
  {
    // this will not be applied to the screeen of this navigator
    // instead it configured if it is the screen of the other navigator
    navigationOptions: {
      drawerIcon: drawConfig => (
        <Ionicons
          name={Platform.OS === "android" ? "md-create" : "ios-create"}
          size={23}
          color={drawConfig.tintColor}
        />
      )
    },
    defaultNavigationOptions: defaultNavOptions
  }
);

const ShopNavigator = createDrawerNavigator(
  {
    Products: ProductsNavigator,
    Orders: OrdersNavigator,
    Admin: AdminNavigator
  },
  {
    contentOptions: {
      activeTintColor: COLORS.primary
    },
    // this will allows you to add your own content for the side drawer
    // instead of default
    contentComponent: props => {
      const dispatch = useDispatch();
      return (
        <View style={{ flex: 1, padding: 20 }}>
          <SafeAreaView forceInset={{ top: "always", horizontal: "never" }}>
            <DrawerItems {...props} />
            <Button
              title="Log Out"
              color={COLORS.primary}
              onPress={() => {
                dispatch(authActions.logout());
                // props.navigation.navigate("Auth");
                // no need of above code as same work will already
                // done by code in 'NavigationContainer.js' file
              }}
            />
          </SafeAreaView>
        </View>
      );
    }
  }
);

const AuthNavigator = createStackNavigator(
  {
    Auth: AuthScreen
  },
  {
    defaultNavigationOptions: defaultNavOptions
  }
);

const MainNavigator = createSwitchNavigator({
  Startup: StartupScreen,
  Auth: AuthNavigator,
  Shop: ShopNavigator
});

// export default createAppContainer(ProductsNavigator);
// export default createAppContainer(ShopNavigator);
export default createAppContainer(MainNavigator);
