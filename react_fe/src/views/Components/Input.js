import React, { Fragment } from "react";

import InputAdornment from "@material-ui/core/InputAdornment";
import Danger from "components/Typography/Danger.js";

import CustomInput from "components/CustomInput/CustomInput.js";

// @material-ui/icons
import Email from "@material-ui/icons/Email";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import NotesIcon from "@material-ui/icons/Notes";

export default function Input(props) {
  const {
    id,
    labeltext,
    validation,
    type,
    handleChange,
    input,
    classes,
    errorText,
  } = props;
  return (
    <Fragment>
      <CustomInput
        labelText={labeltext}
        id={id}
        error={input === "" ? false : !validation(input)}
        formControlProps={{
          fullWidth: true,
        }}
        inputProps={{
          type: type,
          value: input,
          endAdornment: (
            <InputAdornment position="end">
              {id === "password" || id === "verifyPassword" ? (
                <LockOpenIcon className={classes} />
              ) : id === "username" ? (
                <AccountCircleIcon className={classes} />
              ) : id === "email" ? (
                <Email className={classes} />
              ) : (
                <NotesIcon className={classes} />
              )}
            </InputAdornment>
          ),
          autoComplete: "off",
          onChange: handleChange,
        }}
      />
      {input === "" ? (
        ""
      ) : !validation(input) ? (
        <Danger>{errorText}</Danger>
      ) : (
        ""
      )}
    </Fragment>
  );
}
