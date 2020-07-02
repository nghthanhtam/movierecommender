import React from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";

import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import axios from "axios";

import { useHistory } from "react-router-dom";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  formControl: {
    margin: theme.spacing(3),
  },
}));

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;

  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export default function GenreDialog(props) {
  const { open, id } = props;

  let history = useHistory();
  const [state, setState] = React.useState({
    checkboxDrama: false,
    checkboxFamily: false,
    checkboxHorror: false,
    checkboxFantasy: false,
    checkboxAnimation: false,
    checkboxComedy: false,
    checkboxRomance: false,
    checkboxAction: false,
    checkboxHistory: false,
    checkboxDocumentary: false,
  });
  const [openInDialog, changeOpenInDialog] = React.useState(true);
  const classes = useStyles();

  const handleClose = () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios
      .put(
        `${process.env.REACT_APP_BACKEND_HOST}/users/${id}/updateFirstTimeUse`,
        config
      )
      .then((res) => {
        changeOpenInDialog(false);
        props.onSave("-1");
      })
      .catch((er) => {
        history.push("/404");
      });
  };
  const handleSave = () => {
    // Nhớ đặt lệnh này trong phần .then của mày để đóng modal :D
    changeOpenInDialog(false);
    let text = "";
    if (checkboxDrama) text += "|drama";
    if (checkboxFamily) text += "|family";
    if (checkboxHorror) text += "|horror";
    if (checkboxFantasy) text += "|fantasy";
    if (checkboxAnimation) text += "|animation";
    if (checkboxComedy) text += "|comedy";
    if (checkboxRomance) text += "|romance";
    if (checkboxAction) text += "|action";
    if (checkboxHistory) text += "|history";
    props.onSave(text);
  };

  const handleCheckboxChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };
  const {
    checkboxDrama,
    checkboxFamily,
    checkboxHorror,
    checkboxFantasy,
    checkboxAnimation,
    checkboxComedy,
    checkboxRomance,
    checkboxAction,
    checkboxHistory,
    checkboxDocumentary,
  } = state;
  return (
    <div>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open && openInDialog}
        fullWidth={true}
        maxWidth="xs"
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          <div style={{ textAlign: "center" }}>Pick favorite genres</div>
        </DialogTitle>
        <DialogContent dividers>
          {/* <DialogContentText id="alert-dialog-slide-description"> */}

          <div style={{ textAlign: "center" }}>
            <FormControl component="fieldset" className={classes.formControl}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checkboxDrama}
                      onChange={handleCheckboxChange}
                      name="checkboxDrama"
                      color="primary"
                    />
                  }
                  label="Drama"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checkboxFamily}
                      onChange={handleCheckboxChange}
                      name="checkboxFamily"
                      color="primary"
                    />
                  }
                  label="Family"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checkboxHorror}
                      onChange={handleCheckboxChange}
                      name="checkboxHorror"
                      color="primary"
                    />
                  }
                  label="Horror"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checkboxFantasy}
                      onChange={handleCheckboxChange}
                      name="checkboxFantasy"
                      color="primary"
                    />
                  }
                  label="Fantasy"
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checkboxAnimation}
                      onChange={handleCheckboxChange}
                      name="checkboxAnimation"
                      color="primary"
                    />
                  }
                  label="Animation"
                />
              </FormGroup>
            </FormControl>
            <FormControl component="fieldset" className={classes.formControl}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checkboxComedy}
                      onChange={handleCheckboxChange}
                      name="checkboxComedy"
                      color="primary"
                    />
                  }
                  label="Comedy"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checkboxRomance}
                      onChange={handleCheckboxChange}
                      name="checkboxRomance"
                      color="primary"
                    />
                  }
                  label="Romance"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checkboxAction}
                      onChange={handleCheckboxChange}
                      name="checkboxAction"
                      color="primary"
                    />
                  }
                  label="Action"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checkboxHistory}
                      onChange={handleCheckboxChange}
                      name="checkboxHistory"
                      color="primary"
                    />
                  }
                  label="History"
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checkboxDocumentary}
                      onChange={handleCheckboxChange}
                      name="checkboxDocumentary"
                      color="primary"
                    />
                  }
                  label="Documentary"
                />
              </FormGroup>
            </FormControl>
          </div>
          {/* </DialogContentText> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Skip
          </Button>
          <Button
            disabled={
              checkboxDrama
                ? false
                : checkboxFamily
                ? false
                : checkboxHorror
                ? false
                : checkboxFantasy
                ? false
                : checkboxAnimation
                ? false
                : checkboxComedy
                ? false
                : checkboxRomance
                ? false
                : checkboxAction
                ? false
                : checkboxHistory
                ? false
                : checkboxDocumentary
                ? false
                : true
            }
            autoFocus
            onClick={handleSave}
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
