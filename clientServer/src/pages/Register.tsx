import { Button, Checkbox, Form, Input, Select } from "antd";
import { Link } from "react-router-dom";

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const Registration: React.FC = () => {
  const [form] = Form.useForm();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFinish = (values: any) => {
    // TODO: Implement register
    console.log("Received values of form: ", values);
  };

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select style={{ width: 80 }}>
        <Option value="962">+962</Option>
        <Option value="1">+1</Option>
        <Option value="966">+966</Option>
        <Option value="972">+972</Option>
      </Select>
    </Form.Item>
  );

  return (
    <div className="Wraper">
      <Form
        className="registerForm"
        {...formItemLayout}
        form={form}
        name="register"
        onFinish={onFinish}
        initialValues={{
          prefix: "962",
          suffix: "TeamLead",
        }}
        scrollToFirstError
      >
        <Form.Item
          className="registerInput"
          name="name"
          label="Name"
          rules={[
            {
              required: true,
              message: "Please input your name!",
              whitespace: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          className="registerInput"
          name="lastName"
          label="Last Name"
          rules={[
            {
              required: true,
              message: "Please input your Last Name!",
              whitespace: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          className="registerInput"
          name="jobTitle"
          label="JobTitle"
          rules={[{ required: true, message: "Please input Your Job Title!" }]}
        >
          <Select placeholder="select your Title">
            <Option value="backEndDeveloper">backEnd Developer</Option>
            <Option value="frontEndDeveloper">frontEnd Developer</Option>
            <Option value="Marketing">Marketing</Option>
            <Option value="TeamLead">Team Lead</Option>
          </Select>
        </Form.Item>
        <Form.Item
          className="registerInput"
          name="email"
          label="E-mail"
          rules={[
            {
              type: "email",
              message: "The input is not valid E-mail!",
            },
            {
              required: true,
              message: "Please input your E-mail!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          className="registerInput"
          name="password"
          label="Password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          className="registerInput"
          name="confirm"
          label="Confirm Password"
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please confirm your password!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The new password that you entered do not match!")
                );
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          className="registerInput"
          name="gender"
          label="Gender"
          rules={[{ required: true, message: "Please select gender!" }]}
        >
          <Select placeholder="select your gender">
            <Option value="male">Male</Option>
            <Option value="female">Female</Option>
          </Select>
        </Form.Item>
        <Form.Item
          className="registerInput"
          name="phone"
          label="Phone Number"
          rules={[
            { required: true, message: "Please input your phone number!" },
          ]}
        >
          <Input addonBefore={prefixSelector} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="agreement"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject(new Error("Should accept agreement")),
            },
          ]}
          {...tailFormItemLayout}
        >
          <Link to="/login">Already have an Account ? Login </Link>
          <Checkbox>
            I have read the <a href="">agreement</a>
          </Checkbox>
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" className="registerButton">
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Registration;
