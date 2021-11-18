Object.defineProperty(exports, '__esModule', { value: true });

const React = require('react');
const next = require('@alifd/next');
const axios = require('axios');
const core = require('@formily/core');
const react = require('@formily/react');
const next$1 = require('@formily/next');

function _interopDefaultLegacy(e) {
  return e && typeof e === 'object' && 'default' in e ? e : { default: e };
}

const React__default = /* #__PURE__ */ _interopDefaultLegacy(React);
const axios__default = /* #__PURE__ */ _interopDefaultLegacy(axios);

const Component = function Component() {
  React.useEffect(() => {
    axios__default.default.get('https://alibaba.github.io/dawn/middleware.yml');
  }, []);
  return /* #__PURE__ */ React__default.default.createElement(next.Button, null, 'Test');
};

const form = core.createForm();

const FormComponent = function FormComponent() {
  return /* #__PURE__ */ React__default.default.createElement(
    react.FormProvider,
    {
      form,
    },
    /* #__PURE__ */ React__default.default.createElement(
      next$1.FormLayout,
      {
        layout: 'vertical',
      },
      /* #__PURE__ */ React__default.default.createElement(react.Field, {
        name: 'input',
        title: '\u8F93\u5165\u6846',
        required: true,
        initialValue: 'Hello world',
        decorator: [next$1.FormItem],
        component: [next$1.Input],
      }),
    ),
    /* #__PURE__ */ React__default.default.createElement(react.FormConsumer, null, () => {
      return /* #__PURE__ */ React__default.default.createElement(
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
    /* #__PURE__ */ React__default.default.createElement(
      next$1.FormButtonGroup,
      null,
      /* #__PURE__ */ React__default.default.createElement(
        next$1.Submit,
        {
          onSubmit: console.log,
        },
        '\u63D0\u4EA4',
      ),
    ),
  );
};

exports.Component = Component;
exports.FormComponent = FormComponent;
