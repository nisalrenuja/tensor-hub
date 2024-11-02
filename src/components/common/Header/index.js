"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b dark:border-gray-700">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/">
          <h1 className="text-2xl font-bold text-black dark:text-white cursor-pointer">
            Tensor Hub
          </h1>
        </Link>
        <p className="hidden md:block">
          A central hub for AI-powered analysis using TensorFlow.js models
        </p>
      </div>
    </header>
  );
}
