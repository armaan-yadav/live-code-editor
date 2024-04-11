import React from "react";
import Avatar from "react-avatar";
const UserCard = ({ username }) => {
  return (
    <div className="flex w-full gap-3 items-center">
      <Avatar name={username} size="50" round="15px" />
      {username}
    </div>
  );
};

export default UserCard;
