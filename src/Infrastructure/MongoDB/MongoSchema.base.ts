import { Prop } from '@nestjs/mongoose';

export class MongoSchemaBase {
	@Prop({ type: String, required: true, index: true, unique: true })
	public id!: string;

	@Prop({ type: Date, required: true })
	public createdAt!: Date;

	@Prop({ type: Date, required: true })
	public updatedAt!: Date;
}
