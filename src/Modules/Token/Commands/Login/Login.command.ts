import { Command, CommandProps } from '@Libs/ddd/Command.base';

export class LoginCommand extends Command {
	public readonly login: string;
	public readonly password: string;

	public constructor(props: CommandProps<LoginCommand>) {
		super(props);

		this.login = props.login;
		this.password = props.password;
	}
}
