import styled from "@emotion/styled";

export const MainContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
`;

export const LeftBar = styled.div`
  width: 80%;
  height: 100%;
`;

export const RightBar = styled.div`
  width: calc(100% - 80%);
  height: 100%;
  background-color: white;
`;

export const NodeContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;

export const NodeTopBar = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: lightgray;
`;
export const FlowAreaContainer = styled.div`
  width: 100%;
  height: calc(100% - 50px);
  display: flex;
`;
export const TitleText = styled.div`
  font-size: 20px;
  font-family: sans-serif;
  font-weight: 800;
`;
export const NodeDataContainer = styled.div`
  width: 80%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px;
  padding: 10px;
  box-shadow: 0px 2px 4px rgba(235, 243, 243, 0.1);
  border: 1px solid #aaa;
  border-radius: 4px;
  background-color: #fbfcfd;
  cursor: grab;

  &:hover {
    background-color: lightcyan;
  }
`;

export const NodeTitleText = styled.div`
  font-size: 15px;
  font-family: sans-serif;
  font-weight: 600;
`;
export const LabelTextFieldContainer = styled.div`
  padding: 10px;
  width: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;
export const StyledSelectField = styled.select`
  width: 95%;
  height: 30px;
`;
export const StyledInputField = styled.input`
  width: 90%;
  height: 24px;
  padding: 0.5rem;
  margin-top: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;
export const CustomNodeContainer = styled.div`
  text-align: center;
  font-size: 14px;
  //padding: 8px;
  margin-left: -10px;
  margin-right: -10px;
  max-width: 150px;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  overflow: hidden;
`;

export const StyledAddButton = styled.button`
  margin-top: 10px;
  padding: 6px 12px;
  border-radius: 6px;
  background-color: gray;
  color: #fff;
  border: none;
  cursor: pointer;
`;

export const ConditionComponentContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  margin-bottom: 8px;
  gap: 8px;
`;

export const ActionContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  margin-left: 8px;
  display: flex;
  align-items: center;
  color: #888;

  &:hover {
    color: #e00;
  }
`;
