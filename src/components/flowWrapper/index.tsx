"use client";
import { useCallback, useEffect, useState } from "react";
import {
  ReactFlowProvider,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  useReactFlow,
  type Node,
  type Edge,
  type OnConnect,
  type OnNodesChange,
  type OnEdgesChange,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { MainContainer } from "./index.styled";
import LeftBarComponent from "../leftBar";
import RightBarComponent from "../rightBar";

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
      <LeftBarComponent
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
      />
      <RightBarComponent
        nodes={nodes}
        edges={edges}
        selectedNodeId={selectedNodeId}
        label={label}
        setLabel={setLabel}
        condition={condition}
        setCondition={setCondition}
        setNodes={setNodes}
        setEdges={setEdges}
        handleDragStart={handleDragStart}
      />
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
