"use client";
import { useCallback, useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import {
  ReactFlow,
  NodeProps,
  ReactFlowProvider,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  useReactFlow,
  ReactFlowProps,
  Background,
  type Node,
  type Edge,
  type OnConnect,
  type OnNodesChange,
  type OnEdgesChange,
  Handle,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import {
  ConditionComponentContainer,
  CustomNodeContainer,
  FlowAreaContainer,
  LabelTextFieldContainer,
  LeftBar,
  MainContainer,
  NodeContainer,
  NodeDataContainer,
  NodeTitleText,
  NodeTopBar,
  RightBar,
  StyledAddButton,
  StyledInputField,
  StyledSelectField,
  TitleText,
  CloseButton,
  ActionContainer,
} from "./index.styled";

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

function FlowCanvas({
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

function FlowWrapper() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [idCounter, setIdCounter] = useState(1);
  const [label, setLabel] = useState("");
  const [condition, setCondition] = useState<
    { text: string; target: string }[]
  >([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const { screenToFlowPosition } = useReactFlow();

  useEffect(() => {
    setNodes((prev) =>
      prev.map((node) => {
        if (node.type !== "default") return node;

        const incoming = edges.filter((e) => e.target === node.id);
        const newHandles = incoming.map((_, i) => `input-${i}`);

        const existingHandles = Array.isArray(node.data?.inputHandles)
          ? node.data?.inputHandles
          : [];
        const isSame =
          existingHandles.length === newHandles.length &&
          existingHandles.every((h: any, i: number) => h === newHandles[i]);

        if (isSame) return node;

        return {
          ...node,
          data: {
            ...node.data,
            inputHandles: newHandles,
          },
        };
      })
    );
  }, [edges]);

  useEffect(() => {
    setEdges((prevEdges) => {
      const conditionEdges: Edge[] = [];

      nodes.forEach((node) => {
        if (node.type === "default" && Array.isArray(node.data?.condition)) {
          node.data.condition.forEach((c: any, index: number) => {
            if (c.target) {
              conditionEdges.push({
                id: `e${node.id}-${c.target}-cond-${index}`,
                source: node.id,
                target: c.target,
                sourceHandle: `condition-${index}`,
              });
            }
          });
        }
      });

      const nonConditionEdges = prevEdges.filter(
        (e) => !e.sourceHandle?.startsWith("condition-")
      );

      const next = [...nonConditionEdges, ...conditionEdges];

      const isSame =
        next.length === prevEdges.length &&
        next.every((e, i) => e.id === prevEdges[i].id);

      return isSame ? prevEdges : next;
    });
  }, [nodes]);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    []
  );

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData("application/reactflow");
      if (!type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: `${idCounter}`,
        type:
          type === "Widget Node"
            ? "input"
            : type === "Conditional Node"
            ? "default"
            : "output",
        position,
        data: {
          label: type,
          ...(type === "Conditional Node" && {
            condition: [],
            inputHandles: [],
          }),
        },
      };

      setNodes((nds) => nds.concat(newNode));
      setIdCounter((id) => id + 1);
    },
    [idCounter, screenToFlowPosition]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const handleDragStart = (event: React.DragEvent, nodeType: string) => {
    event.stopPropagation();
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const onNodeClick = useCallback((_: any, node: Node) => {
    setSelectedNodeId(node.id);

    if (node.type === "input" || node.type === "output") {
      setLabel((node.data?.label as string) || "");
      setCondition([]);
    }

    if (node.type === "default") {
      const cond = node.data?.condition;
      setCondition(Array.isArray(cond) ? cond : []);
      setLabel("");
    }
  }, []);

  return (
    <MainContainer>
      <LeftBar>
        <NodeTopBar>
          <TitleText>Node Flow Area</TitleText>
        </NodeTopBar>

        <FlowAreaContainer>
          <FlowCanvas
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={onNodeClick}
          />
        </FlowAreaContainer>
      </LeftBar>

      <RightBar>
        <NodeContainer>
          <NodeTopBar>
            <TitleText>Node Setting</TitleText>
          </NodeTopBar>

          <NodeDataContainer
            draggable
            onDragStart={(e) => handleDragStart(e, "Widget Node")}
          >
            <NodeTitleText>Widget Node</NodeTitleText>
          </NodeDataContainer>

          <NodeDataContainer
            draggable
            onDragStart={(e) => handleDragStart(e, "Conditional Node")}
          >
            <NodeTitleText>Conditional Node</NodeTitleText>
          </NodeDataContainer>

          <NodeDataContainer
            draggable
            onDragStart={(e) => handleDragStart(e, "Output Node")}
          >
            <NodeTitleText>Output Node</NodeTitleText>
          </NodeDataContainer>

          {nodes.find((n) => n.id === selectedNodeId)?.type === "input" && (
            <>
              <LabelTextFieldContainer>
                <NodeTitleText>Widget Name:</NodeTitleText>
                <StyledInputField
                  type="text"
                  id="widgetName"
                  placeholder="Enter widget label"
                  value={label}
                  onChange={(e) => {
                    const newLabel = e.target.value;
                    setLabel(newLabel);
                    setNodes((nds) =>
                      nds.map((node) =>
                        node.id === selectedNodeId
                          ? {
                              ...node,
                              data: {
                                ...node.data,
                                label: newLabel,
                              },
                            }
                          : node
                      )
                    );
                  }}
                />
              </LabelTextFieldContainer>

              <LabelTextFieldContainer>
                <NodeTitleText>Connect to:</NodeTitleText>
                <StyledSelectField
                  id="connectTo"
                  onChange={(e) => {
                    const targetNodeId = e.target.value;

                    setEdges((eds) =>
                      eds.filter((e) => e.source !== selectedNodeId)
                    );

                    if (targetNodeId) {
                      setEdges((eds) => [
                        ...eds,
                        {
                          id: `e${selectedNodeId}-${targetNodeId}`,
                          source: selectedNodeId!,
                          target: targetNodeId,
                        },
                      ]);
                    }
                  }}
                  value={
                    edges.find((e) => e.source === selectedNodeId)?.target || ""
                  }
                >
                  <option value="">Select a default node</option>
                  {nodes
                    .filter((n) => n.type === "default")
                    .map((n) => (
                      <option key={n.id} value={n.id}>
                        Default {n.id}
                      </option>
                    ))}
                </StyledSelectField>
              </LabelTextFieldContainer>
            </>
          )}

          {nodes.find((n) => n.id === selectedNodeId)?.type === "output" && (
            <LabelTextFieldContainer>
              <NodeTitleText>Output Node Name:</NodeTitleText>
              <StyledInputField
                type="text"
                id="OutputNodeName"
                placeholder="Enter Node data"
                value={label}
                onChange={(e) => {
                  const newLabel = e.target.value;
                  setLabel(newLabel);
                  setNodes((nds) =>
                    nds.map((node) =>
                      node.id === selectedNodeId
                        ? {
                            ...node,
                            data: {
                              ...node.data,
                              label: newLabel,
                            },
                          }
                        : node
                    )
                  );
                }}
              />
            </LabelTextFieldContainer>
          )}

          {nodes.find((n) => n.id === selectedNodeId)?.type === "default" && (
            <LabelTextFieldContainer>
              <NodeTitleText>Conditions:</NodeTitleText>
              {condition.map((cond, index) => (
                <ConditionComponentContainer key={index}>
                  <StyledInputField
                    type="text"
                    value={cond.text}
                    placeholder="Condition text"
                    onChange={(e) => {
                      const updated = [...condition];
                      updated[index].text = e.target.value;
                      setCondition(updated);
                      setNodes((nds) =>
                        nds.map((node) =>
                          node.id === selectedNodeId
                            ? {
                                ...node,
                                data: { ...node.data, condition: updated },
                              }
                            : node
                        )
                      );
                    }}
                  />
                  <ActionContainer>
                    <StyledSelectField
                      value={cond.target}
                      onChange={(e) => {
                        const updated = [...condition];
                        updated[index].target = e.target.value;
                        setCondition(updated);
                        setNodes((nds) =>
                          nds.map((node) =>
                            node.id === selectedNodeId
                              ? {
                                  ...node,
                                  data: { ...node.data, condition: updated },
                                }
                              : node
                          )
                        );
                      }}
                    >
                      <option value="">Select target node</option>
                      {nodes
                        .filter((n) => n.type === "output")
                        .map((n) => (
                          <option key={n.id} value={n.id}>
                            {Array.isArray(n.data?.label)
                              ? n.data?.label
                              : `Output ${n.id}`}
                          </option>
                        ))}
                    </StyledSelectField>
                    <CloseButton
                      onClick={() => {
                        const updated = condition.filter((_, i) => i !== index);
                        setCondition(updated);
                        setNodes((nds) =>
                          nds.map((node) =>
                            node.id === selectedNodeId
                              ? {
                                  ...node,
                                  data: { ...node.data, condition: updated },
                                }
                              : node
                          )
                        );
                      }}
                    >
                      <MdClose size={20} />
                    </CloseButton>
                  </ActionContainer>
                </ConditionComponentContainer>
              ))}
              <StyledAddButton
                onClick={() => {
                  const updated = [...condition, { text: "", target: "" }];
                  setCondition(updated);
                  setNodes((nds) =>
                    nds.map((node) =>
                      node.id === selectedNodeId
                        ? {
                            ...node,
                            data: { ...node.data, condition: updated },
                          }
                        : node
                    )
                  );
                }}
              >
                + Add Condition
              </StyledAddButton>
            </LabelTextFieldContainer>
          )}
        </NodeContainer>
      </RightBar>
    </MainContainer>
  );
}

export default function Flow() {
  return (
    <ReactFlowProvider>
      <FlowWrapper />
    </ReactFlowProvider>
  );
}
