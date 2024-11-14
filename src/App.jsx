import React from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { Route, Routes, Navigate } from "react-router-dom";

import Example from "./pages/Example";
import Stopwatch from "./pages/Stopwatch";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools />
      <Routes>
        <Route path="/" element={<Navigate to="/stopwatch" />} />
        <Route path="/Example" element={<Example />} />
        <Route path="/stopwatch" element={<Stopwatch />} />
      </Routes>
    </QueryClientProvider>
  );
}
