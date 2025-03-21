"use client";
import { AnimatePresence, motion } from "motion/react";
import { sortBy, uniqBy } from "lodash";
import { useState, useEffect, useRef, Suspense } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

import {
  AIChatLog,
  AIChatMessage,
  AIChatMessageAuthor,
  AIChatMessageBody,
} from "@twilio-paste/ai-chat-log";
import {
  Box,
  ChatLog,
  ChatMessage,
  ChatBubble,
  ChatBookend,
  ChatBookendItem,
  Button,
  Spinner,
  AlertDialog,
} from "@twilio-paste/core";
import { ProductAIAssistantsIcon } from "@twilio-paste/icons/cjs/ProductAIAssistantsIcon";

import { useSearchParams } from "next/navigation";
import ToolMessage from "./toolMessage";
import WrapUpModal from "./wrapUpModal";
import { useRouter } from "next/navigation";

interface AIChatProps {}

const AIChat: React.FC<AIChatProps> = ({}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [viSid, setViSid] = useState("");
  const [viVisible, setVIVisible] = useState(false);
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  const wssURL =
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_APP_DOMAIN!
      : process.env.NEXT_PUBLIC_WS_BASE_URL!;
  const WS_URL = `wss://${wssURL}/api/ws/callConversation`;
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket<any>(
    WS_URL,
    {
      share: false,
      shouldReconnect: () => false,
    },
  );

  // Run when the connection state (readyState) changes
  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      sendJsonMessage({
        event: "pollHistory",
        sessionId: code,
      });
    }
  }, [readyState]);

  const [conversationHistory, setConversationHistory] = useState<any[]>([]);
  enum CallStatus {
    Ongoing = "ongoing",
    Ended = "ended",
    Ringing = "ringing",
  }
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.Ringing);

  useEffect(() => {
    const data = lastJsonMessage?.data || [];
    const event = (lastJsonMessage?.event as string) || "";
    switch (event) {
      case "aiIntro":
        setConversationHistory([...conversationHistory, ...data]);
        break;
      case "startCall":
        setCallStatus(CallStatus.Ongoing);
        break;
      case "endCall":
        setCallStatus(CallStatus.Ended);
        sendJsonMessage({
          event: "endCall",
        });
        break;
      case "history":
        const duplicatesRemoved = uniqBy(
          [...data, ...conversationHistory],
          "id",
        );
        setConversationHistory(duplicatesRemoved);
        break;
      case "voiceIntelligenceSid":
        setCallStatus(CallStatus.Ended);
        setViSid(lastJsonMessage.data.transcript_sid);
        console.log("voiceIntelligence transcript ready");
        break;
    }
  }, [lastJsonMessage]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [conversationHistory]); // Trigger scroll on message changes

  return (
    <>
      <Suspense>
        <AIChatLog>
          <ChatLog>
            <AnimatePresence initial={true}>
              {!viVisible && (
                <motion.div
                  style={{
                    height: 750,
                    overflow: "scroll",
                    scrollbarWidth: "none",
                  }}
                  initial={{
                    height: 0,
                    opacity: 0,
                  }}
                  animate={{
                    opacity: +!viVisible,
                    height: +!viVisible * 750,
                    transition: { duration: 1 },
                  }}
                  exit={{ height: 0, opacity: 0 }}
                >
                  {sortBy(conversationHistory, ["dateCreated"]).map(
                    (message: any, index: number) => {
                      switch (message.role) {
                        case "user":
                          if (message?.content?.content) {
                            return (
                              <motion.div
                                style={{ margin: "20px" }}
                                initial={{
                                  x: 100,
                                  opacity: 0,
                                }}
                                animate={{
                                  opacity: 1,
                                  x: 0,
                                  transition: { duration: 0.5 },
                                }}
                                key={index}
                              >
                                <ChatMessage variant="outbound" key={index}>
                                  <ChatBubble>
                                    <AIChatMessageBody>
                                      {message.content.content}
                                    </AIChatMessageBody>
                                  </ChatBubble>
                                </ChatMessage>
                              </motion.div>
                            );
                          }
                          break;
                        case "assistant":
                          return (
                            <motion.div
                              style={{ margin: "20px" }}
                              initial={{
                                x: -100,
                                opacity: 0,
                              }}
                              animate={{
                                opacity: 1,
                                x: 0,
                                transition: { duration: 0.5 },
                              }}
                              key={index}
                            >
                              <AIChatMessage variant="bot" key={index}>
                                <AIChatMessageAuthor
                                  avatarIcon={ProductAIAssistantsIcon}
                                  aria-label="AI said"
                                >
                                  Jeff
                                </AIChatMessageAuthor>
                                <AIChatMessageBody animated>
                                  {message.content.content}
                                </AIChatMessageBody>
                              </AIChatMessage>
                            </motion.div>
                          );
                          break;
                        case "tool":
                          if (message.content.name === "Inform_User") {
                            return (
                              <motion.div
                                style={{ margin: "20px" }}
                                initial={{
                                  x: -100,
                                  opacity: 0,
                                }}
                                animate={{
                                  opacity: 1,
                                  x: 0,
                                  transition: { duration: 0.5 },
                                }}
                                key={index}
                              >
                                <AIChatMessage variant="bot" key={index}>
                                  <AIChatMessageAuthor
                                    avatarIcon={ProductAIAssistantsIcon}
                                    aria-label="AI said"
                                  >
                                    Jeff
                                  </AIChatMessageAuthor>
                                  <AIChatMessageBody animated>
                                    {message.content.output
                                      .replace(`Assistant: I said "`, "")
                                      .replace(`" to the user.`, "")}
                                  </AIChatMessageBody>
                                </AIChatMessage>
                              </motion.div>
                            );
                          } else if (message.content.output !== "{}") {
                            return (
                              <motion.div
                                style={{ marginBottom: "20px" }}
                                initial={{
                                  x: -100,
                                  opacity: 0,
                                }}
                                animate={{
                                  opacity: 1,
                                  x: 0,
                                  transition: { duration: 0.5 },
                                }}
                                key={index}
                              >
                                <ToolMessage
                                  tool={message.content}
                                  key={index}
                                />
                              </motion.div>
                            );
                          }
                          break;
                        default:
                          return null;
                          break;
                      }
                    },
                  )}
                  <Box ref={scrollRef} minHeight="100px"></Box>
                </motion.div>
              )}
            </AnimatePresence>
            {callStatus === CallStatus.Ringing && (
              <Box display="flex" justifyContent="center" alignItems="center">
                <Spinner
                  decorative={false}
                  title="loading"
                  size="sizeIcon100"
                />
              </Box>
            )}
            {(callStatus === CallStatus.Ended || viSid) && (
              <ChatBookend>
                <ChatBookendItem>Today</ChatBookendItem>
                <ChatBookendItem>
                  <strong>Call Ended</strong>
                </ChatBookendItem>
              </ChatBookend>
            )}
            {viSid && (
              <>
                {viSid && (
                  <Button
                    variant="primary"
                    size="small"
                    onClick={() => setVIVisible(!viVisible)}
                  >
                    {viVisible
                      ? "Back to Live Transcript"
                      : "See Voice Intelligence Analysis"}
                  </Button>
                )}
                <AnimatePresence initial={false}>
                  {viVisible && viSid ? (
                    <WrapUpModal transcriptSid={viSid} />
                  ) : null}
                </AnimatePresence>
              </>
            )}
            {(callStatus === CallStatus.Ended || viSid) && (
              <InactivityAlert timeout={10000} />
            )}
          </ChatLog>
        </AIChatLog>
      </Suspense>
    </>
  );
};

export default AIChat;

const InactivityAlert: React.FC<{ timeout: number }> = ({ timeout }) => {
  const router = useRouter();
  const timer = useRef<ReturnType<typeof setTimeout>>(
    setTimeout(() => {}, 10000),
  );
  const [isOpen, setIsOpen] = useState(false);
  const [countDown, setCountdown] = useState(10);
  const handleOpen = () => {
    setIsOpen(true);
  };
  const handleClose = () => {
    setCountdown(20);
    clearTimeout(timer.current);
    setIsOpen(false);
    timer.current = setTimeout(() => {
      handleOpen();
    }, 30000);
  };

  const handleActivity = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      handleOpen();
    }, timeout);
    // resetTimer();
  };

  useEffect(() => {
    timer.current = setTimeout(() => {
      handleOpen();
    }, timeout);
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);

    return () => {
      clearTimeout(timer.current);
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      const countdownTimer = setInterval(() => {
        if (countDown > 0) {
          setCountdown(countDown - 1);
        } else {
          clearInterval(countdownTimer);
          router.push("/");
        }
      }, 1000);

      return () => clearInterval(countdownTimer);
    }
  }, [isOpen, countDown]);

  return (
    <AlertDialog
      heading="Have you finished?"
      isOpen={isOpen}
      onConfirm={() => router.push("/")}
      onConfirmLabel="Next Person Press Here"
      onDismiss={handleClose}
      onDismissLabel="I'm not done"
    >
      <center>
        <motion.p
          style={{ textAlign: "center" }}
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          key={countDown}
        >
          {countDown}
        </motion.p>
      </center>
    </AlertDialog>
  );
};
