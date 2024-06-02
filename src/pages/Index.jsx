import { useState } from "react";
import { Container, VStack, HStack, Input, Button, Text, Checkbox, IconButton } from "@chakra-ui/react";
import { FaTrash } from "react-icons/fa";
import { usePumps, useAddPump } from "../integrations/supabase/index.js";

const Index = () => {
  const [newPump, setNewPump] = useState({ name: "", latitude: 0, longitude: 0, bilventil: "", cykelventil: "", racer_ventil: "", address: "", status: "", model: "", comment: "" });
  const { data: pumps, isLoading, error } = usePumps();
  const addPumpMutation = useAddPump();

  const addPump = () => {
    if (newPump.name.trim() !== "") {
      addPumpMutation.mutate(newPump);
      setNewPump({ name: "", latitude: 0, longitude: 0, bilventil: "", cykelventil: "", racer_ventil: "", address: "", status: "", model: "", comment: "" });
    }
  };

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <Container centerContent maxW="container.md" py={10}>
      <VStack spacing={4} w="100%">
        <HStack w="100%">
          <Input
            placeholder="Pump Name"
            value={newPump.name}
            onChange={(e) => setNewPump({ ...newPump, name: e.target.value })}
          />
          <Button onClick={addPump} colorScheme="teal">
            Add Pump
          </Button>
        </HStack>
        <VStack w="100%" spacing={3}>
          {pumps.map((pump, index) => (
            <HStack key={index} w="100%" justifyContent="space-between">
              <Checkbox>
                <Text>{pump.name}</Text>
              </Checkbox>
              <IconButton
                aria-label="Delete pump"
                icon={<FaTrash />}
                colorScheme="red"
                // Add delete functionality here
              />
            </HStack>
          ))}
        </VStack>
      </VStack>
    </Container>
  );
};

export default Index;