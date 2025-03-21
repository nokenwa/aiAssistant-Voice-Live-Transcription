"use client";
import { motion } from "motion/react";

import { Suspense, useState } from "react";
import { Box, Button, Heading, Text } from "@twilio-paste/core";

import type { NextPage } from "next";
import Head from "next/head";

import { CallIcon } from "@twilio-paste/icons/esm/CallIcon";
import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";

const Scenario: NextPage = () => {
  const router = useRouter();

  return (
    <Box as="main" padding="space70">
      <Head>
        <title>Paste NextJS App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box padding="space100">
        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: -100 }}
          animate={{
            scale: 1,
            opacity: 1,
            y: 0,
            transition: { duration: 1 },
          }}
        >
          <Box margin="space70" textAlign="center">
            <Heading as="h1" variant="heading10">
              Experience the Future of AI-Powered Conversations
            </Heading>
          </Box>
        </motion.div>
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: 1,
            transition: { duration: 1, delay: 1 },
          }}
        >
          <Box margin="space70" marginTop="space100" textAlign="center">
            <Text as="p" fontSize="fontSize70" lineHeight="lineHeight70">
              Try out Twilio’s Voice AI Agents and see how effortless automated
              conversations can be. Our AI agents can handle customer inquiries,
              schedule appointments, process transactions, and more—all with
              natural, human-like interactions.
            </Text>
          </Box>
        </motion.div>
        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: -100 }}
          animate={{
            scale: 1,
            opacity: 1,
            y: 0,
            transition: { duration: 1, delay: 3 },
          }}
        >
          <Box display="flex" justifyContent="center" columnGap="space70">
            <Box display="flex" justifyContent="center" marginY="space70">
              <Image
                src="/jeff.png"
                width={400}
                height={400}
                alt="Picture of the author"
              />
            </Box>

            <Box margin="space70" textAlign="left">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 1, delay: 4 },
                }}
              >
                <Heading as="h1" variant="heading20">
                  Meet Jeff!
                </Heading>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 1, delay: 5 },
                }}
              >
                <Text as="p" fontSize="fontSize50" marginBottom="space50">
                  The friendly AI Assistant working the phone lines at Owl Shoes
                </Text>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 1, delay: 6 },
                }}
              >
                <Text as="p" fontSize="fontSize50" marginBottom="space50">
                  Today he's here to help you order your next pair of kicks
                </Text>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 1, delay: 7 },
                }}
              >
                <Text as="p" fontSize="fontSize50" marginBottom="space50">
                  Ask him for some recommendations and order some shoes
                </Text>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 1, delay: 8 },
                }}
              >
                <Text as="p" fontSize="fontSize50" marginBottom="space50">
                  Feel free to correct him, and change your shoe size or
                  delivery address
                </Text>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 1, delay: 8 },
                }}
              >
                <Box display="flex" paddingTop="space40">
                  <Suspense>
                    <StartButton />
                  </Suspense>
                </Box>
              </motion.div>
            </Box>
          </Box>
        </motion.div>
      </Box>
      <Box position="absolute" bottom="0">
        <Button onClick={() => router.push("/")} variant="destructive">
          Back
        </Button>
      </Box>
    </Box>
  );
};

export default Scenario;

const StartButton: React.FC = () => {
  const [buttonLoading, setButtonLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const firstName = searchParams.get("firstName");
  const lastName = searchParams.get("lastName");
  const number = searchParams.get("number");

  const participant = {
    email: email,
    firstName: firstName,
    lastName: lastName,
    number: number,
  };

  const handleClick = async () => {
    setButtonLoading(true);

    try {
      const response = await fetch("/api/startBoothCall", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ participant }),
      });
      const { code } = await response.json();
      router.push(`/call?code=${code}`);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Button variant="primary" loading={buttonLoading} onClick={handleClick}>
      <CallIcon decorative />
      Start Call
    </Button>
  );
};
