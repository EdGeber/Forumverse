export const SERVER_PORT = 3000;
export const GUI_PORT    = 4200;

export function GetServerUrlFor(pageName: string): string {
	return `http://localhost:${SERVER_PORT}/${pageName}`;
}

export function GetGuiUrlFor(pageName: string): string {
	return `http://localhost:${GUI_PORT}/${pageName}`;
}
