"use client";

import { axiosRequest } from "@/helpers/axios/axiosRequest";
import { setToLocalStorage } from "@/utils/local-storage";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [seconds, setSeconds] = useState(0);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");

  const handlePhoneNumberSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    axiosRequest("/auth/login", "POST", {
      phoneNumber: phoneNumber,
    })
      .then((result) => {
        if (result?.data?.success) {
          setIsOtpSent(true);
          setSeconds(60);
          toast.success("OTP Sent");
          // Remove after integrating SMS service
          toast(`Your OTP is ${result?.data?.data?.otp}`, {
            duration: 6000,
            position: "bottom-center",
          });
        } else {
          toast.error(
            result?.error?.message?.message || "Something went wrong"
          );
        }
        // console.log(result);
      })
      .catch((error) => {
        toast.error(error?.message);
      });
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    axiosRequest("/auth/verify-otp", "POST", {
      phoneNumber: phoneNumber,
      otp: otp,
    })
      .then((result) => {
        if (result?.data?.success) {
          setToLocalStorage("accessToken", result?.data?.data?.accessToken);
          setIsOtpSent(false);
          setOtp("");
          setPhoneNumber("");
            toast.success("Login Successful", {duration: 3000});
        } else {
          toast.error(
            result?.error?.message?.message || "Something went wrong"
          );
        }
      })
      .catch((error) => {
        console.error(error);
      });
    setOtp("");
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if ( seconds > 0) {
      timer = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    } else if (seconds === 0 && isOtpSent) {
      console.log("OTP Expired");
    }

    return () => clearInterval(timer);
  }, [isOtpSent, seconds]);

  //   console.log(seconds);

  return (
    <div className="min-h-screen bg-[#EEF5FF] flex justify-center items-center">
      <div className="w-full px-3">
        <div className=" bg-[#86B6F6] max-w-[450px] mx-auto py-12 px-5 rounded-lg">
          <h1 className="text-center text-3xl font-bold text-white mb-12">
            Login
          </h1>
          <div className={`${isOtpSent && "hidden"}`}>
            <form onSubmit={handlePhoneNumberSubmit} className="flex flex-col">
              <input
                type="text"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="border-2  rounded-md p-2 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!phoneNumber}
                className={` bg-[#176B87] disabled:cursor-not-allowed text-white px-4 py-2 rounded-md mt-2 transition-transform transform hover:scale-[0.99]`}
              >
                Submit
              </button>
            </form>
          </div>
          <div className={`${!isOtpSent && "hidden"}`}>
            <form onSubmit={handleOtpSubmit} className="flex flex-col">
              <input
                type="text"
                placeholder="OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="border-2  rounded-md p-2 focus:outline-none"
              />
              {!!seconds && (
                <span className="text-xs text-gray-500 text-end">
                  {seconds} seconds left
                </span>
              )}
              <button
                type="submit"
                className={`${
                  !seconds && "hidden"
                } bg-[#176B87] text-white px-4 py-2 rounded-md mt-2 transition-transform transform hover:scale-[0.99]`}
              >
                Submit
              </button>
              <button
                className={`${
                  seconds && "hidden"
                } bg-[#176B87] text-white px-4 py-2 rounded-md mt-2 transition-transform transform hover:scale-[0.99]`}
                onClick={handlePhoneNumberSubmit}
              >
                Resend
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
