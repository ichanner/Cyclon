import React, { Component } from "react";
import { View } from "react-native";
import  MapView from "react-native-maps";

export default class Group extends Component{

	constructor(props){

		super(props);
	}

	render(){

	
		return(

			<View>

				<MapView.Circle
	              
	                key = { this.props.groupId }
	                center = {{latitude: this.props.latitude, longitude: this.props.longitude}}
	                radius = { 100 }
	                strokeWidth = { 0 }
	                strokeColor = { '#1a66ff' }
	                fillColor = { 'rgba(230,238,255,0.5)' }
	               
        		/>

			</View>
		);
	}
}



