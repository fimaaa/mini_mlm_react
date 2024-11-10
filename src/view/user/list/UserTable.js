import React from 'react';
import { useTable, useSortBy } from 'react-table';
import './UserTable.css'; // Adjust the path as necessary
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import { deleteUser } from '../../../redux/actions/userAction';


const UserTable = ({ data, sortBy, onSortChanged, onRefreshList }) => {
  const navigate = useNavigate();

  const columns = React.useMemo(
    () => [
      {
        Header: 'Actions',
        Cell: ({ row }) => (
          <div>
            <button
              className="action-button edit"
              onClick={(e) => {
                handleEdit(row)
                e.stopPropagation()
              }
            }
            >
              Edit
            </button>
            <button
              className="action-button delete"
              onClick={(e) => {
                  handleDelete(row)
                  e.stopPropagation()
                }
              }
            >
              Delete
            </button>
          </div>
        ),
      },
      {
        Header: 'ID',
        accessor: 'id',
      },
      {
        Header: 'Username',
        accessor: 'username',
      },
      {
        Header: 'Full Name',
        accessor: 'fullname',
      },
      {
        Header: 'Member Type',
        accessor: 'memberType',
      },
      {
        Header: 'Suspended',
        accessor: 'isSuspend',
        Cell: ({ value }) => (value ? 'Yes' : 'No')
      }
    ],
    []
  );

  const handleEdit = (row) => {
    navigate("edit/user/"+row.original.id)
    // alert('Edit action on ' + row.original.id);
  };

  const handleDelete = async (row) => {
    const confirmed = await swal({
      title: "Are you sure?",
      text: `Are you sure you want to delete data ${row.original.id} - ${row.original.name}?`,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });

    if (confirmed) {
      swal({
        title: "Deleting...",
        text: "Please wait while we delete the data.",
        icon: "info",
        buttons: false,
        closeOnClickOutside: false,
        closeOnEsc: false,
      });
      try {
        // await axios.delete(`http://localhost:3001/api/v1/member/${id}`);
        await deleteUser(row.original.id)
        swal("Deleted!", "The member has been deleted.", "success");
        onRefreshList()
      } catch (error) {
        console.error('Error deleting member:', error);
        swal("Error!", "Failed to delete the member.", "error");
      }
    } else {
      swal("Cancelled", "Your data is safe!", "info");
    }
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data }, useSortBy);

  return (
    <div className="UserTable">
      <table {...getTableProps()} className="styled-table">
      <thead>
          {headerGroups.map(headerGroup => {
            const { key, ...restHeaderGroupProps } = headerGroup.getHeaderGroupProps();
            return (
              <tr key={key} {...restHeaderGroupProps}>
                {headerGroup.headers.map(column => {
                  const isSorted = column.id === sortBy.key;
                  const sortIndicator = isSorted ? (sortBy.value === 'asc' ? ' 🔼' : ' 🔽') : '';
                  const { key, ...restColumnProps } = column.getHeaderProps();
                  return (
                    <th key={key} {...restColumnProps} onClick={column.id !== 'Actions' ? () => onSortChanged(column.id) : null}>
                      {column.render('Header')}{sortIndicator}
                    </th>
                  );
                })}
              </tr>
            );
          })}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            const { key, ...restRowProps } = row.getRowProps();
            return (
              <tr key={key} {...restRowProps} onClick={() => navigate("/user/"+row.original.id)}>
                {row.cells.map(cell => {
                  const { key, ...restCellProps } = cell.getCellProps();
                  return <td key={key} {...restCellProps}>{cell.render('Cell')}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;