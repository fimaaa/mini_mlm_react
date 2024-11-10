import axios, { AxiosResponse, AxiosError } from 'axios';
import config from '../../config';
import { ErrorResponse, ViewState } from '../../model/common/ViewState';
import { ListMemberData, MemberData } from '../../model/member/Member';
import { BaseResponse } from '../../model/common/BaseResponse';
import Cookies from 'js-cookie';


const URL = config.apiUrl;

export const loginUser = async (form: { username: string; password: string; id_device: string;  token_broadcast: string}): Promise<ViewState<MemberData|null>> => {
  var msg: string = ""
  try {
    form.id_device = "web"
    const response = await axios.post(`${URL}/v1/auth/login`, form, {
      withCredentials: true, // Include credentials (cookies),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 200) {
      const accessToken = Cookies.get('accessToken');
      const refreshToken = Cookies.get('refreshToken');
      console.log("Login successful! Access Token:", accessToken);
      console.log("Refresh Token:", refreshToken);
      // Store tokens securely (e.g., local storage with appropriate expiration)

      const userData = transformMemberData(response.data.data);
      localStorage.setItem("userData", JSON.stringify(userData))

      const successState: ViewState<MemberData> = { type: 'SUCCESS', data: userData };
      return successState
    } else {
      console.error("Login failed:", response.data);
      // Handle login failure (e.g., display error message)
      msg = response.data.msg
    }
  } catch (error) {
    console.error("Login error:", error);
    // Handle login errors (e.g., network issues)
  }

  const state: ViewState<MemberData|null> = { type: 'ERROR', data:null, msg:msg, code:-1};
  return state
}

function isAxiosError(error: any): error is AxiosError {
  return axios.isAxiosError(error);
}


function isErrorResponse(data: any): data is ErrorResponse {
  return data && typeof data === 'object' && 'code' in data; 
}

export const handleWithTokenRefresher = async (listener: () => Promise<BaseResponse<string, any>>): Promise<ViewState<any|null>> => {
  try {
    // Perform the API call
    const response = await listener()
    const successState: ViewState<any> = { type: 'SUCCESS', data: response};
    return successState;
  } catch (error) {
    console.log("TAG ERROR ", error)
    var errorState: ViewState<null> = {
      type: 'ERROR',
      msg: 'An error occurred',
      code: 500,
      err: Error('An error occurred'),
      errResponse: undefined,
    };

    if (!isAxiosError(error)) {
      return errorState
    }

    if(!isErrorResponse(error.response?.data)) {
      return errorState
    }

    errorState = {
      type: 'ERROR',
      msg: error.response?.data?.data || 'An error occurred',
      code: error.response?.status || 500,
      err: error,
      errResponse: error.response?.data,
    };

    console.log("TAG ERROR API ", error.response?.data)

    if (error.response?.data?.code === 401 || error.response?.data?.code_message === 'Token expired') {
      const refreshTokenSuccess = await handleRefresherToken();
      if (refreshTokenSuccess) {
        try {
          // Retry the listener after refreshing the token
          const response = await listener();
          const successState: ViewState<any> = { type: 'SUCCESS', data: response };
          
          return successState;
        } catch (retryError) {
        }
      } else {
        localStorage.removeItem("userData")
        window.location.href = "/login"; 
      }
    }

    // On error, return error state with details
    return errorState;
  }
};

const handleRefresherToken = async (): Promise<boolean> => {
  try {
    const response = await axios.post(`${URL}/v1/auth/refresh`, {}, { withCredentials: true});

    const userData = transformMemberData(response.data.data);
    // localStorage.setItem("token", userData.token);
    // localStorage.setItem("refresh_token", userData.refreshToken);
    localStorage.setItem("userData", JSON.stringify(userData))

    return userData != null
  } catch (error) {
    return false
  }
}



export const transformMemberData = (data: any): MemberData => ({
    id: data.id,
    username: data.username,
    fullname: data.fullname,
    memberType: data.member_type,
    isSuspend: data.is_suspend,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    tokenBroadcast: data.token_broadcast,
    lastLogin: data.last_login,
    deviceId: data.id_device,
    phoneNumber: data.phone_number,
    email: data.email,
    memberPhoto: data.photo_member,
    parentId: data.parent_id,
    level: data.level,
    bonus: data.bonus
});