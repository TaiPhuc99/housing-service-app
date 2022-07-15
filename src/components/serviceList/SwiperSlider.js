import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { Navigation, Pagination, Scrollbar, A11y, EffectFade } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/bundle";
import { toast } from "react-toastify";
import { db } from "../../firebase.config";
import Spinner from "../template/Spinner";

export default function SwiperSlider() {
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState(null);
  const navigate = useNavigate();

  // Retieve All data of Listings Collection from Cloud FireStore
  useEffect(() => {
    const fetchListings = async () => {
      try {
        // Get Reference
        const q = query(
          collection(db, "listings"),
          orderBy("timestamp", "desc"),
          limit(6)
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
        toast.error("Could not fetch listings");
      }
    };

    fetchListings();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  if (listings.length === 0) {
    return <></>;
  }

  return (
    listings && (
      <>
        <p className="exploreHeading">Recommended</p>

        <Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y, EffectFade]}
          cro
          slidesPerView={1}
          pagination={{ clickable: true }}
          fadeEffect={{ crossFade: "true" }}
        >
          {listings?.map(({ data, id }, index) => (
            <SwiperSlide
              key={`slide-${index}`}
              onClick={() => navigate(`/category/${data.type}/${id}`)}
            >
              <div className="swiperSlideDiv">
                <img
                  style={{ height: "500px" }}
                  className="swiperSlideImg"
                  src={data.imageUrls[0]}
                  alt=""
                />
                <p className="swiperSlideText">{data.name}</p>
                <p className="swiperSlidePrice">
                  ${data.discountedPrice ?? data.regularPrice}{" "}
                  {data.type === "rent" && "/ month"}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </>
    )
  );
}
