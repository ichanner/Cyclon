import React, {Component} from "react";
import store from "../store/index"
import Error from "../common/components/Error";
import { connect } from "react-redux";
import {connectWS, disconnectWS} from "../store/socket/socket.actions";
import { View } from "react-native";
import AppWrapper from "./App.js";

class WebSocketWrapper extends Component{

	constructor(props){

		super(props)
	}

	componentDidMount(){

		if(!this.props.connected){

			store.dispatch(connectWS(this.props.host));
		}
	}

	render(){

		///console.log("error" + this.props.error);
		//console.log("socketconn" + this.props.connected)

		return(

			<View style={{flex:1}}>

				 <AppWrapper/>

			</View>

		);
	}
}

const mapStateToProps = (state) =>{

    return{

        connected: state.socket.connected
    }
}


export default connect(mapStateToProps, null)(WebSocketWrapper)

