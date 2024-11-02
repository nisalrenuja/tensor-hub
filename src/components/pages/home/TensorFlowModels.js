import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Brain, Camera, Mic, FileText } from "lucide-react";

const models = [
  {
    title: "MobileNet",
    description: "Classify images into predefined categories",
    icon: Camera,
    link: "/mobilenet",
  },
  {
    title: "Natural Language Processing",
    description: "Process and analyze human language",
    icon: FileText,
    link: "/models/nlp",
  },
  {
    title: "Speech Recognition",
    description: "Convert spoken language into text",
    icon: Mic,
    link: "/models/speech-recognition",
  },
  {
    title: "Neural Network",
    description: "Build and train custom neural networks",
    icon: Brain,
    link: "/models/neural-network",
  },
];

export default function TensorFlowModels() {
  return (
    <div className="container mx-auto py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {models.map((model, index) => (
          <Card key={index} className="flex flex-col">
            <CardHeader>
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
                <model.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <CardTitle>{model.title}</CardTitle>
              <CardDescription>{model.description}</CardDescription>
            </CardHeader>
            <CardFooter className="mt-auto">
              <Button asChild className="w-full">
                <Link href={model.link}>
                  Explore <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
