# aiAssistant-Voice-Live-Transcription

This project is a live transcription and voice assistant application built using **Next.js**, **Twilio**, and other modern web technologies. It integrates Twilio's services to handle voice interactions, transcription, and real-time communication, making it ideal for building AI-powered voice-based applications.

## Features

- **Voice Transcription**: Real-time transcription of voice interactions using Twilio's transcription services.
- **AI Assistant Integration**: Connects to an AI assistant to handle user queries and provide responses.
- **Customizable Voice Settings**: Supports custom voice models, transcription providers, and text-to-speech (TTS) configurations.
- **Environment-Specific Configuration**: Dynamically adjusts settings based on the environment (development or production).

---

## Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js** (v20 or higher)
- **pnpm** (v10.4 or higher)
- **Twilio Account**: With access to Twilio Sync, Voice, and other required services.
- **Environment Variables**: Set up the required environment variables (see `.env.sample`).

---

## Setup Instructions

Follow these steps to set up and run the project locally:

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/aiAssistant-Voice-Live-Transcription.git
cd aiAssistant-Voice-Live-Transcription
```

### 2. Install Dependencies
Use pnpm to install the required dependencies:

```bash pnpm install```

### 3. Create Twilio Properties
To set up Twilio properties, you need to create and configure the following:

1. **Twilio Account SID and Auth Token**  
    - Log in to your Twilio account and navigate to the [Console Dashboard](https://www.twilio.com/console).
    - Copy your **Account SID** and **Auth Token**. These will be used for authentication.

2. **Twilio Phone Number**  
    - Purchase a Twilio phone number capable of voice functionality from the [Phone Numbers section](https://www.twilio.com/console/phone-numbers/incoming).
    - Configure the phone number to use your application's webhook for voice events.

3. **Twilio Sync Service**  
    - Create a new Sync Service in the [Sync Dashboard](https://www.twilio.com/console/sync/services).
    - Create a sync Map to keep track of calls and this sync Map sid to the .env file

4. **Twilio API Key and Secret**  
    - Generate an API Key and Secret in the [API Keys section](https://www.twilio.com/console/project/api-keys).
    - These are used for secure communication with Twilio services.

5. **Twilio Voice Webhook**  
    - Set up a webhook URL to handle incoming voice calls. This should point to your application's endpoint (e.g., `/api/voice`).

6. **Twilio Voice Intelligence Service**  
    - Navigate to the [Voice Intelligence Dashboard](https://www.twilio.com/console/voice/intelligence) and create a new service.  
    - Note the **Service SID** for integration with your application.  
    - Configure the Voice Intelligence Service Webhook to point to `/api/voiceIntelligence`