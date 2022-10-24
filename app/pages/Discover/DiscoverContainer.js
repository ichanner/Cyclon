import React, { Component } from "react";
import {Dimensions} from 'react-native';
import MapView, {Marker, AnimatedRegion} from "react-native-maps";
import { View, PermissionsAndroid,  Text, Button, StyleSheet } from "react-native";
import { connect } from "react-redux";
import AppWrapper from "../../contexts/App";
import GroupService from "../../services/groups";
import * as Location from "expo-location";
import * as TaskManager from 'expo-task-manager';
import { APP_NOT_LOADED, LOCATION_GRANTED, LOCATION_DENIED, LOCATION_TASK_NAME} from "../../utils/constants/location.constants";
import {setLocation, setLocationPermission, setLocationError, getGroupView, sendUpdate} from "../../store/discover/discover.actions";
import {setLoading} from "../../store/app/app.actions";
import Styles from "./Discover.styles";
import UserMarker from "./components/UserMarker";
import Group from "./components/Group";
import AppError from "../../utils/helpers/error.helper";
import Error from "../../common/components/Error.js";

class DiscoverPage extends Component{

    constructor(props){ 

        super(props);

        this.map = null;

        this.groupService = new GroupService();

        this.state = {

            first_location: true,

            coordinate: new AnimatedRegion({

                latitude: 0,
                longitude: 0,
                latitudeDelta: 0,
                longitudeDelta: 0
            })
        }
    }

    initBindings(){

      //  this.updateView = this.updateView.bind(this);
    }

    async initLocation(){

        try{

            TaskManager.defineTask(LOCATION_TASK_NAME , ({data, err})=>{
                
                if(err) throw new AppError(err.message);

                let coords  = data["locations"][0].coords;
            
                this.props.setLocation({

                    timestamp: data["locations"][0].timestamp,
                    accuracy: coords.accuracy,
                    latitude: coords.latitude, 
                    longitude: coords.longitude   
                });

                if(this.state.first_location){

                    this.findMe()

                    this.setState({first_location: false});
                }

            });

            const foreground = await Location.requestForegroundPermissionsAsync();
            //const background = await Location.requestBackgroundPermissionsAsync();
         
            if(foreground.status === 'granted' && background.status === 'granted'){

                 await Location.enableNetworkProviderAsync();
                
                 await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME , {    

                    accuracy: Location.Accuracy.BestForNavigation,
                    showsBackgroundLocationIndicator: true,
                    foregroundService: {
                      
                        notificationTitle: "Background Location",
                        notificationBody: "Fetching Background Location..."
                    },    
                });

                this.props.setLocationPermission(LOCATION_GRANTED) 

            }
            else{

                this.props.setLocationPermission(LOCATION_DENIED);

                throw new AppError("Foreground and Background location must be enabled");
            }
           
        }
        catch(e){

            this.props.setLocationError(e.message);

            throw new AppError(e.message);
        }
    }


    async componentDidMount(){

       await this.initLocation();
       
       this.initBindings();

       this.props.setLoading(false);
    }



    componentDidUpdate(nextProps){
        
        this.props.sendUpdate(nextProps.location);  

        this.updateAnimationState(nextProps.location);
    }
    

   findMe(){

        if(this.map){
          
            if(this.props.location_permission == LOCATION_GRANTED){
               
                this.map.animateToRegion({

                    latitude: this.props.location.latitude,
                    longitude: this.props.location.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01

                }, 500);
            }
        }
   }

   updateAnimationState(location){


        const kalmanData = this.groupService.smoothLocation(location);

        this.state.coordinate.timing(
        {
  
            latitude: kalmanData.latitude, 
            longitude:  kalmanData.longitude, 
            latitudeDelta: 0.01,
            longitudeDelta: 0.01

        }, 300, {useNativeDriver: true}).start();   

    }

    updateView(region){

        console.log(region)

      var bounds = { 

            NE:{

                latitude: region.latitude + region.latitudeDelta/2,
                longitude: region.longitude + region.longitudeDelta/2
            },
            SW:{

                latitude: region.latitude - region.latitudeDelta/2,
                longitude: region.longitude - region.longitudeDelta/2
            }
      };
     
      var zoomLevel = Math.round(Math.log(360/region.longitudeDelta)/Math.LN2);

      this.props.getGroupView(bounds, zoomLevel);
     
    }
    
    render(){

        return(


            <View style={{flex: 1}}>

                <MapView ref={(map)=>{this.map = map}} style={Styles.map} onRegionChangeComplete={(region)=>this.updateView(region)}> 
                
                    { 
                        this.props.group_view.map((group)=>{

                            <Group groupId={group.groupId} latitude={group.pos.latitude} longitude={group.pos.longitude}/>
                        })
                    }

                    <UserMarker coordinate={this.state.coordinate} color={"green"}/>    
                        
                </MapView>

            </View>

        );

    }
}

const mapStateToProps = (state) =>{

    return{

        location: state.discover.location,
        location_permission: state.discover.location_permission,
        group_view: state.discover.group_view,
        con: state.app.connected,
        location_error: state.discover.location_error
    }

}

const mapDispatchToProps = {

    setLocation,
    setLocationError,
    setLoading,
    getGroupView,
    sendUpdate,
    setLocationPermission
}


export default connect(mapStateToProps, mapDispatchToProps)(DiscoverPage);





/*

 async checkServices(){

        let enabled = await Location.hasServicesEnabledAsync();

        if(this.props.location_permission != APP_NOT_LOADED){


            if(this.props.location_permission != LOCATION_GRANTED){

                if(enabled){

                    this.props.setLocationPermission(LOCATION_GRANTED);
                }
            }
            else{

                if(this.props.location_permission != LOCATION_DENIED){

                    this.props.setLocationPermission(LOCATION_DENIED);
                }
            }
        }
    }
    */