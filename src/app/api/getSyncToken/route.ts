import { NextRequest, NextResponse } from 'next/server';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioApiKey = process.env.TWILIO_API_KEY;
const twilioApiSecret = process.env.TWILIO_API_SECRET;
const syncService = process.env.TWILIO_SYNC_SERVICE_SID;
const AccessToken = require('twilio').jwt.AccessToken;


export async function POST(_req: NextRequest, _res: NextResponse) {
    try {
       // Used specifically for creating Sync tokens
const identity = 'phoneBooth';

      // Create a "grant" which enables a client to use Sync as a given user
      const SyncGrant = AccessToken.SyncGrant;
const grant = new SyncGrant({
  serviceSid: syncService,
});

// Create an access token which we will sign and return to the client,
// containing the grant we just created
const token = new AccessToken(
  accountSid,
  twilioApiKey,
  twilioApiSecret,
  { identity: identity }
);
token.addGrant(grant);

      // Serialize the token to a JWT string
      return NextResponse.json({ accessToken: token.toJwt() });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to generate Sync token' }, { status: 500 });
    }
}