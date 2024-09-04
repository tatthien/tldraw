import { Editor, useEditor } from '@tldraw/editor'
import { useCallback } from 'react'
import { useTimer } from '../../hooks/useTimer'
import { TldrawUiButton } from '../primitives/Button/TldrawUiButton'
import { TldrawUiButtonIcon } from '../primitives/Button/TldrawUiButtonIcon'
import { TldrawUiIcon } from '../primitives/TldrawUiIcon'
import { TLTimerProps } from './Timer'

const FIVE_SECONDS = 5 * 1000
const TEN_SECONDS = 10 * 1000
const THIRTY_SECONDS = 30 * 1000
const ONE_MINUTE = 60 * 1000
const FIVE_MINUTES = 5 * ONE_MINUTE

function updateTimer(props: Partial<TLTimerProps>, editor: Editor) {
	editor.updateDocumentSettings({ meta: { timer: props } })
}

export function CollapseButton({ onClick }: { onClick(): void }) {
	return (
		<TldrawUiButton
			type="icon"
			onPointerDown={(e) => e.stopPropagation()}
			onClick={onClick}
			title="Collapse"
		>
			<TldrawUiButtonIcon icon="chevron-left" />
		</TldrawUiButton>
	)
}

export function ResetButton({ props }: { props: TLTimerProps }) {
	const editor = useEditor()
	const handleClick = useCallback(() => {
		updateTimer(
			{
				initialTime: props.initialTime,
				remainingTime: props.initialTime,
				state: { state: 'stopped' },
			},
			editor
		)
	}, [editor, props.initialTime])

	return <TimerButton icon="undo" onClick={handleClick} title="Reset" />
}

export function DecreaseTimeButton({ props }: { props: TLTimerProps }) {
	const editor = useEditor()

	const state = props.state
	const decreaseTime = useCallback(() => {
		let newTime: number
		if (props.initialTime <= THIRTY_SECONDS) {
			newTime = props.initialTime - FIVE_SECONDS
		} else if (props.initialTime <= FIVE_MINUTES) {
			newTime = props.initialTime - THIRTY_SECONDS
		} else {
			newTime = props.initialTime - ONE_MINUTE
		}
		updateTimer(
			{
				initialTime: newTime,
				remainingTime: newTime,
				state: props.state,
			},
			editor
		)
	}, [props.initialTime, editor, props.state])

	return (
		<TimerButton
			icon="minus"
			onClick={decreaseTime}
			disabled={state.state === 'running' || props.initialTime < TEN_SECONDS}
			title="Decrease time"
			small
		/>
	)
}

export function IncreaseTimeButton({ props }: { props: TLTimerProps }) {
	const editor = useEditor()

	const increaseTime = useCallback(() => {
		let newTime: number
		if (props.initialTime < THIRTY_SECONDS) {
			newTime = props.initialTime + FIVE_SECONDS
		} else if (props.initialTime < FIVE_MINUTES) {
			newTime = props.initialTime + THIRTY_SECONDS
		} else {
			newTime = props.initialTime + ONE_MINUTE
		}
		updateTimer(
			{
				initialTime: newTime,
				remainingTime: newTime,
				state: props.state,
			},
			editor
		)
	}, [props.initialTime, editor, props.state])
	const state = props.state

	return (
		<TimerButton
			icon="plus"
			onClick={increaseTime}
			disabled={state.state === 'running'}
			title="Increase time"
			small
		/>
	)
}

export function PlayButton({ props }: { props: TLTimerProps }) {
	const editor = useEditor()
	const { getCurrentServerTime } = useTimer()
	const handleClick = useCallback(() => {
		updateTimer(
			{
				initialTime: props.initialTime,
				remainingTime: props.state.state === 'completed' ? props.initialTime : props.remainingTime,
				state: { state: 'running', lastStartTime: getCurrentServerTime() },
			},
			editor
		)
	}, [editor, props, getCurrentServerTime])
	return <TimerButton icon="play" onClick={handleClick} title="Start" />
}

export function PauseButton({ props }: { props: TLTimerProps }) {
	const editor = useEditor()
	const { getElapsedTime } = useTimer()
	const handleClick = useCallback(() => {
		if (props.state.state !== 'running') return
		const elapsed = getElapsedTime(props)
		updateTimer(
			{
				initialTime: props.initialTime,
				remainingTime: Math.max(0, props.remainingTime - elapsed),
				state: { state: 'paused' },
			},
			editor
		)
	}, [editor, props, getElapsedTime])

	return <TimerButton icon="pause" onClick={handleClick} title="Pause" />
}

function TimerButton({
	disabled = false,
	icon,
	onClick,
	small = false,
	title,
}: {
	disabled?: boolean
	icon: string
	onClick(): void
	small?: boolean
	title: string
}) {
	return (
		<TldrawUiButton
			type="icon"
			disabled={disabled}
			onPointerDown={(e) => e.stopPropagation()}
			onClick={onClick}
			title={title}
		>
			<TldrawUiIcon icon={icon} small={small} />
		</TldrawUiButton>
	)
}