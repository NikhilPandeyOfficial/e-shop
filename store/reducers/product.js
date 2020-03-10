import PRODUCTS from "./../../data/dummy-data.js";
import {
  DELETE_PRODUCT,
  CREATE_PRODUCT,
  UPDATE_PRODUCT,
  SET_PRODUCTS
} from "./../actions/product";
import Product from "../../models/product";

const initialState = {
  availableProducts: PRODUCTS,
  userProducts: PRODUCTS.filter(prod => prod.ownerId === "u1")
};

let count = 11;

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_PRODUCTS:
      return {
        availableProducts: action.products,
        userProducts: action.products.filter(prod => prod.ownerId === "u1")
      };
    case CREATE_PRODUCT:
      // console.log(action.productData);
      const newProduct = new Product(
        // "p" + count, no need sec-10 v-4
        action.productData.id,
        "u1",
        action.productData.title,
        action.productData.imageUrl,
        action.productData.description,
        action.productData.price
      );
      count += 1;
      return {
        ...state,
        availableProducts: state.availableProducts.concat(newProduct),
        userProducts: state.userProducts.concat(newProduct)
      };

    case UPDATE_PRODUCT:
      const productInd = state.userProducts.findIndex(
        prod => prod.id === action.pid
      );
      const updatedProduct = new Product(
        action.id,
        state.userProducts[productInd].ownerId,
        action.productData.title,
        action.productData.imageUrl,
        action.productData.description,
        state.userProducts[productInd].price
      );
      const updatedUserProducts = [...state.userProducts];
      updatedUserProducts[productInd] = updatedProduct;

      const availableProductInd = state.availableProducts.findIndex(
        prod => prod.id === action.pid
      );
      const updatedAvailableProducts = [...state.availableProducts];
      updatedAvailableProducts[availableProductInd] = updatedProduct;
      return {
        ...state,
        userProducts: updatedAvailableProducts,
        userProducts: updatedUserProducts
      };

    case DELETE_PRODUCT:
      return {
        ...state,
        userProducts: state.userProducts.filter(
          product => product.id !== action.pid
        ),
        availableProducts: state.availableProducts.filter(
          product => product.id !== action.pid
        )
      };
  }
  return state;
};
