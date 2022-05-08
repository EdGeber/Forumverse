export async function Setup(browser: any) {
	return browser.get('http://localhost:3000/clear_users')
	// TODO: get clear_threads
}
