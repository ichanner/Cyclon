import {RADIUS} from "../constants/location.constants";

const _toRadians = (number) =>{

  return number * Math.PI / 180;
}

// DOCUMENTATION: http://www.movable-type.co.uk/scripts/latlong.html
const _calculateGreatCircleDistance = (locationA, locationZ) =>{

  const lat1 = locationA.latitude;
  const lon1 = locationA.longitude;
  const lat2 = locationZ.latitude;
  const lon2 = locationZ.longitude;

  const p1 = _toRadians(lat1);
  const p2 = _toRadians(lat2);
  const deltagamma = _toRadians(lon2 - lon1);
  const d = Math.acos(Math.sin(p1) * Math.sin(p2) + Math.cos(p1) * Math.cos(p2) * Math.cos(deltagamma)) * RADIUS;

  return isNaN(d) ? 0 : d;
}


export {_toRadians, _calculateGreatCircleDistance};

