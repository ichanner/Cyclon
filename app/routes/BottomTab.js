import React, { Component } from 'react';
import {View} from "react-native";
import {connect} from "react-redux";
import DiscoverPage from "../pages/Discover/DiscoverContainer";
import {MaterialCommunityIcons} from "react-native-vector-icons";
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import Styles from "./routes.styles.js";
import TestPage from "../pages/Test.js";
import { NavigationContainer } from '@react-navigation/native';
import Error from "../common/components/Error";
import NetInfo from "@react-native-community/netinfo";
import store from "../store/index.js";
import {setLoading, setConnectionStatus} from "../store/app/app.actions";

const Tab = createMaterialBottomTabNavigator();


class Menu extends Component{

  constructor(props){

    super(props);

  }

  render(){

    NetInfo.fetch().then((state)=>{

      if(state.isConnected != null){

        //alert(state.isConnected)

        this.props.setConnectionStatus(state.isConnected);
      }
    
    })

    return(

      <View style={{flex:1}}>

        {this.props.error == null ? null : <Error message={this.props.error} />}

        <Tab.Navigator

          initialRouteName="Discover"
          activeColor="#f0edf6"
          inactiveColor="#3e2465"
          barStyle={Styles.bottom_bar}

        >
            <Tab.Screen name="Discover"   component={DiscoverPage} options={{headerShown:false}, {tabBarLabel: "Discover", tabBarIcon:({color})=>(

              <MaterialCommunityIcons name="map" color={color} size={26}/> 

            )}} />
            <Tab.Screen name="Messages" component={TestPage} options={{headerShown:false}, {tabBarLabel: "Messages", tabBarIcon:({color})=>(

              <MaterialCommunityIcons name="message" color={color} size={26}/>

            )}}/>

            <Tab.Screen name="Create" component={TestPage} options={{headerShown:false}, {tabBarIcon:({color})=>(

              <MaterialCommunityIcons name="plus" color={color} size={26}/>

            )}}/>

            <Tab.Screen name="Groups" component={TestPage} options={{headerShown:false}, {tabBarLabel: "Groups", tabBarIcon:({color})=>(

              <MaterialCommunityIcons name="account" color={color} size={26}/>

            )}}/>

            <Tab.Screen name="Friends" component={TestPage} options={{headerShown:false}, {tabBarLabel: "Friends", tabBarIcon:({color})=>(

              <MaterialCommunityIcons name="group" color={color} size={26}/>

            )}}/>

        </Tab.Navigator>

      </View>

    );
  }
}

const mapStateToProps = (state) =>{

    return{


        conn: state.app.connected,
        error: state.app.error
    }

}

const mapDispatchToProps = {

  setConnectionStatus
}


export default connect(mapStateToProps, mapDispatchToProps)(Menu);