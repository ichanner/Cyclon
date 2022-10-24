import React, { Component } from 'react';
import { Provider } from 'react-redux'
import store from "./store/index";
import config from "./config";
import WebSocketWrapper from "./contexts/WebSocket";
import AppWrapper from "./contexts/App.js";
import AppRoutes from "./routes/App";
import {View} from "react-native";
import DiscoverPage from "./pages/Discover/DiscoverContainer.js";

export default class App extends Component{

  constructor(props){

    super(props);

  }

  render(){

    return(

      <Provider store={store}>

        <WebSocketWrapper host={config.server.domain}/>     
      
      </Provider>

    );
  }

}