import { useState } from "react";
import {
  Button,
  Label,
  Input,
  Form,
  FormControl,
  Spinner,
  Box,
  FormActions,
} from "@twilio-paste/core";
import { useUIDSeed } from "@twilio-paste/uid-library";
import { useRouter } from "next/navigation";

const StartForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const handleClose = () => {
    setLoading(false);
  };
  const seed = useUIDSeed();
  const router = useRouter();

  return (
    <div>
      {loading ? (
        <Box
          style={{
            overflow: "hidden",
            textAlign: "center",
            width: "200px",
            height: "200px",
            margin: "0 auto",
          }}
        >
          <Spinner
            display="lock"
            size="sizeIcon110"
            decorative={false}
            title="Loading"
          />
        </Box>
      ) : (
        <Form aria-labelledby={seed("address-heading")}>
          <FormControl>
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" name="firstName" type="text" required />
          </FormControl>

          <FormControl>
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" name="lastName" type="text" required />
          </FormControl>

          <FormControl>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" />
          </FormControl>

          <FormActions>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            {!loading && (
              <Button
                variant="secondary"
                onClick={() => {
                  (
                    document.getElementById("firstName") as HTMLInputElement
                  ).value = "John";
                  (
                    document.getElementById("lastName") as HTMLInputElement
                  ).value = "Doe";
                  (document.getElementById("email") as HTMLInputElement).value =
                    "john.doe@example.com";
                }}
              >
                Use Dummy Data
              </Button>
            )}
            {!loading && (
              <Button
                variant="primary"
                onClick={async () => {
                  const firstName = (
                    document.getElementById("firstName") as HTMLInputElement
                  ).value;
                  const lastName = (
                    document.getElementById("lastName") as HTMLInputElement
                  ).value;
                  const email = (
                    document.getElementById("email") as HTMLInputElement
                  ).value;

                  const queryParams = new URLSearchParams({
                    firstName,
                    lastName,
                    email,
                  }).toString();

                  try {
                    setLoading(true);
                    router.push(`/scenario?${queryParams}`);
                  } catch (error) {
                    console.error("Error:", error);
                    setLoading(false);
                  }
                }}
              >
                Done
              </Button>
            )}
          </FormActions>
        </Form>
      )}
    </div>
  );
};

export default StartForm;
