import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import AdminCreateForm from "./AdminCreateForm";
import AdminEditForm from "./AdminEditForm";
import AdminDeleteModal from "./AdminDeleteModal";

// create context
export const CreateFormContext = React.createContext();
export const EditFormContext = React.createContext();
export const DeleteModalContext = React.createContext();

// table styling
const tableStyles = {
  rows: {
    style: {
      fontSize: 16,
      background: "#e6e6e6",
    },
  },
  headCells: {
    style: {
      fontSize: 18,
      background: "#d9d9d9",
    },
  },
};

// Admin data Table
function AdminTable() {
  // add states
  const [admins, setAdmins] = useState([]);
  const [data, setData] = useState(admins);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedId, setSelectedId] = useState(0);

  // function - show delete modal
  const handleDeleteModal = (id) => {
    setSelectedId(id);
    setShowDeleteModal(true);
  };

  // function - show edit form
  const handleEditForm = (id) => {
    setSelectedId(id);
    setShowEditForm(true);
  };

  // function - show create form
  const handleCreate = () => {
    setShowCreateForm(true);
  };

  // function - handle search filter
  const handleFilter = (event) => {
    const newData = admins.filter((row) => {
      return row.name.toLowerCase().includes(event.target.value.toLowerCase());
    });
    setData(newData);
  };

  // side effect
  useEffect(() => {
    // api call for getting admin data
    axios
      .get(`${process.env.REACT_APP_ADMINS_API_URL}`)
      .then((res) => {
        setAdmins(res.data.data);
        setData(res.data.data);
        console.log(res.data.data);
      })
      .catch((err) => console.log(err));
  }, [showCreateForm, showDeleteModal]);

  // table column definition
  const columns = [
    {
      name: "Id",
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Password",
      selector: (row) => row.password,
      sortable: true,
      grow: 2,
    },
    {
      name: "Action",
      selector: (row) => (
        <div>
          <Button
            className="m-1"
            variant="primary"
            onClick={() => handleEditForm(row.id)}
          >
            Edit
          </Button>
          <Button
            className="m-1"
            variant="danger"
            onClick={() => handleDeleteModal(row.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  // render
  return (
    <React.Fragment>
      <div className="ms-2 me-2 mb-1">
        <Form.Text>Search:</Form.Text>
      </div>
      <div className="float-start ms-2 me-2 mb-1 w-25">
        <Form.Control onChange={handleFilter}></Form.Control>
      </div>
      <div className="float-end ms-2 me-2 mb-1">
        <Button variant="success" onClick={() => handleCreate()}>
          Create
        </Button>
      </div>
      <div className="d-flex justify-content-center pt-1">
        <div
          className="badge bg-primary text-wrap p-2"
          style={{ width: "8rem", fontSize: 14 }}
        >
          {window.location.pathname.slice(8)}
        </div>
      </div>
      <div className="m-2 rounded-2">
        <DataTable
          columns={columns}
          data={data}
          customStyles={tableStyles}
          fixedHeader
          pagination
        ></DataTable>
      </div>
      <CreateFormContext.Provider
        value={{ showForm: showCreateForm, setShowForm: setShowCreateForm }}
      >
        <AdminCreateForm />
      </CreateFormContext.Provider>
      <EditFormContext.Provider
        value={{
          showForm: showEditForm,
          setShowForm: setShowEditForm,
          editId: selectedId,
        }}
      >
        <AdminEditForm />
      </EditFormContext.Provider>
      <DeleteModalContext.Provider
        value={{
          showModal: showDeleteModal,
          setShowModal: setShowDeleteModal,
          deleteId: selectedId,
        }}
      >
        <AdminDeleteModal />
      </DeleteModalContext.Provider>
    </React.Fragment>
  );
}

export default AdminTable;
