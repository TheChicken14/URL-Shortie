import React from "react";

import CircularProgress from "@material-ui/core/CircularProgress";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
const Loading = () => {
  return (
    <div>
      <Grid container>
        <Grid item xs={12}>
          <Paper
            elevation={0}
            color="inherit"
            style={{
              textAlign: "center",
              marginTop: "5rem",
              backgroundColor: "",
            }}
          >
            <CircularProgress size={80} />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default Loading;
