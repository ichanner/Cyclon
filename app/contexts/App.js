import React, {Component} from "react";
import { View, Button, Text } from "react-native";
import { connect } from "react-redux";
import {setLoading, setConnectionStatus} from "../store/app/app.actions";
import * as SplashScreen from "expo-splash-screen";
import AppRoutes from "../routes/App.js";
import NetInfo from "@react-native-community/netinfo";

class AppWrapper extends Component{

	constructor(props){

		super(props);
	}

	componentDidMount(){
		
		this.props.setLoading(true);	
	}

	async componentDidUpdate(nextProps){

		if(nextProps.loaded != true){

			await SplashScreen.preventAutoHideAsync();
		}
		else{

			await SplashScreen.hideAsync();
		}
	}

	render(){
		
		return(

			<View style={{flex:1}}>

				<AppRoutes/>
					
			</View>
		);
	}
}

const mapStateToProps = (state) =>{

    return{

        loaded: state.app.loaded,
        connected: state.app.connected
    }
}

const mapDispatchToProps = {

   setLoading,
   setConnectionStatus
}


export default connect(mapStateToProps, mapDispatchToProps)(AppWrapper);

