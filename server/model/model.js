const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    confirmPassword: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    role: {type: String, required: true},
});

const vendorSchema = new Schema({
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    confirmPassword: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    canteenName : {type: String, required: true },
    addressOrDescription : {type: String, required: false },
    terms : {type:Boolean, required: true},
    bar : {type:Number, default:0},
    status:{type:String,default:"Pending"},
    qrCode : {type:String,default:"https://www.google.com/url?sa=i&url=https%3A%2F%2Fdepositphotos.com%2Fvector-images%2Fno-image-available.html&psig=AOvVaw18sViR7ESc9OINM6pNCFTJ&ust=1687413928725000&source=images&cd=vfe&ved=0CBEQjRxqFwoTCJDnuvDY0_8CFQAAAAAdAAAAABAI"},
});

const adminSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    
});

const orderSchema = new Schema({
    name : {type: String, required:true},
    price : {type: Number, required:true},
    quantity :{type: Number, required:true},
    token : {type: Number},
    status : {type: String, default:"Pending"},
    canteenId : {type: mongoose.Schema.Types.ObjectId, ref: 'vendor'},
    userId : {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    date: { type: Date, default: new Date() },
    role: {type:String, required:true},
    canteenName : {type:String, required:true, default:"Canteen"},
    qrCode:{type:String},
    delivery : {type:String,default:"No"},
})

const menuSchema = new Schema({
    canteenId : {type: mongoose.Schema.Types.ObjectId, ref: 'vendor'},
    name : {type: String, required:true},
    price : {type: Number, required:true},
    time : {type: Number, required:true},
    category : {type: String, required:true},
})

const basketSchema = new Schema({
    name : {type: String, required:true},
    price : {type: Number, required:true},
    quantity :{type: Number, required:true},
    canteenId : {type: mongoose.Schema.Types.ObjectId, ref: 'vendor'},
    userId : {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    status : {type: String, default:"Unpaid"},
    canteenName : {type: String, required:true},
    qrCode:{type:String},
    role:{type:String},
})

const reviewSchema=new Schema({
    title:{type:String,required:true},
    description: {type:String,required:true},
    rating1:{type:String,default:0},
    rating2:{type:String,default:0},
    rating3:{type:String,default:0},
    status:{type:String,default:"Pending"}
});

const announcementSchema=new Schema({
    title:{type:String,required:true},
    description: {type:String,required:true},
    canteenName : {type:String,required:true},
    date: { type: Date, default: new Date() }
});

const accountSchema = new Schema({
    canteenId : {type: mongoose.Schema.Types.ObjectId, ref: 'vendor'},
    userId : {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    amount : {type: Number, default:0},
});

const employeeSchema = new Schema({
    name : {type: String, required:true},
    salary : {type: Number, required:true},
    address : {type:String,default:"No"},
    phoneNumber: { type: String },
    work: { type: String },
    canteenId : {type: mongoose.Schema.Types.ObjectId, ref: 'vendor'},
});

const user = mongoose.model('User', userSchema);
const vendor = mongoose.model('Vendor', vendorSchema);
const admin = mongoose.model('Admin', adminSchema);
const order = mongoose.model('Order',orderSchema);
const menu = mongoose.model('Menu',menuSchema);
const basket = mongoose.model('Basket',basketSchema);
const review = mongoose.model('Review', reviewSchema);
const announcement = mongoose.model('Announcement',announcementSchema);
const account = mongoose.model('Account',accountSchema);
const employee = mongoose.model('Employee',employeeSchema);


module.exports = {user,vendor,admin,order,menu,basket,review,announcement,account,employee};