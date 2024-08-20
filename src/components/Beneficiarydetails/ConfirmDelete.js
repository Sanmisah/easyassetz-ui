import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@com/ui/alert-dialog";

const ConfirmDelete = ({ onConfirm, alertDialog, setAlertDialog }) => {
  return (
    <AlertDialog open={alertDialog} onOpenChange={setAlertDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. By Clicking on Confirm. I confirm that
            i want to delete this beneficiary.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              window.location.reload(true);
              setAlertDialog(false);
            }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              window.location.reload(true);
              onConfirm();
            }}
          >
            Continue
          </AlertDialogAction>
          ;
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmDelete;
