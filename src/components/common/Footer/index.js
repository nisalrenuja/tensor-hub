"use client";

import { Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t dark:border-gray-700">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          © 2024 Tensor Hub. Design & Developed By Nisal Renuja Palliyaguru.
        </p>
        <div className="flex space-x-4">
          <a
            href="https://github.com/nisalrenuja/tensor-hub"
            target="_blank"
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900"
          >
            <Github className="w-5 h-5" />
            <span className="sr-only">GitHub</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
