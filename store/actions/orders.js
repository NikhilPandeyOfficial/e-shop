import Order from "./../../models/order";

export const ADD_ORDER = "ADD_ORDER";
export const SET_ORDERS = "SET_ORDERS";

export const addOrder = (cartItems, totalAmount) => {
  // return async dispatch => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    const date = new Date();
    const response = await fetch(
      // `https://rn-shop-app-10f35.firebaseio.com/orders/u1.json`,
      `https://rn-shop-app-10f35.firebaseio.com/orders/${userId}.json?auth=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          cartItems,
          totalAmount,
          date: date.toISOString()
        })
      }
    );

    if (!response.ok) {
      throw new Error("An error occured !");
    }

    const resData = await response.json();

    dispatch({
      type: ADD_ORDER,
      orderData: {
        id: resData.name,
        items: cartItems,
        amount: totalAmount,
        date: date
      }
    });
  };

  // return {
  //   type: ADD_ORDER,
  //   orderData: { items: cartItems, amount: totalAmount }
  // };
};

export const fetchOrders = () => {
  // return async dispatch => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    try {
      const response = await fetch(
        // "https://rn-shop-app-10f35.firebaseio.com/orders/u1.json"
        `https://rn-shop-app-10f35.firebaseio.com/orders/${userId}.json`
        // {
        //   // it is default so no need to mention it explicitly
        //   // method: "GET"
        // }
      );

      if (!response.ok) {
        throw new Error("something went wrong!");
      }

      const resData = await response.json();
      const loadedOrders = [];

      for (const key in resData) {
        loadedOrders.push(
          new Order(
            key,
            resData[key].cartItems,
            resData[key].totalAmount,
            new Date(resData[key].date)
          )
        );
      }

      dispatch({ type: SET_ORDERS, orders: loadedOrders });
    } catch (err) {
      // send to custom analytics server
      throw err;
    }

    // dispatch({ type: SET_ORDERS, orders: [] });
  };
};
