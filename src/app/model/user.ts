import { Address } from "./address"

export type userE_DTO={
    username:string;
    referral_by:string
    email:string
    phone:string
    referralId:string
    walletBalance:number;
    activeStatus:boolean;
    status_date:Date;
}

export type LoginFm={
    email:String,
    password:string
}


export type Authentication={
    sai:string,
    email:string,
    token:string,
    username:string,
    role:string,
    status:string
}
export type Dashboard={
    EWallet:number,
    AllMembers:number,
    DirectMembers:number,
    Products:number,
    OutOfStock:number,
    Today:number,
    Yesterday:number,
}
export type userRegs ={
    first_name?:string,
    last_name?:string,
    email?:string,
    password?:string,
    phone_number?:string,
    profile_pic_id?:string,
    pan_number?:string,
    aadhaar_number?:string,
    referral_by?:string,
    user_id?:string,
    user_state?:string,
    address?:Address
}