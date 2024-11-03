import React, { useState, useRef, useEffect } from "react";
import { auth } from "../../lib/firebase"; // Ensure you're importing auth
import fileUpload from "../../lib/fileUpload";
import { db } from "../../lib/firebase"; // Import Firestore
import { doc, getDoc } from "firebase/firestore"; // Import Firestore functions
import "./fileUpload.css";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0); // State for upload progress
  const [username, setUsername] = useState(null); // State for username
  const fileInputRef = useRef(null); // Reference for the file input

  useEffect(() => {
    const fetchUsername = async () => {
      const user = auth.currentUser; // Get the current user
      if (user) {
        const userId = user.uid; // Get the user's UID
        const userDocRef = doc(db, "users", userId); // Reference to the user document
        const userDoc = await getDoc(userDocRef); // Fetch the user document

        if (userDoc.exists()) {
          setUsername(userDoc.data().username); // Set the username from Firestore
          console.log("Username from Firestore:", userDoc.data().username);
        } else {
          console.error("No such user document!");
        }
      }
    };

    fetchUsername();
  }, []); // Empty dependency array to run once on mount

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click(); // Simulate a click on the file input
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Por favor selecciona un archivo primero");
      return;
    }

    if (!username) {
      alert("No se pudo obtener el nombre de usuario.");
      return;
    }

    setLoading(true);
    setProgress(0); // Reset progress to 0 at the start of upload
    try {
      const user = auth.currentUser; // Get the current user
      if (!user) {
        throw new Error("No user is logged in");
      }

      const userId = user.uid; // Get the user's UID

      // Call the upload function with file, userId, username, and setProgress
      const fileUrl = await fileUpload(file, userId, username, setProgress); // Pass setProgress

      alert("Archivo subido exitosamente");
      setFile(null); // Clear the file after upload
    } catch (error) {
      console.error("Error al subir el archivo:", error);
      alert("Error al subir el archivo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="file-upload">
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }} // Hide the input
        onChange={handleFileChange}
      />
      <div className="buttons">
        <button type="button" onClick={handleButtonClick}>
          Seleccionar Archivo
        </button>
        <button type="button" onClick={handleUpload} disabled={loading}>
          {loading ? "Subiendo..." : "Subir Archivo"}
        </button>
      </div>

      {loading && (
        <div style={{ width: '100%', backgroundColor: '#f3f3f3', borderRadius: '5px', marginTop: '10px', height: '2px' }}>
          <div
            style={{
              height: '10px',
              width: `${progress}%`,
              backgroundColor: '#4caf50',
              borderRadius: '5px',
              transition: 'width 0.5s'
            }}
          />
          <span>{Math.round(progress)}%</span> {/* Show the progress percentage */}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
