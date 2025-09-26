## Module Path Aliases

To simplify imports and avoid long relative paths, this project uses **module path aliases**.

### Example Usage

```js
// instead of a long relative path
import user from '../../models/user.js';

// Use the alias
import user from '#models/user';
```

### Setting up Aliases

To implement module path aliases, add paths in the `package.json` file under imports. Aliases must start with #:

```js
"imports": {
        "#db/*.js": "./src/db/*.js",
        "#models/*.js": "./src/models/*.js",
        "#config": "./knexfile.js",
        "#yourAliasHere": "./actual/path/file",
    },
```

### Editor Support (Optional)

To provide editor support (autocomplete, go-to-definition, and error checking in VS Code) you can mirror these aliases in a `jsconfig.json` file.

```js
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "#db/*": ["src/db/*"],
      "#models/*": ["src/models/*"],
      "#config": ["knexfile.js"]
      "#yourAliasHere": ["./actual/path/file"]
    }
  }
}
```
