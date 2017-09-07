window.addEventListener('load', () => {
	let booth = document.getElementById('booth')
	let capture = document.getElementById('capture')
	let camera = new Camera(document.getElementById('camera'))

	let overlay = document.getElementById('overlay')
	overlay.style.display = 'none'

	let roll = document.getElementById('roll')
	let pictureCount = 1

	function takePicture() {
		let img = document.createElement('img')
		img.src = camera.takePicture()

		let thumb = document.createElement('a')
		thumb.classList.add('thumbnail')
		thumb.href = img.src 
		thumb.download = `webcam${pictureCount}.png`
		thumb.appendChild(img)

		pictureCount++

		overlay.addEventListener('animationend', () => {
			overlay.classList.remove('flash')
			overlay.style.display = 'none'

			roll.appendChild(thumb)
			roll.scrollLeft = img.x
		}, {once: true})

		overlay.style.display = 'block'
		overlay.classList.add('flash')
	}

	capture.addEventListener('click', takePicture)
	window.addEventListener('keypress', (event) => {
		if (event.key == ' ' || event.key == 'Enter') {
			takePicture()
		}
	})

	// keep focus on camera roll to allow keyboard scrolling
	roll.focus()
	roll.addEventListener('blur', () => {
		roll.focus()
	})
})

class Camera {
	constructor(video=null) {
		this.video = video
		if (this.video == null) {
			this.video = document.createElement('video')
		}

		const constraints = {video: true}
		navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
			this.video.srcObject = stream
			this.video.play()
		}).catch((err) => {
			console.error(err.name, ':', err.message)
		})
	}

	takePicture() {
		let canvas = document.createElement('canvas')
		let context = canvas.getContext('2d')
		canvas.width = this.video.videoWidth
		canvas.height = this.video.videoHeight

		context.drawImage(this.video, 0, 0)

		return canvas.toDataURL()
	}
}
