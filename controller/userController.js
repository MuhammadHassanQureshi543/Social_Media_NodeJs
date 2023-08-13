const user = require('../model/userModel')
const postModel = require('../model/postModel')
const userModel = require('../model/userModel')
const multer = require('multer')
const { post } = require('../routes/userRoutes')
const { query } = require('express')
// const catogeriesModel = require('../model/catogeriesModel') 


const multerStoarge = multer.diskStorage({
    destination:"public/img/user",
    filename:(req,file,next)=>{
        if(file.fieldname === "photo"){
            next(null,`${file.fieldname}-${Date.now()}.png`)
        }else{
            next()
        }
    }
})

const uploadimage= multer({
    storage : multerStoarge
}) 

exports.uploadUserphoto = uploadimage.single('photo');

exports.creatUser = async(req,res,next)=>{
    try{
    req.body.photo = req.file.filename

    const user = await userModel.create(req.body)
    res.status(200).json({
        status:'Success',
        data:user
    })
    }catch(err){
        if(err.code === 11000){
            let fieldArry = []
            for(const item in err.keyPattern){
                fieldArry.push(item)
            }
            res.status(200).json({
                status:'error',
                message:`duplicate entery on ${fieldArry.join(",")}`,
            })
        }
        
    }
    
}

exports.loginUser = async(req,res,next)=>{
    let user = await userModel.findOne({email:req.body.email,password:req.body.Password})
    if(user === null){
        res.status(400).json({
            status:'Error',
            message:"Login Denied. Maybe Mail or Password Incorect ."
        })
    }else{
        res.status(200).json({
            status:'Success',
            message:"Login Successfull",
            data:user
        })
    }
   
}

exports.sendFriendRequest = async(req,res,next)=>{
    let User = await userModel.findById(req.query.userid)
    let me = await userModel.findById(req.query.myid)
    let check = User.friendrequest.includes(req.query.myid)
    let secondcheck = User.friends.includes(req.query.myid)
    if(secondcheck){
            res.status(400).json({
                status:"Bad Request",
                message:`${User.name} & ${me.name} are alredy friends`
            })
        }
    else{
        if(check){
            res.status(400).json({
                status:"Bad Request",
                message:`Friend Request alredy exsist`
            })
        }else{

            User.friendrequest.push(req.query.myid)
            User = await User.save();
            res.status(200).json({
                status:"Sucess",
                User
            })
        }

    } 
    
}

exports.acceptRequest = async(req,res,next)=>{
    let mineid = await userModel.findById(req.query.myid)
    const check = mineid.friendrequest.includes(req.query.userid)
    let useracc = await userModel.findById(req.query.userid)
    if(check){
        const secondcheck = mineid.friends.includes(req.query.userid)
        if(secondcheck){
            res.status(400).json({
                status:"Bad Request",
                message:`You are already friend`
            })
            
        }else{
        useracc.friends.push(req.query.myid)
        useracc = await useracc.save();
        mineid.friends.push(req.query.userid)
        mineid.friendrequest.splice(req.query.userid)
        mineid = await mineid.save();
        
        res.status(200).json({
            status:"Sucess",
            message:`${useracc.name} and ${mineid.name} are now friend `
        })
        }
        
        
    }else{
    res.status(200).json({
        status:"Sucess",
        message:"No Such a friend find"
    })
}
}

exports.getdata = async(req,res,next)=>{
    // let user = await userModel.findById(req.query.myid)
    // let friend = user.friends
    // arr = []
    // friend = friend.filter((item)=>{
    //     arr.push(item)
    //     return item
    // })
    // let c = []
    // for(let i = 0; i < arr.length ; i++){
    //     let fetch = await userModel.findById(arr[i])
    //     c.push(fetch)
    // }
    let user = await userModel.findById(req.query.myid).populate('friends','name photo _id') 
    res.status(200).json({
        status:"Sucess",
        Friend:user.friends
    })
   
}

exports.getFriendSuggestion = async(req,res,next)=>{
    let users = await userModel.find()
    users = users.filter(item=>String(item._id) !== String(req.query.myid))
    users = users.filter(item=> !item.friends.includes(req.query.myid))
    users = users.filter(item=> !item.friendrequest.includes(req.query.myid))
    res.status(200).json({
        status:"Sucess",
        users
    })
}

exports.creatPost = async(req,res,next)=>{
    req.body.photo = req.file.filename
    const post = await postModel.create(req.body)
    res.status(200).json({
        status:"Sucess",
        post
    })
}

exports.getmyfriendrequest = async(req,res,next)=>{
    let user = await userModel.findById(req.query.myid).populate('friendrequest','name photo _id')
    res.status(200).json({
        status:"Sucess",
        User:user.friendrequest
    })
}

exports.unfriendUser = async(req,res,next)=>{
    let me = await userModel.findById(req.query.myid)
    let myfrind = await userModel.findById(req.query.userid)
    let check = me.friends.includes(req.query.userid)
    if(me.friends.includes(req.query.userid)){
        me.friends.splice(req.query.userid)
        me = await me.save()
        myfrind.friends.splice(req.query.myid)
        myfrind = await myfrind.save()
        res.status(200).json({
            status:"Sucess",
            message:`Sucessfully Unfriend ${myfrind.name}`
        })
    }else{
        res.status(400).json({
            status:"fail",
            message:`${myfrind.name} is not your friend !`
        }) 
    }
}

exports.getPost = async(req,res,next)=>{
    let me = await userModel.findById(req.query.id)
    let friendpost = []
    for(const item of me.friends){
        let post = await postModel.find({user:item})
        friendpost.push(...post)
    }

    res.status(200).json({
        status:"Sucess",
        friendpost
    })
}

exports.likePost = async(req,res,next)=>{
    let post = await postModel.findById(req.query.postid)
    let likestatus = ''
    if(post.likes.includes(req.query.myid)){
        post.likes = post.likes.filter(item=> String(item) !== String(req.query.myid))
        likestatus = 'UNLIKE'
    }else{
        post.likes.push(req.query.myid)
        likestatus = 'LIKE'
    } 
    post.save()
    res.status(200).json({
        status:"Sucess",
        likestatus
    })
}