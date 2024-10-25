import { Command, CommandProps } from '@Libs/ddd/Command.base';

export class RefreshTokenCommand extends Command {
	public readonly refreshToken: string;

	public constructor(props: CommandProps<RefreshTokenCommand>) {
		super(props);

		this.refreshToken = props.refreshToken;
	}
}
