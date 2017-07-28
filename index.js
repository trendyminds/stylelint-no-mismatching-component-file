var stylelint = require("stylelint");
var _ = require("lodash");

var ruleName = "tmi/no-mismatching-component-file"

module.exports = stylelint.createPlugin(ruleName, function (enabled) {
  return function (root, result) {
    var validOptions = stylelint.utils.validateOptions(result, ruleName, {
      actual: enabled,
      possible: [
        true,
        false
      ]
    })

    if (!validOptions) { return }

    /**
     * SUPER lazy. This checks to see if we're in the "components" directory because these
     * rules shouldn't apply to any other directory. I might change this someday.
     * ...maybe.
     */
    var path = result.opts.from.split('/');
    if (path[path.length - 3] !== 'components') { return }

    var fileName = '.' + path[path.length - 2];

    root.walkRules(function (statement) {
      if (
        statement.parent.type === 'root' &&
        _.values(statement.parent.indexes)[0] === 0 &&
        fileName !== statement.selector
      ) {
        stylelint.utils.report({
          ruleName: ruleName,
          result: result,
          node: statement,
          message: `Your selector does not match this component's file name.`
        });
      }
    })
  }
})

module.exports.ruleName = ruleName
