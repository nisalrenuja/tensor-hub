"use client";

import { Upload, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ImageUploader({
  handleFileChange,
  startDetection,
  isDisabled,
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="image-upload"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              PNG, JPG or GIF (MAX. 800x400px)
            </p>
          </div>
          <input
            id="image-upload"
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept="image/*"
          />
        </label>
      </div>

      <Button onClick={startDetection} disabled={isDisabled} className="w-full">
        <Zap className="w-4 h-4 mr-2" />
        Start Detection
      </Button>
    </div>
  );
}
