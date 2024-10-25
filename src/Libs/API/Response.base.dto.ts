import { ApiProperty } from '@nestjs/swagger';

import { IdResponse } from './IdResponse.dto';

export interface BaseResponseProps {
	id: string;
	createdAt: Date;
	updatedAt: Date;
}

export class ResponseBase extends IdResponse {
	@ApiProperty({ example: '2022-11-22T17:43:15.970Z' })
	public readonly createdAt: Date;

	@ApiProperty({ example: '2022-11-22T17:43:15.970Z' })
	public readonly updatedAt: Date;

	public constructor(props: BaseResponseProps) {
		super(props.id);
		this.createdAt = new Date(props.createdAt);
		this.updatedAt = new Date(props.updatedAt);
	}
}
