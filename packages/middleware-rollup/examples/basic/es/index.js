import React, { useEffect } from 'react';
import { Button } from '@alifd/next';
import axios from 'axios';
import { createForm } from '@formily/core';
import { Field, FormConsumer, FormProvider } from '@formily/react';
import { FormButtonGroup, FormItem, FormLayout, Input, Submit } from '@formily/next';

const Component = function Component() {
  useEffect(() => {
    axios.get('https://alibaba.github.io/dawn/middleware.yml');
  }, []);
  return /* #__PURE__ */ React.createElement(Button, null, 'Test');
};

const form = createForm();

const FormComponent = function FormComponent() {
  return /* #__PURE__ */ React.createElement(
    FormProvider,
    {
      form,
    },
    /* #__PURE__ */ React.createElement(
      FormLayout,
      {
        layout: 'vertical',
      },
      /* #__PURE__ */ React.createElement(Field, {
        name: 'input',
        title: '\u8F93\u5165\u6846',
        required: true,
        initialValue: 'Hello world',
        decorator: [FormItem],
        component: [Input],
      }),
    ),
    /* #__PURE__ */ React.createElement(FormConsumer, null, () => {
      return /* #__PURE__ */ React.createElement(
        'div',
        {
          style: {
            marginBottom: 20,
            padding: 5,
            border: '1px dashed #666',
          },
        },
        '\u5B9E\u65F6\u54CD\u5E94\uFF1A',
        form.values.input,
      );
    }),
    /* #__PURE__ */ React.createElement(
      FormButtonGroup,
      null,
      /* #__PURE__ */ React.createElement(
        Submit,
        {
          onSubmit: console.log,
        },
        '\u63D0\u4EA4',
      ),
    ),
  );
};

export { Component, FormComponent };
