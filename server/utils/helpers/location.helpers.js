
const _toRadians = (number) =>{

  return number * Math.PI / 180;
}

const _calculateGreatCircleDistance = (locationA, locationZ) =>{

  const lat1 = locationA.latitude;
  const lon1 = locationA.longitude;
  const lat2 = locationZ.latitude;
  const lon2 = locationZ.longitude;

  // DOCUMENTATION: http://www.movable-type.co.uk/scripts/latlong.html
  const p1 = _toRadians(lat1);
  const p2 = _toRadians(lat2);
  const deltagamma = _toRadians(lon2 - lon1);
  const R = 6371e3; // gives d in metres
  const d =
    Math.acos(
      Math.sin(p1) * Math.sin(p2) + Math.cos(p1) * Math.cos(p2) * Math.cos(deltagamma)
    ) * R;

  return isNaN(d) ? 0 : d;
}

const _calcuateGreatCircleCentroid = (childGroups)=>{

	var x = 0;
  var y = 0;
  var z = 0;

  for(var childGroup of childGroups){

    var lat = childGroup.pos.latitude * Math.PI / 180;
    var long = childGroup.pos.longitude * Math.PI / 180;

    x += Math.cos(lat) * Math.cos(long);
    y += Math.cos(lat) * Math.sin(long);
    z += Math.sin(lat);

  }

  var count = childGroups.length;

  x = x/count;
  y = y/count;
  z = z/count;

  var centralLng = Math.atan2(y, x);
  var centralLat = Math.atan2(z, (Math.sqrt(x*x+y*y)));

  return {latitude: centralLat * 180 / Math.PI, longitude: centralLng * 180 / Math.PI};
}

export {_calcuateGreatCircleCentroid, _calculateGreatCircleDistance, _toRadians};