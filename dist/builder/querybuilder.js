"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class QueryBuilder {
    modelQuery;
    query; // Change the query to use the ProductQueryParams type
    constructor(modelQuery, query) {
        this.modelQuery = modelQuery;
        this.query = query;
    }
    // Search by multiple fields (name, brand, type)
    search(searchableFields) {
        const search = this?.query?.search?.trim(); // Trim spaces
        if (search) {
            const regex = new RegExp(search, "i");
            this.modelQuery = this.modelQuery.find({
                $or: searchableFields.map((field) => ({
                    [field]: { $regex: regex },
                })),
            });
        }
        return this;
    }
    // Filter by brand, price range, model, availability, etc.
    filter() {
        const queryObj = {};
        if (this.query.brand)
            queryObj["brand"] = this.query.brand;
        if (this.query.type)
            queryObj["type"] = this.query.type;
        if (this.query.model)
            queryObj["model"] = this.query.model;
        if (this.query.available !== undefined)
            queryObj["inStock"] = this.query.available === "true";
        // Handle price range
        if (this.query.minPrice || this.query.maxPrice) {
            queryObj["price"] = {};
            if (this.query.minPrice)
                queryObj["price"]["$gte"] = Number(this.query.minPrice);
            if (this.query.maxPrice)
                queryObj["price"]["$lte"] = Number(this.query.maxPrice);
        }
        this.modelQuery = this.modelQuery.find(queryObj);
        return this;
    }
    // Pagination logic
    paginate() {
        const page = Number(this?.query?.page) || 1;
        const limit = Number(this?.query?.limit) || 6;
        const skip = (page - 1) * limit;
        this.modelQuery = this.modelQuery.skip(skip).limit(limit);
        return this;
    }
    // Sorting logic
    sort() {
        let sortStr = "-createdAt"; // Default sorting by createdAt in descending order
        if (this?.query?.sortBy && this?.query?.sortOrder) {
            const sortBy = this.query.sortBy;
            const sortOrder = this.query.sortOrder === "desc" ? "-" : "";
            sortStr = `${sortOrder}${sortBy}`;
        }
        this.modelQuery = this.modelQuery.sort(sortStr);
        return this;
    }
    // Field selection (e.g., exclude __v)
    select() {
        let fields = "-__v";
        if (this?.query?.fields) {
            fields = this.query.fields?.split(",").join(" ");
        }
        this.modelQuery = this.modelQuery.select(fields);
        return this;
    }
}
exports.default = QueryBuilder;
