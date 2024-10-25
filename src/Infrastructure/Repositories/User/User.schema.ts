import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserContactData } from '@Entities/User/Domain/User.types';
import { MongoSchemaBase } from '@Infrastructure/MongoDB/MongoSchema.base';

export type UserDocument = HydratedDocument<UserRecord>;

@Schema({ collection: 'users' })
export class UserRecord extends MongoSchemaBase {
	@Prop()
	public name: string;
	@Prop()
	public login: string;
	@Prop()
	public passwordHash: string;
	@Prop({ type: Object })
	public contactData: UserContactData;
}

export const UserSchema = SchemaFactory.createForClass(UserRecord);
UserSchema.index({ ldap: 1 }, { unique: true });
UserSchema.index({ name: 1 });
