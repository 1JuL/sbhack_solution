import List from "./components/list/List";
import Chat from "./components/chat/Chat";
import Login from "./components/login/Login";
import Notification from "./components/notification/Notification";
import FileUP from "./components/fileUpload/fileUpload"; // Importa tu componente Home
import UserInfo from "./components/list/userInfo/UserInfo";  // Importa el componente UserInfo
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import { useUserStore } from "./lib/userStore";
import { useChatStore } from "./lib/chatStore";
import { RotatingLines } from "react-loader-spinner";
import './App.css'

function App() {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();
  const { chatId } = useChatStore();
  const [isVisible, setIsVisible] = useState(false); // Estado para la visibilidad del contenedor
  const [showUserInfoAndHome, setShowUserInfoAndHome] = useState(false); // Estado para UserInfo y Home

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid);
    });
    return () => {
      unSub();
    };
  }, [fetchUserInfo]);

  if (isLoading)
    return (
      <div className="loading">
        Loading...
        <RotatingLines
          visible={true}
          height="96"
          width="96"
          color="grey"
          strokeWidth="5"
          animationDuration="0.75"
          ariaLabel="rotating-lines-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
    );

  // Función para alternar la visibilidad del contenedor
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  // Función para manejar el clic en "Archivo"
  const handleArchivoClick = () => {
    setShowUserInfoAndHome(true); // Muestra UserInfo y Home al hacer clic en Archivo
  };

  // Función para manejar el clic en "Home" y ocultar UserInfo y Home
  const handleHomeClick = () => {
    setShowUserInfoAndHome(false); // Oculta UserInfo y Home al hacer clic en Home
  };

  return (
    <div>
      {currentUser ? (
        <div className="main-container">
          {/* Página Principal */}
          <div className="main-page">
            <div className="nav-bar">
              <div className="navbar">
                <div className="menu">
                  <div className="icon"></div>
                  <a href="#" onClick={handleHomeClick}>Home</a>
                  <a href="#">Agenda</a>
                  <a href="#" onClick={handleArchivoClick}>Archivo</a> {/* Manejador para Archivo */}
                  <a href="#">Datos</a>
                  <a href="#" onClick={(e) => {
                    e.preventDefault(); // Prevent the default anchor behavior
                    auth.signOut(); // Call signOut to log out the user
                  }}>Log out</a>
                  <div className="select-container">
                    <select id="combo-box" className="combo-box styled-select">
                      <option value="" disabled selected>Idioma</option>
                      <option value="option1">عربي</option>
                      <option value="option2">English</option>
                      <option value="option3">Español</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Condicional para mostrar/ocultar mainContent */}
              {!showUserInfoAndHome && (
                <div className="mainContent">
                  <div className="content">
                    <h1>Upview Venture </h1>
                    <h1>Insider</h1>

                    <div className="charts">
                      <div className="cal">
                        <img src="/calendar-example.png" alt="" />
                        <div className="graf-butt">
                          <h1>Gráficas y Estadísticas</h1>
                        </div>
                      </div>
                      <img src="/chart-example.png" alt="" />
                    </div>
                  </div>
                </div>
              )}

              {/* Mostrar UserInfo y Home solo si showUserInfoAndHome es true */}
              {showUserInfoAndHome && (
                <div className="userInfoAndHome">
                  <UserInfo />
                  <FileUP />
                </div>
              )}
            </div>
          </div>

          {/* Botón para alternar la visibilidad del contenedor adicional */}
          <button className="chat-button" onClick={toggleVisibility}>
            {isVisible ? "" : ""}
          </button>

          {/* Contenedor adicional que se muestra/oculta sobre la Página Principal */}
          {isVisible && (
            <div className="container-overlay">
              <List />
              {chatId && <Chat />}
            </div>
          )}

          <Notification />
        </div>
      ) : (
        <Login />
      )}
    </div>
  );
}

export default App;
