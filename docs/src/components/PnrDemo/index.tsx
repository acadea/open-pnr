"use client"
import { ActionIcon, Anchor, Button, Code, Container, CopyButton, Divider, Grid, Group, MantineProvider, Space, Stack, Text, Textarea, Title, Tooltip, rem } from "@mantine/core";
import { useState } from "react";
import { IconCopy, IconCheck, IconBrandGithubFilled } from '@tabler/icons-react';
import { CodeHighlight } from "@mantine/code-highlight";
import {pnrParser} from "open-pnr";


export default function PnrDemo() {

  const [pnr, setPnr] = useState("");

  function parsedPnr() {
    return JSON.stringify(pnrParser(pnr), null, 2) || "";
  }

  return (
  
    <Container>
      <Grid my="md">
        
        <Grid.Col span={{ base: 12, md: 6 }} >
          <Text  size="lg">PNR</Text>

          <Textarea
            value={pnr}
            onChange={(e) => setPnr(e.target.value)}
            autosize
            minRows={15}
            radius="md"
            description=""
            placeholder="Enter your amadeus PNR here"
          />

        </Grid.Col>

        <Grid.Col display="flex" style={{ flexDirection: 'column' }} span={{ base: 12, md: 6 }} >

          <Text  size="lg">Result</Text>
          <CodeHighlight
            style={{ flexGrow: 1, minHeight: '300px' }}
            copyLabel="Copy Result"
            withCopyButton
            language="json"
            code={parsedPnr()}
          />
        </Grid.Col>
      </Grid>

    </Container>
  
  )
}
