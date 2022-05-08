import { GetGuiUrlFor, GetServerUrlFor } from "../common/fvUrls"

export async function Setup(browser: any) {
	browser.get(GetServerUrlFor("clear_users"));
	browser.get(GetServerUrlFor("clear_threads"));
	browser.get(GetGuiUrlFor("home"));
	browser.refresh();
}
