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

// Define our style presets
const stylePresets = [
  {
    name: "Cinematic",
    prompt:
      "cinematic, dramatic lighting, high detail, intricate, 8k, photorealistic",
  },
  {
    name: "Anime",
    prompt: "anime, cel-shaded, vibrant colors, detailed, studio ghibli style",
  },
  {
    name: "Photorealistic",
    prompt: "photorealistic, 85mm lens, f/1.8, photography, ultra detail",
  },
  {
    name: "Fantasy",
    prompt:
      "fantasy art, epic, detailed, intricate, matte painting, concept art",
  },
];

// Define aspect ratios
const aspectRatios = [
  { name: "Square", width: 1024, height: 1024 },
  { name: "Portrait", width: 896, height: 1152 },
  { name: "Widescreen", width: 1152, height: 896 },
];

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState(stylePresets[0]);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState(
    aspectRatios[0]
  );

  // State is now much simpler
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setImageUrl(null);
    setError(null);

    // Combine the user's prompt with the selected style's keywords
    const finalPrompt = selectedStyle
      ? `${prompt}, ${selectedStyle.prompt}`
      : prompt;

    console.log("Generating with final prompt:", finalPrompt);

    try {
      const response = await fetch("/api/generate/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: finalPrompt,
          negativePrompt,
          width: selectedAspectRatio.width,
          height: selectedAspectRatio.height,
        }),
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
            <div className="space-y-3">
              <Label>Style</Label>
              <div className="grid grid-cols-2 gap-2">
                {stylePresets.map((style) => (
                  <Button
                    key={style.name}
                    variant={
                      selectedStyle?.name === style.name
                        ? "secondary"
                        : "outline"
                    }
                    className="h-auto py-2 px-3 text-xs"
                    onClick={() => setSelectedStyle(style)}
                    disabled={loading}
                  >
                    {style.name}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <Label>Aspect Ratio</Label>
              <div className="grid grid-cols-3 gap-2">
                {aspectRatios.map((ratio) => (
                  <Button
                    key={ratio.name}
                    variant={
                      selectedAspectRatio.name === ratio.name
                        ? "secondary"
                        : "outline"
                    }
                    className="h-auto py-2 px-3 text-xs"
                    onClick={() => setSelectedAspectRatio(ratio)}
                    disabled={loading}
                  >
                    {ratio.name}
                  </Button>
                ))}
              </div>
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
