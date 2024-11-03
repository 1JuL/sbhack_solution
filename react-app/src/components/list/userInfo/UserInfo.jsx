import { auth } from "../../../lib/firebase";
import { useUserStore } from "../../../lib/userStore";
import "./userInfo.css";

const UserInfo = () => {
  const { currentUser } = useUserStore();

  return (
    <div className="userInfo">
      <div className="user">
        <img
          src={currentUser.avatar ? currentUser.avatar : "./avatar.png"}
          alt="user-image"
        />
        <div>
          <h2>{currentUser.username}</h2>
          <div className="buttons">
            <button className="logout" onClick={() => auth.signOut()}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
