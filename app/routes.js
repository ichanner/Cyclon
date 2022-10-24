import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import DiscoverPage from "./pages/Discover/DiscoverContainer";

import WebSocketWrapper from "./contexts/WebSocket";


const screens = {

  DiscoverPage:{

    screen: DiscoverPage,
    
    navigationOptions: {
     
        headerShown: false,
     
      }
  },

}

const stack = createStackNavigator(screens);

export default createAppContainer(stack);