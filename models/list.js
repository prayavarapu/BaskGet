var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ListSchema = new Schema({
	title: {
		type: String
	}

	content: [{
		type: Schema.Types.ObjectId,
		ref: "Content"
	}]

});

var List = mongoose.model("List", ListSchema);

module.exports = List;