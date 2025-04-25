import UsersModel from "../model/UsersModel.js";
import {TokenEncode} from "../utility/tokenUtility.js";
import SendEmail from "../utility/emailUtility.js";

export const Registration=async(req,res)=>{

    try {
        let reqBody = req.body;
        let existingUser = await UsersModel.findOne({ email: reqBody.email });

        if (existingUser) {
            return res.json({ status: "fail", Message: "Email already exists! Please log in." });
        }

        await UsersModel.create(reqBody);
        return res.json({ status: "success", Message: "User registered successfully" });

    }
    catch (e) {
        return res.json({status:"fail","Message":e.toString()})
    }


}




export const Login=async(req,res)=>{
    try {
        let reqBody=req.body;
        let data=await UsersModel.findOne(reqBody)
        if(data==null){
            return res.json({status:"fail",Message:"User not found"})
        }
        else{
            // Login Success
            let token=TokenEncode(data['email'],data['_id'])
            return res.json({status:"success",Message:"User login successfully",data:{token:token,data:data}})
        }
    }
    catch (e) {
        return res.json({status:"fail","Message":e.toString()})
    }
}



export const ProfileDetails=async(req,res)=>{
    try {
        let user_id=req.headers['user_id']
        let data=await UsersModel.findOne({"_id":user_id})
        return res.json({status:"success",message:"User profile successfully",data:data})
    }
    catch (e) {
        return res.json({status:"fail","Message":e.toString()})
    }
}






export const ProfileUpdate=async(req,res)=>{
    try {
        let reqBody=req.body;
        let user_id=req.headers['user_id']
        await UsersModel.updateOne({"_id":user_id},reqBody)
        return res.json({status:"success",Message:"User Update successfully"})
    }
    catch (e) {
        return res.json({status:"fail","Message":e.toString()})
    }
}











export const EmailVerify=async(req,res)=>{
try {
    let email=req.params.email;
    let data=await UsersModel.findOne({email: email})
    if(data==null){
        return res.json({status:"fail",Message:"User email does not exist"})
    }
    else {

        // Send OTP To Email
        let code=Math.floor(100000+Math.random()*900000)
        let EmailTo= data['email'];
        let EmailText= "Your Code is "+ code;
        let EmailSubject= "Task Manager Verification Code"
         await SendEmail(EmailTo, EmailText, EmailSubject)

        // Update OTP In User
        await UsersModel.updateOne({email: email},{otp:code})
        return res.json({status:"success",Message:"Verification successfully,check email"})

    }
}
catch (e){
    return res.json({status:"fail","Message":e.toString()})
}
}


export const CodeVerify=async(req,res)=>{

    try {

        let email=req.params.email;
        let otp=req.params.otp;
  
       
        let data = await UsersModel.findOne({ email: email, otp: otp.toString() });
       
        if(data==null){
            return res.json({status:"fail",Message:"Wrong Verification Code"})
        }
        else {
            return res.json({status:"success",Message:"Verification successfully"})
        }
        
    }
    catch (e){
        
        return res.json({status:"fail","Message":e.toString()})
    }

}



















export const ResetPassword = async (req, res) => {
    try {
        let email = req.params.email;
        let otp = req.params.otp;
        let password = req.body.password;  


        if (!password || password.trim() === "") {
            return res.json({ status: "fail", message: "Password is required" });
        }

        let data = await UsersModel.findOne({ email: email, otp: otp.toString() });

        if (data === null) {
            return res.json({ status: "fail", message: "Wrong Verification Code" });
        } else {
          
            console.log("User data found:", data);

           
            await UsersModel.updateOne({ email: email }, { password: password });

           
            return res.json({ status: "success", message: "Password Reset successfully" });
        }
    } catch (e) {
   
        console.error("Error:", e);
        return res.json({ status: "fail", message: e.toString() });
    }
};






