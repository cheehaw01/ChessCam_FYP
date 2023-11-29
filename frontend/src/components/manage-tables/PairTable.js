import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import PairCreateForm from "./PairCreateForm";
import PairEditForm from "./PairEditForm";
import PairDeleteModal from "./PairDeleteModal";

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

// Pair data Table
function PairTable() {
  // add states
  const [pairs, setPairs] = useState([]);
  const [data, setData] = useState(pairs);
  const [players, setPlayers] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedId, setSelectedId] = useState({
    game_id: 0,
    player_id: 0,
  });

  // function - show delete modal
  const handleDeleteModal = (game_id, player_id) => {
    setSelectedId({
      game_id: game_id,
      player_id: player_id,
    });
    setShowDeleteModal(true);
  };

  // function - show edit form
  const handleEditForm = (game_id, player_id) => {
    setSelectedId({
      game_id: game_id,
      player_id: player_id,
    });
    setShowEditForm(true);
  };

  // function - show create form
  const handleCreate = () => {
    setShowCreateForm(true);
  };

  // function - handle search filter
  const handleFilter = (event) => {
    const newData = pairs.filter((row) => {
      return row.side.toLowerCase().includes(event.target.value.toLowerCase());
    });
    setData(newData);
  };

  // side effect
  useEffect(() => {
    // api call to get pair data
    axios
      .get(
        `http://${process.env.REACT_APP_API_DOMAIN}:${process.env.REACT_APP_API_PORT}${process.env.REACT_APP_PAIRS_API_URL}`
      )
      .then((res) => {
        setPairs(res.data.data);
        setData(res.data.data);
        console.log(res.data.data);
      })
      .catch((err) => console.log(err));

    // api call to get players data
    axios
      .get(
        `http://${process.env.REACT_APP_API_DOMAIN}:${process.env.REACT_APP_API_PORT}${process.env.REACT_APP_PLAYERS_API_URL}`
      )
      .then((res) => {
        setPlayers(res.data.data);
        console.log(res.data.data);
      })
      .catch((err) => console.log(err));
  }, [showCreateForm, showDeleteModal, showEditForm]);

  // table column definition
  const columns = [
    {
      name: "Game Id",
      selector: (row) => row.game_id,
      sortable: true,
    },
    {
      name: "Player Id",
      selector: (row) => row.player_id,
      sortable: true,
    },
    {
      name: "Player Name",
      selector: (row) => {
        return players.map((player) => {
          return player.player_id === row.player_id && player.player_name;
        });
      },
      sortable: true,
    },
    {
      name: "Side",
      selector: (row) => row.side,
      sortable: true,
    },
    {
      name: "Action",
      selector: (row) => (
        <div>
          <Button
            className="m-1"
            variant="primary"
            onClick={() => handleEditForm(row.game_id, row.player_id)}
          >
            Edit
          </Button>
          <Button
            className="m-1"
            variant="danger"
            onClick={() => handleDeleteModal(row.game_id, row.player_id)}
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
        <PairCreateForm />
      </CreateFormContext.Provider>
      <EditFormContext.Provider
        value={{
          showForm: showEditForm,
          setShowForm: setShowEditForm,
          editId: selectedId,
        }}
      >
        <PairEditForm />
      </EditFormContext.Provider>
      <DeleteModalContext.Provider
        value={{
          showModal: showDeleteModal,
          setShowModal: setShowDeleteModal,
          deleteId: selectedId,
        }}
      >
        <PairDeleteModal />
      </DeleteModalContext.Provider>
    </React.Fragment>
  );
}

export default PairTable;
