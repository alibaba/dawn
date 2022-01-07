import React, { useEffect } from "react";
import { Button } from "@alifd/next";
import axios from "axios";
import string from "./string.txt";
import styles from "./style.module.css";
import dawnUrl from "./dawn.png";
import whatsAppUrl, { ReactComponent as WhatsApp } from "./whats-app.svg";

import "./style.css";
import "./less-style.less";
import "./sass-style.scss";

const Component: React.FC<{ foo?: string; bar?: number }> = () => {
  useEffect(() => {
    (async () => {
      const ret = await axios.get("https://alibaba.github.io/dawn/middleware.yml");
      console.log(ret);
    })();
  }, []);

  return (
    <div className="container">
      <div className="main">
        <span>Fusion: </span>
        <Button>Test</Button>
      </div>
      <div className={styles.main}>
        <span>string: </span>
        <span>{string}</span>
      </div>
      <div>
        <img src={dawnUrl} />
      </div>
      <div>
        <img src={whatsAppUrl} />
        <WhatsApp />
      </div>
    </div>
  );
};

export default Component;
