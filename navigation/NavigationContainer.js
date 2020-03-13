import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { NavigationActions } from "react-navigation";

import ShopNavigator from "./ShopNavigator";

// sec-11 v-12 8:30 (title : implementing auto logout)
// using this new Navigation b'coz when timeout occur for logout
// it is deleting the data (i.e. token etc) but for navigation it back to
// auth screen we can use ... (watch from the mentioned time)

const NavigationContainer = props => {
  const navRef = useRef();
  const isAuth = useSelector(state => !!state.auth.token);

  useEffect(() => {
    if (!isAuth) {
      navRef.current.dispatch(
        NavigationActions.navigate({ routeName: "Auth" })
      );
    }
  }, [isAuth]);

  return <ShopNavigator ref={navRef} />;
};

export default NavigationContainer;
