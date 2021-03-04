
import './App.css';
import {Switch, Route} from "react-router-dom"
import Home from "./components/home"
import Reviews from "./components/reviews"

function App() {
  return (
    <div className="container">


        <Switch>
          <Route exact path="/"><Home /></Route>
          <Route path="/restuarant/id::slug"><Reviews /></Route>
        </Switch>
     
    </div>
  );
}

export default App;
