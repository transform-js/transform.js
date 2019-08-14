# transform.js

Transform.js allows you to syntaxically transform your data. This may be useful when you wan't to forward / amend one's api message to an other one.

## Example :

Let's say you wan't to forward an error message to your [PRTG](https://www.paessler.com/manuals/prtg/custom_sensors#advanced_sensors) platform.
Here is your source message, JSON formatted :

```
{
  "message": "Unable to retrieve metrics"
}
```

Here is what you expect, also, JSON formatted :

```
{
  "prtg": {
    "error": "1",
    "text": "Unable to retrieve metrics"
  }
}
```

In Transform.js you will have to define the following :

- Interface: this piece of code is responsible for handling your data from source to destination formats. Interface makes your transformation more flexible, you can add pre/post processing code, loop the formatter, define your own configuration, ...
- Config: you must define your configuration, that is, all the required functions to perform the transformation.

According to this example, you will have to create the following files (you can mimic the 'example' interface)

- `sources/interfaces/prtg/Iprtg.js`: where you export your interface
- `sources/interfaces/prtg/config.js`: where you export your configuration

You interface must extends Imother and write formatted data in `dst` variable.

A working config.js for our example would be :

```
import * as m from "../../core/mutations.js"

ERRORS_TPL = '{ \
  "prtg": { \
    "error": "1", \
    "text": "${_("prtg.text")}" \
  } \
}'

export default {
  _default: {
    errors: {
      json: {
        errors_template: ERRORS_TPL,
        errors_operations: [
          {
            from: "message",
            to: "prtg.text",
            mutations: m.m_any
          }
        ]
      }
    }
  }
}
```

where `m.m_any` is a base mutation from `/sources/core/mutations.js` :

```
export const m_any = (dst, s) => {
  return s;
};
```

The interface can now call the formatter:

```
import CONFIG from "./config.js";

export default class Iprtg extends Imother {
  constructor(src, id, kind, lang) {
    try {
      const template = CONFIG[id][kind][lang].errors_template;
      const operations = CONFIG[id][kind][lang].errors_operations;

      this.dst = new Formatter(this.src, operations, template).format();
    } catch (e) {
      throw new InterfaceError(e.message);
    }
  }
}
```

About the parameters:

- `src`: source data (the error message to be transformed)
- `id`: the target identity (\_default)
- `kind`: the kind of data to be transformed (errors)
- `lang`: the lang used to perform syntax operations (json)

# Test

We can now test our interface.

```
import Transform from "../../../sources/index.js"
import CONSTANTS from "../../../sources/core/constants.js"

describe("PRTG Errors", () => {
  test("Simple", async () => {
    const src = {
      "message": "Unable to retrieve metrics"
    }
    const expected = {
      "prtg": {
        "error": "1",
        "text": "Unable to retrieve metrics"
      }
    }
    const p = await new Transform(src, CONSTANTS.ID.AZURE, CONSTANTS.TO.PRTG, CONSTANTS.KIND_ERRORS);
    expect(p.format()).toEqual(expected);
  });
});
```
