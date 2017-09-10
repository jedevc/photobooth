window.addEventListener('load', () => {
	let capture = document.getElementById('capture')
	let caption = document.getElementById('caption')

	let videoCamera = document.getElementById('camera')
	let videoPreview1 = document.getElementById('preview1').children[0]
	let videoPreview2 = document.getElementById('preview2').children[0]

	let camera = new Camera(videoCamera, videoPreview1, videoPreview2)
	let filters = new Filters(videoCamera, videoPreview1, videoPreview2)

	let overlay = document.getElementById('overlay')
	overlay.style.display = 'none'

	let roll = document.getElementById('roll')
	let pictureCount = 1

	function takePicture() {
		let img = document.createElement('img')
		img.src = camera.takePicture()

		// create thumbnail
		let thumb = document.createElement('a')
		thumb.classList.add('thumbnail')
		thumb.href = img.src 
		thumb.download = `webcam${pictureCount}.png`
		thumb.appendChild(img)

		pictureCount++

		// append thumbnail after flash complete
		overlay.addEventListener('animationend', () => {
			overlay.classList.remove('flash')
			overlay.style.display = 'none'

			roll.appendChild(thumb)
			roll.scrollLeft = roll.scrollWidth
		}, {once: true})
		overlay.style.display = 'block'
		overlay.classList.add('flash')
	}

	capture.addEventListener('click', takePicture)

	videoPreview1.addEventListener('click', () => {
		filters.update(-1)
		caption.innerText = filters.current()
	})

	videoPreview2.addEventListener('click', () => {
		filters.update(1)
		caption.innerText = filters.current()
	})

	window.addEventListener('keyup', (event) => {
		if (event.key == 'Enter') {
			takePicture()
		} else if (event.key == ' ') {
			filters.update(1)
			caption.innerText = filters.current()
		}
	})

	// keep focus on camera roll to allow keyboard scrolling
	roll.focus()
	roll.addEventListener('blur', () => {
		setTimeout(() => roll.focus(), 0)
	})
})

class Camera {
	constructor(video=null, ...videos) {
		this.video = video
		if (this.video == null) {
			this.video = document.createElement('video')
		}
		this.videos = videos

		const constraints = {video: true}

		// use video stream in all video elements
		navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
			this.video.srcObject = stream
			this.video.play()

			for (let vid of this.videos) {
				vid.srcObject = stream
				vid.play()
			}
		}).catch((err) => {
			console.error(err.name, ':', err.message)
		})
	}

	takePicture() {
		let canvas = document.createElement('canvas')
		let context = canvas.getContext('2d')
		canvas.width = this.video.videoWidth
		canvas.height = this.video.videoHeight

		// if filter applied to main video, render image with filter
		if (this.video.style.filter != null) {
			context.filter = this.video.style.filter
		}

		context.drawImage(this.video, 0, 0)
		return canvas.toDataURL()
	}
}

function wrapAround(n, l) {
	// wrap a number n into range (0, l)
	if (n < 0) {
		n = n % l
		n += l
	} else if (n >= l) {
		n = n % l
	}

	return n
}

const filters = [
	'',
	'grayscale(100%)',
	'sepia(100%)',
	'brightness(50%)',
	'brightness(200%)',
	'invert(100%)'
]

class Filters {
	constructor (main, left, right) {
		this.main = main
		this.left = left
		this.right = right

		this.filterNum = 0

		this.update()
	}

	update (count=0) {
		// update filters
		this.filterNum = wrapAround(this.filterNum + count, filters.length)
		let first = wrapAround(this.filterNum - 1, filters.length)
		let second = wrapAround(this.filterNum + 1, filters.length)

		// apply filters
		this.main.style.filter = filters[this.filterNum]
		this.left.style.filter = filters[first]
		this.right.style.filter = filters[second]
	}

	current () {
		return filters[this.filterNum]
	}
}
