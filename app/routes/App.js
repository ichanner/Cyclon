import React, { Component } from 'react';
import {View, Text, SafeAreaView} from "react-native";
import {connect} from "react-redux";
import Menu from "./BottomTab";
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native';
import Error from "../common/components/Error";

const Stack = createNativeStackNavigator();

export default class App extends Component{

  constructor(props){

    super(props);
  }

  render(){

    return(

      <NavigationContainer>

        <View style={{flex:1}}>

          <Stack.Navigator>

            <Stack.Screen  name="Menu" component={Menu} options={{headerShown:false}} />

          </Stack.Navigator>

        </View>

      </NavigationContainer>

    );
  }
}