import {
  ReactFlow,
  NodeProps,
  ReactFlowProps,
  Background,
  Handle,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { CustomNodeContainer } from "./index.styled";

function CustomNode({ data, type }: { data: any; type?: string }) {
  return (
    <CustomNodeContainer>
      {type === "default" ? (
        Array.isArray(data?.inputHandles) && data.inputHandles.length > 0 ? (
          data.inputHandles.map((_: any, i: number) => (
            <Handle
              key={i}
              type="target"
              position={Position.Left}
              id={`input-${i}`}
            />
          ))
        ) : (
          <Handle type="target" position={Position.Left} id="input-0" />
        )
      ) : type === "input" ? (
        <Handle type="source" position={Position.Right} />
      ) : type === "output" ? (
        <Handle type="target" position={Position.Left} />
      ) : null}

      <div>
        {type === "input"
          ? data.label
          : type === "default"
          ? Array.isArray(data.condition)
            ? data.condition.map((c: any, i: number) => (
                <div key={i} style={{ padding: "8px 0", position: "relative" }}>
                  {c.text}
                  <Handle
                    type="source"
                    position={Position.Right}
                    id={`condition-${i}`}
                    style={{
                      top: "50%",
                      transform: "translateY(-50%)",
                    }}
                  />
                </div>
              ))
            : "Default Node"
          : type === "output"
          ? data.label || "Output Node"
          : ""}
      </div>
    </CustomNodeContainer>
  );
}

const inputNode = (props: NodeProps) => <CustomNode {...props} type="input" />;
const defaultNode = (props: NodeProps) => (
  <CustomNode {...props} type="default" />
);
const outputNode = (props: NodeProps) => (
  <CustomNode {...props} type="output" />
);

export default function FlowCanvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onDrop,
  onDragOver,
  onNodeClick,
}: ReactFlowProps) {
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onNodeClick={onNodeClick}
      fitView
      style={{ background: "#f6fafd" }}
      nodeTypes={{ input: inputNode, default: defaultNode, output: outputNode }}
    >
      <Background />
    </ReactFlow>
  );
}
