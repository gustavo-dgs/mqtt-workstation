import React, { useRef, useState } from "react";
import { TextField } from "@mui/material";

const ResizableInput = ({ value, onChange, ...props }) => {
  const textSpan = useRef(null);
  const labelSpan = useRef(null);
  const [text, setText] = useState(value);

  const onTextChange = (e) => {
    setText(e.target.value);
    onChange(e);
  };

  const getSpanWidth = () => {
    const spanWidth = textSpan.current?.offsetWidth + 30 || 0;
    const labelStringWidth = labelSpan.current?.offsetWidth + 30 || 0;

    return spanWidth > labelStringWidth ? spanWidth : labelStringWidth;
  };

  const setSpacesIntoA = (text) => {
    //replace spaces and dashes into a
    return text.replace(/ /g, "a").replace(/-/g, "a");
  };

  return (
    <>
      <TextField
        id="outlined-basic"
        placeholder="Label"
        variant="outlined"
        value={text}
        inputProps={{ min: 0, style: { textAlign: "center" } }} // the change is here
        onChange={onTextChange}
        style={{ width: getSpanWidth(), textAlign: "right" }}
        {...props}
      />
      <div style={{ opacity: 0 }}>
        <span
          ref={textSpan}
          style={{
            position: "absolute",
            border: "1px solid red",
            maxWidth: 500,
          }}
        >
          {setSpacesIntoA(text)}
        </span>
        <span ref={labelSpan} style={{ position: "absolute", top: 20 }}>
          Label
        </span>
      </div>
    </>
  );
};

export default ResizableInput;
