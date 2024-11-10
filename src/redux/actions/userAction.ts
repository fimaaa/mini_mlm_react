import axios, { AxiosResponse } from 'axios';
import config from '../../config';
import { ViewState } from '../../model/common/ViewState';
import { ListMemberData, MemberData } from '../../model/member/Member';
import { handleWithTokenRefresher } from './authActions';
import { toQueryString } from '../../utill/Mapping.js';
import { BaseResponse } from '../../model/common/BaseResponse';
import {transformMemberData} from './authActions';

const URL = config.apiUrl;

const apiGetListUser = (param: any) => {
  return async (): Promise<BaseResponse<string, ListMemberData[]|null>> => {
    const queryString = toQueryString(param);

    const response =  await axios.get(`${URL}/v1/member?${queryString}`, { withCredentials: true });
    return response.data
  };
};

export const getListUser = async (param: any): Promise<ViewState<BaseResponse<string, ListMemberData[]|null>>> => {  
    const response =  await handleWithTokenRefresher(apiGetListUser(param))

    if(response.type === "SUCCESS") {
      response.data.data = response.data.data.map(transformListMemberData);
    }

    return response
};

const apiGetListChildMember = (id: string, param: any) => {
  return async (): Promise<BaseResponse<string, ListMemberData[]|null>> => {
    const queryString = toQueryString(param);

    const response =  await axios.get(`${URL}/v1/member/child/${id}?${queryString}`, { withCredentials: true });
    console.log("GETLISTCHILD apiGetListChildMember ", response)
    return response.data
  };
};

export const getListChildMember = async (id: string, param: any): Promise<ViewState<BaseResponse<string, ListMemberData[]|null>>> => {  
    const response =  await handleWithTokenRefresher(apiGetListChildMember(id, param))
    console.log("TAG GETLISTCHILD RESPONSE ", response)
    // if(response.type === "SUCCESS") {
    //   response.data.data = response.data.data.map(transformListMemberData);
    // }

    return response
};

const apiGetUser = (id: string) => {
  return async (): Promise<BaseResponse<string, MemberData|null>> => {  
    const response =  await axios.get(`${URL}/v1/member/${id}`, { withCredentials: true });
    console.log("TAG RESPON1 "+JSON.stringify(response.data.data))
    response.data.data = transformMemberData(response.data.data)
    console.log("TAG RESPON1 Map "+JSON.stringify(response.data.data))
    return response.data
  };
};

export const getUser = async (id: string): Promise<ViewState<BaseResponse<string, MemberData|null>>> => {  
    const response =  await handleWithTokenRefresher(apiGetUser(id))
    console.log("TAG RESPON2 "+JSON.stringify(response))
    return response
};

const apiCreateUser = (form: any) => {
  return async (): Promise<BaseResponse<string, MemberData|null>> => {  
    const response =  await axios.post(`${URL}/v1/member`, form, { withCredentials: true });
    response.data.data = transformMemberData(response.data.data)
    return response.data
  };
};
  
export const createUser = async (form: any): Promise<ViewState<MemberData|null>> => {  
  const response =  await handleWithTokenRefresher(apiCreateUser(form))
  return response
};

const apiEditUser = (form: any) => {
  return async (): Promise<BaseResponse<string, MemberData|null>> => {  
    const response =  await axios.put(`${URL}/v1/member`, form, { withCredentials: true });
    response.data.data = transformMemberData(response.data.data)
    return response.data
  };
};
  
export const editUser = async (id: string, form: any): Promise<ViewState<BaseResponse<string, MemberData|null>>> => {  
  const updatedFormData = {
    ...form,
    id: id
  };
  const response =  await handleWithTokenRefresher(apiEditUser(updatedFormData))
  return response
};

const apiDeleteUser = (id: string) => {
  return async (): Promise<BaseResponse<string, MemberData|null>> => {  
    const response =  await axios.delete(`${URL}/v1/member/${id}`, { withCredentials: true });
    response.data.data = transformMemberData(response.data.data)
    return response.data
  };
};

export const deleteUser = async (id: string): Promise<ViewState<MemberData|null>> => {  
    const response =  await handleWithTokenRefresher(apiDeleteUser(id))
    return response
};

const transformListMemberData = (data: any): ListMemberData => ({
    id: data.id,
    username: data.username,
    fullname: data.fullname,
    memberType: data.member_type,
    isSuspend: data.is_suspend,
    memberPhoto: data.photo_member,
    parentId: data.parent_id,
    level: data.level,
    bonus: data.bonus,
  });

export const transformMemberFormData = (formData: any) => {
    return {
        username: formData.username,
        fullname: formData.fullname,
        password: formData.password,
        member_type: formData.memberType,
        phone_number: formData.phoneNumber || null,
        email: formData.email || null,
        photo_member: formData.memberPhoto || null,
    };
};