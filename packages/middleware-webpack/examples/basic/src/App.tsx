import React, { useState } from "react";
import { Button, Input } from "@alifd/next";
import img from "./assets/dawn.png";
import svg from "./assets/whats-app.svg";
import text from "./text.txt";
import jsonData from "./data.json";
import yamlData from "./data.yml";
import tsfile from "./tsfile";
import JSComponent from "./JSComponent";
import JSXComponent from "./JSXComponent";
import $config from "$config";
import $i18n from "$i18n";

import styles from "./app.module.scss";
import "./app.scss";
import "./app.less";
import "./app.css";

const AsyncComponent = React.lazy(() => import(/* webpackChunkName: "async-component" */ "./AsyncComponent"));

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);

    await new Promise<void>(resolve => {
      setTimeout(() => {
        resolve();
      }, 3000);
    });

    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <h1>Hello World!</h1>
      <Button loading={loading} onClick={handleClick}>
        Click Me!
      </Button>
      <img src={img} className={styles.img} />
      <img src={svg} className="svg" />
      <div className="text">Plain text: {text}</div>
      <div className="text">JSON data: {JSON.stringify(jsonData)}</div>
      <div className="text">YAML data: {JSON.stringify(yamlData)}</div>
      <div className="text">TS file: {tsfile}</div>
      <Input />
      <JSComponent />
      <JSXComponent />
      <React.Suspense fallback="Loading">
        <AsyncComponent />
      </React.Suspense>
      <div>config: {JSON.stringify($config)}</div>
      <div>i18n: {$i18n("hello", { name: "龙归" })}</div>
    </div>
  );
};

export default App;
