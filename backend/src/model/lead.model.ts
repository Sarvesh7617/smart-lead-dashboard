import mongoose, {Schema,Document} from "mongoose";



export interface LeadProps extends Document {

  name: string;

  email: string;

  status:| "New" | "Contacted" | "Qualified" | "Lost";

  source:| "Website" | "Instagram" | "Referral";

  createdBy: mongoose.Types.ObjectId;
}



const leadSchema = new Schema<LeadProps>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "New",
        "Contacted",
        "Qualified",
        "Lost",
      ],
      default: "New",
    },

    source: {
      type: String,
      enum: [
        "Website",
        "Instagram",
        "Referral",
      ],
      required: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },{timestamps: true,});



const Lead = mongoose.model<LeadProps>("Lead",leadSchema);



export default Lead;