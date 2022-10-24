import React, { Component } from "react";
import { View } from "react-native";
import  MapView, { Marker } from "react-native-maps";

export default class UserMarker extends Component{

	constructor(props){

		super(props);
	}

	render(){

	
		return(

			<View>

				<Marker.Animated pinColor={this.props.color} coordinate={this.props.coordinate} />	

			</View>
		);
	}
}



