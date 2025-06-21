import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const beamToken = process.env.BEAM_TOKEN;
    const beamAppUrl = process.env.BEAM_APP_URL;

    if (!beamToken || !beamAppUrl) {
      throw new Error("BEAM_TOKEN or BEAM_APP_URL is not set in .env.local");
    }

    // Get the prompt from the user's request
    const { prompt, negativePrompt } = await request.json();
    console.log("API route received:", { prompt, negativePrompt });

    const payload = {
      prompt,
      negative_prompt: negativePrompt,
    };

    // Make a single, direct call to the synchronous Beam endpoint
    const beamResponse = await fetch(beamAppUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${beamToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!beamResponse.ok) {
      const errorText = await beamResponse.text();
      console.error("Beam API Error:", errorText);
      throw new Error(`Beam API responded with status ${beamResponse.status}`);
    }

    // First, get the raw text of the response for debugging
    const responseText = await beamResponse.text();
    console.log("Raw response text from Beam:", responseText);

    // Now, try to parse the text as JSON
    const data = JSON.parse(responseText);
    console.log("Beam response with final URL:", data);

    // Forward the response containing the image_url to the frontend
    return NextResponse.json(data);
  } catch (error) {
    console.error("API Error:", error);
    let errorMessage = "An error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
