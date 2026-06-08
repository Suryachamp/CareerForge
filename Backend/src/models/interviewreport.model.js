const mongoose = require('mongoose');

/**
 * Job description schema :String
 * resume text: string
 * self description:string
 * matchscore:number
 * technical questions and answers :
 *      [{
 *          question: "",
 *          answer: "",
 *          intention: "",
 *      }]
 * behavioural questions :
 *      [{
 *          question: "",
 *          answer: "",
 *          intention: "",
 *      }]
 * skill gaps :
 *      [{  
 *          skil:""
 *          severity :{
 *              type:"string",
 *              enum:["low","medium","high"]
 *          }
 *      }]
 * preparation plan :
 *      [{
 *          day:number,
 *          focus:string,
 *          task:[string]
 *      }]
 *  
 */

const technicalQuestionsSchema = new mongoose.Schema({
    question:{
        type:String,
        required:[true,"Technical question is required"]
    },
    intention:{
        type:String,
        required:[true,"Intention is required"]
    },
    answer:{
        type:String,
        required:[true,"Answer is required"]
    }
},{
    _id:false
})

const behaviouralQuestionsSchema = new mongoose.Schema({
    question:{
        type:String,
        required:[true,"Technical question is required"]
    },
    intention:{
        type:String,
        required:[true,"Intention is required"]
    },
    answer:{
        type:String,
        required:[true,"Answer is required"]
    }
},{
    _id:false
})

const skillGapSchema = new mongoose.Schema({
    skill:{
        type:String,
        required:[true,"skill is required"]
    },
    severity:{
        type:String,
        enum:["low","medium","high"],
        required:[true,"severity is required"]
    }
},{
    _id:false
})

const preparationPlanSchema = new mongoose.Schema({
    day:{
        type:Number,
        required:[true,"Day is required"]
    },
    focus:{
        type:String,
        required:[true,"Focus is required"]
    },
    task:{
        type:String,
        required:[true,"Task is required"]
    }
},{
    _id:true
})

const interviewReportSchema = new mongoose.Schema({
    jobDescription:{
        type:String,
        required:[true,"Job Description is requires"]
    },
    resume:{
        type:String,
    },
    selfDescription:{
        type:String,
    },
    matchScore:{
        type:Number,
        min:0,
        max:100
    },
    technicalQuestions:[technicalQuestionsSchema],
    behaviouralQuestionsSchema:[behaviouralQuestionsSchema],
    skillGap:[skillGapSchema],
    preparationPlanS:[preparationPlanSchema],
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    }
},{
    timestamps:true
})


const interReportModel = mongoose.model("InterviewReport",interviewReportSchema)
module.exports=interReportModel;