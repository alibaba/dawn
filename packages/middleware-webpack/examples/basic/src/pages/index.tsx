import React from "react";
import ReactDOM from "react-dom";
import App from "../App";
import "@alifd/next/dist/next.css";

import { hierarchy } from "d3-hierarchy";
import { parse } from "mathjs";
import { AbortController } from "abort-controller";
import useSwr from "swr";

console.log(hierarchy, parse, AbortController, useSwr);
ReactDOM.render(<App />, document.getElementById("root"));
