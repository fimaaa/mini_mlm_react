import React, { useContext, useEffect, useState, useCallback } from 'react';
import { HeaderContext } from '../../../component/HeaderContext'; // Adjust the import path
import { getListUser } from "../../../redux/actions/userAction";
import LoadingSpinner from '../../../component/LoadingSpinner.js';
import ReactPaginate from 'react-paginate';
import UserTable from './UserTable.js';
import { useNavigate } from 'react-router-dom';
import '../UserPage.css';

const UserPage = () => {
    const { setHeaderText } = useContext(HeaderContext);
    const [state, setState] = useState({ type: 'LOADING', data: null }); // Initial state
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);
    const [sortBy, setSortBy] = useState({ key: 'id', value: 'asc' });
    const itemsPerPage = 10

    const navigate = useNavigate();

    const fetchData =useCallback(async () => {
        try {
            setState({ type: 'LOADING', data: null })
            const sortParam = {
              [sortBy.key]: sortBy.value === 'asc' ? -1 : 0
            };
            const baseReqFind = {
              page: itemOffset,
              size: itemsPerPage,
              // value: 'someValue',
              sort_by: JSON.stringify(sortParam)
            };
            const result = await getListUser(baseReqFind);
            console.log("TAG DATA ", result.data)
            setPageCount(Math.ceil(result.data.pagination.total_records/itemsPerPage))

            setState(result);
        } catch (error) {
            setState({ type: 'ERROR', msg: 'Failed to fetch user list', code: 500, err: error });
        }
      }, [itemOffset, itemsPerPage, sortBy]);

    useEffect(() => {
      setHeaderText('List User');
    }, [setHeaderText]); // fetchData is included as a dependency

    useEffect(() => {
      fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [itemOffset, itemsPerPage, sortBy]);

    const handleRefresh = () => {
      fetchData();
    };

    const handlePageClick = (event) => {
      setItemOffset(event.selected)
    };

    const handleSortChange = (column) => {
      setSortBy(prevSortBy => {
        if (prevSortBy.key === column) {
          return {
            key: column,
            value: prevSortBy.value === 'asc' ? 'desc' : 'asc'
          };
        }
        return {
          key: column,
          value: 'asc'
        };
      });
    };

    return (
        <>
          {state.type === 'LOADING' && <LoadingSpinner/>}
          <div style={{flex:1}}>
            <div className="button-container">
            <button onClick={() => navigate("create/user")} disabled={state.type === 'LOADING'}>
                Create
              </button>
              <button onClick={handleRefresh} disabled={state.type === 'LOADING'}>
                <i className="fas fa-sync-alt"></i>
              </button>
            </div>
            {console.log("TAG MEMEBER ", state)}
            {state.type === "SUCCESS" && state.data.data != null &&
              <UserTable data={state.data.data} sortBy={sortBy} onSortChanged={handleSortChange} onRefreshList={handleRefresh}/>
            }
          </div>
          <div>
            <ReactPaginate
              breakLabel="..."
              nextLabel=">>"
              onPageChange={handlePageClick}
              pageRangeDisplayed={itemsPerPage}
              pageCount={pageCount}
              previousLabel="<<"
              renderOnZeroPageCount={null}
              containerClassName={"pagination"}
              pageClassName={"page-item"}
              pageLinkClassName={"page-link"}
              previousClassName={"page-item"}
              previousLinkClassName={"page-link"}
              nextClassName={"page-item"}
              nextLinkClassName={"page-link"}
              breakClassName={"page-item"}
              breakLinkClassName={"page-link"}
              activeClassName={"active"}
            />
          </div>
        </>
      );
}

export default  UserPage;