import React, { useEffect } from "react";
import { Button } from "@alifd/next";
import axios from "axios";

const Component: React.FC = () => {
  useEffect(() => {
    axios.get("https://alibaba.github.io/dawn/middleware.yml");
  }, []);

  return <Button>Test</Button>;
};

export default Component;
