"use client";

import { AppContext } from "@/context/app-provider";
import { useContext } from "react";

export const useAppState = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppState must be used within an AppProvider");
  }
  return context;
};
