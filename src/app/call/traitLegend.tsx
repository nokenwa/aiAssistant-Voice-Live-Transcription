"use client";
import { Box } from "@twilio-paste/core";
import uniqBy from "lodash/uniqBy";

import { Badge } from "@twilio-paste/core";
import { NewIcon } from "@twilio-paste/icons/cjs/NewIcon";
import { motion } from "motion/react";

interface TraitLegendProps {
  traits: Record<string, string>;
}

const TraitLegend: React.FC<TraitLegendProps> = ({ traits }) => {
  if (!traits) {
    return null;
  }
  const traitsArray = Object.keys(traits)
    .map((key) => {
      return {
        key: key
          .replaceAll("-", " ")
          .replaceAll("_", " ")
          .replaceAll("inferred", "")
          .trim(),
        value: traits[key],
      };
    })
    .filter((trait) => {
      return !trait.key.toLowerCase().includes("name");
    })
    .filter((trait) => {
      return !trait.key.toLowerCase().includes("email");
    })
    .filter((trait) => {
      return typeof trait.key === "string" && typeof trait.value === "string";
    });

  const uniqueTraits = uniqBy(traitsArray, "key");
  return (
    <Box display="flex" flexWrap="wrap" rowGap="space30" columnGap="space30">
      {uniqueTraits
        .filter((trait) => trait.value !== "")
        .slice(0, 10)
        .map((trait: { key: string; value: string; }, index: number) => (
          <motion.div
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: index * 0.1 }}
            key={index}
          >
            <Badge as="span" variant="new" key={index}>
              <NewIcon decorative />
              {toTitleCase(trait.key)} {" - "}
              {toTitleCase(trait.value)}
            </Badge>
          </motion.div>
        ))}
    </Box>
  );
};

export default TraitLegend;

function toTitleCase(str: string) {
  return str.replace(
    /\w\S*/g,
    (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase(),
  );
}
