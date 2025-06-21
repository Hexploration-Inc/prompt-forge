"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// A simple spinner component
function Spinner() {
  return (
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100"></div>
  );
}

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");

  // State is now much simpler
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setImageUrl(null);
    setError(null);

    try {
      const response = await fetch("/api/generate/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, negativePrompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to generate image.");
      }

      // The response now directly contains the final image URL
      const data = await response.json();
      console.log("Received final data:", data);

      if (data.image_url) {
        setImageUrl(data.image_url);
      } else {
        throw new Error("API did not return an image URL.");
      }
    } catch (e) {
      console.error("Generation failed:", e);
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-[380px] p-4 border-r overflow-y-auto">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="prompt">Prompt</Label>
              <Textarea
                id="prompt"
                placeholder="A vibrant cityscape at sunset, in the style of a Monet painting."
                className="min-h-[120px] resize-none"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="negative-prompt">Negative Prompt</Label>
              <Textarea
                id="negative-prompt"
                placeholder="blurry, low-quality, ugly, text, watermark"
                className="min-h-[80px] resize-none"
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                disabled={loading}
              />
            </div>
            <Button
              className="w-full"
              onClick={handleGenerate}
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate"}
            </Button>
          </div>
        </aside>
        <main className="flex-1 p-4 flex items-center justify-center overflow-y-auto">
          {loading && (
            <div className="flex flex-col items-center gap-4">
              <Spinner />
              <p className="text-muted-foreground">
                Generating image... this can take a minute.
              </p>
            </div>
          )}
          {error && (
            <div className="text-destructive text-center">
              <h3 className="text-lg font-semibold">Error</h3>
              <p>{error}</p>
            </div>
          )}
          {!loading && imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt="Generated image"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          )}
          {!loading && !imageUrl && !error && (
            <div className="text-center text-muted-foreground">
              <p>Your generated image will appear here.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
