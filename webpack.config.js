module.exports = (config) => {
    config.resolve = config.resolve || {};
    config.resolve.extensionAlias = {
        ...config.resolve.extensionAlias,
        '.js': ['.js', '.ts'],
    };

    return config;
};
