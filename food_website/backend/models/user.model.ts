import mongoose, { Document, Model } from "mongoose"; // import mongoose for MongoDB interactions, Document type for interface extension, and Model type for TS model typing

export interface IUser { // define interface for user structure to enforce type safety
    fullname: string; // full name of the user as string
    email: string; // email of the user as string
    password: string; // hashed password of the user as string
    contact: number; // contact number of the user as number
    address: string; // address of the user as string
    city: string; // city of the user as string
    country: string; // country of the user as string
    profilePicture: string; // URL or path of profile picture as string
    admin: boolean; // flag to indicate admin privileges as boolean
    lastLogin?: Date; // optional field for last login timestamp
    isVerified?: boolean; // optional field indicating if user is verified
    resetPasswordToken?: string; // optional token for password reset
    resetPasswordTokenExpiresAt?: Date; // optional expiration date for password reset token
    verificationToken?: string; // optional token for email verification
    verificationTokenExpiresAt?: Date; // optional expiration date for verification token
}

export interface IUserDocument extends IUser, Document { // extend IUser with mongoose Document to include MongoDB document properties
    createdAt: Date; // timestamp of when the document was created
    updatedAt: Date; // timestamp of when the document was last updated
}

const userSchema = new mongoose.Schema<IUserDocument>({ // create mongoose schema for users with type safety from IUserDocument
    fullname: { // define fullname field in schema
        type: String, // set type to String
        required: true // make the field mandatory
    },
    
    email: { // define email field in schema
        type: String, // set type to String
        required: true // make the field mandatory
    },
    
    password: { // define password field in schema
        type: String, // set type to String
        required: true // make the field mandatory
    },
    
    contact: { // define contact field in schema
        type: Number, // set type to Number
        required: true // make the field mandatory
    },
    
    address: { // define address field in schema
        type: String, // set type to String
        default: "" // default to empty string if not provided
    },
    
    city: { // define city field in schema
        type: String, // set type to String
        default: "" // default to empty string if not provided
    },
    
    country: { // define country field in schema
        type: String, // set type to String
        default: "" // default to empty string if not provided
    },
    
    profilePicture: { // define profilePicture field in schema
        type: String, // set type to String
        default: "" // default to empty string if not provided
    },
    
    admin: { type: Boolean, default: false }, // define admin field as Boolean and default to false
    
    lastLogin: { // define lastLogin field in schema
        type: Date, // set type to Date
        default: Date.now // default to current timestamp
    },
    
    isVerified: { // define isVerified field in schema
        type: Boolean, // set type to Boolean
        default: false // default to false
    },
    
    resetPasswordToken: String, // define optional resetPasswordToken as string
    
    resetPasswordTokenExpiresAt: Date, // define optional resetPasswordTokenExpiresAt as Date
    
    verificationToken: String, // define optional verificationToken as string
    
    verificationTokenExpiresAt: Date, // define optional verificationTokenExpiresAt as Date
}, { timestamps: true }); // enable automatic createdAt and updatedAt timestamps

export const User: Model<IUserDocument> = mongoose.model<IUserDocument>("User", userSchema); // create and export mongoose model named "User" with type safety using IUserDocument
