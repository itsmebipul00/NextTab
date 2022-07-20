import { useAxios, useLocalStorage } from './Hooks'

import { SetStateAction, useEffect, useState,useRef } from 'react'

import { UNSPLASH_API } from './Urls/index'

import { v4 as uuid } from 'uuid'

import { TeenyiconsMenuSolid } from './Icons'

import {
	Loader,
	DateTime,
	Weather,
	Quotes,
	Todos,
	Focus,
} from './Components'

interface urlType{
	full: string;
	raw: string;
	regular: string;
	small: string;
	small_s3: string;
	thumb: string;	
}

interface fetchedImageType extends urlType{
	id: string;
}


interface ResultType{
	urls: urlType;
}

interface ResponseType {
	results: ResultType[];
}

export default function App() {
	const [selectImage, setSelectImage] = useLocalStorage(
		'selectedImage',
		''
	)

	const [username, setUserName] = useLocalStorage('username','')

	const selectedImage  = selectImage as unknown as fetchedImageType

	const setSelectedImage = setSelectImage as unknown as React.Dispatch<SetStateAction<fetchedImageType>>

	const [nebulaImages, setNebulaImages] = useState<fetchedImageType[]>([])

	const [displayHeader, setDisplayHeader] = useState(true)

	const [res, loading, error] = useAxios({
		method: 'get',
		url: UNSPLASH_API,
	})

	const response = res as ResponseType

	useEffect(() => {
		const fetchedImages = response?.results?.map(img => ({
			...img.urls,
			id: uuid(),
		}))


		if (!selectedImage) {
			setSelectedImage(fetchedImages?.[0])
		}

		setNebulaImages(fetchedImages)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [response])

	const clickImgHandler = (img: fetchedImageType) => {
		if (img.id === selectedImage.id) {
			return null
		}

		setSelectedImage(img)

		const remaningImages = nebulaImages.filter(
			images => images.id !== img.id
		)

		setNebulaImages([img, ...remaningImages])
	}

	const inputRef= useRef<HTMLInputElement>(null)

	useEffect(() => {
		inputRef?.current?.focus()
	},[])

	return (
		<div className='grid bg-black font-mono'>
			{!username && (
				<div className='fixed w-[100vw] h-[100vh] backdrop-blur z-50 flex justify-center items-center flex-col'>
					<div>
						<h3 className='text-white font-thin text-2xl'>Hi welcome, please enter your name ?</h3>
						<input name='username' type="text" className='w-full p-1 mt-2 bg-transparent border-none text-white'ref={inputRef} onKeyDown={(e) => e.code === "Enter" && ((e.target)as HTMLInputElement).value !== '' && setUserName(((e.target)as HTMLInputElement).value)}/>
					</div>
				</div>
			)}
			{!error && loading && <Loader />}

			<header
				className={`${
					Boolean(!displayHeader)
						? 'hidden'
						: 'grid grid-cols-10 gap-1 h-13vh order-1 mt-2'
				} `}>
				{nebulaImages?.map((img, idx) => (
					<button key={idx} onClick={() => clickImgHandler(img)}>
						<img
							src={img.thumb}
							alt='header-imgs'
							loading='eager'
							className='aspect-square h-full w-full z-10 hover:scale-100'
						/>
					</button>
				))}
			</header>

			<main className='order-3'>
				<div className='grid children:row-span-full children:col-span-full'>
					<img
						src={selectedImage?.regular}
						alt='bg-img'
						loading='eager'
						className={`${
							Boolean(displayHeader) ? 'h-85vh' : 'h-100vh'
						} w-full `}
					/>

					<section className='flex'>
						<div className='self-end m-3 w-1/2'>
							<h2 className='text-xl text-white ml-4'>Hello, {username}! Have a nice day.</h2>
							<Weather />
							<DateTime />
						</div>

						<div className='flex flex-col items-end w-1/2 h-full justify-between'>
							<div className='h-3/4 w-full flex flex-col items-end'>
								<TeenyiconsMenuSolid
									width='1.5rem'
									height='1.5rem'
									className='mt-5 mr-5  cursor-pointer'
									onClick={() => setDisplayHeader(prev => !prev)}
								/>

								<Todos />
							</div>

							<div className='text-white text-xl mt-auto mr-2 self-end  grid h-1/4'>
								<Focus />

								<Quotes />
							</div>
						</div>
					</section>
				</div>
			</main>

			<footer
				className={`${
					Boolean(displayHeader) ? 'order-2 h-1vh bg-black' : 'hidden'
				}`}></footer>
		</div>
	)
}
