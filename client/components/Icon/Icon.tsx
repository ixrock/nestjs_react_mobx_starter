import * as styles from "./Icon.module.css";
import React from "react";
import { base64, cssNames, IClassName } from "../../utils";

export const inlineBase64Prefix = "data:image/svg+xml;base64,";

export interface IconProps {
  svgContent: string; // base64 encoded data-url or plain <svg>*</svg> content
  className?: IClassName;
  big?: boolean;
  onClick?(evt: React.MouseEvent): void;
}

export function Icon(props: IconProps) {
  const { className, svgContent, big, onClick } = props;

  const inlineSvg = svgContent.startsWith(inlineBase64Prefix)
    ? base64.decode(svgContent.replace(inlineBase64Prefix, ""))
    : svgContent;

  return (
    <div
      onClick={onClick}
      className={cssNames(styles.Icon, className, { [styles.big]: big })}
      dangerouslySetInnerHTML={{ __html: inlineSvg }}
    />
  );
}
