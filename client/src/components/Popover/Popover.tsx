import React from "react";

const ConfirmModal = () => {
  return (
    <>
      <p>
        Are you sure? This action will delete the item from the database and
        cannot be undone.{" "}
      </p>
      <div>
        <button>Confirm</button>
        <button>Cancel</button>
      </div>
    </>
  );
};

export default ConfirmModal;
