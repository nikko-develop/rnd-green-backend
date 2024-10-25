import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { MongoSchemaBase } from '@Infrastructure/MongoDB/MongoSchema.base';
import { ULID } from '@Libs/types/ULID.type';

export type RefreshTokenDocument = HydratedDocument<RefreshTokenRecord>;

@Schema({ collection: 'refresh-tokens' })
export class RefreshTokenRecord extends MongoSchemaBase {
	@Prop()
	public userId: ULID;
	@Prop()
	public hash?: string;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshTokenRecord);
RefreshTokenSchema.index({ userId: 1 }, { unique: true });
