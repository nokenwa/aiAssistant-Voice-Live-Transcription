import {isEqual, sortBy} from 'lodash'
const twilio = require("twilio")()

const syncServiceSid = process.env.TWILIO_SYNC_SERVICE_SID!;
        const mapSid = process.env.NEXT_PUBLIC_CALLS_MAP_SID!;

export function SOCKET(
    client: import('ws').WebSocket,
    _request: import('http').IncomingMessage,
    _server: import('ws').WebSocketServer
) {
  console.log('A client connected');
  const { send} = createHelpers(client);
    (client as any).type = 'web'
  let callOngoing = true;
  let pollDelay = 2000
    client.on('message', async (message:any) => {
      const msg = JSON.parse(message.toString())
      
      try {
        const { data: callInfo } = await twilio.sync.v1
          .services(syncServiceSid)
          .syncMaps(mapSid)
          .syncMapItems(msg.sessionId)
          .fetch();
      

        switch (msg.event) {
          case "endCall":
            callOngoing = false
          case "pollHistory":
            let ch: Message[] = [];
            const introMessage = { event: "aiIntro", data: [{ id: "01", role: 'assistant', dateCreated: '2025-01-01T00:00:00Z', content: { content: await startMessage(callInfo.scenario, callInfo.participant.firstName) } }] }
            await send(introMessage)

            async function pollMessageHistory() {
              const newCh = await getConversationHistory(msg.sessionId, 100)
              if (ch.length < newCh.length) {
                send({ event: 'history', data: newCh.slice(ch.length) })
                ch = newCh;
                pollDelay = 2000
              } else if (!isEqual(ch.slice(-1)[0], newCh.slice(-1)[0])) {
                for (var i = 0, len = ch.length; i < len; i++) {
                  const duplicateIndex = newCh.findIndex(x => x.id === ch[i]?.id);
                  if (newCh[duplicateIndex].content.output === ch[duplicateIndex].content.output) {
                    newCh.splice(duplicateIndex, 1)
                  }
                }
                ch = newCh;
                send({ event: 'history', data: newCh })
                pollDelay = 2000
              } else {
                pollDelay = pollDelay + 1000
              }
              if (callOngoing && pollDelay <= 10000) {
                setTimeout(pollMessageHistory, pollDelay)
              }
            }
            pollMessageHistory()
            break;
          default:
            break;
      
        }
      } catch(error) {
        if (error instanceof Error) {
          console.log(error.message);
        } else {
          console.log(String(error));
        }
      }
    });
    
  client.on('close', () => {
      console.log('A client disconnected');
    });
}
  
function createHelpers(
  client: import('ws').WebSocket
) {
  const send = (payload: unknown) => client.send(JSON.stringify(payload));

  return { send };
}

type Message = {
  id: string,
  sessionId: string,
  role: string,
  content: { output: string },
  meta: Object,
  dateCreated: Date,
  dateUpdated: Date,
}

async function getConversationHistory(sessionId: string, limit: Number) {
  const messages: Message[] = await twilio.assistants.v1.sessions(`voice:${sessionId}`)
    .messages.list({ dateSent: new Date(),limit });
  return sortBy(messages, "dateCreated")
    // .filter((message: { role: string; }) => message.role !== "user")
    
}

async function startMessage(scenario: string, name: string) {

  switch (scenario) {
    case 'retail':
    return `Hello ${name || ''}, My name is Jeff and I work for Owl Shoes. Are you looking for some new shoes or do you have something else you need?`;
    break;
    case 'estates':
    return `Hello ${name || ''}, My name is Jeff and I work for Owl Estates. Are you looking to buy or rent a property today?`;
    break;
    case 'healthcare':
    return `Hello ${name || ''}, My name is Jeff and I work for Owl Healthcare. How can I assist you with your healthcare needs today?`;
    break;
    default:
    return `Hello ${name || ''}, My name is Jeff. How can I assist you today?`;
    break;
}

}