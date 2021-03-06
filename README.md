# transform.js

Transform.js allows you to syntaxically transform your data. This may be useful when you want to forward / amend api data.

## Getting started

- Build library: `npm run build`. build in `/lib`
- Test library: `npm run test`. Clear jest cache with `npm run clear`

You can try the library plugged with the `example` interface using this [project](https://github.com/valkheim/transform.js-client).

## Example

Let's say you wan't to forward an error message to your [PRTG](https://www.paessler.com/manuals/prtg/custom_sensors#advanced_sensors) platform.

Here is your source message:

```
{
  "message": "unable to retrieve metrics"
}
```

And here is what you want from transform.js:

```
{
  "prtg": {
    "error": "1",
    "text": "Unable to retrieve metrics."
  }
}
```

Transform.js can take care of these kind of transformation.

### Configuration and interface

In Transform.js you will have to define the following :

- Configuration: you must define your configuration, that is, all the required functions to perform the transformation.
- Interface: this piece of code is responsible for handling your data from source to destination formats. Interface makes your transformation more flexible, you can add pre/post processing code, loop the formatter, redefine the configuration, ...

Following the PRTG example, you will have to create the following files (you can mimic the 'example' interface):

- `sources/interfaces/prtg/config.js`: where you export your configuration
- `sources/interfaces/prtg/Iprtg.js`: where you export your interface

#### And a working config.js for our example would be:

```
import * as m from "./mutations.js"

const ERRORS_TPL = '{ \
  "prtg": { \
    "error": "1", \
    "text": "${_("prtg.text")}" \
  } \
}'

export default {
  _default: {                                           // identity
    errors: {                                           // kind
      json: {                                           // lang
        errors_template: ERRORS_TPL,                    // destination format template
        errors_operations: [                            // transformation operations
          {
            from: "message",                            // read from src[message]
            to: "prtg.text",                            // write to errors_template[prtg][text]
            mutations: m.make_phrase                    // capialize + dot
          }
        ]
      }
    }
  }
}
```

##### About the configuration:

Configuration is built as a tree. From top to bottom:

- identity: data type. In a monitoring context we may have an identity per sensor type
- kind: defines the kind of data (e.g. sensor metrics, sensor errors)
- lang: the required format

Deeper levels are interface specific.

In our example:

- `_default`: our identity, a default one, like a fallback
- `errors`: the kind of data (in a prtg example, you would have 'kinds' like 'errors' and 'metrics')
- `json`: the destination language the formatter will deal with
- `errors_template`: the template to be filled with the transformed data
- `errors_operations`: the data mutations to be performed

##### About the template:

Template destination placeholder (to) must be surrounded by `${_("` and `")}` guards. This allows placeholders tracking during template parsing.

##### About the operations:

An operation defines a set of mutations and some placeholder values for source (from) and destination (to) or both (placeholder). Here is a mutation that takes the source value at location `resource.value`, fills the template with the capitalized version at location `resource.value`:

```
{
  placeholder: "resource.value",
  mutations: capitalize
}
```

##### About the mutations

There is some default mutations defined in the core: `/sources/core/mutations.js`. There is two kinds of mutations:

###### unary mutations

Unary mutations are 1-ary functions that mutates a copy of the value pointed by the source placeholder (from). This value is then written at the destination placeholder pointed position in intermediate representation (to).

Example of unary mutation :
```
{
  from: "resource.value",
  to: "prtg.results.value"
  mutations: m_number_to_string
}
```

The operation m_number_to_string takes the unique parameter retrieved from the source data pointed by the source placeholder from "resource.value".

Its returned value will be written in the template at the location pointed by the destination placeholder to "prtg.results.value".

n.b. : you may introduce more than one mutation in the mutations element by passing an array.

###### variadic mutations: 

Variadic mutations are n-ary functions that are used to transform a value from the source to the destination nearly the same way as a unary mutation. The difference remains in that we can add additional parameters to a variadic mutation.
The nature of those additional parameters is not restricted.

Here is an example using three functions as arguments (additional parameters of the variadic function):
```
{
  placeholder: "resource.value"         // e.g. 42
  mutations: [
    {
      variadic: m.m_chain,              // m_chain() takes n arguments, 
      arguments: [
        m_retype_number_to_string,      // 42   ->  "42"
        m_retype_string_to_number,      // "42" ->  42
        m_any                           // 42   ->  42
      ]
    }
  ]
}
```
In this example, our variadic function is m_chain. This one will act as a unary mutation with a carry on the partial results of arguments (m_retype_number_to_string, m_retype_string_to_number, m_any).

#### And working interface for our example would be:

```
import Formatter from "../../core/formatter.js";                               // Importing the library formatter
// other imports (e.g. your CONFIGuation, errors, base class, etc)

export default class Iprtg extends Imother {                                   // Imother base interface class
  constructor(src, id, kind, lang) {
    super();
    this.src = src; this.id = id; this.kind = kind; this.lang = lang;
  }

  get() {
    try {
      const template = CONFIG[this.id][this.kind][this.lang].tpl;
      const operations = CONFIG[this.id][this.kind][this.lang].operations;
      
      return new Formatter(this.src, operations, template).format();           // Requesting the formatted data
    } catch (e) {
      throw new InterfaceError(e.message);
    }
  }
}
```

Your interface should extends Imother and return formatted data from `.get()` method.

#### About the interface parameters:

- `src`: source data (the error message to be transformed)
- `id`: the target identity (\_default)
- `kind`: the kind of data to be transformed (errors)
- `lang`: the lang used to perform syntax operations (json)

#### About the formatter parameters:

- `src`: source data (the error message to be transformed)
- `operations`: the operations defined for the identity transformation in the configuration
- `template`: the template where to fill the transformed data. Also defined in the configuration

### Testing the interface

Let's write the test in `/tests/interfaces/Iprtg.test.js`:

```
import Transform from "../../../sources/index.js"                 // import library under name Transform
import CONSTANTS from "../../../sources/core/constants.js"        // import some constants (interface / identity names)

describe("PRTG Errors", () => {

  test("Simple error", async () => {                              // Transform returns a promise
    const src = {                                                 // the source data
      "message": "unable to retrieve metrics"
    }
    
    const expected = {                                            // the expected data
      "prtg": {
        "error": "1",
        "text": "Unable to retrieve metrics."
      }
    }
    
    const p = await new Transform(src,                            // source data
                                  CONSTANTS.TO.PRTG,              // interface name (e.g. prtg)
                                  CONSTANTS.ID._DEFAULT,          // identity name (e.g. _default)
                                  CONSTANTS.KIND_ERRORS           // kind of data (e.g. errors)
                                 );
                                 
    expect(p.format()).toEqual(expected);                         // passing test
  });

});
```
