import Rax, { Component } from 'rax';
import logo from '../assets/logo.png';
import './app.css';

class App extends Component {
  render() {
    return (
      <div className="app">
        <div className="app-header">
          <h2 className="app-welcome">Welcome to Dawn</h2>
        </div>
        <div className="app-intro">
          <img src={logo} className="app-logo" alt="logo" />
          <div>
            To get started, edit <code>src/components/App.js</code> and save to reload.
          </div>
        </div>
        <ul className="app-links">
          <li><a href="https://alibaba.github.io/dawn/">Homepage</a></li>
          <li><a href="https://alibaba.github.io/dawn/docs">Documents</a></li>
          <li><a href="https://github.com/alibaba/dawn">Git Repo</a></li>
          <li><a href="https://github.com/alibaba/dawn/issues">Issues</a></li>
        </ul>
      </div>
    );
  }
}

export default App;
