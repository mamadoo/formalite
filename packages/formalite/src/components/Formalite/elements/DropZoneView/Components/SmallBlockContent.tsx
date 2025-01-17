import { Grid, Typography } from "@mui/material";
import React from "react";
import { useI18nContext } from "@components/base/I18nProvider";
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
const SmallBlockContent = (props: { required: boolean }) => {
  const { t } = useI18nContext();

  return (
    <Grid container>
      <Grid
        item
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CloudUploadOutlinedIcon
          color="primary"
          sx={{
            width: 45,
            height: 45,
            mx: 2,
          }}
        />
      </Grid>
      <Grid item xs container direction="column">
        <Grid item>
          <Typography gutterBottom variant="h5">
            {`${t("fg-dropzone-drop-or-select-file")} ${
              props.required ? "*" : ""
            }`}
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {t("fg-dropzone-drop-files-here-or-click")}&nbsp;
            <Typography
              variant="body2"
              component="span"
              sx={{ color: "primary.main", textDecoration: "underline" }}
            >
              {t("fg-dropzone-browse")}
            </Typography>
            &nbsp;{t("fg-dropzone-select-thorough-your-machine")}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};
export default SmallBlockContent;
