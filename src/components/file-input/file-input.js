import { Fragment, useState } from "react";
import { LoadingButton } from "@mui/lab";
import { FileUpload } from "@mui/icons-material";
import { Snackbar, Alert } from "@mui/material";

function FileInput(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ isOpen: false, message: "" });

  const handleOnChange = function (e) {
    const file = e.target.files[0];
    const fileReader = new FileReader();

    fileReader.readAsText(file);

    fileReader.onloadstart = () => {
      setIsLoading(true);
    };

    fileReader.onloadend = () => {
      setIsLoading(false);
    };

    fileReader.onload = (r) => {
      const xmlText = r.target.result;
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "text/xml");
      const validationConstraints = {
        units: { tag: "Units", count: 1 },
        project: {
          tag: "Project",
          count: 1,
          requiredAttr: ["name"],
        },
        application: {
          tag: "Application",
          count: 1,
          requiredAttr: ["name", "desc", "manufacturer", "version"],
        },
        pipeNetworks: {
          tag: "PipeNetworks",
          count: 1,
        },
      };

      try {
        validateDoc(xmlDoc, validationConstraints);
      } catch (err) {
        setSnackbar((prevState) => {
          return {
            ...prevState,
            isOpen: true,
            message: err.message,
          };
        });
      }
    };
  };

  const handleOnClose = function (_e, reason) {
    if (reason === "clickaway") return;

    setSnackbar((prevState) => {
      return {
        ...prevState,
        isOpen: false,
        message: "",
      };
    });
  };

  return (
    <Fragment>
      <LoadingButton
        loading={isLoading}
        loadingPosition="start"
        component="label"
        variant="contained"
        color="secondary"
        startIcon={<FileUpload />}
      >
        {props.children || "Upload"}
        <input type="file" accept="text/xml" onChange={handleOnChange} hidden />
      </LoadingButton>
      <Snackbar
        open={snackbar.isOpen}
        autoHideDuration={6000}
        onClose={handleOnClose}
      >
        <Alert
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
          onClose={handleOnClose}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Fragment>
  );
}

const validateDoc = function (xmlDoc, constraints) {
  if (!xmlDoc) throw new TypeError("No XML document provided");
  if (!constraints) throw new TypeError("No constraints object provided");

  for (const value of Object.values(constraints)) {
    const tag = xmlDoc.getElementsByTagName(value.tag);

    if (value.count && tag.length !== value.count) {
      throw new ProjectDocumentError(
        `Invalid project document. Should contains ${value.count} ${value.tag} tags while contains ${tag.length}`
      );
    }

    if (value.requiredAttr) {
      value.requiredAttr.forEach((attr) => {
        if (!tag[0].getAttribute(attr)) {
          throw new ProjectDocumentError(
            `Invalid project document. ${value.tag} tag should contain ${attr} attribute`
          );
        }
      });
    }
  }

  return true;
};

class ProjectDocumentError extends Error {
  constructor(message) {
    super(message);
    this.name = "ProjectDocumentError";
  }
}

export default FileInput;
