"use client";
import { Box, Button, Card, Heading, Text } from "@twilio-paste/core";
import type { NextPage } from "next";
import Head from "next/head";
import { RefreshIcon } from "@twilio-paste/icons/cjs/RefreshIcon";

// import Keypad from "./components/Keypad";
import WebSocketHandler from "./components/WebSocketHandler";
import StartForm from "./components/StartForm";
import Video from "./components/Video";

const Home: NextPage = () => {
  return (
    <Box as="main" padding="space70">
      <Head>
        <title>Paste NextJS App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box
        display="flex"
        justifyContent="center"
        marginY="space70"
        overflowX="hidden"
      >
        <Video />
      </Box>
      <Box height="100px"></Box>
      <Box margin="space70" textAlign="center">
        <Text as="h1" fontSize="fontSize110">
          Voice Agents
        </Text>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        margin="space70"
      >
        <Heading as="h1" variant="heading20">
          Try out the future of Voice Agents powered by Twilio
        </Heading>
      </Box>
      <Box display="flex" justifyContent="center" columnGap="space70">
        <Card>
          <Box marginY="space60" textAlign="center">
            <StartForm />
          </Box>
        </Card>
      </Box>

      <WebSocketHandler />
      <Box position="fixed" bottom="space70" left="space70">
        <Button
          variant="destructive_icon"
          onClick={() => window.location.reload()}
        >
          <RefreshIcon decorative={false} title="remove" />
        </Button>
      </Box>
    </Box>
  );
};

export default Home;
