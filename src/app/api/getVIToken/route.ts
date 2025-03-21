import { NextRequest, NextResponse } from 'next/server';
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const VOICE_INTELLIGENCE_SERVICE_SID = process.env.VOICE_INTELLIGENCE_SERVICE_SID;


export async function POST(req: NextRequest, _res: NextResponse) {
 
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
    return NextResponse.json({ error: 'Environment variables are not set' }, { status: 500 });
  }

  const { transcriptSid } = await req.json();

try{
  const response = await fetch("https://ai.twilio.com/v1/Tokens", {
    headers: {
      authorization: `Basic ${btoa(TWILIO_ACCOUNT_SID + ":" + TWILIO_AUTH_TOKEN)}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      ott_ttl:300,
      grants: [{
        product: "annotator",
        service_sid: VOICE_INTELLIGENCE_SERVICE_SID,
        transcript_sid: transcriptSid,
        metadata: { 
          isDownloadButtonVisible: false 
        }
      }]
    }),
    method: "POST"
  });


  if (!response.ok) {
    console.log('error')
    return NextResponse.json({ error: 'Failed to fetch token from Twilio' }, { status: response.status });
  }

  const {token} = await response.json();
      // Serialize the token to a JWT string
      return NextResponse.json({ accessToken: token });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to generate token' }, { status: 500 });
    }
}