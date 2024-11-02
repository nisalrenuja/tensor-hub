"use client";

import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import TensorFlowModels from "@/components/pages/home/TensorFlowModels";

export default function Component() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      <Header />
      <main className="flex-grow">
        <TensorFlowModels />
      </main>
      <Footer />
    </div>
  );
}
