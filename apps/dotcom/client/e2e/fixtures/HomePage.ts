import type { Locator, Page } from '@playwright/test'
import { expect } from '@playwright/test'
import { USER_1 } from '../consts'
import { Editor } from './Editor'

export class HomePage {
	public readonly signInButton: Locator
	public readonly tldrawEditor: Locator
	constructor(
		private readonly page: Page,
		private readonly editor: Editor
	) {
		this.signInButton = this.page.getByTestId('tla-signin-button')
		this.tldrawEditor = this.page.getByTestId('tla-editor')
	}

	async login() {
		await this.loginAs(USER_1)
	}

	async loginAs(email: string) {
		const isSideBarToggleVisible = await this.editor.sidebarToggle.isVisible()
		// We are already logged in
		if (isSideBarToggleVisible) return
		await this.goto()
		await expect(this.signInButton).toBeVisible()
		await this.page.click('text=Sign up')
		await this.page.getByLabel('Email address').fill(email)
		await this.page.getByRole('button', { name: 'Continue', exact: true }).click()
		await this.page.waitForTimeout(1000)
		await this.page.getByLabel('Enter verification code. Digit').fill('424242')
	}

	async expectSignInButtonVisible() {
		await expect(this.signInButton).toBeVisible()
	}

	async goto() {
		await this.page.goto('http://localhost:3000/q')
	}

	async isLoaded() {
		await expect(this.page).toHaveTitle(/tldraw/)
		await expect(this.tldrawEditor).toBeVisible({ timeout: 10000 })
	}
}
