import { Command, CommandProps } from '@Libs/ddd/Command.base';

export class RegisterCommand extends Command {
	public readonly name: string;
	public readonly login: string;
	public readonly password: string;

	public constructor(props: CommandProps<RegisterCommand>) {
		super(props);
		this.name = props.name;
		this.login = props.login;
		this.password = props.password;
	}
}
