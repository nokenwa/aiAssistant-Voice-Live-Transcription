"use client";

import { useState, useEffect, useRef } from "react";

import {
  Box,
  Stack,
  SkeletonLoader,
  DescriptionList,
  DescriptionListSet,
  DescriptionListTerm,
  Text,
} from "@twilio-paste/core";
import { useSearchParams } from "next/navigation";
import TraitLegend from "./traitLegend";
import { motion, AnimatePresence } from "motion/react";

const Profile: React.FC = () => {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  const [profile, setProfile] = useState<ProfileType>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);
  const pollDelay = useRef<number>(2000);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/getSegmentProfile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    if (code) {
      pollRef.current = setInterval(fetchProfile, pollDelay.current);
      return () => {
        if (pollRef.current) {
          clearInterval(pollRef.current as NodeJS.Timeout);
        }
      };
    }
  }, [code]);

  return (
    <DescriptionList>
      <DescriptionListSet>
        <DescriptionListTerm>
          <AnimatePresence initial={false}>
            {profile ? (
              <motion.div
                initial={{ opacity: 0, scale: 0, x: -100 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  x: 0,
                  transition: { duration: 0.5 },
                }}
                exit={{ opacity: 0, scale: 0 }}
              >
                <Text as="h2" fontSize="fontSize70">
                  {profile.first_name || profile.firstName}{" "}
                  {profile.last_name || profile.lastName}
                </Text>
              </motion.div>
            ) : null}
            {!profile ? <Loader /> : null}
          </AnimatePresence>
        </DescriptionListTerm>
      </DescriptionListSet>

      <Box display="flex" columnGap="space40" rowGap="space60" flexWrap="wrap">
        {profile ? <TraitLegend traits={profile} /> : <Loader />}
      </Box>
    </DescriptionList>
  );
};

export default Profile;

interface Profile {
  firstName?: string;
  lastName?: string;
  [key: string]: any;
}

type ProfileType = Profile | null;

const Loader: React.FC = () => {
  return (
    <Stack orientation="vertical" spacing="space60">
      <SkeletonLoader />
    </Stack>
  );
};
