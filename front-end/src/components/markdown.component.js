import React from "react";
import { Platform } from "react-native";
import ReactMarkdown from "react-markdown";
import { Heading, Text, Link } from "native-base";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialOceanic } from "react-syntax-highlighter/dist/cjs/styles/prism";

const CodeBlock = ({ className, children }) => {
  const language = className?.replace("language-", "");
  return (
    <SyntaxHighlighter
      style={materialOceanic}
      language={className?.replace("language-", "")}
    >
      {children}
    </SyntaxHighlighter>
  );
};

const TextBlock = ({ children }) => {
  return (
    <Text selectable={true} color={"lightText"} m={1}>
      {children}
    </Text>
  );
};

const ListBlock = ({ children, ...props }) => {
  return (
    <Text selectable={true} color={"lightText"} {...props}>
      {children}
    </Text>
  );
};

const HeadingBlock = ({ children, node }) => {
  const fontSize = {
    h1: "2xl",
    h2: "xl",
    h3: "lg",
    h4: "md",
    h5: "sm",
    h6: "xs",
  };
  return (
    <Heading
      m={1}
      selectable={true}
      color={"lightText"}
      fontSize={fontSize[node?.tagName]}
    >
      {children}
    </Heading>
  );
};

const LinkBlock = ({ children, href }) => {
  return (
    <Link href={href} _hover={true}>
      {children}
    </Link>
  );
};
export const Markdown = ({ text }) => {
  // add support for code blocks
  if (Platform.OS === "web") {
    return (
      <ReactMarkdown
        skipHtml={true}
        children={text}
        components={{
          p: TextBlock,
          ul: ListBlock,
          ol: ListBlock,
          code: CodeBlock,
          h: HeadingBlock,
          h1: HeadingBlock,
          h2: HeadingBlock,
          h3: HeadingBlock,
          h4: HeadingBlock,
          h5: HeadingBlock,
          h6: HeadingBlock,
          a: LinkBlock,
        }}
      />
    );
  } else {
    return (
      <Text fontSize={["sm", "md", "lg"]} color={"lightText"}>
        {text}
      </Text>
    );
  }
};
