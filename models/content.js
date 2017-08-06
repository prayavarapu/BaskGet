var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ContentSchema = new Schema({
	productType: {
		type: String //product type is a small description of the product
	},
	productTag: {
		type: String //product tag will be the product vendor
	},
	url: {
		type: String //product url
	}

});

var Content = mongoose.model("Content", ContentSchema);

module.exports = Content;