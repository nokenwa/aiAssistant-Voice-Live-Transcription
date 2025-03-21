"use  client";
import {
  AIChatMessage,
  AIChatMessageAuthor,
  AIChatMessageBody,
} from "@twilio-paste/ai-chat-log";

const aiChatFactory = (message: any) => {
  const time = new Date(0).toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    timeZone: "UTC",
    hour12: true,
  });

  return {
    content: (
      <AIChatMessage variant={message?.variant}>
        <AIChatMessageAuthor
          aria-label={message?.metaLabel + time}
          avatarName={message?.variant === "bot" ? undefined : "Gibby Radki"}
        >
          {message.type}
        </AIChatMessageAuthor>
        <AIChatMessageBody>{message.text}</AIChatMessageBody>
      </AIChatMessage>
    ),
  };
};

export default aiChatFactory;
