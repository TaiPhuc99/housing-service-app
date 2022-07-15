/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { updateProfile } from "firebase/auth";
import { auth, db } from "../firebase.config";
import { toast } from "react-toastify";
import ListingItem from "../components/serviceList/ListingItem";
import arrowRight from "../assets/svg/keyboardArrowRightIcon.svg";
import homeIcon from "../assets/svg/homeIcon.svg";
import {
  doc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
} from "firebase/firestore";

export default function ProfilePage() {
  const [changeDetails, setChangeDetails] = useState(false);
  const [userData, setUserData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
  const navigate = useNavigate();
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);

  // Retrieve all listings of current User
  useEffect(() => {
    const fetchListingCurrentUser = async () => {
      try {
        // Get Reference
        const q = query(
          collection(db, "listings"),
          where("userRef", "==", auth.currentUser.uid),
          orderBy("timestamp", "desc")
        );

        // Execute query
        const querySnapshot = await getDocs(q);
        const listings = [];
        querySnapshot.forEach((doc) => {
          listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });

        // Update State
        setListings(listings);
        setLoading(false);
      } catch (error) {
        throw error;
      }
    };

    fetchListingCurrentUser();
  }, [auth.currentUser.uid]);

  // Handle Change with Input
  const handleOnChange = (e) => {
    let { id, value } = e.target;
    setUserData({
      ...userData,
      [id]: value,
    });
  };

  // Handle Submit with Form
  const onSubmit = async (e) => {
    try {
      // Handle Update Profile
      if (auth.currentUser.displayName !== userData.name) {
        updateProfile(auth.currentUser, {
          displayName: userData.name,
        });
        toast.success("Successfully Updated");
      }
    } catch (error) {
      toast.error("Could not update profile details");
    }
  };

  // Handle Logout Profile
  const handleLogOut = () => {
    auth.signOut();
    navigate("/");
  };

  // Handle Delete Listing
  const handleDeleteListing = async (idListing) => {
    if (window.confirm("Are you sure you want to delete?")) {
      await deleteDoc(doc(db, "listings", idListing));
      setListings(
        listings.filter((listing) => {
          return listing.id !== idListing;
        })
      );
      toast.success("Successfully deleted listing");
    }
  };

  // Handle Edit Listing
  const handleEditListing = (idListing) => {
    navigate(`/update/${idListing}`);
  };

  return (
    <div className="profile">
      <header className="profileHeader">
        <p className="pageHeader">My Profile</p>
        <button type="button" className="logOut" onClick={handleLogOut}>
          Logout
        </button>
      </header>

      <main>
        <div className="profileDetailsHeader">
          <p className="profileDetailsText">Personal Details</p>
          <p
            className="changePersonalDetails"
            onClick={() => {
              onSubmit();
              setChangeDetails((prevState) => !prevState);
            }}
          >
            {changeDetails ? "done" : "change"}
          </p>
        </div>

        <div className="profileCard">
          <form>
            <input
              type="text"
              id="name"
              className={!changeDetails ? "profileName" : "profileNameActive"}
              disabled={!changeDetails}
              value={userData.name}
              onChange={handleOnChange}
            />
            <input
              type="text"
              id="email"
              className={!changeDetails ? "profileEmail" : "profileEmailActive"}
              disabled={!changeDetails}
              value={userData.email}
              onChange={handleOnChange}
            />
          </form>
        </div>

        <Link to="/add" className="createListing">
          <img src={homeIcon} alt="home" />
          <p>Sell or rent your home</p>
          <img src={arrowRight} alt="arrow right" />
        </Link>

        {!loading && listings?.length > 0 && (
          <>
            <p className="listingText">Your Listings</p>
            <ul className="listingsList">
              {listings.map((listing, index) => (
                <ListingItem
                  key={`currentListing-${index}`}
                  listing={listing.data}
                  id={listing.id}
                  handleDeleteListing={() => handleDeleteListing(listing.id)}
                  handleEditListing={() => handleEditListing(listing.id)}
                />
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  );
}
