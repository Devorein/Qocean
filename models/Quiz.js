const mongoose = require('mongoose');
const slugify = require('slugify');

const QuizSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Please add a name'],
			unique: true,
      trim: true,
      minlength: [3, 'Name can not be less than 3 characters'],
			maxlength: [50, 'Name can not be more than 50 characters']
    },
		averageDuration: Number,
		slug: String,
		createdAt: {
			type: Date,
			default: Date.now
		},
    tags:[String],
    favourite: {
      type: Boolean,
      default: false
    },
    subject: {
      type: String,
      required: [true, 'Please provide a subject']
    },
    source:{
      type: {
        required: true,
        type: String,
        enum: ['Web','Local']
      },
      link: {
        default: '',
        type: String
      }
    }
  },
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true }
	}
);

// Create quiz slug from the name

QuizSchema.pre('save', function (next) {
	this.slug = slugify(this.name, { lower: true });
	next();
});

module.exports = mongoose.model('Quiz', QuizSchema);
