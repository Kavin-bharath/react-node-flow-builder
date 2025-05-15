"use client";
import React from "react";
import { ReactFlowProps } from "@xyflow/react";
import {
  FlowAreaContainer,
  LeftBar,
  NodeTopBar,
  TitleText,
} from "./index.styled";
import FlowCanvas from "../flowCanvasComponent";

export default function LeftBarComponent({
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
  );
}
