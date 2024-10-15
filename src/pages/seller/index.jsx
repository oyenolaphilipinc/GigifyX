import { useStateProvider } from "../../context/StateContext";
import { GET_SELLER_DATA, HOST } from "../../utils/constants";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

export default function Index() {
  const [cookies] = useCookies();
  const [{ userInfo }] = useStateProvider();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState(undefined);

  useEffect(() => {
    const getSellerDashboardData = async () => {
      const response = await axios.get(GET_SELLER_DATA, {
        headers: {
          Authorization: `Bearer ${cookies.jwt}`,
        },
      });
      if (response.status === 200) {
        setDashboardData(response.data.dashboardData);
      }
      console.log({ response });
    };
    if (userInfo) {
      getSellerDashboardData();
    }
  }, [userInfo]);

  const DashboardCard = ({ title, value, onClick }) => (
    <div
      className="shadow-md h-full p-6 flex flex-col gap-2 cursor-pointer hover:shadow-xl transition-all duration-300"
      onClick={onClick}
    >
      <h2 className="text-lg md:text-xl">{title}</h2>
      <h3 className="text-[#1DBF73] text-2xl md:text-3xl font-extrabold">
        {value}
      </h3>
    </div>
  );

  return (
    <>
      {userInfo && (
        <div className="flex flex-col md:flex-row min-h-[80vh] my-5 md:my-10 px-4 md:px-8 lg:px-16 gap-5">
          <div className="shadow-md h-max p-6 md:p-10 flex flex-col gap-5 w-full md:w-96">
            <div className="flex flex-col md:flex-row gap-5 items-center">
              <div>
                {userInfo?.imageName ? (
                  <Image
                    src={userInfo.imageName}
                    alt="Profile"
                    width={100}
                    height={100}
                    className="rounded-full"
                  />
                ) : (
                  <div className="bg-purple-500 h-24 w-24 flex items-center justify-center rounded-full relative">
                    <span className="text-4xl md:text-5xl text-white">
                      {userInfo.email[0].toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-1 text-center md:text-left">
                <span className="text-[#62646a] text-base md:text-lg font-medium">
                  {userInfo.username}
                </span>
                <span className="font-bold text-sm md:text-md">{userInfo.fullName}</span>
              </div>
            </div>

            <div className="border-t py-5">
              <p className="text-sm md:text-base">{userInfo.description}</p>
            </div>
          </div>

          <div className="flex-grow">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
              <DashboardCard
                title="Total Gigs"
                value={dashboardData?.gigs}
                onClick={() => router.push("/seller/gigs")}
              />
              <DashboardCard
                title="Total Orders"
                value={dashboardData?.orders}
                onClick={() => router.push("/seller/orders")}
              />
              <DashboardCard
                title="Unread Messages"
                value={dashboardData?.unreadMessages}
                onClick={() => router.push("/seller/unread-messages")}
              />
              <DashboardCard
                title="Earnings Today"
                value={`$${dashboardData?.dailyRevenue}`}
                onClick={() => {}}
              />
              <DashboardCard
                title="Earnings Monthly"
                value={`$${dashboardData?.monthlyRevenue}`}
                onClick={() => {}}
              />
              <DashboardCard
                title="Earnings Yearly"
                value={`$${dashboardData?.revenue}`}
                onClick={() => {}}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}