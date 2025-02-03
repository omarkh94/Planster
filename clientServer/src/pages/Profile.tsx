import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { mockData } from "../mock";
import { UserType } from "../types";

interface UserTypeWithConfirm extends UserType {
  confirm: string;
}

const Profile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<UserType | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<UserTypeWithConfirm>();

  useEffect(() => {
    const foundUser = mockData.users.find((user) => user.id === id);
    if (foundUser) {
      setUser(foundUser);
      setValue("name", foundUser.name);
      setValue("lastName", foundUser.lastName);
      setValue("email", foundUser.email);
      setValue("jobTitle", foundUser.jobTitle || foundUser.jobTitle[0]);
      setValue("gender", foundUser.gender);
      setValue("phoneNumber", foundUser.phoneNumber);
      setValue("confirm", "");
    }
  }, [id, setValue]);

  const onSubmit = (data: UserTypeWithConfirm) => {
    // TODO: Implement profile update
    console.log(data);
  };

  return (
    <div className="profile-container">
      <h2 className="profile-title">User Profile</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="profile-form">
        <div className="input-group">
          <label htmlFor="name" className="input-label">
            Name
          </label>
          <input
            id="name"
            {...register("name", { required: "Name is required" })}
            className="input-field"
          />
          {errors.name && (
            <p className="error-message">{errors.name.message}</p>
          )}
        </div>

        <div className="input-group">
          <label htmlFor="password" className="input-label">
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register("password", { required: "Password is required" })}
            className="input-field"
          />
          {errors.password && (
            <p className="error-message">{errors.password.message}</p>
          )}
        </div>

        <div className="input-group">
          <label htmlFor="confirm" className="input-label">
            Confirm Password
          </label>
          <input
            id="confirm"
            type="password"
            {...register("confirm", {
              required: "Please confirm your password",
              validate: (value) =>
                value === user?.password || "Passwords do not match",
            })}
            className="input-field"
          />
          {errors.confirm && (
            <p className="error-message">{errors.confirm.message}</p>
          )}
        </div>

        <button type="submit" className="submit-button">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default Profile;
