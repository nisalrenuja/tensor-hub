"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload, Github } from "lucide-react";
import { loadModel, loadImage } from "@/utils/imageProcessing";
import Image from "next/image";

export default function Component() {
  const [model, setModel] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTensorFlowModel = async () => {
      try {
        const loadedModel = await loadModel();
        setModel(loadedModel);
      } catch (error) {
        console.error("Error loading the model:", error);
        setError("Failed to load the model. Please try again later.");
      }
    };
    loadTensorFlowModel();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyzeClick = async () => {
    if (!selectedFile) {
      setError("Please upload an image file.");
      return;
    }

    if (!model) {
      setError("The model is still loading. Please try again in a moment.");
      return;
    }

    setError(null);
    setIsAnalyzing(true);

    try {
      const image = await loadImage(selectedFile);
      const predictions = await model.classify(image);
      setPredictions(predictions);
    } catch (err) {
      console.error("Error analyzing the image:", err);
      setError("An error occurred while analyzing the image.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const downloadResults = useMemo(() => {
    return () => {
      const element = document.createElement("a");
      const file = new Blob(
        [
          `Predictions: \n${predictions
            .map(
              (pred) =>
                `${pred.className}: ${(pred.probability * 100).toFixed(2)}%\n`
            )
            .join("")}`,
        ],
        {
          type: "text/plain",
        }
      );
      element.href = URL.createObjectURL(file);
      element.download = "image-analysis-results.txt";
      document.body.appendChild(element);
      element.click();
    };
  }, [predictions]);

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      <header className="border-b dark:border-gray-700">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-black dark:text-white">
            Tensor Hub
          </h1>
          <p className="hidden md:block">
            A central hub for AI-powered analysis using TensorFlow.js models
          </p>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto sm:max-w-full md:max-w-md lg:max-w-lg">
          <CardHeader>
            <CardTitle>Analyze Your Image</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-2">
                <Input
                  type="file"
                  id="image-upload"
                  onChange={handleFileChange}
                  className="flex-grow"
                />
                <Button
                  onClick={handleAnalyzeClick}
                  disabled={isAnalyzing}
                  className="w-full sm:w-auto"
                >
                  {isAnalyzing ? (
                    <div className="flex items-center">
                      <span className="spinner-border animate-spin inline-block w-4 h-4 border-4 rounded-full"></span>
                      <span className="ml-2">Analyzing...</span>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Analyze
                    </>
                  )}
                </Button>
              </div>

              {imagePreview && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Image Preview:</h3>
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    className="max-w-full h-auto rounded-lg"
                    width={500}
                    height={500}
                  />
                </div>
              )}

              {isAnalyzing && <Progress value={50} className="w-full" />}

              {error && <p className="text-red-600 mt-2">{error}</p>}

              {predictions.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Results:</h3>
                  <ul className="space-y-2">
                    {predictions.map((pred, index) => (
                      <li
                        key={index}
                        className="grid grid-cols-3 items-center w-full gap-1"
                      >
                        <div className="font-xs">
                          {pred.className}
                          <a
                            href={`https://en.wikipedia.org/wiki/${pred.className}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-500 ml-2"
                          >
                            (Learn More)
                          </a>
                        </div>

                        <div className="w-full">
                          <Progress
                            value={pred.probability * 100}
                            className="w-full"
                          />
                        </div>

                        <div className="text-right font-mono">
                          {(pred.probability * 100).toFixed(2)}%
                        </div>
                      </li>
                    ))}
                  </ul>

                  <Button onClick={downloadResults} className="mt-4 w-full">
                    Download Results
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>

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
    </div>
  );
}
