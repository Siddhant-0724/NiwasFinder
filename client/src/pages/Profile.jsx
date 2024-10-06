import { useState, useEffect } from "react";
import { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserFaliure,
  updateUserStart,
  updateUserSucess,
  deleteUserFaliure,
  deleteUserStart,
  deleteUserSucess,
  signoutUserStart,
  signoutUserFaliure,
  signoutUserSucess,
} from "../redux/user/userSlice";
import { Link } from "react-router-dom";
const Profile = () => {
  const fileref = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [fileper, setFileper] = useState(0);
  const [fileUploadErr, setFileUploadErr] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSucess, setUpdatesucess] = useState(false);
  const [showlistError, setshowlistError] = useState(false);
  const [ userlisting, setUserlisting ] = useState({});
  const dispatch = useDispatch();
  useEffect(() => {
    if (file) {
      handelFileupload(file);
    }
  }, [file]);
  const handelFileupload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_change",
      (snapshot) => {
        const process = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFileper(Math.round(process));
      },
      (error) => {
        error(setFileUploadErr(true));
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setFormData({ ...formData, avatar: downloadUrl });
        });
      }
    );
  };
  const handelChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handelSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/server/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.sucess === false) {
        dispatch(updateUserFaliure(data.message));
        return;
      }
      dispatch(updateUserSucess(data));
      setUpdatesucess(true);
    } catch (error) {
      dispatch(updateUserFaliure(error.message));
    }
  };
  const handeldeleteAccount = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/server/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.sucess === false) {
        dispatch(deleteUserFaliure(data.message));
        return;
      }
      dispatch(deleteUserSucess(data));
    } catch (error) {
      dispatch(deleteUserFaliure(error.message));
    }
  };
  const handelSignout = async () => {
    try {
      dispatch(signoutUserStart());
      const res = await fetch("/server/auth/signout");
      const data = await res.json();
      if (data.sucess === false) {
        dispatch(signoutUserFaliure(data.message));
        return;
      }
      dispatch(signoutUserSucess(data));
    } catch (error) {
      dispatch(signoutUserFaliure(error.message));
    }
  };
  const handelShowListing = async () => {
    try {
      setshowlistError(false);
      const res = await fetch(`/server/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setshowlistError(true);
        return;
      }
      setUserlisting(data);
    } catch (error) {
      setshowlistError(true);
      console.log(error)
    }
  };
  const handeListingDelete = async(listingId)=>{
    console.log(listingId)
    try {
      const res = await fetch(`/server/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.sucess === false) {
       console.log(data.message)
        return;
      }
      setUserlisting((prev)=>prev.filter((listing)=> listing.id !== listingId))
    } catch (error) {
      console.log(error)
    }
  }

  const handeListingUpdate=async(listingId)=>{

  }
  console.log(userlisting);

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form onSubmit={handelSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          hidden
          accept="image/*"
          type="file"
          ref={fileref}
        />
        <img
          onClick={() => fileref.current.click()}
          src={formData.avatar || currentUser.avatar}
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
          defaultValue={currentUser.avatar}
        />
        <p className="text-sm self-center">
          {fileUploadErr ? (
            <span className="text-res-700">Error in image upload</span>
          ) : fileper > 0 && fileper < 100 ? (
            <span className="text-slate-700">{`Uploading ${fileper}%`}</span>
          ) : fileper === 100 ? (
            <span className="text-green-700">Image Sucessfully Upload</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg"
          id="username"
          defaultValue={currentUser.username}
          onChange={handelChange}
        />
        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg"
          id="email"
          defaultValue={currentUser.email}
          onChange={handelChange}
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={handelChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "LOADING.." : "UPDATE"}
        </button>
        <Link
          to={"/create-listing"}
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handeldeleteAccount}
          className="font-semibold text-red-700 cursor-pointer "
        >
          Delete Account
        </span>
        <span
          onClick={handelSignout}
          className="font-semibold text-red-700 cursor-pointer "
        >
          Sign out
        </span>
      </div>
      <p className="text-red-700">{error ? error : ""}</p>
      <p className="text-green-700">
        {updateSucess ? "Updated Successfully" : ""}
      </p>
      <button onClick={handelShowListing} className="text-green-700 w-full">
        Show List
      </button>
      <p className="text-red-700">
        {showlistError ? "error showing list" : ""}
      </p>

      {userlisting && userlisting.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-2xl font-semibold">
            Your Listings
          </h1>
          {userlisting.map((listing) => {
            return (
              <div
                key={listing._id}
                className="border rounded-lg items-center flex justify-between p-3 gap-4"
              >
                <Link to={`/listing/${listing._id}`}>
                  <img
                    src={listing.imageUrls[0]}
                    alt="listing cover"
                    className="h-16 w-16 object-contain"
                  />
                </Link>
                <Link
                  className="text-slate-700 font-semibold flex-1 hover:underline truncate"
                  to={`/listing/${listing._id}`}
                >
                  <p>{listing.name}</p>
                </Link>
                <div className="flex flex-col items-center">
                  <button onClick={()=>handeListingDelete(listing._id)} className="text-red-700">Delete</button>
                  <Link to={`/update-listing/${listing._id}`}>
                  <button className="text-green-700">Edit</button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Profile;
