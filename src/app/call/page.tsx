"use client";

import { Badge, Button } from "@twilio-paste/core";
import { Box } from "@twilio-paste/core";

import { Heading } from "@twilio-paste/core";
import { ProductSegmentIcon } from "@twilio-paste/icons/cjs/ProductSegmentIcon";
import type { NextPage } from "next";
import Link from "next/link";

import Tasks from "./tasks";
import AIChat from "./aiChat";
import Profile from "./profile";
import { Suspense } from "react";

const Call: NextPage = () => {
  return (
    <Box as="main" padding="space70">
      <Box display="flex" alignItems="stretch" zIndex="zIndex10">
        <Box
          borderStyle="solid"
          borderRadius="borderRadius20"
          borderWidth="borderWidth10"
          borderColor="colorBorderPrimaryWeak"
          padding="space40"
          margin="space40"
          flexGrow={1}
          flexShrink={1}
          width="0"
        >
          <Heading as="h2" variant="heading20">
            Customer Profile
            <Badge as="span" variant="brand30">
              <ProductSegmentIcon decorative />
              Powered by Segment
            </Badge>
          </Heading>
          <Suspense>
            <Profile />
          </Suspense>
        </Box>
        <Suspense>
          <Tasks />
        </Suspense>
      </Box>
      <Box
        borderStyle="solid"
        borderRadius="borderRadius20"
        borderWidth="borderWidth10"
        borderColor="colorBorderPrimaryWeak"
        margin="space40"
        maxHeight="1300px"
        overflow="scroll"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        zIndex="zIndex0"
      >
        <style jsx>{`
          ::-webkit-scrollbar {
        display: none;
          }
        `}</style>
        <Suspense>
          <AIChat />
        </Suspense>
      </Box>
      <Box margin="space40">
        <Link href="/">
          <Button variant="destructive">Back to Home</Button>
        </Link>
      </Box>
    </Box>
  );
};

export default Call;

