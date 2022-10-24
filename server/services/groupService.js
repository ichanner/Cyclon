import GroupModel from "../schemas/group.js";
import {uuid} from "uuidv4";
import centerGroups from "../workers/centerGroups.js";
import mapGroupIds from "../workers/mapGroupIds.js";
import {METER_CONST, LARGE, MEDIUM, SMALL, SINGULAR, MEDIUM_MIN, SMALL_MIN, LARGE_MIN, LARGE_RADIUS, MEDIUM_RADIUS, SMALL_RADIUS, LARGE_ZOOM_LIMIT, SMALL_ZOOM_LIMIT, MEDIUM_ZOOM_LIMIT, SINGULAR_ZOOM_LIMIT} from "../config/constants.js";

class GroupService{


	setGroupZoomLimit(type){

		switch(type){

			case LARGE:
				return LARGE_ZOOM_LIMIT;
				break;

			case MEDIUM:
				return MEDIUM_ZOOM_LIMIT;
				break;

			case SMALL: 
				return SMALL_ZOOM_LIMIT;
				break;

			case SINGULAR:
				return SINGULAR_ZOOM_LIMIT;
				break;

			default: 
				break;
		}
	}

	setGroupRadius(type){

		switch(type){

			case LARGE:
				return LARGE_RADIUS;
				break;

			case MEDIUM:
				return MEDIUM_RADIUS;
				break;

			case SMALL:
				return SMALL_RADIUS;
				break;

			default:
				break;
		}
	}

	setGroupMinimum(type){

		switch(type){

			case LARGE:
				return LARGE_MIN;
				break;

			case MEDIUM:
				return MEDIUM_MIN;
				break;

			case SMALL:
				return SMALL_MIN;
				break;

			default:
				break;
		}
	}

	createSingularRecord(id, pos){

		return{

			groupId: id,
			zoomLimit: this.setGroupZoomLimit(type),
			pos: pos
		};
	}

	async createGroupRecord(type, children=null){

		const pos = (children!=null ? await centerGroups(children) : {latitude: -1, longitude: -1});

		return {

			groupType: type,
			radius: this.setGroupRadius(type),
			minimum: this.setGroupMinimum(type),
			zoomLimit: this.setGroupZoomLimit(type),
			zoomFade: this.setGroupZoomLimit(type-1),
			pos: pos,
			childGroups: children==null ? [] : children
		};
	}

	async createGroup(type, children){


	   const record = await this.createGroupRecord(type, children);

	   console.log(record)

		try{

			const group = await GroupModel.create(record);

			return group;
		}
		catch(e){

			throw new Error(e.message);
		}
	}

	async createSingular(id, pos){

		const record = this.createSingularRecord(id, pos);

		try{

			const singular = await GroupModel.create(record);

			return singular;
			
		}
		catch(e){

			throw new Error(e.message);
		}
	}


	inBound(bounds, isChild=false){

		const group = isChild ? "$$layer.childGroup.pos" : "$pos";

		return {

			$let:{

				vars:{

					eastBound: {$lt:[group.longitude, bounds.NE.longitude]},
					westBound: {$gt:[group.longitude, bounds.SW.longitude]},
					
					inLat: {

						$and:[

							{$lt:[group.latitude, bounds.NE.longitude]},

							{$gt:[group.latitude, bounds.SW.longitude]}

						]
					}
				},

				in:{

					$cond:{

						if:{$lt:[bounds.NE.longitude, bounds.SE.longitude]},

						then:{

							$and:[

								inLat,

								{
									$or:[

										eastBound, 
										westBound
									]
								}
							]
						},

						else:{

							$and:[

								inLat,

								{
									$and:[

										eastBound,
										westBound
									]
								}
							]

						}
					}

				}
			}
		}

	}

	async getGroupView(zoom, bounds, parentGroups=null){

		var query;

		try {

			if(parentGroups[0] != null){

				query = {
				
					$project:{

						view:{

							$let:{

								vars:{

									inView:{

										$filter:{

											input: "$childGroups",
											as: "layer",
											$cond: {
												
												$and:[
													
													[this.inBounds(bounds, true)],
													{$gte:[zoom, "$$zoomLimit"]},
													{$lt:[zoom, "$$zoomFade"]}
												]
											}
										}
									}
								},

								in:{

									childGroups:{

										$cond:{

											if:{$gt:[{$size:"$$inView"}, 0]},

											then:{

												$map:{

													input: "$$inView",
													as: "group",
													in:{

														$cond:{

															if:{$eq:["$$group.groupType", SINGULAR]},

															then: "$$group",

															else: {

																$let:{

																	vars:{

																		inView:{

																			$filter:{

																				input: "$$group.childGroups",
																				as: "layer",
																				$cond: {
																					
																					$and:[
																						
																						[this.inBounds(bounds, true)],
																						{$gte:[zoom, "$$layer.zoomLimit"]},
																						{$lt:[zoom, "$$layer.zoomFade"]}
																					]
																				}
																			}
																		}
																	},

																	in:{

																		childGroups:{

																			$cond:{

																				if:{$gt:[{$size:"$$inView", 0]}},

																				then:{

																					$map:{

																						input: "$$inView",
																						as:"group",
																						in:{

																							$cond:{

																								if:{$eq:["$$group.groupType", SINGULAR]},

																								then: "$$group",

																								else: {
																								
																									childGroups:{
																									
																										"$$group.childGroups"
																									}
																								}
																							}
																							
																						}
																					}
																				},

																				else: "$$inView"
																			}

																		}

																	}
																}
															}
														}
														
													}
												}

											},

											else: "$childGroups"
										}
									}	
								}
							}					
					
						}

					}

				};
			}
			else{

				query =

					{
						$match:{

							$expr:{

								$and:[

									[this.inBounds(bounds)],
									{$gte:[zoom, "$zoomLimit"]},
									{$lt:[zoom, "$zoomFade"]}

								]
							}
						}
					};
				
			}

			const view = await GroupModel.aggregate([query]);
		}
		catch(e){

			throw new Error(e.message);
		}

	}


	async selectGroup(userId, pos){

		try{

			const selection = await GroupModel.aggregate([

				{
					$match: { 

						$expr: { 

							$or: [

								{$eq: ["$groupId", userId] }, {$gte: ["$radius", this.getDistance(pos)]}

							] 
						} 
					}
				},  //layer1

				{"$project":{

					    "groupId": "$groupId",

						"childGroups":{

							"$map":{

								"input": {

									"$filter":{

										"input": "$childGroups",
										"as": "childGroup",
										"cond": {

											"$or": [ 

												{"$eq": ["$$childGroup.groupId", userId]}, { "$gte": ["$$childGroup.radius", this.getDistance(pos, true)]}
											]
										}
									}
								},
								"as": "layer2",
								"in":{ 

									"groupId": "$$layer2.groupId",
									"childGroups":{

										"$map":{

											"input":{

												"$filter":{

													"input": "$$layer2.childGroups",
													"as": "childGroup",
													"cond": { 

														"$or": [ 
																
															{"$eq": ["$$childGroup.groupId", userId]}, {"$gte": ["$$childGroup.radius", this.getDistance(pos, true)]}
														]
													}
												}
											},
											"as": "layer3",
											"in":{

												"groupId": "$$layer3.groupId",
												"childGroups":{

													"$filter":{

														"input": "$$layer3.childGroups",
														"as": "childGroup",
														"cond": { "$eq": ["$$childGroup.groupId", userId]}
													}
												}
											}
										}
									}
								}
							}
						}	
					}
				},
				{
					$project: {

						layer1: ["$$ROOT"],
						layer2: "$childGroups",
						layer3:{  

							$reduce: {
					          
					            input: '$childGroups.childGroups',
					            initialValue: [],
					            in: {$concatArrays: ['$$value', '$$this']}
					        }
						},
						layer4:{  

							$reduce: {
					          
					            input: '$childGroups.childGroups.childGroups',
					            initialValue: [],
					            in: {$concatArrays: ['$$value', '$$this']}
					        }
						}
					}
				},
				{
					$project:{

						groups: { $concatArrays: [ { groupId: "$layer1.groupId", groupType: "$layer1.groupType", pos: "$layer1.pos"} , 
												   { groupId: "$layer2.groupId", groupType: "$layer2.groupType", pos: "$layer2.pos"}, 
												   { groupId: "$layer3.groupId", groupType: "$layer3.groupType", pos: "$layer3.pos"}, 
												   { groupId: "$layer4.groupId", groupType: "$layer4.groupType", pos: "$layer4.pos"} ] }
					}
				}

			]);

			return selection;
		}
		catch(e){

			throw new Error(e.message);
		}
	
	}


	getDistance(pos, childGroup=false){

		const other = childGroup==true ? "$$childGroup.pos." : "$pos.";

		return {

			$multiply:[

			{
				$acos:{ 

					$add: [ 

						{
							$multiply:[ 

								{
									$sin:{$degreesToRadians : other + "latitude"}
								}, 
								{
									$sin:{$degreesToRadians : pos.latitude}
								} 
							]
						}, 
						{
							$multiply: [ 

								{
									$cos:{$degreesToRadians : other + "latitude"}
								}, 
								{
									$cos:{$degreesToRadians : pos.latitude}
								}, 
								{
									$cos: {

										$degreesToRadians : {

											$subtract:[pos.longitude, other + "longitude"]
										}
									}
								} 
							]
						},
					]

				}
											
			}, METER_CONST]
		}
	
	}

	getCenter(){

		return {

			$let:{

				vars: {

					x:{

						$map:{

							input: "$$closeGroups",
							as: "childGroup",
							in:{

								$multiply:[{$cos:{$degreesToRadians:"$$childGroup.pos.latitude"}}, {$cos:{$degreesToRadians:"$$childGroup.pos.longitude"}}]
							}
						}
					},
					y:{

						$map:{

							input: "$$closeGroups",
							as: "childGroup",
							in:{

								$multiply:[{$cos:{$degreesToRadians:"$$childGroup.pos.latitude"}}, {$sin:{$degreesToRadians:"$$childGroup.pos.longitude"}}]
							}
						}
					},
					z: {

						$map:{

							input: "$$closeGroups",
							as: "childGroup",
							in:{

								$sin:{$degreesToRadians:"$$childGroup.pos.latitude"}
							}
						}
					}
				},
				in:{

					latitude: {$radiansToDegrees: {$atan2:[{$divide:[{$sum: "$$y"},{$size:"$$closeGroups"}]}, {$divide:[{$sum:"$$x"},{$size:"$$closeGroups"}]}]}},
					longitude: {$radiansToDegrees:{$atan2:[{$divide:[{$sum:"$$z"},{$size:"$$closeGroups"}]}, {$sqrt:{$add:[{$pow:[{$divide:[{$sum: "$$x"},{$size:"$$closeGroups"}]},2]}, {$pow:[{$divide:[{$sum: "$$y"},{$size:"$$closeGroups"}]},2]}]}}]}}
				}
			}
		}
	}

	updateCondition(index, type, lineUp, noLayer=false){

		const layerChildren = (noLayer!=true ? "$$layer.childGroups" : "$childGroups");

		return {

			$let:{

				vars:{

					closeGroups:{

						$filter:{

							input: layerChildren,
							as: "childGroup",
							cond:{

								$and:[

									{$eq:["$$childGroup.groupType", type]},

									{

										$gte:[this.setGroupRadius(type+1),

											this.getDistance(this.getLineUp(index, lineUp), true)	
										]
									}
								]	
							}
						}
					}

				},

				in:{

					$cond:{

						if:{$gte:[{$size: "$$closeGroups"}, this.setGroupMinimum(type+1)]},
						
						then:{

							$cond:{

								if: {$gt:[this.getLineUp(index-1, lineUp).groupType-type, 1]}, //last group, current indec

								then:{

									$concatArrays:[

										[
											{
												$mergeObjects:[

													this.createGroupRecord(type+1),

													{
														childGroups: "$$closeGroups", 

														pos: this.getCenter()
									
													}
												]
											}
										],

										{
											$filter:{

												input: layerChildren,
												as: "childGroup",
												cond:{$not:{$in:["$$childGroup", "$$closeGroups"]}}

											}
										}
										

									]	
								},

								else: (noLayer != true ? ["$$layer"] : "$childGroups")
							}
						},

						else: layerChildren
				
					}

				}
			}
		}
	}


	async updateSingualars(lineUp){

		try{

			const firstLayer = await this.getFirstLayer(lineUp[0]);
			const firstLayerSize = firstLayer.length;

			if(lineUp[0].groupType == SINGULAR){

				if(firstLayerSize >= this.setGroupMinimum(SMALL)){

					await this.createGroup(SMALL, firstLayer);

					const ids = mapGroupIds(firstLayer);

					await GroupModel.deleteMany({groupId:{"$in": ids}});
				}
			}
			else{

				if(this.getLineUp(1, lineUp).groupType == SINGULAR){

					const res = await GroupModel.aggregate([

						{$match:{groupId: lineUp[0].groupId}},

						{
							$project:{

								root: this.updateCondition(1, SINGULAR, lineUp, true)		
							}	
						}
					])


					if(res[0].root.length < this.setGroupMinimum(SMALL) && (lineUp[0].groupType - this.getLineUp(1, lineUp).groupType == 1)){
						
						await GroupModel.insertMany(res[0].root);
						
						await GrouoModel.deleteOne({groupId:lineUp[0].groupId});
					}
					else{

			
						await GroupModel.updateOne({groupId: lineUp[0].groupId},{$set:{childGroups:res[0].root}})
					}
				}
				else{

					const res = await GroupModel.aggregate([

						{$match:{groupId: lineUp[0].groupId}},

						{$addFields:{

							childGroups:{

								$reduce:{

									input:{

										$map:{

											input: "$childGroups",
											as: "layer",
											in:{

												$cond:{

													if:{$eq:["$$layer.groupId", this.getLineUp(1, lineUp).groupId]},

													then:{

														$cond:{

															if:{$eq:[this.getLineUp(2 ,lineUp).groupType, SINGULAR]},

															then: this.updateCondition(2, SINGULAR, lineUp),

															else:{

																$mergeObjects:[

																	"$$layer",

																	{
																		childGroups:{

																			$reduce:{

																				input:{ 

																					$map:{

																						input: "$$layer.childGroups",
																						as: "layer",
																						in:{

																							$cond:{

																								if:{$eq:["$$layer.groupId", this.getLineUp(2, lineUp).groupId]},

																								then: this.updateCondition(3, SINGULAR, lineUp),

																								else: ["$$layer"]
																							}
																						}
																					}
																				},

																				initialValue:[],
																				in:{$concatArrays:["$$value", "$$this"]}
																			}
																		}
																	}
																]
															}
														}
													},

													else: ["$$layer"]
												}
											}
										}

									},
							
									initialValue:[],
									in:{$concatArrays:["$$value", "$$this"]}
								}
											
							}

						}}
					])

					await GroupModel.updateOne({groupId: lineUp[0].groupId}, {$set: res[0]});
				}
			}
		}
		catch(e){

			throw new Error(e.message);
		}

	}


	async getFirstLayer(firstGroup){

		try{

			//const condition = (isMed ? {$ne: ["$groupType", SINGULAR]} : {$eq: ["$groupType", lineUp.groupType]});

			const res = await GroupModel.aggregate([

				{
					$match: { 

						$expr: { 

							$and :[

								{$eq: ["$groupType", firstGroup.groupType]},

								{$gte: [this.setGroupRadius(firstGroup.groupType+1), 

									this.getDistance(firstGroup, false)
								]}
					 		]
					 	
					 	}
					}
				}
			]);

			return res;
		}
		catch(e){

			throw new Error(e.message);
		}
	}


	async createNestedSingular(lineUp, userId, pos){

		const singularRecord = createSingularRecord(userId, pos);

		try{
			
			await GroupModel.aggregate([

				{$match: {groupId: lineUp[0]}},
				{
					$addFields:{

						childGroups:{
						
							$cond: {

								if: {$eq:["$groupId", lineUp[lineUp.length-1]]},

								then: { $concatArrays: ["$childGroups", [singularRecord]] },
							
								else: {

									$concatArrays:[ 

										{
											$filter: { 

												input: "$childGroups",
												as: "childGroup",
												cond: { $ne: ["$$childGroup.groupId", lineUp[1]] }
											
											}
										},
									 	{
									 		$map:{

										 		input: {

										 			$filter:{

										 				input: "$childGroups",
										 				as: "childGroup",
										 				cond: { $eq: ["$$childGroup.groupId", lineUp[1]] }
										 			}
										 		},
												as: "layer2",
												in:{

													$mergeObjects:[

														"$$layer2",

														{
															childGroups:{

																$cond:{

																	if: {

																		$eq: [lineUp[1], lineUp[lineUp.length-1]]
																	},

																	then: { $concatArrays: ["$$layer2.childGroups", [singularRecord]] },

																	else: {

																		$concatArrays:[
																		
																		{	
																			$filter: { 

																				input: "$$layer2.childGroups",
																				as: "childGroup",
																				cond: { $ne: ["$$childGroup.groupId", lineUp[2]] }
																			}
																		},

																		{
																			$map:{

																				input: {

																					$filter:{

																 						input: "$$layer2.childGroups",
																 						as: "childGroup",
																 						cond: { $eq: ["$$childGroup.groupid", lineUp[2]] }
															 						}
															 					},
																				as: "layer3",
																				in:{

																					$mergeObjects: [

																						"$$layer3",
																					
																						{
																							childGroups:{

																								$concatArrays: ["$$layer3.childGroups", [singularRecord]]
																							}
																						}
																					]
																				}
																			}
																		}]
																	}
																}
															}
														}
													]	
												}
											}
										}
									]
								}
							}
						}	
					}
				},

				{$merge: {into: "groups"}}
			])
		}
		catch(e){

			throw new Error(e.message);
		}
	}
	
}

export default new GroupService();