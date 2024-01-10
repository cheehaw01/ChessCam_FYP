import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import GameCreateForm from "./GameCreateForm";
import GameDeleteModal from "./GameDeleteModal";
import GameEditForm from "./GameEditForm";

// create contexts
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

// Game data Table
function GameTable() {
  // set states
  const [games, setGames] = useState([]);
  const [data, setData] = useState(games);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedId, setSelectedId] = useState(0);

  // function - show delete modal
  const handleDeleteModal = (game_id) => {
    setSelectedId(game_id);
    setShowDeleteModal(true);
  };

  // function - show edit form
  const handleEditForm = (game_id) => {
    setSelectedId(game_id);
    setShowEditForm(true);
  };

  // function - show create form
  const handleCreate = () => {
    setShowCreateForm(true);
  };

  // function - handle search filter
  const handleFilter = (event) => {
    const newData = games.filter((row) => {
      return (
        row.white_player
          .toLowerCase()
          .includes(event.target.value.toLowerCase()) ||
        row.black_player
          .toLowerCase()
          .includes(event.target.value.toLowerCase()) ||
        row.tournament_name
          .toLowerCase()
          .includes(event.target.value.toLowerCase()) ||
        row.venue_name
          .toLowerCase()
          .includes(event.target.value.toLowerCase()) ||
        row.date
          .toString()
          .toLowerCase()
          .includes(event.target.value.toLowerCase())
      );
    });
    setData(newData);
  };

  // side effect
  useEffect(() => {
    // api call to get game data
    axios
      .get(`${process.env.REACT_APP_GAMES_API_URL}`)
      .then((res) => {
        setGames(res.data.data);
        setData(res.data.data);
        console.log(res.data.data);
      })
      .catch((err) => console.log(err));
  }, [showCreateForm, showDeleteModal, showEditForm]);

  // table column definition
  const columns = [
    {
      name: "Id",
      selector: (row) => row.game_id,
      sortable: true,
    },
    {
      name: "Tournament",
      selector: (row) => row.tournament_name,
      sortable: true,
    },
    {
      name: "Venue",
      selector: (row) => row.venue_name,
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) => row.date.slice(0, 10),
      sortable: true,
    },
    {
      name: "Player White",
      selector: (row) => row.white_player,
      sortable: true,
    },
    {
      name: "Player Black",
      selector: (row) => row.black_player,
      sortable: true,
    },
    {
      name: "Winning Side",
      selector: (row) => row.winning_side,
      sortable: true,
    },
    {
      name: "Action",
      selector: (row) => (
        <div>
          <Button
            className="m-1"
            variant="primary"
            onClick={() => handleEditForm(row.game_id)}
          >
            Edit
          </Button>
          <Button
            className="m-1"
            variant="danger"
            onClick={() => handleDeleteModal(row.game_id)}
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
        <GameCreateForm />
      </CreateFormContext.Provider>
      <EditFormContext.Provider
        value={{
          showForm: showEditForm,
          setShowForm: setShowEditForm,
          editId: selectedId,
        }}
      >
        <GameEditForm />
      </EditFormContext.Provider>
      <DeleteModalContext.Provider
        value={{
          showModal: showDeleteModal,
          setShowModal: setShowDeleteModal,
          deleteId: selectedId,
        }}
      >
        <GameDeleteModal />
      </DeleteModalContext.Provider>
    </React.Fragment>
  );
}

export default GameTable;
