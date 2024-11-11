import React, { useContext, useEffect, useState, useCallback } from "react";
import { HeaderContext } from '../../../component/HeaderContext'; // Adjust the import path
import { getUser, getListChildMember, editUser } from "../../../redux/actions/userAction";
import { useParams } from 'react-router-dom';
import LoadingSpinner from '../../../component/LoadingSpinner.js';
import { Tree, TreeNode } from "react-organizational-chart";
import '../UserPage.css';
import SelectParent from "../select/SelectParent";

const UserDetailPage = () => {
    const { setHeaderText, setHeaderBackButton } = useContext(HeaderContext);
    const [state, setState] = useState({ type: 'LOADING', data: null }); // Initial state
    // Get `idUser` from URL params
    const { idUser } = useParams();
    
    // Set up state for `userId` with fallback to localStorage
    const [userId, setUserId] = useState(idUser || JSON.parse(localStorage.getItem('userData')).id);

    useEffect(() => {
        setHeaderText('UserDetail');
        var haveBack = idUser !== undefined
        setHeaderBackButton(haveBack)
        fetchData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setHeaderText, setHeaderBackButton]);

    const fetchData = useCallback(async () => {
        try {
            setState({ type: 'LOADING', data: null })
            const result = await getUser(userId);
            setState(result);
        } catch (error) {
            setState({ type: 'ERROR', msg: 'Failed to fetch user list', code: 500, err: error });
        }
    }, [userId]);

    const updateDataMember = useCallback(async (id) => {
        console.log("UPDATE MEMBER ",id)
        try {
            var lastState = state
            setState({ type: 'LOADING', data: null })
            const result = await editUser(userId, {"id":userId,"parent_id":id});
            setState(result);
        } catch (error) {
            setState(lastState);
        }
    }, []);


    const [childState, setChildState] = useState({ type: 'EMPTY', data: null }); // Initial state

    const fetchChildMember = async () => {
        console.log("TAG FETCH CHILD")
        try {
            setChildState({ type: 'LOADING', data: null })
            var maxLevel = JSON.parse(localStorage.getItem('userData')).level
            if(maxLevel == null) {
                maxLevel = 0
            }
            const result = await getListChildMember(userId, {"maxLevel":maxLevel+2});
            console.log("Tree data:", result.data);
            setChildState(result);
        } catch (error) {
            setChildState({ type: 'ERROR', msg: 'Failed to fetch user list', code: 500, err: error });
        }
    }

    const createNodeTree = (node) => {
        return (
            <TreeNode key={node.id} label={<div class="member-card">
                <div class="member-level">{node.username} Lv.{node.level}</div>
                {node.bonus != null && (
                    <div className="bonus">( Bonus: ${node.bonus} )</div>
                )}
            </div>}>
            {console.log("TAG LENGTH ", node)}
            {node.children_member && node.children_member.length > 0 &&
              node.children_member.map((childNode) => createNodeTree(childNode))
            }
          </TreeNode>
        );
      };

    const renderChildMember = (value) => {
        switch (value) {
          case 'LOADING':
            return <LoadingSpinner />;
          case 'EMPTY':
            return <button onClick={fetchChildMember} >Get Child Member</button>;
          case'ERROR':
            return <p>{childState.msg}</p>;
          default:
            return <div style={{ width: "100%", height: "600px" }}>
            <Tree label={<div></div>}>
                {childState.data.data && childState.data.data.length > 0 &&
                    childState.data.data.map((childNode) => createNodeTree(childNode))
                }
            </Tree>
            </div>;
        }
      };

    const [statusChangeParent, setStatusChangeParent] = useState(false);

    const renderContent = () => {
        console.log("TAG RENDER CONTENT ",state)
        switch(true) {
            case (state.type === 'LOADING'):
                return <LoadingSpinner />;

            case (state.type === 'SUCCESS' && state.data.data != null):
                return (
                        <>
                            <img
                                src={state.data.data.memberPhoto}
                                alt={state.data.data.fullname}
                                className="member-photo"
                            />
                            <p><strong>{state.data.data.fullname}</strong></p>
                            <div className="info-container">
                                <p><strong>ID:</strong> {state.data.data.id}</p>
                                <p><strong>Username:</strong> {state.data.data.username}</p>
                                <p><strong>Email:</strong> {state.data.data.email}</p>
                                <p><strong>Phone Number:</strong> {state.data.data.phoneNumber}</p>
                                <p><strong>Member Type:</strong> {state.data.data.memberType}</p>
                                <p><strong>Last Login:</strong> {new Date(state.data.data.lastLogin).toLocaleString()}</p>
                                <p><strong>Account Created:</strong> {new Date(state.data.data.createdAt).toLocaleString()}</p>
                                <p><strong>Account Updated:</strong> {new Date(state.data.data.updatedAt).toLocaleString()}</p>
                                <p><strong>Device ID:</strong> {state.data.data.deviceId}</p>
                                <p><strong>Token Broadcast:</strong> {state.data.data.tokenBroadcast}</p>
                                <p><strong>Is Suspended:</strong> {state.data.data.isSuspend ? 'Yes' : 'No'}</p>
                                <p><strong>Level :</strong> {state.data.data.level}</p>
                                <p><strong>Bonus:</strong> {state.data.data.bonus}</p>
                                {
                                    state.data.data.parentId != null && (<p><strong>Parent:</strong> {state.data.data.parentId}</p>)
                                }
                                {
                                    statusChangeParent ? 
                                    (<SelectParent id={state.data.data.id} onCancelClicked={() => setStatusChangeParent(false)} onUpdateParentClicked={(id) => updateDataMember(id)}/>) :(<button onClick={() => setStatusChangeParent(true)}>Change Parent</button>
                                    )
                                }
                                
                            </div>
                            <div>
                            {renderChildMember(childState.type)}
                            </div>
                        </>
                    );

            case (state.type === 'ERROR'):
                return <div>Error loading member data.</div>;

            default:
                return <div>Member data Null, please refresh</div>;
        }
    };

      return (
        <div className="member-page">
            {renderContent()}
        </div>
    );
}

export default  UserDetailPage;