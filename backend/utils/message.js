const success=(message,data=null)=>
{
    return {
        success:true,
        message:message,
        data:data
    }
}
const failed=(message)=>
{
    return {
        success:false,
        message:message
    }
}


module.exports={success,failed}