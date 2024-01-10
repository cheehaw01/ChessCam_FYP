import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Live from "./components/Live";
import Replay from "./components/Replay";
import Manage from "./components/Manage";
import NavigationBar from "./components/NavigationBar";
import ReplayView from "./components/ReplayView";
import GameTable from "./components/manage-tables/GameTable";
import TournamentTable from "./components/manage-tables/TournamentTable";
import VenueTable from "./components/manage-tables/VenueTable";
import PlayerTable from "./components/manage-tables/PlayerTable";
import PairTable from "./components/manage-tables/PairTable";
import Login from "./components/Login";
import AdminTable from "./components/manage-tables/AdminTable";
import PageNotFound from "./components/PageNotFound";
import Register from "./components/Register";
// import LiveCamera from "./components/LiveCamera";

function App() {
  return (
    <BrowserRouter>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="live" element={<Live />}></Route>
        <Route path="replay" element={<Replay />}></Route>
        <Route path="replay/:id" element={<ReplayView />}></Route>
        <Route path="login" element={<Login />}></Route>
        <Route path="register" element={<Register />}></Route>
        <Route path="manage" element={<Manage />}>
          <Route path="admin" element={<AdminTable />} />
          <Route path="game" element={<GameTable />} />
          <Route path="pair" element={<PairTable></PairTable>} />
          <Route path="player" element={<PlayerTable></PlayerTable>} />
          <Route path="tournament" element={<TournamentTable />} />
          <Route path="venue" element={<VenueTable></VenueTable>} />
        </Route>
        {/* <Route path="livecamera" element={<LiveCamera />}></Route> */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
