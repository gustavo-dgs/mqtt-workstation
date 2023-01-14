import { useEffect, useRef } from "react";

function Home() {
  const effectRef = useRef(false);
  useEffect(() => {
    
  },[]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        // backgroundColor: "yellow",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        // padding: 20,
      }}
    >
      <p>WELCOME TO THE APP</p>
    </div>
  );
}

export default Home;
