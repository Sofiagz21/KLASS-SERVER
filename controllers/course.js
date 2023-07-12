import { nanoid } from "nanoid";
import AWS from "aws-sdk";
import Course from '../models/course'
import slugify from "slugify";
import {readFileSync} from 'fs' //rs. readFileSync
import { error } from "console";

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

export const removeImage = async (req,res) =>{
    try{
        const {image} = req.body;
        //image params
        const params = {
            Bucket: image.Bucket,
            Key: image.Key,
        };
        
        //send remove request to s3
        S3.deleteObject(params, (err, data) =>{
            if(err){
                console.log(err);
                res.sendStatus(400)
            }
            res.send({ ok: true })
        })
    }catch(err){
        console.log(err);
    }
};

export const create = async (req, res) => {
  //console.log("CREATE COURSE");
  //return;
  try {
    //React for beginners
    //slug: React-for-beginners
    const alreadyExist = await Course.findOne({
      slug: slugify(req.body.name.toLowerCase()),
    });
    if (alreadyExist) return res.status(400).send("Titulo ya existente");

    const course = await new Course({
      slug: slugify(req.body.name),
      instructor: req.auth._id, //loggedin user from requireSignin
      ...req.body, //other information including image
    }).save();

    res.json(course);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Intentalo de Nuevo");
  }
};

export const read = async (req, res) => {
    try{
        const course = await Course.findOne({slug: req.params.slug})
            .populate("instructor","_id name")
            .exec();
        res.json(course);
    } catch(err){
        console.log(err)
    }
}


export const uploadPdf = async (req,res) => {
    try{
        /*console.log('req.user._id', req.user._id);
        console.log('req.params.instructorId',req.params.instructorId);
        return;*/
        if(req.user._id != req.params.instructorId){
        return res.status(400).send("No esta autorizado");
        }
        const { pdf } = req.files;
        //console.log(pdf);
        if (!pdf) return res.status(400).send("No PDF");
        // pdf params
        const params = {
            Bucket: "klass-education-bucket",
            Key: `${nanoid()}.${pdf.type.split("/")[1]}}`,
            Body: readFileSync(pdf.path),
            ACL: "public-read",
            ContentType: pdf.type,
        };
        // upload to S3
        S3.upload(params, (err, data) => {
            if(err){
                console.log(err);
                res.sendStatus(400);
            }
            console.log(data);
            res.send(data);
        });
    }catch(err){
        console.log(err)
    
    }
}

export const removePdf= async (req, res) => {
    try {

    if(req.user._id != req.params.instructorId){
        return res.status(400).send("No esta autorizado");
    }

      const { Bucket, Key } = req.body;
      // console.log("VIDEO REMOVE =====> ", req.body);

      // video params
      const params = {
        Bucket,
        Key,
      };
  
      // upload to s3
      S3.deleteObject(params, (err, data) => {
        if (err) {
          console.log(err);
          res.sendStatus(400);
        }
        console.log(data);
        res.send({ ok: true });
      });
    } catch (err) {
      console.log(err);
    }
  };

  export const addLesson = async (req, res) => {
    try{
    const{ slug, instructorId} = req.params;
    const{ title, content, content_pdf} = req.body;
    if(req.user._id != instructorId){
        return res.status(400).send("No esta autorizado");
    }
    const updated = await Course.findOneAndUpdate(
        {slug},
        {
        $push: {lessons:{title, content, content_pdf , slug: slugify (title)}},
        },
        {new:true}
    ).populate("instructor","_id name").exec();
    res.json(updated);
    } catch (err) {
        console.log("error", error)
        return res.status (400).send("Leccion no añadida")
    }
  };

  export const update=async (req,res) =>  {
   try{
   const {slug} = req.params;
   //console.log(slug)
   const course = await Course.findOne ({slug}).exec;
   //console.log("CURSO ENCONTRADO", course)
   if(req.user._id != course.instructor){
    return res.status(400).send("No autorizado");
   }

   const updated= await Course.findOneAndUpdate({slug}, req.body, {
   new:true
   }).exec();

   res.json(updated);

   } catch (err){

    console.log(err);

    return res.status(400).send(err.message);
   }
};

export const removeLesson= async (req,res)=>{
const {slug, lessonId}=req.params;
const course= await Course.findOne ({slug}).exec();
if(req.user._id != course.instructor){
  return res.status(400).send("No autorizado");
};

const deletedCourse= await Course.findByIdAndUpdate (course._id,{
    $pull:{lessons:{_id:lessonId}},
}).exec();

res.json({ok:true})


};

export const updateLesson= async (req, res)=>{
    try{
        //console.log("Leccion actualizada")

        const {slug} = req.params;

        const {_id, title,content,video,free_preview} = req.body;
    
        const course= await Course.findOne({slug}).select("instructor").exec();
    
        if(course.instructor._id != req.user._id){
            return res.status(400).send("No autorizado");
        };
    
        const updated= await Course.updateOne(
        {"lessons._id": _id},
        {
        $set:{
            "lessons.$.title":title,
            "lessons.$.content":content,
            "lessons.$.video":video,
            "lessons.$.free_preview":free_preview,
        }
        },
        {new:true}
        ).exec;
        console.log("updated", updated)
        res.json({ok:true});
    }catch(err){
        console.log(err);
        return res.status(400).sen("Leccion cargada fallida")
    }
}
