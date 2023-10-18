exports.getItems = (model, page, page_size, whereCondition = {}) => {
    const query = {}
    const options = {
        lean: true,
        sort: { createdAt: -1 },
        page: page,
        limit: page_size,
        forceCountFn: true,
    }

    if (whereCondition.populate) {
        options.populate = whereCondition.populate
    }

    if (whereCondition.category) {
        query.category = whereCondition.category
    }

    if (whereCondition.type) {
        query.type = whereCondition.type
    }

    if (whereCondition.modAppId) {
        query.modAppId = whereCondition.modAppId;
    }

    if (whereCondition.keyword) {
        query.$or = [
            { title: { $regex: whereCondition.keyword, $options: 'i' } },
            { description: { $regex: whereCondition.keyword, $options: 'i' } },
        ]
    }
    // console.log("q", query)

    return new Promise((resolve, reject) => {
        model
            .paginate(query, options)
            .then((result) => {
                resolve(result)
            })
            .catch((err) => {
                reject(err)
            })
    })
}
