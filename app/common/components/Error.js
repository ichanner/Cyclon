import React, {Component} from 'react';
import {Text, View, StatusBar} from 'react-native';
import {Animated} from "react-native";
import Styles from "./Styles";

export default class Error extends Component{

	constructor(props){

		super(props);

		this.state = {

			dropDown: new Animated.Value(0)
		}
	}

	componentDidMount(){

		Animated.timing(this.state.dropDown, {toValue:StatusBar.currentHeight, duration:500}, {useNativeDriver: true}).start();  
	}


	render(){

		return(

			<Animated.View style={{...Styles.err_container, top: this.state.dropDown}}>

				<Text style={Styles.err_text}> {this.props.message} </Text>

			</Animated.View>
			
		);
	
	}
}
