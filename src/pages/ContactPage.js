/* eslint-disable no-unused-vars */
import React from "react";
import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";

export default function ContactPage() {
  const [message, setMessage] = useState("");
  const [landlord, setLandlord] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const { landId } = useParams();

  // Get Email & Name User from FireStore
  useEffect(() => {
    const fetListing = async () => {
      try {
        const docRef = doc(db, "users", landId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setLandlord(docSnap.data());
        }
      } catch (error) {
        toast.error("Could not get landlord data");
        throw error;
      }
    };

    fetListing();
  }, [landId]);

  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Contact Landlord</p>
      </header>

      {landlord !== null && (
        <main>
          <div className="contactLandlord">
            <p className="landlordName">Contact {landlord?.name}</p>
          </div>

          <form className="messageForm">
            <div className="messageDiv">
              <label htmlFor="message" className="messageLabel">
                Message
              </label>
              <textarea
                name="message"
                id="message"
                className="textarea"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
              ></textarea>
            </div>

            <div style={{ marginBottom: "5rem" }}>
              <a
                href={`mailto:${landlord.email}?Subject=${searchParams.get(
                  "listingName"
                )}&body=${message}`}
              >
                <button type="button" className="primaryButton">
                  Send Message
                </button>
              </a>
            </div>
          </form>
        </main>
      )}
    </div>
  );
}
