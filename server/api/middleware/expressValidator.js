export default async(schema)=>{

	return async(req, res, next)=>{

		try{

			await schema.validateAsync(req.body);

			next();
		}	
		catch(e){

			return res.status(400);
		}
	}
}