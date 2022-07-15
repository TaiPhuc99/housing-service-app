/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable default-case */
import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { serverTimestamp, doc, updateDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase.config";
import { toast } from "react-toastify";
import Spinner from "../components/template/Spinner";
import { v4 as uuidv4 } from "uuid";

export default function UpdatePage() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    type: "rent",
    name: "",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    location: "",
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    images: [],
  });
  const navigate = useNavigate();
  const isMounted = useRef(true);
  const { idUpdate } = useParams();

  // Redirect if listing is not user's owner
  useEffect(() => {
    if (listing && listing.userRef !== auth.currentUser.uid) {
      toast.error("You can not edit that listing");
      setTimeout(() => {
        navigate("/");
      }, 1000);
    }
  });

  // Retrieve Listing Data from FireStore
  useEffect(() => {
    setLoading(true);
    const fetchListing = async () => {
      try {
        const docRef = doc(db, "listings", idUpdate);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          // console.log("Document data:", docSnap.data());
          setListing(docSnap.data());
          setUserData(docSnap.data());
          setLoading(false);
        }
      } catch (error) {
        toast.error("Service does not exist");
        navigate("/");
        throw error;
      }
    };

    fetchListing();
  }, [navigate, idUpdate]);

  // Retrieve Current User from Auth
  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setUserData({ ...userData, userRef: user.uid });
        } else {
          navigate("/sign-in");
        }
      });
    }
    return () => {
      isMounted.current = false;
    };
  }, [isMounted]);

  // Handle Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check DiscountedPrice must be corrected
      if (userData.discountedPrice >= userData.regularPrice) {
        setLoading(false);
        toast.error("Discounted price needs to be less than regular price");
        return;
      }

      // Check Images Limitation
      if (userData.images.length > 6) {
        setLoading(false);
        toast.error("Max 6 images");
        return;
      }

      // Upload File to Firebase Storage --> create a new Promise for uploading one Image
      const uploadAnImage = async (image) => {
        return new Promise((resolve, reject) => {
          const storage = getStorage();
          const file = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
          const storageRef = ref(storage, `images/${file}`);
          const uploadTask = uploadBytesResumable(storageRef, image);
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              // console.log("Upload is " + progress + "% done");
              switch (snapshot.state) {
                case "paused":
                  // console.log("Upload is paused");
                  break;
                case "running":
                  // console.log("Upload is running");
                  break;
              }
            },
            (error) => {
              // Handle unsuccessful uploads
              reject(error);
            },
            () => {
              // Handle successful uploads on complete
              // For instance, get the download URL: https://firebasestorage.googleapis.com/...
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                resolve(downloadURL);
              });
            }
          );
        });
      };

      // Upload all Images to Storage
      const imageUrls = await Promise.all(
        [...userData.images].map((image) => uploadAnImage(image))
      ).catch(() => {
        setLoading(false);
        toast.error("Images not uploaded");
        return;
      });
      // console.log(imageUrls);

      // Clone UserData
      const userDataClone = {
        ...userData,
        imageUrls,
        timestamp: serverTimestamp(),
      };
      // console.log(userDataClone);
      delete userDataClone.images;
      !userDataClone.offer && delete userDataClone.discountedPrice;

      // Update Doc with FireStore
      const docRef = doc(db, "listings", idUpdate);
      await updateDoc(docRef, userDataClone);
      setLoading(false);
      toast.success("Service saved");
      navigate(`/category/${userDataClone.type}/${docRef.id}`);
    } catch (error) {
      toast.error("Failed to Update");
      throw error;
    }
  };

  // Handle Change
  const onMutate = (e) => {
    let { id, value, files } = e.target;
    let boolean = null;
    if (value === "true") {
      boolean = true;
    } else if (value === "false") {
      boolean = false;
    }

    // Check Files
    if (files) {
      setUserData({
        ...userData,
        images: files,
      });
    }

    // Text/Booleans/Numbers
    if (!e.target.files) {
      setUserData({
        ...userData,
        [id]: boolean ?? value,
      });
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="profile">
      <header>
        <p className="pageHeader">Edit Listing</p>
      </header>

      <main>
        <form onSubmit={handleSubmit}>
          <label className="formLabel">Sell / Rent</label>
          <div className="formButtons">
            <button
              type="button"
              className={
                userData.type === "sale" ? "formButtonActive" : "formButton"
              }
              id="type"
              value="sale"
              onClick={onMutate}
            >
              Sell
            </button>
            <button
              type="button"
              className={
                userData.type === "rent" ? "formButtonActive" : "formButton"
              }
              id="type"
              value="rent"
              onClick={onMutate}
            >
              Rent
            </button>
          </div>

          <label className="formLabel">Name</label>
          <input
            className="formInputName"
            type="text"
            id="name"
            value={userData.name}
            onChange={onMutate}
            maxLength="32"
            minLength="10"
            required
          />

          <div className="formRooms flex">
            <div>
              <label className="formLabel">Bedrooms</label>
              <input
                className="formInputSmall"
                type="number"
                id="bedrooms"
                value={userData.bedrooms}
                onChange={onMutate}
                min="1"
                max="50"
                required
              />
            </div>
            <div>
              <label className="formLabel">Bathrooms</label>
              <input
                className="formInputSmall"
                type="number"
                id="bathrooms"
                value={userData.bathrooms}
                onChange={onMutate}
                min="1"
                max="50"
                required
              />
            </div>
          </div>

          <label className="formLabel">Parking spot</label>
          <div className="formButtons">
            <button
              className={userData.parking ? "formButtonActive" : "formButton"}
              type="button"
              id="parking"
              value={true}
              onClick={onMutate}
              min="1"
              max="50"
            >
              Yes
            </button>
            <button
              className={
                !userData.parking && userData.parking !== null
                  ? "formButtonActive"
                  : "formButton"
              }
              type="button"
              id="parking"
              value={false}
              onClick={onMutate}
            >
              No
            </button>
          </div>

          <label className="formLabel">Furnished</label>
          <div className="formButtons">
            <button
              className={userData.furnished ? "formButtonActive" : "formButton"}
              type="button"
              id="furnished"
              value={true}
              onClick={onMutate}
            >
              Yes
            </button>
            <button
              className={
                !userData.furnished && userData.furnished !== null
                  ? "formButtonActive"
                  : "formButton"
              }
              type="button"
              id="furnished"
              value={false}
              onClick={onMutate}
            >
              No
            </button>
          </div>

          <label className="formLabel">Address</label>
          <textarea
            className="formInputAddress"
            type="text"
            id="location"
            value={userData.location}
            onChange={onMutate}
            required
          />

          <label className="formLabel">Offer</label>
          <div className="formButtons">
            <button
              className={userData.offer ? "formButtonActive" : "formButton"}
              type="button"
              id="offer"
              value={true}
              onClick={onMutate}
            >
              Yes
            </button>
            <button
              className={
                !userData.offer && userData.offer !== null
                  ? "formButtonActive"
                  : "formButton"
              }
              type="button"
              id="offer"
              value={false}
              onClick={onMutate}
            >
              No
            </button>
          </div>

          <label className="formLabel">Regular Price</label>
          <div className="formPriceDiv">
            <input
              className="formInputSmall"
              type="number"
              id="regularPrice"
              value={userData.regularPrice}
              onChange={onMutate}
              min="50"
              max="750000000"
              required
            />
            {userData.type === "rent" && (
              <p className="formPriceText">$ / Month</p>
            )}
          </div>

          {userData.offer && (
            <>
              <label className="formLabel">Discounted Price</label>
              <input
                className="formInputSmall"
                type="number"
                id="discountedPrice"
                value={userData.discountedPrice}
                onChange={onMutate}
                min="50"
                max="750000000"
                required={userData.offer}
              />
            </>
          )}

          <label className="formLabel">Images</label>
          <p className="imagesInfo">
            The first image will be the cover (max 6).
          </p>
          <input
            className="formInputFile"
            type="file"
            id="images"
            onChange={onMutate}
            max="6"
            accept=".jpg,.png,.jpeg"
            multiple
            required
          />
          <button type="submit" className="primaryButton createListingButton">
            Edit Listing
          </button>
        </form>
      </main>
    </div>
  );
}
