import "./App.css"
import { HashRouter as Router, Route, Routes} from "react-router-dom";
import Header from './Components/Header';
import Homepage from './Pages/Homepage';
import Coinpage from "./Pages/Coinpage";
import { makeStyles } from "@material-ui/core/styles";
import Alert from './Components/Alert';


//MUI Styling
const useStyles = makeStyles(() => ({
  App: {
    backgroundColor: "white",
    color: "blue",
    minHeight: "200px",
  },
}));

function App() {
  const classes = useStyles();

  return (
    <Router>
      <div className={classes.App}> 
        <Header />
        <Routes>
          <Route path='/' element={<Homepage />} />
            <Route path='/coins/:id' element={<Coinpage />} />
        </Routes>
      </div>
      <Alert />
    </Router>
  );
}

export default App;
