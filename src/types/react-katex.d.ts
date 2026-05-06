declare module "react-katex" {
  import * as React from "react";

  type MathProps =
    | {
        math: string;
        errorColor?: string;
        renderError?: (error: Error) => React.ReactNode;
      }
    | {
        children: React.ReactNode;
        errorColor?: string;
        renderError?: (error: Error) => React.ReactNode;
      };

  export function InlineMath(props: MathProps): React.JSX.Element;
  export function BlockMath(props: MathProps): React.JSX.Element;
}
