import { useState } from "react";
import { Container, VStack, HStack, Input, Button, Text, Checkbox, IconButton, Box, Flex } from "@chakra-ui/react";
import { FaTrash } from "react-icons/fa";
import { usePumps, useAddPumps } from "../integrations/supabase/index.js";

const Footer = () => (
  <Box as="footer" py={4} bg="gray.700" color="white" mt={10}>
    <Flex justify="center">
      <Text>&copy; {new Date().getFullYear()} Todo App. All rights reserved.</Text>
    </Flex>
  </Box>
);

const Index = () => {
  const [newPump, setNewPump] = useState({ name: "", latitude: "", longitude: "", bilventil: "", cykelventil: "", racer_ventil: "", address: "", status: "", model: "", comment: "" });
  const { data: pumps, isLoading, error } = usePumps();
  const addPumpMutation = useAddPumps();

  const addPump = async () => {
    if (newPump.name.trim() !== "") {
      try {
        await addPumpMutation.mutateAsync(newPump);
        setNewPump({ name: "", latitude: "", longitude: "", bilventil: "", cykelventil: "", racer_ventil: "", address: "", status: "", model: "", comment: "" });
      } catch (error) {
        console.error("Error adding pump:", error);
        alert("Failed to add pump: " + error.message);
      }
    }
  };

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <Container centerContent maxW="container.md" py={10}>
      <VStack spacing={4} w="100%">
        <HStack w="100%">
          <Input
            placeholder="Name"
            value={newPump.name}
            onChange={(e) => setNewPump({ ...newPump, name: e.target.value })}
          />
          <Input
            placeholder="Latitude"
            value={newPump.latitude}
            onChange={(e) => setNewPump({ ...newPump, latitude: e.target.value })}
          />
          <Input
            placeholder="Longitude"
            value={newPump.longitude}
            onChange={(e) => setNewPump({ ...newPump, longitude: e.target.value })}
          />
          <Button onClick={addPump} colorScheme="teal">
            Add Pump
          </Button>
        </HStack>
        <VStack w="100%" spacing={3}>
          {pumps.map((pump, index) => (
            <HStack key={index} w="100%" justifyContent="space-between">
              <Text>{pump.name}</Text>
              <Text>{pump.latitude}</Text>
              <Text>{pump.longitude}</Text>
            </HStack>
          ))}
        </VStack>
      </VStack>
    <Footer />
    </Container>
  );
};

export default Index;