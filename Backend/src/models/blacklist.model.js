const mongoose = require('mongoose')

const blackListTokenSchema = new mongoose.Schema({
    token:{
        type:String,
        required:[true,"token is required to be added in blacklist"]
    }
},{
    timestamps:true
})

const tokenblacklistmodel=mongoose.model("blacklistTokens",blackListTokenSchema)
module.exports=tokenblacklistmodel