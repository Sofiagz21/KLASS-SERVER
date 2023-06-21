import { nanoid } from "nanoid";
import AWS from "aws-sdk";

const awsConfig={
    accessKeyId:  process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey:  process.env.AWS_SECRET_ACCESS_KEY_ID,
    region: process.env.AWS_REGION,
    apiVersion: process.env.AWS_API_VERSION,
};

const S3 = new AWS.S3(awsConfig);

export const uploadImage = async (req, res) =>{
    //console.log(req.body);
    try{
        const {image} = req.body;
        if (!image) return res.status(400).send("No hay imagen");
        
        //prepare the imagen
        
        // prepare the image
        const base64Data = new Buffer.from(
            image.replace(/^data:image\/\w+;base64,/, ""),
            "base64"
        );
        
        const type = image.split(";")[0].split("/")[1];
        
        // image params
        const params = {
            Bucket: "klass-education-bucket",
            Key: `${nanoid()}.${type}`, // aeiou.jpeg
            Body: base64Data,
            ACL: 'public-read', 
            ContentEncoding: "base64",
            ContentType: `image/${type}`,
        };
        
        //upload to S3
        S3.upload(params, (err, data) =>{
            if(err){
                console.log(err);
                return res.sendStatus(400);
            }
            console.log(data);
            res.send(data);
        });
         
    }catch (err){
        console.log(err);
    
    }
};


