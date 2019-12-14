module.exports = class Router {
    constructor(description) {
        this._childRouters = [];
        this._commands = [];
        this._description = description;
        this._parent = null;
    }

    command(keyword, parameters, description, callback) {
        this._commands.push({
            keyword,
            parameters,
            description,
            callback,
        });
    }

    use(router) {
        router._parent = this;
        this._childRouters.push(router);
    }

    _getCommands() {
        const childCommands = this._childRouters.map(router => router._getCommands());
        return [
            ...this._commands,
            ...childCommands.flat(),
        ];
    }

    getCommand(keyword) {
        const commands = this._getCommands();
        return commands.find(command => command.keyword === keyword);
    }

    _isRoot() {
        return !this._parent;
    }

    _getRoot() {
        let root = this;
        for(root = this; !root._isRoot(); root = root._parent) {/* Do nothing */}
        return root;
    }

    getAllCommands() {
        const root = this._getRoot();
        return root._getCommands();
    }

    getAllCommandsAsTree() {
        if (!this._isRoot()) {
            return this._getRoot().getAllCommandsAsTree();
        }

        function constructNode(tree, router) {
            if (!tree.commands) {
                tree.commands = [];
            }
            tree.commands.push(...router._commands);

            router._childRouters.forEach(childRouter => {
                if (childRouter._description) {
                    if (!tree.children) {
                        tree.children = {};
                    }
                    tree.children[childRouter._description] = {};
                    constructNode(tree.children[childRouter._description], childRouter);
                } else {
                    constructNode(tree, childRouter);
                }
            });

            return tree;
        }

        return constructNode({}, this);
    }
};
