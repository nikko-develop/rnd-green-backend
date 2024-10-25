const greenRostovRoot = 'greent-rostov';
const v1 = 'v1';

export const routesV1 = {
	version: v1,

	greenRostov: {
		root: greenRostovRoot,
		tag: 'Green Rostov',

		register: `${greenRostovRoot}/register`,
		login: `${greenRostovRoot}/login`,
		logout: `${greenRostovRoot}/logout`,
		refreshToken: `${greenRostovRoot}/refreshToken`
	}
};
