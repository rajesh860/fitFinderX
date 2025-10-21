// src/types/user.types.ts
 interface emergency_contactsInterface {
  name:string;
  relation:string;
  phone:string;

}
export interface UserDetail {
    id: string;
    first_name: string;
    last_name: string;
    phone?: string;
    photo?: string;
    status?: string;
    plan?: string;
    weight?: string;
    height?:string;
    blood_group?:string;
    fee_amount?:string;
    fee_status?:string;
    registration_date?:string;
    medical_conditions?:string;
    fitness_goals?:string;
    emergency_contacts?:emergency_contactsInterface[];
  }
export interface enquiryInter {
    gymId: string;
    date: string;
    time: string;
   
  }
  export interface loginInter {
    success:boolean,
    message:string,
    token?:any,
  }
  
  interface gymListData {
    name:string,
    coverImage:string[];
    fees_monthly:string;
    address:string;
    _id:string;

  }
export interface GymList {
    success:string,
    data:gymListData[]
  }
  
export interface trainer {
    success:string,
    data:gymListData[]
  }
  