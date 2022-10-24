import store from "../store/index.js";
import {_calculateGreatCircleDistance} from "../utils/helpers/location.helpers";
import {KALMAN} from "../utils/helpers/location.helpers";

export default class GroupService{

	constructor(){

		this.prev = {

            lastLocation:{

                latitude: null,
                longitude: null,
                timestamp: null
            },

            variance: -1
        };
	}

	smoothLocation(location){

	  const accuracy = Math.max(location.accuracy, 1);
	  const result = { ...location, ...this.prev.lastLocation };
	  var new_variance = this.prev.variance;

	  if (this.prev.lastLocation.latitude==null) {
	   
	    new_variance = accuracy * accuracy;

	    result.latitude = location.latitude;
	    result.longitude = location.longitude;
	    result.timestamp = location.timestamp;
	    result.variance = new_variance;

	  } 
	  else {

	    var timestamp = new Date(location.timestamp);
	    var lastTimestamp = new Date(this.prev.lastLocation.timestamp);
	    
	    const timestampInc = timestamp.getTime() - lastTimestamp.getTime();

	    if (timestampInc > 0) {
	       
	        const velocity = _calculateGreatCircleDistance(location, this.prev.lastLocation) / timestampInc * KALMAN;
	        
	        new_variance += timestampInc * velocity * velocity / 1000;
	    }

	    const k = new_variance / (new_variance + accuracy * accuracy);

	    result.latitude += k * (location.latitude - this.prev.lastLocation.latitude);
	    result.longitude += k * (location.longitude - this.prev.lastLocation.longitude);
	    result.timestamp = location.timestamp;
	    result.variance = (1 - k) * new_variance;

	  }  

	  return result;  
	}

	async getView(bounds, zoom, visibleGroups=[]){

		var groups = store.getState().discover.groups_view;

		for(var group of groups){

			if(inBounds(group.pos, bounds) && zoom >= group.zoomLimit && zoom < group.zoomFade){

				visibleGroups.push(group);
			}

			if(group.childGroups.length != 0){

				getView(bounds, zoom, visibleGroups);
			}
		}

		return visibleGroups;
	}

	inBounds(pos, bounds){

	  const eastBound = (pos.longitude < bounds.NE.longitude);
	  const westBound = (pos.longitude > bounds.SW.longitude);
	  const inLat = (pos.latitude < bounds.NE.longitude && pos.latitude > bounds.SW.longitude);

	  if(bounds.NE.longitude < bounds.SE.longitude){

	    return (inLat && (eastBound || westBound));
	  }
	  else{

	    return (inLat && eastBound && westBound);
	  }
	}
}