import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFiles] = useState([]);
  const [formdata, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: "",
    bathrooms: "",
    regularPrice: "100",
    discountPrice: "0",
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setimageUploadError] = useState(false);
  const [uplaod, setUpload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId;
      const res = await fetch(`/server/listing/get/${listingId}`);
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        console.log(data.message);
      }
      setFormData(data);
    };
    fetchListing();
  }, []);
  const handelImageSubmit = (e) => {
    if (file.length > 0 && file.length + formdata.imageUrls.length < 7) {
      setUpload(true);
      setimageUploadError(false);
      const promises = [];
      for (let i = 0; i < file.length; i++) {
        promises.push(storeImage(file[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formdata,
            imageUrls: formdata.imageUrls.concat(urls),
          });
          setimageUploadError(false);
          setUpload(false);
        })
        .catch((err) => {
          setimageUploadError(
            "image upload failed (2mb max length image allowed"
          );
          setUpload(false);
        });
    } else {
      setimageUploadError("You can upload 6 images per List");
      setUpload(false);
    }
  };
  const handelRevoveImage = (index) => {
    setFormData({
      ...formdata,
      imageUrls: formdata.imageUrls.filter((_, i) => i !== index),
    });
  };
  const handelChange = (e) => {
    if (e.target.id === "rent" || e.target.id === "sale") {
      setFormData({
        ...formdata,
        type: e.target.id,
      });
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formdata,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formdata,
        [e.target.id]: e.target.value,
      });
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(progress);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            resolve(downloadUrl);
          });
        }
      );
    });
  };
  const handelSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formdata.imageUrls.length < 1)
        return setError("You must upload atleast one image");
      if (+formdata.regularPrice < +formdata.discountPrice)
        return setError("Discount Price must be lower than regular price");
      setLoading(true);
      setError(false);
      const res = await fetch(`/server/listing/update/${params.listingId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formdata,
          userRef: currentUser._id, // Correcting useRef to userId
        }),
    });
    const data = await res.json();
    console.log(data)
    if (data.success === false) {
      setLoading(false);
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
        console.log(error)
      setError(error.message);
      setLoading(true);
    }
  };
  return (
    <main className="my-3 p-3 max-w-4xl mx-auto bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold text-center my-7">Update List</h1>
      <form
        onSubmit={handelSubmit}
        className="flex flex-col sm:flex-row gap-4 mr-3"
      >
        <div className="flex flex-col gap-4 flex-1">
          <input
            onChange={handelChange}
            value={formdata.name}
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
          />

          <input
            onChange={handelChange}
            value={formdata.description}
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
          />

          <input
            onChange={handelChange}
            value={formdata.address}
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handelChange}
                checked={formdata.type === "sale"}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handelChange}
                checked={formdata.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handelChange}
                value={formdata.parking}
              />
              <span>Parking Spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handelChange}
                value={formdata.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handelChange}
                value={formdata.offer}
              />
              <span>Discount</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                className="p-2 border border-gray-300 rounded-lg"
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                onChange={handelChange}
                value={formdata.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                onChange={handelChange}
                value={formdata.bathrooms}
                className="p-2 border border-gray-300 rounded-lg"
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
              />
              <p>Washrooms</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                onChange={handelChange}
                value={formdata.regularPrice}
                className="p-2 border border-gray-300 rounded-lg"
                type="number"
                id="regularPrice"
                min="100"
                max="10000000"
                required
              />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <span className="text-xs">Rs/month</span>
              </div>
            </div>
            {formdata.offer && (
              <div className="flex items-center gap-2">
                <input
                  onChange={handelChange}
                  value={formdata.discountPrice}
                  className="p-2 border border-gray-300 rounded-lg"
                  type="number"
                  id="discountPrice"
                  min="0"
                  max="100000"
                  required
                />
                <div className="flex flex-col items-center">
                  <p>Discount Price</p>
                  <span className="text-xs">Rs/month</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">Images:</p>
          <span className="font-normal text-gray-600 ml-2">
            The first image will cover (maximum upload 6)
          </span>
          <div className="flex gap-4">
            <input
              onChange={(e) => {
                setFiles(e.target.files);
              }}
              className="p-3 border border-gray-300 rounded w-full "
              type="file"
              id="image/*"
              multiple
            />
            <button
              type="button"
              disabled={uplaod}
              onClick={handelImageSubmit}
              className="p-3 text-green-700 border uppercase hover:shadow-lg disabled:opacity-80 border-green-700"
            >
              {uplaod ? "uploading..." : "Upload"}
            </button>
          </div>
          <p className="text-red-700 text-sm">
            {imageUploadError && imageUploadError}
          </p>

          {formdata.imageUrls.length > 0 &&
            formdata.imageUrls.map((url, index) => {
              return (
                // Add 'return' here
                <div
                  className="flex justify-between p-3 border items-center"
                  key={url}
                >
                  <img
                    src={url}
                    alt="listing image"
                    className="w-20 h-20 object-contain rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handelRevoveImage(index)}
                    className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
                  >
                    Delete
                  </button>
                </div>
              );
            })}

          <button
            disabled={loading || uplaod}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Updating.." : "Update"}
          </button>
          {error ? <p className="text-red-700">{error}</p> : ""}
        </div>
      </form>
    </main>
  );
}
