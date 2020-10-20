import React from "react";
import ReactDOM from "react-dom";
import { Button } from "@alifd/next";
import "./index.less";
import '@alifd/next/dist/next.css';

const App = () => {
    const x: string = "1234";
    console.log(x);
    return (
        <div className="test">hahahah
            <Button type="primary">123</Button>
        </div>
    )
}


ReactDOM.render(<App />, document.getElementById("root"));
