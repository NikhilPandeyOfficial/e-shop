import { AsyncStorage } from "react-native"; // for storing token on device

// action Identifiers
// export const SIGNUP = "SIGNUP"; // combining login & signup using authenticate see sec-11 v-10
// export const LOGIN = "LOGIN";
export const AUTHENTICATE = "AUTHENTICATE";
export const LOGOUT = "LOGOUT";

let timer;

// sec-11 v-12 auto logout
// export const authenticate = (userId, token) => {
export const authenticate = (userId, token, expiryTime) => {
  return dispatch => {
    dispatch(setLogoutTimer(expiryTime));
    dispatch({ type: AUTHENTICATE, userId: userId, token: token });
  };
  // sec-11 v-11 auto logout
  // return { type: AUTHENTICATE, userId: userId, token: token };
};

export const signup = (email, password) => {
  return async dispatch => {
    const response = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBvSlGNHc9fXpoo_i4WF_oqXw07yuPnXSg",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true
        })
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      const errorId = errorResData.error.message;
      // for different error message see firebase possible error in signup/login
      let message = "something went wrong";
      if (errorId === "EMAIL_EXISTS") {
        message = "This email already exists";
      }
      throw new Error(message);
    }

    const resData = await response.json();
    console.log(resData);
    // see sec-11 v-10 14: 30 combining signup and login
    // dispatch({ type: SIGNUP, token: resData.idToken, userId: resData.localId });
    // sec-11 v-12 auto logout
    // dispatch(authenticate(resData.idToken, resData.localId));
    dispatch(
      authenticate(
        resData.idToken,
        resData.localId,
        parseInt(resData.expiresIn) * 1000
      )
    );

    // .getTime() gives time in milliseconds and resData.expiresIn is in seconds
    const expirationDate = new Date(
      new Date().getTime() + parseInt(resData.expiresIn) * 1000
    );
    saveDataToStorage(resData.idToken, resData.localId, expirationDate);
  };
};

export const login = (email, password) => {
  return async dispatch => {
    const response = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBvSlGNHc9fXpoo_i4WF_oqXw07yuPnXSg",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true
        })
      }
    );

    if (!response.ok) {
      //   throw new Error("Something went wrong");
      const errorResData = await response.json();
      // console.log(errorResData);
      const errorId = errorResData.error.message;
      let message = "something went wrong";
      if (errorId === "EMAIL_NOT_FOUND") {
        message = "This email could not be found";
      } else if (errorId === "INVALID_PASSWORD") {
        message = "This password is not valid";
      }
      throw new Error(message);
    }
    const resData = await response.json();
    console.log(resData);
    // see sec-11 v-4 14: 30 combining signup and login
    // dispatch({ type: LOGIN, token: resData.idToken, userId: resData.localId });
    // sec-11 v-12 auto logout
    // dispatch(authenticate(resData.idToken, resData.localId));
    dispatch(
      authenticate(
        resData.idToken,
        resData.localId,
        parseInt(resData.expiresIn) * 1000
      )
    );

    // .getTime() gives time in milliseconds and resData.expiresIn is in seconds
    const expirationDate = new Date(
      new Date().getTime() + parseInt(resData.expiresIn) * 1000
    );
    saveDataToStorage(resData.idToken, resData.localId, expirationDate);
  };
};

export const logout = () => {
  clearLogoutTimer();
  AsyncStorage.removeItem("userData");
  return { type: LOGOUT };
};

const clearLogoutTimer = () => {
  if (timer) {
    // clearTimeout is built-in js method to clear the timer
    clearTimeout(timer);
  }
};

// auto logout feature
const setLogoutTimer = expirationTime => {
  return dispatch => {
    timer = setTimeout(() => {
      // for dispatch logout() we're taking advantage of
      // 'redux-thunk' way of return => dispatch ....
      dispatch(logout());
    }, expirationTime);
  };
};

// saving token and userId on user's device/mobile
const saveDataToStorage = (token, userId, expirationDate) => {
  AsyncStorage.setItem(
    "userData",
    JSON.stringify({
      token: token,
      userId: userId,
      expiryDate: expirationDate.toISOString()
    })
  );
};
