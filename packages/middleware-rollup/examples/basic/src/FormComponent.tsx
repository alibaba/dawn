import React from "react";
import { createForm } from "@formily/core";
import { Field, FormConsumer, FormProvider } from "@formily/react";
import { FormButtonGroup, FormItem, FormLayout, Input, Submit } from "@formily/next";

const form = createForm();

const FormComponent: React.FC = () => {
  return (
    <FormProvider form={form}>
      <FormLayout layout="vertical">
        <Field
          name="input"
          title="输入框"
          required
          initialValue="Hello world"
          decorator={[FormItem]}
          component={[Input]}
        />
      </FormLayout>
      <FormConsumer>
        {() => (
          <div
            style={{
              marginBottom: 20,
              padding: 5,
              border: "1px dashed #666",
            }}
          >
            实时响应：{form.values.input}
          </div>
        )}
      </FormConsumer>
      <FormButtonGroup>
        <Submit onSubmit={console.log}>提交</Submit>
      </FormButtonGroup>
    </FormProvider>
  );
};

export default FormComponent;
