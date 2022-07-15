/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import Spinner from "../components/template/Spinner";
import ListingItem from "../components/serviceList/ListingItem";

export default function OfferPage() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadMore, setLoadMore] = useState(null);

  // Fetch Data from FireStore
  useEffect(() => {
    const fetchListings = async () => {
      try {
        // Get Reference
        const first = query(
          collection(db, "listings"),
          where("offer", "==", true),
          orderBy("timestamp", "desc"),
          limit(3)
        );

        // Execute query
        const querySnapshot = await getDocs(first);
        const newListings = [];
        querySnapshot.forEach((doc) => {
          newListings.push({
            id: doc.id,
            data: doc.data(),
          });
        });

        // Get Last Listings from FireStore matched with 'Where' condition
        const lastListing = querySnapshot.docs[querySnapshot.docs.length - 1];
        setLoadMore(lastListing);
        // console.log("last", lastListing);

        // Update State
        setListings(newListings);
        setLoading(false);
      } catch (error) {
        toast.error("Something went wrong with services loading");
      }
    };

    fetchListings();
  }, []);

  // Handle get more Listing from StartAfter
  const loadMoreListings = async () => {
    try {
      // Get Reference
      const next = query(
        collection(db, "listings"),
        where("offer", "==", true),
        orderBy("timestamp", "desc"),
        startAfter(loadMore),
        limit(3)
      );

      // Execute query
      const querySnapshot = await getDocs(next);
      const newListings = [];
      querySnapshot.forEach((doc) => {
        newListings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      // console.log(newListings);

      // Get Last Listings from FireStore matched with 'Where' condition
      const lastListing = querySnapshot.docs[querySnapshot.docs.length - 1];
      setLoadMore(lastListing);

      // Update State
      // Cuz Obj --> Spread Operator must be corrected with type Obj
      setListings([...listings, ...newListings]);
      setLoading(false);
    } catch (error) {
      toast.error("Something went wrong with services loading");
    }
  };

  return (
    <div className="category">
      <header>
        <p className="pageHeader">Offers</p>
      </header>

      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul className="categoryListings">
              {listings?.map((listing, index) => (
                <ListingItem
                  listing={listing.data}
                  id={listing.id}
                  key={`item-${index}`}
                />
              ))}
            </ul>
          </main>

          <br />
          <br />
          {loadMore && (
            <p className="loadMore" onClick={loadMoreListings}>
              Load More
            </p>
          )}
        </>
      ) : (
        <p>There are no current offers</p>
      )}
    </div>
  );
}
