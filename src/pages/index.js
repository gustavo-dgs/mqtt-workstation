function Flow() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "yellow",
        display: "flex",
        flexDirection: "row",
      }}
    >
      <div
        style={{
          flexFlow: 1,
          minWidth: 50,
          height: 50,
          backgroundColor: "blue",
        }}
      ></div>
      <div
        style={{
          flexFlow: 1,
          minWidth: 50,
          height: 50,
          backgroundColor: "red",
        }}
      ></div>
    </div>
  );
}

export default Flow;

/* <ReactFlow
          style={{ width: "100%", height: "100%" }}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow> */
