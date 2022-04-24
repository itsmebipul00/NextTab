import { useDateTime } from './../Hooks/useDateTime'

export const DateTime = () => {
	const [dateNow, timeNow] = useDateTime()

	return (
		<div className='text-white'>
			<p className='text-xl ml-2'>
				{dateNow}, {timeNow}
			</p>
		</div>
	)
}
