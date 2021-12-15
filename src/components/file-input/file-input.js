import { Button } from "@mui/material";
import { FileUpload } from "@mui/icons-material";

function FileInput() {
  return (
    <Button
      component="label"
      variant="contained"
      color="secondary"
      startIcon={<FileUpload />}
    >
      Projekt
      <input type="file" accept="text/xml" hidden />
    </Button>
  );
}

export default FileInput;
