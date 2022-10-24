import {StyleSheet,StatusBar} from "react-native";

export default StyleSheet.create({

   err_container:{
   	
   	position: "absolute",
 	zIndex:5,
    flexDirection:"row",
    alignItems: "center",
    backgroundColor: 'rgba(70, 70, 70, 0.7)',
    alignSelf: 'center',
    borderRadius: 5,
    height: "5%",
    width: "60%",
  },

  err_text:{
  
    flex: 1,
    flexWrap: "wrap",
    fontSize: 10,
    fontFamily:"Roboto",
    color: "white",
    textAlign: "center"
  }

})