import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import TournamentCreateForm from "./TournamentCreateForm";
import TournamentDeleteModal from "./TournamentDeleteModal";
import TournamentEditForm from "./TournamentEditForm";

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

// Tournament data Table
function GameTable() {
  // add states
  const [tournaments, setTournaments] = useState([]);
  const [data, setData] = useState(tournaments);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedId, setSelectedId] = useState(0);

  // function - show delete modal
  const handleDeleteModal = (tournament_id) => {
    setSelectedId(tournament_id);
    setShowDeleteModal(true);
  };

  // function - show edit form
  const handleEditForm = (tournament_id) => {
    setSelectedId(tournament_id);
    setShowEditForm(true);
  };

  // function - show create form
  const handleCreate = () => {
    setShowCreateForm(true);
  };

  // function - handle search filter
  const handleFilter = (event) => {
    const newData = tournaments.filter((row) => {
      return row.tournament_name
        .toLowerCase()
        .includes(event.target.value.toLowerCase());
    });
    setData(newData);
  };

  // side effect
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_TOURNAMENTS_API_URL}`)
      .then((res) => {
        setTournaments(res.data.data);
        setData(res.data.data);
        console.log(res.data.data);
      })
      .catch((err) => console.log(err));
  }, [showCreateForm, showDeleteModal, showEditForm]);

  // table column definition
  const columns = [
    {
      name: "Id",
      selector: (row) => row.tournament_id,
      sortable: true,
    },
    {
      name: "Tournament",
      selector: (row) => row.tournament_name,
      sortable: true,
    },
    {
      name: "Action",
      selector: (row) => (
        <div>
          <Button
            className="m-1"
            variant="primary"
            onClick={() => handleEditForm(row.tournament_id)}
          >
            Edit
          </Button>
          <Button
            className="m-1"
            variant="danger"
            onClick={() => handleDeleteModal(row.tournament_id)}
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
        <TournamentCreateForm />
      </CreateFormContext.Provider>
      <EditFormContext.Provider
        value={{
          showForm: showEditForm,
          setShowForm: setShowEditForm,
          editId: selectedId,
        }}
      >
        <TournamentEditForm />
      </EditFormContext.Provider>
      <DeleteModalContext.Provider
        value={{
          showModal: showDeleteModal,
          setShowModal: setShowDeleteModal,
          deleteId: selectedId,
        }}
      >
        <TournamentDeleteModal />
      </DeleteModalContext.Provider>
    </React.Fragment>
  );
}

export default GameTable;
