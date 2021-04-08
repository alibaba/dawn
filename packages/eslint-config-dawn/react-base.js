module.exports = {
  rules: {
    // 对 react 组件的 prop-type 不再做要求
    'react/prop-types': 'off',

    /**
     * 检查 effect dependencies，必须包含依赖参数
     * https://github.com/facebook/react/tree/master/packages/eslint-plugin-react-hooks
     * @example
     * good: useEffect(() => {}, []);
     * bad: useEffect(() => {});
     */
    'react-hooks/exhaustive-deps': 'off',

    /**
     * 锚点类标签建议包含内容
     * https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/anchor-has-content.md
     * @example
     * good: <a href="">mylink</a>
     * bad: <a href="" />
     */
    'jsx-a11y/anchor-has-content': ['warn', { components: ['a', 'button'] }],

    // ARIA 无障碍属性 暂时不开启
    // Require ARIA roles to be valid and non-abstract
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/aria-role.md
    'jsx-a11y/aria-role': ['off', { ignoreNonDom: false }],

    // ARIA 无障碍属性 暂时不开启
    // Enforce ARIA state and property values are valid.
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/aria-proptypes.md
    'jsx-a11y/aria-proptypes': 'off',

    // ARIA 无障碍属性 暂时不开启
    // Enforce that elements that do not support ARIA roles, states, and
    // properties do not have those attributes.
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/aria-unsupported-elements.md
    'jsx-a11y/aria-unsupported-elements': 'off',

    /**
     * 建议 img 等标签增加描述属性 alt
     * https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/alt-text.md
     * @example
     * good: <img src="" alt="foo" />
     * bad: <img src="" />
     */
    'jsx-a11y/alt-text': [
      'warn',
      {
        elements: ['img', 'object', 'area', 'input[type="image"]'],
        img: [],
        object: [],
        area: [],
        'input[type="image"]': [],
      },
    ],

    // 不做限制
    // Prevent img alt text from containing redundant words like "image", "picture", or "photo"
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/img-redundant-alt.md
    'jsx-a11y/img-redundant-alt': 'off',

    /**
     * 暂时不开启
     * Label 标签包含文本和 associated control
     * https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/label-has-associated-control.md
     */
    'jsx-a11y/label-has-associated-control': [
      'off',
      {
        labelComponents: [],
        labelAttributes: [],
        controlComponents: [],
        assert: 'both',
        depth: 25,
      },
    ],

    /**
     * 暂时不开启
     * Enforce that a control (an interactive element) has a text label.
     * https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/control-has-associated-label.md
     */
    'jsx-a11y/control-has-associated-label': [
      'off',
      {
        labelAttributes: ['label'],
        controlComponents: [],
        ignoreElements: ['audio', 'canvas', 'embed', 'input', 'textarea', 'tr', 'video'],
        ignoreRoles: [
          'grid',
          'listbox',
          'menu',
          'menubar',
          'radiogroup',
          'row',
          'tablist',
          'toolbar',
          'tree',
          'treegrid',
        ],
        depth: 5,
      },
    ],

    // 暂时不开启
    // require that mouseover/out come with focus/blur, for keyboard-only users
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/mouse-events-have-key-events.md
    'jsx-a11y/mouse-events-have-key-events': 'off',

    // require onBlur instead of onChange
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-onchange.md
    'jsx-a11y/no-onchange': 'off',

    // 暂时不开启
    // Elements with an interactive role and interaction handlers must be focusable
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/interactive-supports-focus.md
    'jsx-a11y/interactive-supports-focus': 'off',

    // 暂时不开启
    // Enforce that elements with ARIA roles must have all required attributes
    // for that role.
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/role-has-required-aria-props.md
    'jsx-a11y/role-has-required-aria-props': 'off',

    // 暂时不开启
    // Enforce that elements with explicit or implicit roles defined contain
    // only aria-* properties supported by that role.
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/role-supports-aria-props.md
    'jsx-a11y/role-supports-aria-props': 'off',

    // 暂时不开启
    // Enforce tabIndex value is not greater than zero.
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/tabindex-no-positive.md
    'jsx-a11y/tabindex-no-positive': 'off',

    // 暂时不开启
    // ensure <hX> tags have content and are not aria-hidden
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/heading-has-content.md
    'jsx-a11y/heading-has-content': ['off', { components: [''] }],

    /**
     * <html> 标签上建议有 lang 属性
     * https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/html-has-lang.md
     */
    'jsx-a11y/html-has-lang': 'warn',

    /**
     * <html> 标签上建议有 lang 属性
     * https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/lang.md
     */
    'jsx-a11y/lang': 'warn',

    // 暂时不开启
    // require onClick be accompanied by onKeyUp/onKeyDown/onKeyPress
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/click-events-have-key-events.md
    'jsx-a11y/click-events-have-key-events': 'off',

    // 暂时不开启
    // Enforce that DOM elements without semantic behavior not have interaction handlers
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-static-element-interactions.md
    'jsx-a11y/no-static-element-interactions': [
      'off',
      {
        handlers: ['onClick', 'onMouseDown', 'onMouseUp', 'onKeyPress', 'onKeyDown', 'onKeyUp'],
      },
    ],
  },
};
