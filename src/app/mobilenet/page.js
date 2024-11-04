"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ImageUploader from "@/components/pages/coco-ssd/ImageUploader";
import { Progress } from "@/components/ui/progress";
import { Github } from "lucide-react";
import { loadModel, loadImage } from "@/utils/imageProcessing";
import Image from "next/image";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

export default function MobileNet() {
  const [model, setModel] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState(null);
  const [loadingState, setLoadingState] = useState({
    loading: true,
    progress: 0,
  });

  useEffect(() => {
    const loadTensorFlowModel = async () => {
      try {
        setLoadingState({ loading: true, progress: 10 });
        const loadedModel = await loadModel();
        setModel(loadedModel);
        setLoadingState({ loading: false, progress: 100 });
      } catch (error) {
        console.error("Error loading the model:", error);
        setError("Failed to load the model. Please try again later.");
        setLoadingState({ loading: false, progress: 100 });
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
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              MobileNet Model
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loadingState.loading && loadingState.progress < 100 && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Loading model...
                </p>
                <Progress value={loadingState.progress} className="w-full" />
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <ImageUploader
                handleFileChange={handleFileChange}
                startDetection={handleAnalyzeClick}
                isDisabled={!imagePreview || loadingState.loading}
              />

              <div className="relative aspect-square">
                {imagePreview && (
                  <>
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      className="object-cover rounded-lg"
                      width={400}
                      height={400}
                    />
                  </>
                )}
              </div>
            </div>

            {isAnalyzing && <Progress value={50} className="w-full" />}

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
          </CardContent>
        </Card>
      </main>
      <Footer className="border-t dark:border-gray-700">
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
      </Footer>
    </div>
  );
}
