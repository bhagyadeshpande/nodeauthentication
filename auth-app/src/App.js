import React from "react";
import "./App.css";

function App() {
  return (
    <div>
     <form className="myform">
  <label>
    Email :
    <input type="text" name="email" className="ip" />
  </label>
  <br/><br/>
  <label>
    Password :
    <input type="password" name="password" className="ip" />
  </label>
  <br/><br/>
  <input type="submit" value="Submit" />
</form>
    </div>
  );
}

export default App;
