import { tldrawConstants } from '../../../tldraw-constants'
import { useBreakpoint } from '../../context/breakpoints'
import { kbd } from '../../kbd-utils'

const { PORTRAIT_BREAKPOINT } = tldrawConstants

/** @public */
export interface TLUiKbdProps {
	children: string
	visibleOnMobileLayout?: boolean
}

/** @public */
export function TldrawUiKbd({ children, visibleOnMobileLayout = false }: TLUiKbdProps) {
	const breakpoint = useBreakpoint()
	if (!visibleOnMobileLayout && breakpoint < PORTRAIT_BREAKPOINT.MOBILE) return null
	return (
		<kbd className="tlui-kbd">
			{kbd(children).map((k, i) => (
				<span key={i}>{k}</span>
			))}
		</kbd>
	)
}