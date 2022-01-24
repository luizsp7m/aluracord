import Head from "next/head";

import { Button, Container, Flex, FormControl, FormLabel, Heading, HStack, Image, Input, InputGroup, InputLeftAddon, Text, VStack } from "@chakra-ui/react";

export default function Home() {
  return (
    <Flex
      w="100vw"
      h="100vh"
      bg="red.500"
      justify="center"
      align="center"
      bgImage="url(assets/blob.svg)"
      bgRepeat="no-repeat"
      bgSize="200% 200%"
      bgPos="right"
      p={8}
    >
      <Head>
        <title>Log In</title>
      </Head>

      <Container maxW="container.sm" bg="gray.700" borderRadius={8} p={8}>
        <HStack justify="space-around" flexDir={{
          base: "column", md: "row",
        }}>
          <VStack align="flex-start" spacing={6}>
            <VStack align="flex-start">
              <Heading color="gray.100">Welcome</Heading>
              <Text color="gray.300">Discord - Alura Marvel</Text>
            </VStack>

            <VStack as="form" align="flex-start" spacing={2}>
              <FormControl>
                <FormLabel htmlFor="username" color="gray.400">Username</FormLabel>
                <Input id="username" type="text" w={{
                  base: "full", sm: "288px"
                }} color="gray.100" />
              </FormControl>
              <Button type="submit" w={{
                base: "full", sm: "288px"
              }} colorScheme="green">Log In</Button>
            </VStack>
          </VStack>

          <VStack spacing={4} display={{ base: "none", md: "flex" }}>
            <Image
              borderRadius="full"
              boxSize="150px"
              src="https://bit.ly/dan-abramov"
              alt="Dan Abramov"
            />

            <Text color="gray.100">Dan Abramov</Text>
          </VStack>
        </HStack>
      </Container>
    </Flex>
  );
}