import React, { useEffect, useState } from "react";
import { useStateProvider } from "../../context/StateContext";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import {
  CHECK_USER_ORDERED_GIG_ROUTE,
  GET_GIG_BY_ID_ROUTE,
} from "../../utils/constants";
import axios from "axios";
import Details from "../../components/Gigs/Details";
import Pricing from "../../components/Gigs/Pricing";
import { reducerCases } from "../../context/constants";
import { ProgressBar } from "react-loader-spinner";

const GigInfo = () => {
  const router = useRouter();
  const { gigId } = router.query;
  const [cookies] = useCookies();
  const [loading, setLoading] = useState(true);

  const [{ userInfo }, dispatch] = useStateProvider();

  useEffect(() => {
    const fetchGigInfo = async () => {
      try {
        const {
          data: { gig },
        } = await axios.get(`${GET_GIG_BY_ID_ROUTE}/${gigId}`);
        dispatch({ type: reducerCases.SET_GIG_DATA, gigData: gig });
        // console.log({ gig });
      } catch (er) {
        console.log(er);
      } finally {
        setLoading(false);
      }
    };
    if (gigId) fetchGigInfo();
  }, [gigId, dispatch]);

  useEffect(() => {
    const hasOrdered = async () => {
      const {
        data: { hasUserOrderedGig },
      } = await axios.get(`${CHECK_USER_ORDERED_GIG_ROUTE}/${gigId}`, {
        headers: {
          Authorization: `Bearer ${cookies.jwt}`,
        },
      });
      // console.log({ hasUserOrderedGig });
      dispatch({
        type: reducerCases.HAS_USER_ORDERED_GIG,
        hasOrdered: hasUserOrderedGig,
      });
    };
    if (userInfo) hasOrdered();
  }, [dispatch, gigId, userInfo]);

  if (loading)
    return (
      <div className="flex items-center justify-center text-5xl min-h-[76vh]">
        <ProgressBar
          height="80"
          width="80"
          ariaLabel="progress-bar-loading"
          wrapperStyle={{}}
          wrapperClass="progress-bar-wrapper"
          borderColor="#F4442E"
          barColor="#51E5FF"
        />
      </div>
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 mx-32 gap-20">
      <Details />
      <Pricing />
    </div>
  );
};

export default GigInfo;
