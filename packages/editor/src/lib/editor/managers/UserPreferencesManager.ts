import { atom, computed } from '@tldraw/state'
import { TLUserPreferences, defaultUserPreferences } from '../../config/TLUserPreferences'
import { TLUser } from '../../config/createTLUser'
import { Editor } from '../Editor'

/** @public */
export class UserPreferencesManager {
	systemColorScheme = atom<'dark' | 'light'>('systemColorScheme', 'light')
	constructor(
		public editor: Editor,
		private readonly user: TLUser,
		private readonly inferDarkMode: boolean
	) {
		if (typeof window === 'undefined' || !('matchMedia' in window)) return

		const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
		if (darkModeMediaQuery?.matches) {
			this.systemColorScheme.set('dark')
		}
		darkModeMediaQuery?.addEventListener('change', (e) => {
			if (e.matches) {
				this.systemColorScheme.set('dark')
			} else {
				this.systemColorScheme.set('light')
			}
		})
	}

	updateUserPreferences(userPreferences: Partial<TLUserPreferences>) {
		this.user.setUserPreferences({
			...this.user.userPreferences.get(),
			...userPreferences,
		})
	}
	@computed getUserPreferences() {
		return {
			id: this.getId(),
			name: this.getName(),
			locale: this.getLocale(),
			color: this.getColor(),
			animationSpeed: this.getAnimationSpeed(),
			isSnapMode: this.getIsSnapMode(),
			colorScheme: this.user.userPreferences.get().colorScheme,
			isDarkMode: this.getIsDarkMode(),
			isWrapMode: this.getIsWrapMode(),
			isDynamicResizeMode: this.getIsDynamicResizeMode(),
		}
	}

	@computed getIsDarkMode() {
		switch (this.user.userPreferences.get().colorScheme) {
			case 'dark':
				return true
			case 'light':
				return false
			case 'system':
				return this.systemColorScheme.get() === 'dark'
			default:
				return this.inferDarkMode ? this.systemColorScheme.get() === 'dark' : false
		}
	}

	/**
	 * The speed at which the user can scroll by dragging toward the edge of the screen.
	 */
	@computed getEdgeScrollSpeed() {
		return this.user.userPreferences.get().edgeScrollSpeed ?? defaultUserPreferences.edgeScrollSpeed
	}

	@computed getAnimationSpeed() {
		return this.user.userPreferences.get().animationSpeed ?? defaultUserPreferences.animationSpeed
	}

	@computed getId() {
		return this.user.userPreferences.get().id
	}

	@computed getName() {
		return this.user.userPreferences.get().name ?? defaultUserPreferences.name
	}

	@computed getLocale() {
		return this.user.userPreferences.get().locale ?? defaultUserPreferences.locale
	}

	@computed getColor() {
		return this.user.userPreferences.get().color ?? defaultUserPreferences.color
	}

	@computed getIsSnapMode() {
		return this.user.userPreferences.get().isSnapMode ?? defaultUserPreferences.isSnapMode
	}

	@computed getIsWrapMode() {
		return this.user.userPreferences.get().isWrapMode ?? defaultUserPreferences.isWrapMode
	}

	@computed getIsDynamicResizeMode() {
		return (
			this.user.userPreferences.get().isDynamicSizeMode ?? defaultUserPreferences.isDynamicSizeMode
		)
	}

	@computed getIsPasteAtCursorMode() {
		return (
			this.user.userPreferences.get().isPasteAtCursorMode ??
			defaultUserPreferences.isPasteAtCursorMode
		)
	}

	@computed getIsToolLocked() {
		return (
			this.user.userPreferences.get().isToolLocked ??
			this.editor.getInstanceState().isToolLocked ??
			defaultUserPreferences.isToolLocked
		)
	}

	@computed getIsGridMode() {
		return (
			this.user.userPreferences.get().isGridMode ??
			this.editor.getInstanceState().isGridMode ??
			defaultUserPreferences.isGridMode
		)
	}

	@computed getIsFocusMode() {
		return (
			this.user.userPreferences.get().isFocusMode ??
			this.editor.getInstanceState().isFocusMode ??
			defaultUserPreferences.isFocusMode
		)
	}

	@computed getIsDebugMode() {
		return (
			this.user.userPreferences.get().isDebugMode ??
			this.editor.getInstanceState().isDebugMode ??
			defaultUserPreferences.isDebugMode
		)
	}
}
