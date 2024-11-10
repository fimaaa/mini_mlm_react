import React, { useState, useCallback, useEffect } from 'react';
import { getListUser } from "../../../redux/actions/userAction";
import '../UserPage.css';
import LoadingSpinner from '../../../component/LoadingSpinner.js';

const SelectParent = ({ id, onCancelClicked, onUpdateParentClicked }) => {
    const [state, setState] = useState({ type: 'LOADING', data: null }); // Initial state
    const [searchQuery, setSearchQuery] = useState('');
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    useEffect(() => {
        fetchData();
      }, [searchQuery]);

    const fetchData =useCallback(async () => {
        if(searchQuery.length <= 3) {
            setState({type: 'EMPTY'})
            return
        }
        try {
            console.log("TAG SEARCHQUERY ", searchQuery)
            setState({ type: 'LOADING', data: null })
            const baseReqFind = {
              page: 0,
              size: 5,
              value: JSON.stringify({ "username": searchQuery, "fullname": searchQuery, "banned_id": [id]}),
              sort_by: JSON.stringify({ key: 'username', value: 'asc' })
            };
            const result = await getListUser(baseReqFind);
            console.log("TAG DATA ", result.data)

            setState(result);
        } catch (error) {
            setState({ type: 'ERROR', msg: 'Failed to fetch user list', code: 500, err: error });
        }
      }, [searchQuery]);

      const ListMember = (value) => {
        console.log("TYPE ", value, " == ", value === "LOADING")
        switch (value.value) {
            case "LOADING":
                console.log("TYPE IS LOADING")
                return <LoadingSpinner />;
            case "EMPTY":
                return <></>;
            case"ERROR":
                return <p>{state.msg}</p>;
            default:
                console.log("TYPE IS DEFAULT")
                return <div>
                    <p onClick={() => onUpdateParentClicked(null)} class="member-card">Non Parent</p>
                    {state.data.data && state.data.data.length > 0 &&
                        state.data.data.map((data) => (<p onClick={() => onUpdateParentClicked(data.id)} class="member-card">{data.username}</p>))
                    }
                </div>;
        }
      }

    return (
        <div>
        <input
            type="text"
            placeholder="Search organizers"
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
        />
        {console.log("RETURN SELECT ", state.type)}
        <ListMember value={state.type} />
        <button onClick={onCancelClicked}>Cancel</button>
        </div>
    )
}

export default SelectParent