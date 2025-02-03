import type { FormProps } from "antd";
import { Button, Checkbox, Form, Input } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import ForgitPass from "../components/ForgitPass";
import { useUser } from "../store/UserStore";

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
  // TODO: Implement login
  console.log(values);
};

const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
  // TODO: Implement login failed
  console.log("Failed:", errorInfo);
};

const Login: React.FC = () => {
  const { setOpen } = useUser();

  const toggleOpen = () => {
    setOpen();
  };
  return (
    <div className="Wraper">
      <Form
        className="loginForm"
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 300 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          className="registerInput"
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          className="registerInput"
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item<FieldType>
          name="remember"
          valuePropName="checked"
          label={null}
          className="registerInput"
        >
          <Checkbox>Remember me</Checkbox>
        </Form.Item>
        <Link to="/register" className="registerInput">
          Don't have account ?? Register
        </Link>

        <Form.Item label={null} className="registerInput">
          <Link className="forgitPass" onClick={toggleOpen} to="">
            Forgit Your Password ?
          </Link>
          <Button type="primary" htmlType="submit" className="loginButton">
            Submit
          </Button>
        </Form.Item>
      </Form>
      <ForgitPass />
    </div>
  );
};

export default Login;
