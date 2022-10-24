
export default async(packet, next)=>{

	try{

		const schema = loadSchema(packet[0]);

		if(schema!=null) await schema.validateAsync(packet[1]);

		next();
	}	
	catch(e){

		throw new Error("Invalid")
	}
}
