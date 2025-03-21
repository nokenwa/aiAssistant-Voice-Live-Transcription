import { NextRequest, NextResponse } from 'next/server';
import { twiml, Twilio } from 'twilio';

const { VoiceResponse } = twiml;
const client = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export async function POST(req: NextRequest, _res: NextResponse) {
    try {
        // Determine the base URL based on the environment
        const baseUrl = process.env.NODE_ENV === 'production' ? process.env.APP_URL! : process.env.BASE_URL!;
        const url = new URL(req.url!, baseUrl);

        // Extract query parameters
        const assistantId = url.searchParams.get("assistant") as string;
        const code = url.searchParams.get("code") as string;

        // Fetch call information from Twilio Sync
        const syncServiceSid = process.env.TWILIO_SYNC_SERVICE_SID!;
        const mapSid = process.env.NEXT_PUBLIC_CALLS_MAP_SID!;
        const { data: callInfo } = await client.sync.v1
            .services(syncServiceSid)
            .syncMaps(mapSid)
            .syncMapItems(code)
            .fetch();

        // Create a Twilio VoiceResponse
        const response = new VoiceResponse();

        // Add transcription settings
        const start = response.start();
        start.transcription({
            intelligenceService: process.env.VOICE_INTELLIGENCE_SERVICE_SID,
            inboundTrackLabel: 'Customer',
            outboundTrackLabel: "Agent",
            languageCode: 'en-GB',
        });

        // Generate the opening message
        const openingMessage = `Hello ${callInfo.participant.firstName || ''}, My name is Jeff and I work for Owl Shoes. Are you looking for some new shoes or do you have something else you need?`;

        // Add assistant connection with parameters
        const connect = response.connect({});
        const assistant = connect.assistant({
            id: assistantId,
            welcomeGreeting: openingMessage,
            transcriptionProvider: "deepgram",
            voice: process.env.VOICE_ID,
            ttsProvider: 'Elevenlabs',
            speechModel: 'nova-2-general',
        });

        // Add assistant parameters
        assistant.parameter({
            "name": "identity",
            "value": `email:${callInfo.participant.email}`,
        });
        assistant.parameter({
            "name": "sessionId",
            "value": code,
        });

        // Return the XML response
        return new Response(response.toString(), {
            status: 200,
            headers: { 'content-type': 'text/xml' },
        });
    } catch (error) {
        // Handle errors and log them
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error('Error in POST /boothTWIML:', errorMessage);

        return new Response('Something went wrong', {
            status: 500,
        });
    }
}

