import React, { useState, useCallback, useEffect, useReducer } from "react";
import {
  View,
  TextInput,
  ScrollView,
  Text,
  StyleSheet,
  Platform,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useSelector, useDispatch } from "react-redux";

import HeaderButton from "../../components/UI/HeaderButton";
import * as productsActions from "../../store/actions/product";
import Input from "./../../components/UI/Input";
import COLORS from "../../constants/Colors";

const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE";

// build-in is outside to avoid un-necessary re-builds
const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value
    };

    const updatedValidites = {
      ...state.inputValidites,
      [action.input]: action.isValid
    };

    let updatedFormIsValid = true;
    for (const key in updatedValidites) {
      updatedFormIsValid = updatedFormIsValid && updatedValidites[key];
    }

    return {
      // ...state,
      formIsValid: updatedFormIsValid,
      inputValidites: updatedValidites,
      inputValues: updatedValues
    };
  }
};

const EditProductScreen = props => {
  const [error, setError] = useState();
  const [Loading, setIsLoading] = useState(false);
  const productId = props.navigation.getParam("productId");
  const editedProduct = useSelector(state =>
    state.products.userProducts.find(prod => prod.id === productId)
  );

  // ==== complex form handling using 'useReducer'
  // return arr of 2 elements arr[0] contains updated state and arr[1] dispatching fn on actions
  // containargs - reducer fn, initial state,
  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      title: editedProduct ? editedProduct.title : "",
      imageUrl: editedProduct ? editedProduct.imageUrl : "",
      description: editedProduct ? editedProduct.description : "",
      price: ""
    },
    inputValidites: {
      title: editedProduct ? true : false,
      imageUrl: editedProduct ? true : false,
      description: editedProduct ? true : false,
      price: editedProduct ? true : false
    },
    formIsValid: editedProduct ? true : false
  });

  // const [title, setTitle] = useState(editedProduct ? editedProduct.title : "");
  // const [titleIsValid, setTitleIsValid] = useState(false);
  // const [imageUrl, setImageUrl] = useState(
  //   editedProduct ? editedProduct.imageUrl : ""
  // );
  // const [price, setPrice] = useState("");
  // const [description, setDescription] = useState(
  //   editedProduct ? editedProduct.description : ""
  // );

  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      Alert.alert("An error occurred !", error, [{ text: "Okay" }]);
    }
  }, [error]);

  const submitHandler = useCallback(async () => {
    // if (!titleIsValid) {
    // if(!formState.inputValidites.title){ check for title only in case of using 'useReducer'
    if (!formState.formIsValid) {
      Alert.alert("Wrong Input!", "Please check the errors in the form", [
        { text: "Ok" }
      ]);
      return;
    }

    // in order to work of following 'dispatches'; we added just below line
    const { title, description, imageUrl, price } = formState.inputValues;
    setError(null);
    setIsLoading(true);
    try {
      if (editedProduct) {
        await dispatch(
          productsActions.updateProduct(productId, title, description, imageUrl)
        );
      } else {
        await dispatch(
          productsActions.createProduct(title, description, imageUrl, +price)
        );
      }
      props.navigation.goBack(); // navigating back only when create & update is successful
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
    // props.navigation.goBack();

    // titleIsvalid should be added to the dependency array if not then function will not rebuilt and we'll
    // not be able to submit the form (sec-9 video-4)
    // }, [dispatch, productId, title, description, imageUrl, price, titleIsValid]);
  }, [dispatch, productId, formState.inputValues]);

  // way to sending handler function to the navigationOptions
  useEffect(() => {
    props.navigation.setParams({ submit: submitHandler });
  }, [submitHandler]);

  // const titleChangeHandler = text => {
  //   // text validation is upto you, you can use minlength, maxlength or regex
  //   if (text.trim().length === 0) {
  //     setTitleIsValid(false);
  //   } else {
  //     setTitleIsValid(true);
  //   }
  //   setTitle(text);
  // };

  // ========= sec-9 video-7 (cmmnting after using UI/Input.js file) ======
  // const textChangeHandler = (inputIdentifier, text) => {
  //   let isValid = false;
  //   if (text.trim().length > 0) {
  //     isValid = true;
  //   }
  //   dispatchFormState({
  //     type: FORM_INPUT_UPDATE,
  //     value: text,
  //     isValid: isValid,
  //     // input: "title" // this key should be same as in useReducer
  //     input: inputIdentifier
  //   });
  // };

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier
      });
    },
    [dispatchFormState]
  );

  if (Loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={COLORS.primary} size="large" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 /*important otherwise it won't work */ }}
      behavior="padding"
      keyboardVerticalOffset={100}
    >
      <ScrollView>
        <View style={styles.form}>
          {/*
        ======= Moved to UI/Input.js =====
        <View style={styles.formControl}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            // value={title}
            value={formState.inputValues.title}
            // onChangeText={text => setTitle(text)}
            //                        text arg will automatically passed to textChangeHandler
            onChangeText={textChangeHandler.bind(this, "title")}
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect
            returnKeyType="next" // Determines how the return key should look
            onEndEditing={() => console.log("editing done")}
            onSubmitEditing={() => console.log("submiting done")}
          />
          {!formState.inputValues.title && (
            <Text>Please enter a valid Title</Text>
          )}
        </View> */}

          <Input
            id="title"
            label="Title"
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect
            returnKeyType="next"
            // we'll not use '.bind' bcoz even using this with 'useEffect'
            // we're ending with enoromous rendering of component hence we're using
            // 'id' hack/passing id as param so we can use in Input component
            // onInputChange={inputChangeHandler.bind(this, "title")}
            onInputChange={inputChangeHandler}
            errorText="Please enter a valid title"
            initialValue={editedProduct ? editedProduct.title : ""}
            initiallyValid={!!editedProduct}
          />

          {/*<View style={styles.formControl}>
          <Text style={styles.label}>Image Url</Text>
          <TextInput
            style={styles.input}
            // value={imageUrl}
            value={formState.inputValues.imageUrl}
            // onChangeText={text => setImageUrl(text)}
            onChangeText={textChangeHandler.bind(this, "imageUrl")}
            returnKeyType="next"
          />
        </View>*/}

          <Input
            id="imageUrl"
            label="Image Url"
            keyboardType="default"
            returnKeyType="next"
            errorText="Please enter a valid image url!"
            // onInputChange={inputChangeHandler.bind(this, "imageUrl")}
            onInputChange={inputChangeHandler}
            initialValue={editedProduct ? editedProduct.imageUrl : ""}
            initiallyValid={!!editedProduct}
          />

          {editedProduct ? null : (
            // <View style={styles.formControl}>
            //   <Text style={styles.label}>Price</Text>
            //   <TextInput
            //     style={styles.input}
            //     // value={price}
            //     value={formState.inputValues.price}
            //     // onChangeText={text => setPrice(text)}
            //     onChangeText={textChangeHandler.bind(this, "price")}
            //     keyboardType="decimal-pad"
            //     returnKeyType="next"
            //   />
            // </View>

            <Input
              id="price"
              // onInputChange={inputChangeHandler.bind(this, "price")}
              onInputChange={inputChangeHandler}
              label="Price"
              keyboardType="decimal-pad"
              returnKeyType="next"
              errorText="Please enter a valid price!"
              required
              min={0.1}
            />
          )}
          {/*<View style={styles.formControl}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input}
            // value={description}
            value={formState.inputValues.description}
            // onChangeText={text => setDescription(text)}
            onChangeText={textChangeHandler.bind(this, "description")}
            returnKeyType="done"
          />
        </View>*/}
          <Input
            id="description"
            // onInputChange={inputChangeHandler.bind(this, "description")}
            onInputChange={inputChangeHandler}
            label="Description"
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect
            multiline
            numberOfLines={3} // works only in android
            returnKeyType="next"
            errorText="Please enter a valid description!"
            initialValue={editedProduct ? editedProduct.description : ""}
            initiallyValid={!!editedProduct}
            required
            minlength={5}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

EditProductScreen.navigationOptions = navData => {
  const submitFn = navData.navigation.getParam("submit");
  return {
    headerTitle: navData.navigation.getParam("productId")
      ? "Edit Product"
      : "Add Product",
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Save"
          iconName={
            Platform.OS === "android" ? "md-checkmark" : "ios-checkmark"
          }
          onPress={submitFn}
        />
      </HeaderButtons>
    )
  };
};

const styles = StyleSheet.create({
  form: {
    margin: 20
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
  //===== moved to UI/Input.js ======
  // formControl: {
  //   width: "100%"
  // },
  // label: {
  //   fontFamily: "open-sans-bold",
  //   marginVertical: 8
  // },
  // input: {
  //   paddingHorizontal: 2,
  //   paddingVertical: 5,
  //   borderBottomColor: "#ccc",
  //   borderBottomWidth: 1
  // }
});

export default EditProductScreen;
