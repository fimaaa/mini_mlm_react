import React, { useContext, useCallback, useState, useEffect } from 'react';
import './EditMemberForm.css'; // CSS for styling
import { ViewState } from '../../../model/common/ViewState';
import { HeaderContext } from '../../../component/HeaderContext'; 
import { MemberData } from '../../../model/member/Member';
import { useNavigate, useParams } from 'react-router-dom';
import { editUser, getUser, transformMemberFormData } from "../../../redux/actions/userAction";
import LoadingSpinner from '../../../component/LoadingSpinner';
import { BaseResponse } from '../../../model/common/BaseResponse';

const EditMemberForm = () => {
    const navigate = useNavigate();
    const { setHeaderText } = useContext(HeaderContext);
    const { idUser } = useParams();
    const [state, setState] = useState<ViewState<BaseResponse<string, MemberData|null>>>({ type: 'LOADING' });

    useEffect(() => {
        setHeaderText('Edit User');
        fetchData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [setHeaderText]);

    const fetchData = useCallback(async () => {
        try {
            setState({ type: 'LOADING'})
            const result = await getUser(idUser as string);
            setState(result);
            if(result.type === "SUCCESS" && result.data.data != null) {
                setFormData({
                    fullname: result.data.data.fullname,
                    memberType: result.data.data.memberType,
                    isSuspend: result.data.data.isSuspend,
                    phoneNumber: result.data.data.phoneNumber,
                    email: result.data.data.email,
                    memberPhoto: result.data.data.memberPhoto,
                    password: '',
                    username: result.data.data.username
                })
            }
        } catch (error) {
            setState({ type: 'ERROR', msg: 'Failed to fetch user list', code: 500, err: error as Error });
        }
    }, [idUser]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setState({ type: 'LOADING'})
            const result = await editUser(idUser as string, transformMemberFormData(formData))
            setState(result)
            console.log("STATE EDIT ", result)
            if(result.type === "SUCCESS") {
                console.log("STATE EDIT SUCCESS")
                navigate("/");
            }
        } catch (error) {
            setState({ type: 'ERROR', msg: 'Failed to fetch data', code: 500, err: error as Error });
            console.error('Error creating member:', error);
            alert('Failed to create member.');
        }
    };

    const [formData, setFormData] = useState({
        username: '',
        fullname: '',
        memberType: '',
        isSuspend: false,
        phoneNumber: '',
        email: '',
        memberPhoto: '',
        password: ''
    });

    const [isFormValid, setIsFormValid] = useState(false);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            setFormData({
                ...formData,
                [name]: (e.target as HTMLInputElement).checked
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const isValidPhoneNumber = (phoneNumber: string): boolean => {
        const phoneNumberPattern = /^[0-9]{10,15}$/; // Adjust the pattern based on your requirements
        return phoneNumberPattern.test(phoneNumber);
    };

    const validateForm = (): boolean => {
        const {
            username, fullname, memberType, phoneNumber, email
        } = formData;
    
        // Ensure all required fields are non-empty strings and phone number is valid
        return (
            username.trim() !== '' &&
            fullname.trim() !== '' &&
            memberType.trim() !== '' &&
            phoneNumber.trim() !== '' &&
            email.trim() !== '' &&
            isValidPhoneNumber(phoneNumber)
        );
    };
    

    useEffect(() => {
        setIsFormValid(validateForm());
    }, [formData]);

    return (
        <>
        {state.type === 'LOADING' && <LoadingSpinner/>}
        {state.type === 'SUCCESS' && state.data && (
            <form onSubmit={handleSubmit} className="edit-member-form">
                <label>
                    Username:
                    <input type="text" name="username" value={formData.username} onChange={handleChange} required />
                </label>
                <label>
                    Fullname:
                    <input type="text" name="fullname" value={formData.fullname} onChange={handleChange} required />
                </label>
                <label>
                    Member Type:
                    <select name="memberType" value={formData.memberType} onChange={handleChange} required>
                        <option value="">Select type</option>
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                    </select>
                </label>
                <label>
                    Is Suspend:
                    <input type="checkbox" name="isSuspend" checked={formData.isSuspend} onChange={handleChange} />
                </label>
                {/* <label>
                    Created At:
                    <input type="datetime-local" name="createdAt" value={formData.createdAt} onChange={handleChange} required />
                </label> */}
                <label>
                    Phone Number:
                    <input
                        type="text"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        required
                        pattern="[0-9]{10,15}" // Example pattern for phone numbers
                        title="Phone number should be between 10 to 15 digits"
                    />
                    {!isValidPhoneNumber(formData.phoneNumber) && (formData.phoneNumber !== "") && <p className="error-message">Invalid phone number</p>}
                </label>
                <label>
                    Email:
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </label>
                <label>
                    Member Photo URL:
                    <input type="url" name="memberPhoto" value={formData.memberPhoto} onChange={handleChange} />
                </label>
                <label>
                    Password:
                    <input
                        type='password'
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength={8} // Example requirement for minimum length
                        title="Password must be at least 8 characters long"
                    />
                </label>

                <button type="submit" disabled={!isFormValid} className={`submit-button ${!isFormValid ? 'disabled' : ''}`}>
                    Create Member
                </button>
            </form>
        )}
        </>
    );
};

export default EditMemberForm;