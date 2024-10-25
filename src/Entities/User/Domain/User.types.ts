export interface UserProps {
	name: string;
	login: string;
	passwordHash: string;
	contactData: UserContactData;
}

export interface UserContactData {
	phoneNumber?: string;
	telegram?: string;
}
