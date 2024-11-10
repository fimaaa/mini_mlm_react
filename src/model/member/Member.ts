export interface MemberData {
    id: string;
    username: string;
    fullname: string;
    memberType: string;
    isSuspend: boolean;
    createdAt: string;
    updatedAt: string;
    tokenBroadcast: string;
    lastLogin: string;
    deviceId: string;
    phoneNumber: string;
    email: string;
    memberPhoto: string;
    parentId: string;
    level: number;
    bonus: number;
}

export interface ListMemberData {
    id: string;
    username: string;
    fullname: string;
    memberType: string;
    isSuspend: boolean;
    memberPhoto: string;
    parentId: string;
    level: number;
    bonus: number;
}
  
export interface CreateMemberData {
    username: string;
    fullname: string;
    password: string;
    memberType: string;
    phoneNumber?: string;
    email?: string;
    memberPhoto?: string;
}

export interface LoginForm {
    username: string;
    password: string;
}