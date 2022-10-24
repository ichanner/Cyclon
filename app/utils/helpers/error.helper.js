export default class AppError extends Error{

	constructor(name, msg){

		super(msg);

		this.name = name;
	}
}