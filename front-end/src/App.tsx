import { useState } from "react";
import Footer from "./components/Footer.tsx";
import Nav from "./components/Nav.tsx";
import "./App.css";
import Board from "./pages/Board.tsx";
import Profile from "./pages/Profile.tsx";
import Auth from "./pages/Auth.tsx";
import { log } from "./utils/logger.ts";

// TODO: Grab function to grab data.

type TPage = "board" | "profile";

function App() {
  const [page, setPage] = useState<TPage>("board");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);

  const handleSignIn = (email: string) => {
    log({ event: 'USER_SIGNED_IN' });
    setCurrentUserEmail(email);
    setIsAuthenticated(true);
    setPage("board");
  };

  return (
    <>
      {isAuthenticated ? <Nav currentPage={page} onNavigate={setPage} /> : null}

      <section id="center" className={isAuthenticated ? "center--app" : "center--auth"}>
        {!isAuthenticated ? <Auth onSignIn={handleSignIn} /> : null}
        {isAuthenticated && page === "board" ? <Board currentUserEmail={currentUserEmail} /> : null}
        {isAuthenticated && page === "profile" ? <Profile /> : null}
      </section>
      <Footer />
    </>
  );
}

export default App;
