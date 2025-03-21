import axios from 'axios';
import { isEmpty } from 'lodash';
import { NextRequest, NextResponse } from 'next/server';
import { Twilio } from 'twilio'
const syncServiceSid = process.env.TWILIO_SYNC_SERVICE_SID!;
const mapSid = process.env.NEXT_PUBLIC_CALLS_MAP_SID!
const SEGMENT_API_URL = `https://profiles.segment.com/v1/spaces/${process.env.SEGMENT_SPACE_ID}/collections/users/profiles/email:`;

export async function POST(req: NextRequest, _res: NextResponse) {
    const client = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    const { code } = await req.json();
    if (!code) {
        return NextResponse.json({ error: 'Missing code' }, { status: 400 });
    }

    try {

        const { data } = await client.sync.v1
        .services(syncServiceSid)
        .syncMaps(mapSid)
        .syncMapItems(code)
            .fetch();
        
        const requestURL = `${SEGMENT_API_URL}${data.participant.email}/traits?limit=200`
        const profile = await axios.get(requestURL, {
            headers: {
                Authorization: `Basic ${btoa(process.env.SEGMENT_API_TOKEN + ":")}`,
            },
        });
        if (isEmpty(profile.data.traits)) {
            return NextResponse.json({...data.participant});
        } else return NextResponse.json(profile.data.traits)
        
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            const { data } = await client.sync.v1
            .services(syncServiceSid)
            .syncMaps(mapSid)
            .syncMapItems(code)
              .fetch();
            return NextResponse.json({...data.participant});
        } else {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.log(errorMessage);
            return NextResponse.json({ error: errorMessage }, { status: 500 });
        }

    }
}