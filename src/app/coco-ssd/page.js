"use client";

import { useState, useEffect, useRef } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import ImageUploader from "@/components/pages/coco-ssd/ImageUploader";
import DetectedObjectsList from "@/components/pages/coco-ssd/DetectedObjectsList";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { Github } from "lucide-react";

export default function ObjectDetection() {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const [model, setModel] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [detectedObjects, setDetectedObjects] = useState([]);
  const [loadingState, setLoadingState] = useState({
    loading: true,
    progress: 0,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadModel = async () => {
      try {
        setLoadingState({ loading: true, progress: 10 });
        const loadedModel = await cocoSsd.load();
        setModel(loadedModel);
        setLoadingState({ loading: false, progress: 100 });
      } catch (err) {
        setError("Failed to load model.");
        setLoadingState({ loading: false, progress: 100 });
      }
    };
    loadModel();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedImage(null);
      setDetectedObjects([]);
      setError(null);

      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const drawDetections = (ctx, detections) => {
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.drawImage(
      imageRef.current,
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );

    detections.forEach(({ bbox: [x, y, width, height], class: className }) => {
      ctx.strokeStyle = "green";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);
      ctx.fillStyle = "green";
      ctx.font = "16px Arial";
      ctx.fillText(className, x, y > 10 ? y - 5 : 10);
    });
  };

  const startDetection = async () => {
    if (!model) return setError("Model not loaded yet.");
    if (!imageRef.current) return setError("No image selected.");

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    setLoadingState({ loading: true, progress: 0 });
    try {
      const detections = await model.detect(imageRef.current);
      setDetectedObjects(detections);
      drawDetections(ctx, detections);
    } catch (err) {
      setError("Failed to perform detection.");
    } finally {
      setLoadingState({ loading: false, progress: 100 });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      <Header />
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            COCO-SSD Model
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loadingState.loading && loadingState.progress < 100 && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Loading model...</p>
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
              startDetection={startDetection}
              isDisabled={!uploadedImage || loadingState.loading}
            />

            <div className="relative aspect-square">
              {uploadedImage && (
                <>
                  <Image
                    ref={imageRef}
                    src={uploadedImage}
                    alt="Uploaded"
                    height={400}
                    width={400}
                    className="object-cover rounded-lg"
                  />
                  <canvas
                    ref={canvasRef}
                    width={400}
                    height={400}
                    className="absolute top-0 left-0 w-full h-full"
                  />
                </>
              )}
            </div>
          </div>

          {detectedObjects.length > 0 && (
            <DetectedObjectsList detectedObjects={detectedObjects} />
          )}
        </CardContent>
      </Card>
      <Footer />
    </div>
  );
}
