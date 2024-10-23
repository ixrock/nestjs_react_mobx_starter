import * as styles from "./Icon.module.css";
import React from "react";
import { base64, cssNames, IClassName } from "@/utils";

export const inlineBase64Prefix = "data:image/svg+xml;base64,";

export interface IconProps {
  source: string; // base64 encoded data-url or plain <svg>*</svg> content
  className?: IClassName;
  big?: boolean;
  onClick?(evt: React.MouseEvent): void;
}

export function Icon(props: IconProps) {
  const { className, source, big, onClick } = props;

  const inlineSvg = source.startsWith(inlineBase64Prefix)
    ? base64.decode(source.replace(inlineBase64Prefix, ""))
    : source;

  return (
    <div
      onClick={onClick}
      className={cssNames(styles.Icon, className, { [styles.big]: big })}
      dangerouslySetInnerHTML={{ __html: inlineSvg }}
    />
  );
}
