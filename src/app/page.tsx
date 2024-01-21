"use client";

import LoginPage from "@/components/Login";
import { axiosRequest } from "@/helpers/axios/axiosRequest";
import { Toaster } from "react-hot-toast";

export default function Home() {

  return (
    <div>
      <div>
        <LoginPage />
      </div>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}
