"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { SyncClient, SyncMap } from "twilio-sync";
import { motion } from "motion/react";

import { Box, Stack, Heading, Text, SkeletonLoader } from "@twilio-paste/core";
import { useSearchParams } from "next/navigation";

const Tasks: React.FC = () => {
  const [syncToken, setSyncToken] = useState<string | null>(null);
  const [syncClient, setSyncClient] = useState<SyncClient | null>(null);

  useEffect(() => {
    async function fetchSyncToken() {
      try {
        const response = await fetch("/api/getSyncToken", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const data = await response.json();
          setSyncToken(data.accessToken);
        } else {
          console.error("Failed to fetch sync token");
        }
      } catch (error) {
        console.error("Error fetching sync token:", error);
      }
    }
    fetchSyncToken();
  }, []);
  useEffect(() => {
    async function fetchSyncClient() {
      try {
        if (syncToken) {
          const syncClient = new SyncClient(syncToken);
          setSyncClient(syncClient);
        }
      } catch (error) {
        console.error("Failed to fetch Sync Map Item:", error);
      }
    }

    fetchSyncClient();
  }, [syncToken]);
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  const [activeCall, _, mapInitialized] = useSyncMap(
    syncClient,
    process.env.NEXT_PUBLIC_CALLS_MAP_SID!,
    code ? code : "",
  );
  return (
    <>
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
        <Heading as="h2" variant="heading20" marginBottom="space0">
          Tasks
        </Heading>
        <Box
          display="flex"
          columnGap="space40"
          rowGap="space60"
          flexWrap="wrap"
        >
          <Suspense>
            <Stack orientation="vertical" spacing="space40">
              {!syncClient || !mapInitialized ? (
                <SkeletonLoader />
              ) : (
                <>
                  {" "}
                  {Object.keys(activeCall.tasks)
                    .reverse()
                    .map((task, index) => (
                      <motion.label
                        style={{ display: "flex", alignItems: "center" }}
                        key={index}
                        animate={{
                          textDecorationLine: activeCall.tasks[task]
                            ? "line-through"
                            : "none",
                        }}
                      >
                        <motion.input
                          animate={{
                            x: activeCall.tasks[task] ? [0, -4, 0] : [0, 4, 0],
                            scale: activeCall.tasks[task] ? [1, 1.5, 1] : [1],
                          }}
                          className="taskCheckbox"
                          type="checkbox"
                          checked={activeCall.tasks[task]}
                          readOnly
                          style={{ marginRight: "space30" }}
                        />
                        <div>
                          <Text as="span" fontSize="fontSize40">
                            {task}
                          </Text>
                        </div>
                      </motion.label>
                    ))}
                </>
              )}
            </Stack>
          </Suspense>
        </Box>
      </Box>
    </>
  );
};

export default Tasks;

function useSyncMap(
  syncClient: SyncClient | null,
  name: string,
  sessionId: string,
) {
  const [docReady, setDocReady] = useState(false);
  const [syncResource, setResource] = useState<SyncMap>();
  const [mapItem, setMapItem] = useState<{ tasks: Record<string, any> }>({
    tasks: {},
  });

  useEffect(() => {
    setResource(undefined);
  }, [syncClient]);

  useEffect(() => {
    (async () => {
      if (syncClient && !syncResource) {
        try {
          const newMap = await syncClient.map(name);
          const mapData = new Map();
          setResource(newMap);
          newMap.on("itemUpdated", (args) => {
            if (args.item.key === sessionId) {
              setMapItem(args.item.data);
            }
          });
          newMap.on("itemAdded", (args) => {
            if (args.item.key === sessionId) {
              setMapItem(args.item.data);
            }
          });
          try {
            const item = await newMap.get(sessionId);
            mapData.set(sessionId, item?.data);
          } catch (e) {
            console.error(e);
          }

          setDocReady(true);
        } catch (e: any) {
          console.error(e);
        }
      }
    })();
    return () => {
      syncResource && syncResource.close();
    };
  }, [syncClient, syncResource, name]);

  const setData = useCallback(
    async (key: string, value: any) => {
      if (!syncResource) {
        throw new Error("Sync Map not initialized");
      }
      try {
        await syncResource.set(key, value);
      } catch (e: any) {}
    },
    [syncResource, mapItem],
  );

  return [mapItem, setData, docReady] as const;
}
