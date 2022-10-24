import workerpool from "workerpool";
import centerGroup from "./centerGroup.js";
import mapGroupIds from "./mapGroupIds.js";
import test from "./test.js";

workerpool.worker({

	centerGroup: centerGroup,
	mapGroupIds: mapGroupIds,
	test: test

});