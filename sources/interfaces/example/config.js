import * as m from "../../core/mutations.js";

export default {
  test: {
    metrics: {
      json: {
        tpl:
          '{ "foo": "${_("foo")}", "bar": ${_("bar")}, "baz": "${_("baz")}", "moo": "${_("moo")}" }',
        /* no operations for baz / moo */
        operations: [
          {
            from: "test_metrics.foo",
            to: "foo",
            mutations: m.m_uppercase
          },
          {
            from: "test_metrics.bar",
            to: "bar",
            mutations: [
              {
                /* will chain functions in .arguments */
                variadic: m.m_chain,
                arguments: [
                  /* uppercase : def -> DEF */
                  m.m_uppercase,
                  /* will return as string : DEF -> "DEF" (no quotes in template) */
                  m.m_as_string
                ]
              }
            ]
          }
        ]
      }
    }
  }
};
