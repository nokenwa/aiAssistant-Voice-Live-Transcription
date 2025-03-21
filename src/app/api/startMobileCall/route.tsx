import { NextRequest, NextResponse } from "next/server";

import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export async function POST(req: NextRequest, _res: NextResponse) {
  try {
    const retailAssistantId = process.env.RETAIL_ASSISTANT_ID;
    const estatesAssistantId = process.env.ESTATES_ASSISTANT_ID;
    const healthcareAssistantId = process.env.HEALTHCARE_ASSISTANT_ID;
    const { to, scenario } = await req.json();

    const from = process.env.TWILIO_PHONE_NUMBER as string;
    const baseUrl =
      process.env.NODE_ENV === "production"
        ? process.env.APP_URL!
        : process.env.BASE_URL!;
    let url = `${baseUrl}/api/mobileTwiml`;

    if (scenario === "retail") {
      url += `?assistant=${retailAssistantId}`;
    } else if (scenario === "estates") {
      url += `?assistant=${estatesAssistantId}`;
    } else if (scenario === "health") {
      url += `?assistant=${healthcareAssistantId}`;
    }

    const call = await client.calls.create({
      to,
      from,
      url,
    });
    return NextResponse.json({ success: true, call });
  } catch (error) {
    console.error(error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(errorMessage, {
      status: 500,
    });
  }
}
