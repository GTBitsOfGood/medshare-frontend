import React from "react";
import {ThemeProvider} from "styled-components";

const theme = {
    fg: "palevioletred",
    bg: "white"
}  

function App () {
    const theme = ThemeProvider.div
return <div>
     <ThemeProvider theme={theme}> </ThemeProvider>
    </div>;
}



export default App;
