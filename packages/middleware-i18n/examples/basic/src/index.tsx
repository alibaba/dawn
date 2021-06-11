import React from "react";
import ReactDOM from "react-dom";
import $i18n from "$i18n";

const App: React.FC = () => {
  return (
    <div>
      <h1>Basic Example</h1>
      <p>{$i18n("hello", { name: <span style={{ color: "red" }}>龙归</span> })}</p>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
