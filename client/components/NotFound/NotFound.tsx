import * as styles from "./NotFound.module.css";
import React from "react";

export class NotFound extends React.Component {
  render() {
    return (
      <div className={styles.NotFound}>
        404: Route not found
      </div>
    );
  }
}
