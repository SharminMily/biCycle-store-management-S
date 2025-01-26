export interface TUser { 
    id: string ,  
    email: string,
    password: string,
    needsPasswordChange: boolean;
    passwordChangedAt?: Date;
    role:  'user'| 'admin',
    status: 'in-progress' | 'blocked';
    isDeleted: boolean; 
}
