"use client";
import dynamic from "next/dynamic";
import styled from "@emotion/styled";

const Flow = dynamic(() => import("@/components/flowWrapper"), {
  ssr: false,
});

const Layout = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
`;

export default function Page() {
  return (
    <Layout>
      <Flow />
    </Layout>
  );
}
