import { Skeleton, Stack } from "@chakra-ui/react";
import React from "react";

function UpdateLoading() {
  return (
    <Stack>
      <Skeleton height="50px" borderRadius="50px" />
      <Skeleton height="50px" borderRadius="50px" />
      <Skeleton height="50px" borderRadius="50px" />
    </Stack>
  );
}

export default UpdateLoading;
