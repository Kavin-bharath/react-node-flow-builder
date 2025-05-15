export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ overflow: "hidden", margin: "0px" }}>{children}</body>
    </html>
  );
}
