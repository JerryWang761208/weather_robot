import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import * as firebase from 'firebase';
import App from './components/app';
import reducers from './reducers';
// import * as firebase from 'firebase';
const createStoreWithMiddleware = applyMiddleware()(createStore);

var config = {
      apiKey: "AIzaSyDDFA-Dmpu5MVln5sl1D0pB3B_tuv_Yb9c",
      authDomain: "weather-robot-5988e.firebaseapp.com",
      databaseURL: "https://weather-robot-5988e.firebaseio.com",
      storageBucket: "weather-robot-5988e.appspot.com",
      messagingSenderId: "554509220665"
    };
firebase.initializeApp(config);
const db = firebase.database().ref().child('appName');
db.on('value',(snapshot)=>{
      const dbName = snapshot.val();
      //if db no exists, create one
      if(!(dbName == 'Weather_Robot')){
        firebase.database().ref().set({
          appName:'Weather_Robot',
          people:'test'
        });
      }
});


ReactDOM.render(
  <Provider store={createStoreWithMiddleware(reducers)}>
    <App />
  </Provider>
  , document.querySelector('.container'));
