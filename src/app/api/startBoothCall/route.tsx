import { NextRequest, NextResponse } from "next/server";
import { Analytics } from "@segment/analytics-node";

import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export async function POST(req: NextRequest, _res: NextResponse) {
  const analytics = new Analytics({
    writeKey: process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY!,
  });

  const { participant } = await req.json();

  if (!participant) {
    return new Response("Missing participant info", {
      status: 400,
    });
  }

  // The Sync Service SID and Sync Map SID are used to create a new Sync Map Item
  const syncServiceSid = process.env.TWILIO_SYNC_SERVICE_SID!;
  const syncMapSid = process.env.NEXT_PUBLIC_CALLS_MAP_SID!;

  // Create Tasks that show up on the call page
  const tasks: { [key: string]: any } = {};
  tasks["Order a Pair of Shoes"] = false;
  tasks["Change the address or Shoe Size on your Order"] = false;

  // Create a new Sync Map Item with the participant's info
  const itemData = {
    scenario: "retail",
    tasks,
    participant,
    timestamp: new Date().toISOString(),
  };

  // Generate a random 4-digit code in production the 4 digit code would be your User Identifier
  let code = Math.floor(1000 + Math.random() * 9000).toString();

  let attempts = 0;
  const maxAttempts = 5;

  while (attempts < maxAttempts) {
    try {
      await client.sync.v1
        .services(syncServiceSid)
        .syncMaps(syncMapSid)
        .syncMapItems.create({ key: code, data: itemData });

      break; // Exit loop if successful
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Error in POST /phoneBoothEnQueue:", errorMessage);

      attempts++;
      if (attempts >= maxAttempts) {
        throw new Error(
          "Failed to create sync map item after multiple attempts",
        );
      }
      // Generate a new code and try again
      code = Math.floor(1000 + Math.random() * 9000).toString();
    }
  }

  // Identify the participant in Segment
  await analytics.identify({
    userId: code,
    traits: {
      ...participant,
    },
  });

  //Create a new call to the retail assistant
  try {
    const retailAssistantId = process.env.RETAIL_ASSISTANT_ID;
    const to = process.env.TWILIO_SIP_PHONE as string;
    const from = process.env.TWILIO_PHONE_NUMBER as string;

    if (!to) {
      throw new Error("TWILIO_SIP_PHONE environment variable is not set");
    }

    const baseUrl =
      process.env.NODE_ENV === "production"
        ? process.env.APP_URL!
        : process.env.BASE_URL!;
    let url = `${baseUrl}/api/boothTwiml`;
    url += `?code=${code}`;
    url += `&scenario=retail`;
    url += `&assistant=${retailAssistantId}`;

    await client.calls.create({
      to,
      from,
      url,
    });
    return NextResponse.json({ success: true, code });
  } catch (error) {
    console.error(error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(errorMessage, {
      status: 500,
    });
  }
}
