"use client";

import React, { Suspense, useEffect } from "react";

const getShiprocketToken = async () => {
  try {
    const res = await fetch("/api/admin/shiprocket/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      return {
        status: res.status,
        company_id: "",
        created_at: "",
        email: "",
        first_name: "",
        id: "",
        last_name: "",
        token: "",
      };
    }

    const shiprocketToken = await res.json();

    shiprocketToken.status = res.status;

    return shiprocketToken;
  } catch (err) {
    return {
      status: 500,
      company_id: "",
      created_at: "",
      email: "",
      first_name: "",
      id: "",
      last_name: "",
      token: "",
    };
  }
};

const ShiprocketProvider = ({ children }) => {
  useEffect(() => {
    const fetchToken = async () => {
      let savedToken = JSON.parse(localStorage.getItem("shiprocketToken"));
      const currentDate = new Date();
      const nineDaysInMilliseconds = 9 * 24 * 60 * 60 * 1000;

      if (
        !savedToken ||
        currentDate - new Date(savedToken.date) > nineDaysInMilliseconds ||
        savedToken.status_code !== 200
      ) {
        localStorage.removeItem("shiprocketToken");

        const token = await getShiprocketToken();
        token.date = new Date().toISOString();

        localStorage.setItem("shiprocketToken", JSON.stringify(token));

        savedToken = token;
      }
    };

    fetchToken();
  }, []);

  return <Suspense>{children}</Suspense>;
};

export default ShiprocketProvider;
