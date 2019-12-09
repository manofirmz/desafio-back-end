module.exports = (href, rel, method, params = null) => {
    const hateoas = {
        href, 
        rel, 
        method
    };

    if (params) {
        hateoas['params'] = params;
    }

    return hateoas;
};
