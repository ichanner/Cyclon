import mongoose from "mongoose";
import {ObjectId} from "mongodb";
import {v4} from "uuid";
import {SINGULAR} from "../utils/constants/group.constants.js";

const Schema = mongoose.Schema;

const layerFour = new Schema({

	_id: {type: mongoose.Types.ObjectId, default: new ObjectId()},
	groupId: {type: String, required: true},
	groupType: {type: Number, default: SINGULAR},
	zoomLimit: {type: Number, default: -1},
	pos: {latitude: Number, longitude: Number}
})

const layerThree = new Schema({

	_id: {type: mongoose.Types.ObjectId, default: new ObjectId()},
	groupId: {type: String, default: v4()},
	groupType: {type: Number, required: true},
	pos: {latitude: Number, longitude: Number},
	radius : {type: Number, default: null},
	minimum: {type: Number, default: null},
	heatScore: {type: Number, default: 0},
	zoomLimit: {type: Number, default: -1},
	zoomFade:{type: Number, default: -1},
	childGroups: {type: [layerFour], default: []},
})

const layerTwo = new Schema({

	_id: {type: mongoose.Types.ObjectId, default: new ObjectId()},
	groupId: {type: String, default: v4()},
	groupType: {type: Number, required: true},
	pos: {latitude: Number, longitude: Number},
	radius : {type: Number, default: null},
	minimum: {type: Number, default: null},
	heatScore: {type: Number, default: 0},
	zoomLimit: {type: Number, default: -1},
	zoomFade:{type: Number, default: -1},
	childGroups: {type: [layerThree], default: []},

})

const layerOne = new Schema({

	_id: {type: mongoose.Types.ObjectId, default: new ObjectId()},
	groupId: {type: String, default: v4()},
	groupType: {type: Number, required: true},
	pos: {latitude: Number, longitude: Number},
	radius : {type: Number, default: null},
	minimum: {type: Number, default: null},
	heatScore: {type: Number, default: 0},
    zoomLimit: {type: Number, default: -1},
    zoomFade:{type: Number, default: -1},
	childGroups: {type: [layerTwo], default: []},
});

export default mongoose.model("Group", layerOne, "groups");
