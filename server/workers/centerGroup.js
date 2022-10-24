
export default (childGroups)=>{

  const _toRadians = (degree) =>{

	return degree * Math.PI / 180;
  }

  const _toDegrees = (radian) =>{

  	return radian * 180 / Math.PI;
  }

  var x = 0;
  var y = 0;
  var z = 0;

  if(childGroups == null) return null;

  console.log(childGroups)

  for(var childGroup of childGroups){

    var lat = _toRadians(childGroup.pos.latitude);
    var long = _toRadians(childGroup.pos.longitude);

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

  return {latitude: _toDegrees(centralLat), longitude: _toDegrees(centralLng)};

}


/*

export default (doc)=>{

	//if(doc.new){

		doc.pos = _calcuateGreatCircleCentroid(doc.childGroups)
		//doc.new = false;
	//}

	//delete doc._id;

	for(var i = 0; i < doc.childGroups.length; i++){

		//if(doc.childGroups[i].new){

			doc.childGroups[i].pos = _calcuateGreatCircleCentroid(doc.childGroups[i].childGroups);
			//doc.childGroups[i].new = false;
		//}

		//delete doc.childGroups[i]._id;
		
		for(var n = 0; n < doc.childGroups[i].childGroups.length; n++){

			//if(doc.childGroups[i].childGroups[n].new){
				
				doc.childGroups[i].childGroups[n].pos = _calcuateGreatCircleCentroid(doc.childGroups[i].childGroups[n].childGroups);	
				//doc.childGroups[i].childGroups[n].new = false;
			//}		

			//delete doc.childGroups[i].childGroups[n]._id;

			for(var k = 0; k < doc.childGroups[i].childGroups[n].childGroups.length; k++){

				//delete doc.childGroups[i].childGroups[n].childGroups[k]._id;
			}	
		}
	}

	return doc;
	
}
*/