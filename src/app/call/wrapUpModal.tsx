"use  client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Box } from "@twilio-paste/core";
import { motion } from "motion/react";

interface WrapUpModalProps {
  transcriptSid: string;
}

const WrapUpModal: React.FC<WrapUpModalProps> = ({ transcriptSid }) => {
  const [token, setToken] = useState<string | null>(null);
  const [iframeLoaded, setIframeLoaded] = useState(0);
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await axios.post("/api/getVIToken", { transcriptSid });
        setToken(response.data.accessToken);
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };

    fetchToken();
  }, []);

  return (
    <>
      {token && (
        <Box minHeight="100px">
          <motion.div
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              opacity: iframeLoaded,
              height: 750,
              transition: { duration: 1 },
            }}
            exit={{ height: 0, opacity: 0 }}
          >
            <iframe
              src={`https://assets.twilio.com/public_assets/annotator/latest/index.html?token=${token}`}
              style={{ width: "100%", minHeight: "750px", maxHeight: "1000px" }}
              onLoad={() => setIframeLoaded(100)}
            />
          </motion.div>
        </Box>
      )}
    </>
  );
};

export default WrapUpModal;
