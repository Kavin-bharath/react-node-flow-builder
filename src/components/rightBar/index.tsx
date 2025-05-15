"use client";
import React from "react";
import { MdClose } from "react-icons/md";
import {
  RightBar,
  NodeContainer,
  NodeTopBar,
  TitleText,
  NodeDataContainer,
  NodeTitleText,
  LabelTextFieldContainer,
  StyledInputField,
  StyledSelectField,
  ConditionComponentContainer,
  StyledAddButton,
  CloseButton,
  ActionContainer,
} from "./index.styled";

export default function RightBarComponent({
  nodes,
  edges,
  selectedNodeId,
  label,
  setLabel,
  condition,
  setCondition,
  setNodes,
  setEdges,
  handleDragStart,
}: any) {
  const selectedNode = nodes.find((n: any) => n.id === selectedNodeId);

  return (
    <RightBar>
      <NodeContainer>
        <NodeTopBar>
          <TitleText>Node Setting</TitleText>
        </NodeTopBar>

        {["Widget Node", "Conditional Node", "Output Node"].map((type) => (
          <NodeDataContainer
            key={type}
            draggable
            onDragStart={(e) => handleDragStart(e, type)}
          >
            <NodeTitleText>{type}</NodeTitleText>
          </NodeDataContainer>
        ))}

        {selectedNode?.type === "input" && (
          <>
            <LabelTextFieldContainer>
              <NodeTitleText>Widget Name:</NodeTitleText>
              <StyledInputField
                type="text"
                value={label}
                onChange={(e) => {
                  const newLabel = e.target.value;
                  setLabel(newLabel);
                  setNodes((nds: any[]) =>
                    nds.map((node) =>
                      node.id === selectedNodeId
                        ? { ...node, data: { ...node.data, label: newLabel } }
                        : node
                    )
                  );
                }}
              />
            </LabelTextFieldContainer>

            <LabelTextFieldContainer>
              <NodeTitleText>Connect to:</NodeTitleText>
              <StyledSelectField
                onChange={(e) => {
                  const targetNodeId = e.target.value;
                  setEdges((eds: any[]) =>
                    eds.filter((e: any) => e.source !== selectedNodeId)
                  );
                  if (targetNodeId) {
                    setEdges((eds: any[]) => [
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
                  edges.find((e: any) => e.source === selectedNodeId)?.target ||
                  ""
                }
              >
                <option value="">Select a default node</option>
                {nodes
                  .filter((n: any) => n.type === "default")
                  .map((n: any) => (
                    <option key={n.id} value={n.id}>
                      Default {n.id}
                    </option>
                  ))}
              </StyledSelectField>
            </LabelTextFieldContainer>
          </>
        )}

        {selectedNode?.type === "output" && (
          <LabelTextFieldContainer>
            <NodeTitleText>Output Node Name:</NodeTitleText>
            <StyledInputField
              type="text"
              value={label}
              onChange={(e) => {
                const newLabel = e.target.value;
                setLabel(newLabel);
                setNodes((nds: any[]) =>
                  nds.map((node) =>
                    node.id === selectedNodeId
                      ? { ...node, data: { ...node.data, label: newLabel } }
                      : node
                  )
                );
              }}
            />
          </LabelTextFieldContainer>
        )}

        {selectedNode?.type === "default" && (
          <LabelTextFieldContainer>
            <NodeTitleText>Conditions:</NodeTitleText>
            {condition.map((cond: any, index: number) => (
              <ConditionComponentContainer key={index}>
                <StyledInputField
                  type="text"
                  value={cond.text}
                  placeholder="Condition text"
                  onChange={(e) => {
                    const updated = [...condition];
                    updated[index].text = e.target.value;
                    setCondition(updated);
                    setNodes((nds: any[]) =>
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
                      setNodes((nds: any[]) =>
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
                      .filter((n: any) => n.type === "output")
                      .map((n: any) => (
                        <option key={n.id} value={n.id}>
                          {n.data?.label || `Output ${n.id}`}
                        </option>
                      ))}
                  </StyledSelectField>
                  <CloseButton
                    onClick={() => {
                      const updated = condition.filter(
                        (_: any, i: number) => i !== index
                      );
                      setCondition(updated);
                      setNodes((nds: any[]) =>
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
                setNodes((nds: any[]) =>
                  nds.map((node) =>
                    node.id === selectedNodeId
                      ? { ...node, data: { ...node.data, condition: updated } }
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
  );
}
