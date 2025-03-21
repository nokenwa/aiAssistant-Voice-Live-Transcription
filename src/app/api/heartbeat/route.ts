import { NextRequest, NextResponse } from "next/server";

export async function POST(_req: NextRequest, _res: NextResponse) {

    return new Response('heartbeat', {
      status: 200,
      headers: { "content-type": "text" },
    });

}
