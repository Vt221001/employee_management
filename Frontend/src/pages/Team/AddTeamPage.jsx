import React from "react";
import UserForm from "../../components/UserForm";

const AddTeamPage = () => {
  const handleFormSubmit = (newUserData) => {
    console.log("New user data added:", newUserData);
  };

  return (
    <div className="mx-auto">
      <UserForm onSubmit={handleFormSubmit} />
    </div>
  );
};

export default AddTeamPage;
``;
