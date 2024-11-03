// upload.js
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

const fileUpload = async (file, userId, userName, setProgress) => {
  const date = new Date();
  const storageRef = ref(storage, `${userName + "-" + userId}/files/${date.getTime()}-${file.name}`);

  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        // Update progress state
        setProgress(progress);
      },
      (error) => {
        reject("Something went wrong! " + error?.code);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL);
        });
      }
    );
  });
};

export default fileUpload;
