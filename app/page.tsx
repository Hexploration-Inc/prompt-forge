import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function Home() {
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
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="negative-prompt">Negative Prompt</Label>
              <Textarea
                id="negative-prompt"
                placeholder="blurry, low-quality, ugly, text, watermark"
                className="min-h-[80px] resize-none"
              />
            </div>
            <Button className="w-full">Generate</Button>
          </div>
        </aside>
        <main className="flex-1 p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Output</h2>
          {/* The generated images and videos will be displayed here */}
        </main>
      </div>
    </div>
  );
}
