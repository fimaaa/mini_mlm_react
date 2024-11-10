import React, { useContext, useState, useEffect } from 'react';
import './CreateMemberForm.css'; // CSS for styling
import { ViewState } from '../../../model/common/ViewState';
import { MemberData } from '../../../model/member/Member';
import { createUser, transformMemberFormData } from '../../../redux/actions/userAction';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../../component/LoadingSpinner';
import { HeaderContext } from '../../../component/HeaderContext'; 


const CreateMemberForm = () => {
    const navigate = useNavigate();
    const { setHeaderText } = useContext(HeaderContext);
    useEffect(() => {
        setHeaderText('Create User');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setHeaderText]);


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

    const [state, setState] = useState<ViewState<MemberData|null>>({ type: 'EMPTY', msg:"init" });
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setState({ type: 'LOADING'})
            // await axios.post('http://localhost:3001/api/v1/member', formData);
            // alert('Member created successfully!');
            const data = await createUser(transformMemberFormData(formData))
            setState(data);
            if(data.type === "SUCCESS") {
                navigate(-1);
            }
        } catch (error) {
            setState({ type: 'ERROR', msg: 'Failed to fetch data', code: 500, err: error as Error });
            console.error('Error creating member:', error);
            alert('Failed to create member.');
        }
    };

    return (
        <>
        {state.type === 'LOADING' && <LoadingSpinner/>}
        {state.type !== 'LOADING' && (
            <form onSubmit={handleSubmit} className="create-member-form">
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

export default CreateMemberForm;