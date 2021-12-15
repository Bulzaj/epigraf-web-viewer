import { Box, AppBar, Toolbar } from "@mui/material";
import FileInput from "../file-input/file-input";

function NavBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <FileInput />
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default NavBar;
