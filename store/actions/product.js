export const DELETE_PRODUCT = "DELETE_PRODUCT";
export const CREATE_PRODUCT = "CREATE_PRODUCT";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";
export const SET_PRODUCTS = "SET_PRODUCTS";

import Product from "../../models/product";

export const fetchProducts = () => {
  return async (dispatch, getState) => {
    // any async code we want !
    const userId = getState().auth.userId;
    try {
      const response = await fetch(
        "https://rn-shop-app-10f35.firebaseio.com/products.json"
        // {
        //   // it is default so no need to mention it explicitly
        //   // method: "GET"
        // }
      );

      if (!response.ok) {
        throw new Error("something went wrong!");
      }

      const resData = await response.json();
      const loadedProducts = [];

      for (const key in resData) {
        loadedProducts.push(
          new Product(
            key,
            // "u1",
            resData[key].ownerId,
            resData[key].title,
            resData[key].imageUrl,
            resData[key].description,
            resData[key].price
          )
        );
      }

      dispatch({
        type: SET_PRODUCTS,
        products: loadedProducts,
        userProducts: loadedProducts.filter(prod => prod.ownerId === userId)
      });
    } catch (err) {
      // send to custom analytics server
      throw err;
    }
  };
};

export const deleteProduct = productId => {
  // return async dispatch => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      // `https://rn-shop-app-10f35.firebaseio.com/products/${productId}.json`,
      `https://rn-shop-app-10f35.firebaseio.com/products/${productId}.json?auth=${token}`,

      {
        method: "DELETE"
      }
    );

    if (!response.ok) {
      throw new Error("something went wrong !");
    }

    dispatch({ type: DELETE_PRODUCT, pid: productId });
  };
  // return { type: DELETE_PRODUCT, pid: productId };
};

export const createProduct = (title, description, imageUrl, price) => {
  // now using reduxthunk returning a fn sec-10 v-4
  // return {
  //   type: CREATE_PRODUCT,
  //   productData: {
  //     title,
  //     description,
  //     imageUrl,
  //     price
  //   }
  // };

  // return async dispatch => {
  return async (dispatch, getState) => {
    // any async code we want !
    const token = getState().auth.token;
    const userId = getState().auth.userId;

    const response = await fetch(
      // "https://rn-shop-app-10f35.firebaseio.com/products.json",
      `https://rn-shop-app-10f35.firebaseio.com/products.json?auth=${token}`,
      {
        method: "POST",
        header: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          description,
          imageUrl,
          price,
          // for mapping of orders to users
          ownerId: userId
        })
      }
    );

    const resData = await response.json();
    // console.log(resData);

    dispatch({
      type: CREATE_PRODUCT,
      productData: {
        id: resData.name, // forwarding server generated product id
        title,
        description,
        imageUrl,
        price,
        // for mapping of orders to users
        ownerId: userId
      }
    });
  };
};

export const updateProduct = (id, title, description, imageUrl) => {
  // return {
  //   type: UPDATE_PRODUCT,
  //   pid: id,
  //   productData: {
  //     title,
  //     description,
  //     imageUrl
  //   }
  // };

  // return async dispatch => {
  return async (dispatch, getState) => {
    // console.log(getState()); //we get access to redux store using 'redux-thunk'
    const token = getState().auth.token;
    const response = await fetch(
      // `https://rn-shop-app-10f35.firebaseio.com/products/${id}.json`,
      // Real-time authentication (appending token with req)
      `https://rn-shop-app-10f35.firebaseio.com/products/${id}.json?auth=${token}`,
      {
        method: "PATCH", // PATCH - update the data while ; PUT - 'OVERWRITE'
        header: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          description,
          imageUrl
        })
      }
    );

    if (!response.ok) {
      throw new Error("something went wrong !");
    }

    dispatch({
      type: UPDATE_PRODUCT,
      pid: id,
      productData: {
        title,
        description,
        imageUrl
      }
    });
  };
};
