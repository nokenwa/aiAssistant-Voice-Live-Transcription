"use client";

import {
  AIChatMessage,
  AIChatMessageAuthor,
  AIChatMessageBody,
  Box,
  ChatBubble,
  ChatMessage,
  Flex,
  MediaBody,
  MediaFigure,
  MediaObject,
} from "@twilio-paste/core";
import { CartIcon } from "@twilio-paste/icons/cjs/CartIcon";
import { CarouselIcon } from "@twilio-paste/icons/cjs/CarouselIcon";
import { CalendarIcon } from "@twilio-paste/icons/cjs/CalendarIcon";
import { CodeIcon } from "@twilio-paste/icons/cjs/CodeIcon";

import { Text } from "@twilio-paste/core";
import { ProductSegmentIcon } from "@twilio-paste/icons/cjs/ProductSegmentIcon";
import TraitLegend from "./traitLegend";

interface ToolMessageProps {
  tool: {
    name: string;
    output: string;
    description: string;
    input: string;
  };
}

const ToolMessage: React.FC<ToolMessageProps> = ({ tool }) => {
  const { name, output } = tool;
  let content: {
    [x: string]: string | any[];
    shoeName?: any;
    price?: any;
    colorOptions?: any;
    inStock?: any;
    orderNumber?: any;
    address?: any;
    shoeSize?: any;
    order?: any;
    date?: any;
    slots?: any;
    title?: any;
    location?: any;
    time?: any;
  };
  let toolDisplay = <></>;
  switch (name) {
    case "Inferred Traits":
      if (output) {
        toolDisplay = (
          <ChatMessage variant="inbound">
            <ChatBubble>
              <AIChatMessage variant="user">
                <AIChatMessageAuthor
                  avatarIcon={ProductSegmentIcon}
                  avatarName="Jeff"
                  aria-label="AI said"
                >
                  {name}
                </AIChatMessageAuthor>
                <AIChatMessageBody>
                  <Flex wrap>
                    <TraitLegend traits={JSON.parse(output)} />
                  </Flex>
                </AIChatMessageBody>
              </AIChatMessage>
            </ChatBubble>
          </ChatMessage>
        );
      } else {
        return <></>;
      }

      break;
    case "AI Personalization Engine":
      return <></>;
      break;
    
    //Custom Tool Components Go Here
    case "Shoes_Inventory":
      try {
        content = JSON.parse(output);
      } catch {
        return <></>;
      }
      toolDisplay = (
        <ChatMessage variant="inbound">
          <ChatBubble>
            <AIChatMessage variant="user">
              <AIChatMessageAuthor
                avatarIcon={CodeIcon}
                avatarName="Jeff"
                aria-label="AI said"
              >
                {name.replaceAll("_", " ")}
              </AIChatMessageAuthor>
              <AIChatMessageBody>
                <Flex wrap>
                  <MediaObject verticalAlign="center">
                    <MediaFigure spacing="space40">
                      <CarouselIcon
                        decorative={false}
                        title="Description of icon"
                      />
                    </MediaFigure>
                    <MediaBody>
                      <Text
                        as="h3"
                        fontSize="fontSize60"
                        lineHeight="lineHeight60"
                      >
                        <Text
                          href="/"
                          as="a"
                          color="inherit"
                          fontSize="inherit"
                          lineHeight="inherit"
                          textDecoration="none"
                        >
                          {content.shoeName}
                        </Text>
                      </Text>
                      <Text
                        as="h3"
                        fontSize="fontSize20"
                        lineHeight="lineHeight20"
                        color="colorTextWeak"
                      >
                        Price: € {content.price}
                      </Text>
                      {content.colorOptions && (
                        <Text
                          as="h3"
                          fontSize="fontSize20"
                          lineHeight="lineHeight20"
                          color="colorTextWeak"
                        >
                          Colors Available: {content.colorOptions.join(", ")}
                        </Text>
                      )}
                      <Text
                        as="h3"
                        fontSize="fontSize20"
                        lineHeight="lineHeight20"
                        color="colorTextWeak"
                      >
                        {content.inStock ? "In Stock" : "Not In Stock"}
                      </Text>
                    </MediaBody>
                  </MediaObject>
                </Flex>
              </AIChatMessageBody>
            </AIChatMessage>
          </ChatBubble>
        </ChatMessage>
      );

      break;
    case "Purchasing_Shoes":
      try {
        content = JSON.parse(output);
      } catch {
        return <></>;
      }
      toolDisplay = (
        <ChatMessage variant="inbound">
          <ChatBubble>
            <AIChatMessage variant="user">
              <AIChatMessageAuthor
                avatarIcon={ProductSegmentIcon}
                avatarName="Jeff"
                aria-label="AI said"
              >
                {name.replaceAll("_", " ")}
              </AIChatMessageAuthor>
              <AIChatMessageBody>
                <Flex wrap>
                  <MediaObject verticalAlign="center">
                    <MediaFigure spacing="space40">
                      <CartIcon
                        decorative={false}
                        title="Description of icon"
                      />
                    </MediaFigure>
                    <MediaBody>
                      <Text
                        as="h3"
                        fontSize="fontSize60"
                        lineHeight="lineHeight60"
                      >
                        <Text
                          href="/"
                          as="a"
                          color="inherit"
                          fontSize="inherit"
                          lineHeight="inherit"
                          textDecoration="none"
                        >
                          {content.shoeName} Ordered
                        </Text>
                      </Text>
                      <Text
                        as="h3"
                        fontSize="fontSize20"
                        lineHeight="lineHeight20"
                        color="colorTextWeak"
                      >
                        Order Number: {content.orderNumber}
                      </Text>
                      <Text
                        as="h3"
                        fontSize="fontSize20"
                        lineHeight="lineHeight20"
                        color="colorTextWeak"
                      >
                        Delivery Address: {content.address}
                      </Text>
                      <Text
                        as="h3"
                        fontSize="fontSize20"
                        lineHeight="lineHeight20"
                        color="colorTextWeak"
                      >
                        Shoe Size: {content.shoeSize}
                      </Text>
                    </MediaBody>
                  </MediaObject>
                </Flex>
              </AIChatMessageBody>
            </AIChatMessage>
          </ChatBubble>
        </ChatMessage>
      );
      break;
    case "Updating_Shoes_Order":
      try {
        content = JSON.parse(output);
      } catch (error) {
        return <></>;
      }
      toolDisplay = (
        <ChatMessage variant="inbound">
          <ChatBubble>
            <AIChatMessage variant="user">
              <AIChatMessageAuthor
                avatarIcon={ProductSegmentIcon}
                avatarName="Jeff"
                aria-label="AI said"
              >
                {name.replaceAll("_", " ")}
              </AIChatMessageAuthor>
              <AIChatMessageBody>
                <Flex wrap>
                  <MediaObject verticalAlign="center">
                    <MediaFigure spacing="space40">
                      <CartIcon
                        decorative={false}
                        title="Description of icon"
                      />
                    </MediaFigure>
                    <MediaBody>
                      <Text
                        as="h3"
                        fontSize="fontSize60"
                        lineHeight="lineHeight60"
                      >
                        <Text
                          href="/"
                          as="a"
                          color="inherit"
                          fontSize="inherit"
                          lineHeight="inherit"
                          textDecoration="none"
                        >
                          Order Updated
                        </Text>
                      </Text>

                      <TraitLegend traits={content.order} />
                    </MediaBody>
                  </MediaObject>
                </Flex>
              </AIChatMessageBody>
            </AIChatMessage>
          </ChatBubble>
        </ChatMessage>
      );
      break;
    case "Check_Appointment_Times":
      try {
        content = JSON.parse(output);
      } catch {
        return <></>;
      }
      toolDisplay = (
        <ChatMessage variant="inbound">
          <ChatBubble>
            <AIChatMessage variant="user">
              <AIChatMessageAuthor
                avatarIcon={ProductSegmentIcon}
                avatarName="Jeff"
                aria-label="AI said"
              >
                Checking Available Times
              </AIChatMessageAuthor>
              <AIChatMessageBody>
                <Flex wrap>
                  <MediaObject verticalAlign="center">
                    <MediaFigure spacing="space40">
                      <CalendarIcon
                        decorative={false}
                        title="Description of icon"
                      />
                    </MediaFigure>
                    <MediaBody>
                      <Text
                        as="h2"
                        fontSize="fontSize20"
                        lineHeight="lineHeight60"
                      >
                        <Text
                          href="/"
                          as="a"
                          color="inherit"
                          fontSize="inherit"
                          lineHeight="inherit"
                          textDecoration="none"
                        >
                          Available Times - {content.date}
                        </Text>
                      </Text>
                      {content.slots.map((slot: string) => {
                        return (
                          <Text
                            as="h3"
                            fontSize="fontSize20"
                            lineHeight="lineHeight20"
                            color="colorTextWeak"
                            key={slot}
                          >
                            {slot}
                          </Text>
                        );
                      })}
                    </MediaBody>
                  </MediaObject>
                </Flex>
              </AIChatMessageBody>
            </AIChatMessage>
          </ChatBubble>
        </ChatMessage>
      );
      break;
    case "Booking_Appointment":
    //   try {
    //     content = JSON.parse(output);
    //   } catch {
    //     return <></>;
    //   }
    //   toolDisplay = (
    //     <ChatMessage variant="inbound">
    //       <ChatBubble>
    //         <AIChatMessage variant="user">
    //           <AIChatMessageAuthor
    //             avatarIcon={ProductSegmentIcon}
    //             avatarName="Jeff"
    //             aria-label="AI said"
    //           >
    //             Booked Appointment
    //           </AIChatMessageAuthor>
    //           <AIChatMessageBody>
    //             <Flex wrap>
    //               <MediaObject verticalAlign="center">
    //                 <MediaFigure spacing="space40">
    //                   <CalendarIcon
    //                     decorative={false}
    //                     title="Description of icon"
    //                   />
    //                 </MediaFigure>
    //                 <MediaBody>
    //                   <Text
    //                     as="h3"
    //                     fontSize="fontSize60"
    //                     lineHeight="lineHeight60"
    //                   >
    //                     <Text
    //                       href="/"
    //                       as="a"
    //                       color="inherit"
    //                       fontSize="inherit"
    //                       lineHeight="inherit"
    //                       textDecoration="none"
    //                     >
    //                       {content.title}
    //                     </Text>
    //                   </Text>
    //                   <Text
    //                     as="h3"
    //                     fontSize="fontSize20"
    //                     lineHeight="lineHeight20"
    //                     color="colorTextWeak"
    //                   >
    //                     Location: {content.location}
    //                   </Text>
    //                   <Text
    //                     as="h3"
    //                     fontSize="fontSize20"
    //                     lineHeight="lineHeight20"
    //                     color="colorTextWeak"
    //                   >
    //                     Date: {content.date.substring(0, 10)}
    //                   </Text>
    //                   <Text
    //                     as="h3"
    //                     fontSize="fontSize20"
    //                     lineHeight="lineHeight20"
    //                     color="colorTextWeak"
    //                   >
    //                     Time: {content.time}
    //                   </Text>
    //                 </MediaBody>
    //               </MediaObject>
    //             </Flex>
    //           </AIChatMessageBody>
    //         </AIChatMessage>
    //       </ChatBubble>
    //     </ChatMessage>
    //   );
    //   break;
    default:
      let internal = <></>;
      try {
        content = JSON.parse(output);
        internal = (
          <>
            {Object.keys(content).map((key) => {
              if (Array.isArray(content[key])) {
                let contentArray = content[key] as Array<any>;
                return (
                  <>
                    {contentArray.map((item, index) => {
                      return (
                        <Box
                          borderStyle="solid"
                          borderWidth="borderWidth10"
                          borderColor="colorBorderWeakest"
                          backgroundColor="colorBackgroundBodyElevation"
                          margin="space40"
                          padding="space40"
                        >
                          <MediaObject verticalAlign="center" key={index}>
                            <MediaFigure spacing="space40">
                              <CarouselIcon
                                decorative={false}
                                title="Description of icon"
                              />
                            </MediaFigure>
                            <MediaBody>
                              {item?.name && (
                                <Text
                                  as="h3"
                                  fontSize="fontSize60"
                                  lineHeight="lineHeight60"
                                >
                                  {item.name}
                                </Text>
                              )}
                              {item?.description && (
                                <Text
                                  as="h3"
                                  fontSize="fontSize20"
                                  lineHeight="lineHeight20"
                                  color="colorTextWeak"
                                >
                                  {item.description}
                                </Text>
                              )}
                            </MediaBody>
                          </MediaObject>
                        </Box>
                      );
                    })}
                  </>
                );
              } else if (!Array.isArray(content[key])) {
                return (
                  <>
                    {Object.keys(content[key]).map((key) => {
                      return (
                        <Text
                          as="h3"
                          fontSize="fontSize20"
                          lineHeight="lineHeight20"
                          color="colorTextWeak"
                          key={key}
                        >
                          {key}: {content[key]}
                        </Text>
                      );
                    })}
                  </>
                );
              }
            })}
          </>
        );

        toolDisplay = (
          <ChatMessage variant="inbound">
            <ChatBubble>
              <AIChatMessage variant="user">
                <AIChatMessageAuthor
                  avatarIcon={CodeIcon}
                  avatarName="Jeff"
                  aria-label="AI said"
                >
                  {name.replaceAll("_", " ")}
                </AIChatMessageAuthor>
                <AIChatMessageBody>
                  <Flex wrap>
                    <MediaObject verticalAlign="center">
                      <MediaFigure spacing="space40">
                        <CarouselIcon
                          decorative={false}
                          title="Description of icon"
                        />
                      </MediaFigure>
                      <MediaBody>{internal}</MediaBody>
                    </MediaObject>
                  </Flex>
                </AIChatMessageBody>
              </AIChatMessage>
            </ChatBubble>
          </ChatMessage>
        );
      } catch {
        console.log("Error Rendering tool");
        console.log(name, output);
        return <></>;
      }
      break;
  }
  return (
    <ChatMessage variant="inbound">
      <ChatBubble>{toolDisplay}</ChatBubble>
    </ChatMessage>
  );
};

export default ToolMessage;
